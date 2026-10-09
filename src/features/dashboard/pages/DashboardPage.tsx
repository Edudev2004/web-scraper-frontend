import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { Product, Deal } from '../types';
import { motion } from 'framer-motion';
import { Activity, Target, Zap, ChevronRight, Terminal } from 'lucide-react';

export const DashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggerStatus, setTriggerStatus] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const handleTrigger = async () => {
    setTriggerStatus('EJECUTANDO...');
    try {
      const res = await dashboardService.triggerScraper();
      setTriggerStatus(res.message);
      setTimeout(() => setTriggerStatus(''), 5000);
    } catch (err) {
      setTriggerStatus('ERROR');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={container}>
      <header className="sharp-header">
        <h1><Terminal size={28} color="var(--accent)"/> MONITOR CENTRAL</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--accent)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{triggerStatus}</span>
          <button className="sharp-btn" onClick={handleTrigger}>
            <Zap size={16} /> Ejecutar Scraper
          </button>
        </div>
      </header>

      <div className="sharp-grid">
        <motion.div variants={item} className="sharp-panel">
          <div className="panel-title"><Activity size={16}/> Estado del Motor</div>
          <div className="panel-data">
            <span className="status-indicator processing"></span> EN LÍNEA
          </div>
          <div className="panel-meta"><span>MODO: Autónomo</span><span></span></div>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
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
                    <th>ID</th>
                    <th>TÉRMINO / BÚSQUEDA</th>
                    <th>MARCA</th>
                    <th>MODELO</th>
                    <th>PART NUMBER</th>
                    <th>CATEGORÍA</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod, idx) => (
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
                        <span className="status-indicator"></span> Activo
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <h2 className="section-title"><Zap size={18} /> Últimas Oportunidades</h2>
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
                    <th>PRECIO USD</th>
                    <th>TIMESTAMP</th>
                    <th>ESTADO</th>
                    <th>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal, idx) => (
                    <motion.tr 
                      key={deal.log_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.05) }}
                    >
                      <td style={{ color: 'var(--alert-green)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        ${deal.price_usd.toFixed(2)}
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>{new Date(deal.scraped_at).toLocaleString()}</td>
                      <td>
                        <span className={`status-indicator ${deal.stock_status === 'IN_STOCK' ? '' : 'offline'}`}></span>
                        {deal.stock_status}
                      </td>
                      <td>
                        <button className="sharp-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>
                          VER <ChevronRight size={14}/>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
