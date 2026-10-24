import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { Product, Deal } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
// Se corrigió la importación duplicada
import { Activity, Target, Zap, Terminal, ExternalLink, BookOpen, ShieldCheck, CheckCircle2, DollarSign, Layers, BellRing, X } from 'lucide-react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { PriceHistoryChart } from '../components/PriceHistoryChart';

export const DashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggerStatus, setTriggerStatus] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem('custom_usd_exchange_rate');
    return saved ? parseFloat(saved) : 3.75;
  });
  const [displayMode, setDisplayMode] = useState<'both' | 'usd' | 'original'>('both');
  const [showHelperBanner, setShowHelperBanner] = useState(true);

  // Conexión WebSocket al backend (Ajustar URL según el entorno)
  const { alertas, isWsConnected, limpiarAlertas } = useWebSocket('ws://127.0.0.1:8000/ws/alertas');

  const loadData = async () => {
    try {
      const [prodData, dealData] = await Promise.all([
        dashboardService.getProducts(),
        dashboardService.getDeals()
      ]);
      setProducts(prodData);
      setDeals(dealData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTrigger = async () => {
    setTriggerStatus('INICIANDO MOTOR...');
    try {
      await dashboardService.triggerScraper();
      setTriggerStatus('RASTREANDO OFERTAS...');
      
      setTimeout(async () => {
        await loadData();
        setTriggerStatus('¡OFERTAS ACTUALIZADAS!');
        setTimeout(() => setTriggerStatus(''), 4000);
      }, 3500);
    } catch (err) {
      setTriggerStatus('ERROR');
      setTimeout(() => setTriggerStatus(''), 4000);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products];
  if (sortConfig !== null) {
    sortedProducts.sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';
      
      switch (sortConfig.key) {
        case 'id': aVal = a.product_id; break;
        case 'name': aVal = a.product_name.toLowerCase(); break;
        case 'brand': aVal = (a.brand?.brand_name || '').toLowerCase(); break;
        case 'category': aVal = (a.category?.category_name || '').toLowerCase(); break;
        case 'model': aVal = (a.model_number || '').toLowerCase(); break;
        case 'part': aVal = (a.part_number || '').toLowerCase(); break;
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const [expandedDescIds, setExpandedDescIds] = useState<number[]>([]);
  
  const toggleDesc = (id: number) => {
    if (expandedDescIds.includes(id)) {
      setExpandedDescIds(expandedDescIds.filter(x => x !== id));
    } else {
      setExpandedDescIds([...expandedDescIds, id]);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  // Mapear los datos reales del backend para el gráfico
  const chartData = deals
    .slice() // Hacemos una copia para no mutar el estado original
    .sort((a, b) => new Date(a.scraped_at).getTime() - new Date(b.scraped_at).getTime()) // Orden cronológico
    .map(deal => ({
      fecha: new Date(deal.scraped_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
      precio: deal.currency_code === 'PEN' ? (deal.price_original / exchangeRate) : deal.price_original
    }))
    .slice(-15); // Se muestran las ultimas 15 variaciones para que el gráfico no se sature
  
  return (
    <motion.div initial="hidden" animate="show" variants={container}>
      <header className="sharp-header">
        <h1><Terminal size={28} color="var(--accent)"/> MONITOR CENTRAL</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            type="button"
            className="sharp-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('open-system-guide'))}
            style={{ 
              background: 'rgba(0, 240, 255, 0.05)', 
              borderColor: 'var(--accent)', 
              color: 'var(--accent)',
              fontSize: '0.8rem'
            }}
          >
            <BookOpen size={16} /> GUÍA & REGLAS
          </button>
          <span style={{ color: 'var(--accent)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{triggerStatus}</span>
          <button className="sharp-btn" onClick={handleTrigger}>
            <Zap size={16} /> Ejecutar Scraper
          </button>
        </div>
      </header>

      {showHelperBanner && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.04) 0%, rgba(20, 20, 20, 0.8) 100%)',
          border: '1px solid #222',
          borderLeft: '4px solid var(--accent)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          fontSize: '0.8rem',
          lineHeight: '1.5'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.5px' }}>
              <ShieldCheck size={16} color="var(--accent)" /> REGLAS ACTIVAS DEL SISTEMA DE RASTREO:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: '#bbb', marginTop: '0.2rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} color="var(--alert-green)" /> <strong>Solo Productos Nuevos:</strong> Descarte automático de usados y reacondicionados.
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={14} color="var(--accent)" /> <strong>Filtro por Modelo y P/N:</strong> No se aceptan cables o repuestos que no sean el equipo completo.
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <DollarSign size={14} color="#ffb74d" /> <strong>Tipo de Cambio Editable:</strong> Modifica la tasa del dólar para recalcular cotizaciones en tiempo real.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowHelperBanner(false)}
            style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.8rem' }}
            title="Ocultar resumen"
          >
            ✕
          </button>
        </div>
      )}

      <div className="sharp-grid">
        <motion.div variants={item} className="sharp-panel">
          <div className="panel-title"><Activity size={16}/> Estado del Motor (WS)</div>
          <div className="panel-data" style={{ color: isWsConnected ? '#00f0ff' : '#ff3333' }}>
            <span className={`status-indicator ${isWsConnected ? 'processing' : 'offline'}`}></span> 
            {isWsConnected ? 'EN LÍNEA' : 'DESCONECTADO'}
          </div>
          <div className="panel-meta">
            <span>MODO: {isWsConnected ? 'Reactivo (Tiempo Real)' : 'Manual'}</span>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="sharp-panel">
          <div className="panel-title"><Target size={16}/> Términos Activos</div>
          <div className="panel-data">{products.length}</div>
          <div className="panel-meta"><span>Objetivos monitorizados</span></div>
        </motion.div>
        
        <motion.div variants={item} className="sharp-panel">
          <div className="panel-title"><Zap size={16}/> Oportunidades Hoy</div>
          <div className="panel-data">{deals.length}</div>
          <div className="panel-meta"><span>Registradas en log</span></div>
        </motion.div>
      </div>

      {/* Gráfico de Tendencias Real */}
      <PriceHistoryChart data={chartData} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '2rem' }}>
        <motion.div variants={item}>
          <h2 className="section-title"><Target size={18} /> Objetivos Monitorizados</h2>
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--accent)' }}>CARGANDO OBJETIVOS...</div>
            ) : products.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay productos registrados.</div>
            ) : (
              <table className="sharp-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')} style={{cursor: 'pointer', userSelect: 'none'}}>
                      ID {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('name')} style={{cursor: 'pointer', userSelect: 'none'}}>
                      TÉRMINO / BÚSQUEDA {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('brand')} style={{cursor: 'pointer', userSelect: 'none'}}>
                      MARCA {sortConfig?.key === 'brand' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('model')} style={{cursor: 'pointer', userSelect: 'none'}}>
                      MODELO {sortConfig?.key === 'model' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('part')} style={{cursor: 'pointer', userSelect: 'none'}}>
                      PART NUMBER {sortConfig?.key === 'part' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('category')} style={{cursor: 'pointer', userSelect: 'none'}}>
                      CATEGORÍA {sortConfig?.key === 'category' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th>DESCRIPCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((prod, idx) => (
                    <motion.tr 
                      key={prod.product_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (idx * 0.05) }}
                    >
                      <td style={{ color: 'var(--text-secondary)' }}>#{prod.product_id}</td>
                      <td style={{ fontWeight: 'bold' }}>{prod.product_name}</td>
                      <td>{prod.brand?.brand_name || 'N/A'}</td>
                      <td>{prod.model_number || 'N/A'}</td>
                      <td>{prod.part_number || 'N/A'}</td>
                      <td>{prod.category?.category_name || 'General'}</td>
                      <td>
                        {prod.description ? (
                          expandedDescIds.includes(prod.product_id) ? (
                            <div style={{ cursor: 'pointer', maxWidth: '200px', whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '0.8rem', color: 'var(--text-secondary)' }} onClick={() => toggleDesc(prod.product_id)}>
                              {prod.description}
                            </div>
                          ) : (
                            <div style={{ cursor: 'pointer', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem', color: 'var(--text-secondary)' }} onClick={() => toggleDesc(prod.product_id)} title="Click para expandir">
                              {prod.description}
                            </div>
                          )
                        ) : (
                          <span style={{ color: '#555' }}>-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            marginBottom: '1rem' 
          }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <Zap size={18} /> Últimas Oportunidades
            </h2>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              flexWrap: 'wrap',
              background: '#0d0d0d', 
              border: '1px solid #222', 
              padding: '0.4rem 0.8rem', 
              borderRadius: '4px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--alert-green)', fontWeight: 'bold' }}>$ 1 USD =</span>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.1" 
                  value={exchangeRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setExchangeRate(val);
                      localStorage.setItem('custom_usd_exchange_rate', val.toString());
                    }
                  }}
                  style={{
                    width: '65px',
                    padding: '0.2rem 0.4rem',
                    background: '#1a1a1a',
                    border: '1px solid var(--accent)',
                    color: '#fff',
                    borderRadius: '3px',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    textAlign: 'center'
                  }}
                  title="Modifica el tipo de cambio del dólar en tiempo real"
                />
                <span style={{ fontSize: '0.75rem', color: '#888' }}>PEN (Soles)</span>
              </div>

              <div style={{ display: 'flex', gap: '0.25rem', borderLeft: '1px solid #333', paddingLeft: '0.8rem' }}>
                <button
                  type="button"
                  onClick={() => setDisplayMode('both')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: displayMode === 'both' ? 'var(--accent)' : '#181818',
                    color: displayMode === 'both' ? '#000' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: displayMode === 'both' ? 'var(--accent)' : '#333',
                    borderRadius: '3px',
                    transition: 'all 0.2s'
                  }}
                >
                  AMBOS
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('usd')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: displayMode === 'usd' ? 'var(--accent)' : '#181818',
                    color: displayMode === 'usd' ? '#000' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: displayMode === 'usd' ? 'var(--accent)' : '#333',
                    borderRadius: '3px',
                    transition: 'all 0.2s'
                  }}
                >
                  EN USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('original')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: displayMode === 'original' ? 'var(--accent)' : '#181818',
                    color: displayMode === 'original' ? '#000' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: displayMode === 'original' ? 'var(--accent)' : '#333',
                    borderRadius: '3px',
                    transition: 'all 0.2s'
                  }}
                >
                  ORIGINAL
                </button>
              </div>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--accent)', letterSpacing: '2px' }}>
                <Activity size={32} className="animate-pulse" style={{ margin: '0 auto', display: 'block', marginBottom: '1rem' }} />
                SINCRONIZANDO ENLACE...
              </div>
            ) : deals.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay oportunidades registradas aún en la Base de Datos.</div>
            ) : (
              <table className="sharp-table">
                <thead>
                  <tr>
                    <th>OBJETIVO / BÚSQUEDA</th>
                    <th>TIENDA</th>
                    {(displayMode === 'both' || displayMode === 'original') && (
                      <th>PRECIO ORIGINAL</th>
                    )}
                    {(displayMode === 'both' || displayMode === 'usd') && (
                      <th>PRECIO CONVERTIDO (USD)</th>
                    )}
                    <th>ESTADO</th>
                    <th>CAPTURADO</th>
                    <th>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal, idx) => {
                    const isPen = deal.currency_code === 'PEN';
                    const calculatedUsd = isPen ? (deal.price_original / exchangeRate) : deal.price_original;
                    const originalFormatted = `${deal.currency_symbol || (isPen ? 'S/' : '$')} ${deal.price_original.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                    return (
                      <motion.tr 
                        key={deal.log_id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (idx * 0.05) }}
                      >
                        <td style={{ fontWeight: 'bold', color: '#fff' }}>
                          <div>{deal.product_name || 'Objetivo'}</div>
                          {deal.offer_title && deal.offer_title !== deal.product_name && (
                            <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 'normal', marginTop: '0.2rem' }}>
                              {deal.offer_title}
                            </div>
                          )}
                        </td>
                        <td>
                          <span style={{ 
                            padding: '0.2rem 0.5rem', 
                            background: '#151515', 
                            border: '1px solid #333', 
                            fontSize: '0.75rem', 
                            borderRadius: '3px',
                            color: 'var(--accent)',
                            fontWeight: 600
                          }}>
                            {deal.vendor_name || 'General'}
                          </span>
                        </td>

                        {(displayMode === 'both' || displayMode === 'original') && (
                          <td style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e0e0e0' }}>
                            <span style={{ 
                              padding: '0.15rem 0.4rem', 
                              background: '#222', 
                              borderRadius: '3px', 
                              fontSize: '0.7rem', 
                              marginRight: '0.4rem',
                              color: isPen ? '#ffb74d' : 'var(--alert-green)'
                            }}>
                              {deal.currency_code}
                            </span>
                            {originalFormatted}
                          </td>
                        )}

                        {(displayMode === 'both' || displayMode === 'usd') && (
                          <td style={{ color: 'var(--alert-green)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                            ${calculatedUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {isPen && (
                              <div style={{ fontSize: '0.65rem', color: '#666', fontWeight: 'normal' }}>
                                (TC: {exchangeRate.toFixed(2)})
                              </div>
                            )}
                          </td>
                        )}

                        <td>
                          <span className={`status-indicator ${deal.stock_status === 'IN_STOCK' ? '' : 'offline'}`}></span>
                          {deal.stock_status === 'IN_STOCK' ? 'En Stock' : deal.stock_status}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(deal.scraped_at).toLocaleTimeString()} ({new Date(deal.scraped_at).toLocaleDateString()})
                        </td>
                        <td>
                          {deal.product_url ? (
                            <a 
                              href={deal.product_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="sharp-btn" 
                              style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                            >
                              VER OFERTA <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span style={{ color: '#555' }}>-</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '350px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000,
        pointerEvents: 'none'
      }}>
        <AnimatePresence>
          {alertas.map((alerta, index) => (
            <motion.div
              key={`${alerta.id}-${index}`}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                background: 'rgba(10, 10, 10, 0.95)',
                border: '1px solid var(--alert-green)',
                borderLeft: '4px solid var(--alert-green)',
                padding: '1rem',
                borderRadius: '4px',
                boxShadow: '0 10px 25px rgba(0,255,0,0.15)',
                backdropFilter: 'blur(10px)',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--alert-green)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  <BellRing size={14} className="animate-pulse" />
                  {alerta.tipo_evento === 'caida_precio' ? '¡CAÍDA DE PRECIO!' : '¡RE-STOCK DETECTADO!'}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#888' }}>Ahora mismo</span>
              </div>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '0.2rem', lineHeight: '1.2' }}>
                {alerta.producto_nombre}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Valor detectado: <span style={{ color: 'var(--alert-green)', fontWeight: 'bold', fontSize: '1rem' }}>${alerta.valor_detectado}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {alertas.length > 0 && (
          <button 
            onClick={limpiarAlertas}
            className="sharp-btn"
            style={{ pointerEvents: 'auto', alignSelf: 'flex-end', padding: '0.3rem 0.8rem', fontSize: '0.7rem', marginTop: '5px' }}
          >
            Limpiar Notificaciones
          </button>
        )}
      </div>
    </motion.div>
  );
};