import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  CheckCircle2, 
  XCircle, 
  Search, 
  RefreshCw, 
  ExternalLink,
  Cpu,
  Database,
  Power
} from 'lucide-react';
import { vendorService } from '../services/vendorService';
import type { Vendor } from '../types';

export const VendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Ordenamiento de tabla
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'id',
    direction: 'asc'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const vendorsData = await vendorService.getVendors();
      setVendors(vendorsData);
    } catch (err: any) {
      console.error('Error al cargar proveedores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleToggleStatus = async (vendorId: number) => {
    try {
      setTogglingId(vendorId);
      const updated = await vendorService.toggleVendorStatus(vendorId);
      setVendors(prev => prev.map(v => v.vendor_id === vendorId ? { ...v, is_active: updated.is_active } : v));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al cambiar estado del proveedor.');
    } finally {
      setTogglingId(null);
    }
  };

  // Filtrado y ordenamiento
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.country_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? v.is_active :
      !v.is_active;

    return matchesSearch && matchesStatus;
  });

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    let aVal: any = '';
    let bVal: any = '';

    switch (sortConfig.key) {
      case 'id':
        aVal = a.vendor_id;
        bVal = b.vendor_id;
        break;
      case 'name':
        aVal = a.vendor_name.toLowerCase();
        bVal = b.vendor_name.toLowerCase();
        break;
      case 'country':
        aVal = a.country_code.toLowerCase();
        bVal = b.country_code.toLowerCase();
        break;
      case 'catalogs':
        aVal = a.total_catalogs || 0;
        bVal = b.total_catalogs || 0;
        break;
      case 'status':
        aVal = a.is_active ? 1 : 0;
        bVal = b.is_active ? 1 : 0;
        break;
      default:
        aVal = a.vendor_id;
        bVal = b.vendor_id;
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Métricas reales
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.is_active).length;
  const pausedVendors = totalVendors - activeVendors;
  const totalCatalogs = vendors.reduce((acc, curr) => acc + (curr.total_catalogs || 0), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* CABECERA */}
      <header className="sharp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1><Server size={28} color="var(--accent)" /> PROVEEDORES & FUENTES</h1>
          <p className="system-status">CONTROL OPERATIVO DE PLATAFORMAS EN EL MOTOR DE BÚSQUEDA</p>
        </div>
        <div>
          <button 
            onClick={loadData} 
            className="sharp-btn" 
            title="Refrescar estado de plataformas"
            style={{ padding: '0.6rem 1.2rem' }}
          >
            <RefreshCw size={16} /> Refrescar
          </button>
        </div>
      </header>

      {/* MÉTRICAS CENTRALES CON ESTILO SHARP-GRID */}
      <div className="sharp-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="sharp-panel">
          <div className="panel-title"><Server size={16} /> Fuentes Configuradas</div>
          <div className="panel-data">{totalVendors}</div>
          <div className="panel-meta">
            <span>PLATAFORMAS INTEGRADAS POR DESARROLLO</span>
          </div>
        </div>

        <div className="sharp-panel">
          <div className="panel-title"><Power size={16} /> Estado en Scraper</div>
          <div className="panel-data" style={{ color: activeVendors > 0 ? '#00ff66' : '#ff3333' }}>
            <span className={`status-indicator ${activeVendors > 0 ? 'processing' : ''}`} style={{ background: activeVendors > 0 ? '#00ff66' : '#ff3333' }}></span> {activeVendors} / {totalVendors}
          </div>
          <div className="panel-meta">
            <span>{activeVendors === totalVendors ? '100% ACTIVAS EN BÚSQUEDA' : `${pausedVendors} PAUSADAS POR USUARIO`}</span>
          </div>
        </div>

        <div className="sharp-panel">
          <div className="panel-title"><Database size={16} /> Catálogos Monitoreados</div>
          <div className="panel-data">{totalCatalogs}</div>
          <div className="panel-meta">
            <span>OBJETIVOS VINCULADOS EN VENDOR_CATALOG</span>
          </div>
        </div>
      </div>

      {/* TABLA DE PLATAFORMAS Y CONTROL DE ACTIVACIÓN */}
      <div className="table-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            <Server size={18} /> Plataformas Disponibles ({sortedVendors.length})
          </h2>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0 0.8rem' }}>
              <Search size={16} color="var(--text-secondary)" />
              <input 
                type="text" 
                placeholder="Buscar plataforma o país..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.6rem 0.8rem', fontFamily: 'monospace', outline: 'none', width: '220px' }}
              />
            </div>

            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              style={{ background: '#0a0a0a', border: '1px solid var(--border-color)', color: '#fff', padding: '0.6rem 1rem', borderRadius: '4px', fontFamily: 'monospace' }}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo Activas</option>
              <option value="inactive">Solo Pausadas</option>
            </select>
          </div>
        </div>

        <table className="sharp-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                PLATAFORMA {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>CONTROLADOR / DRIVER</th>
              <th onClick={() => handleSort('country')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                PAÍS {sortConfig.key === 'country' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>MONEDA BASE</th>
              <th onClick={() => handleSort('catalogs')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                CATÁLOGOS ASIGNADOS {sortConfig.key === 'catalogs' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}>
                ESTADO EN SCRAPER {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  Cargando plataformas...
                </td>
              </tr>
            ) : sortedVendors.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  No se encontraron plataformas que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              sortedVendors.map(vendor => (
                <tr key={vendor.vendor_id}>
                  <td style={{ color: 'var(--text-secondary)' }}>#{vendor.vendor_id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1rem' }}>{vendor.vendor_name}</span>
                      {vendor.website && (
                        <a 
                          href={vendor.website} 
                          target="_blank" 
                          rel="noreferrer" 
                          title={`Abrir ${vendor.website}`}
                          style={{ color: 'var(--accent)', opacity: 0.8 }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.6rem', 
                      background: 'rgba(0, 240, 255, 0.08)', 
                      border: '1px solid rgba(0, 240, 255, 0.25)', 
                      color: 'var(--accent)',
                      fontSize: '0.78rem', 
                      borderRadius: '3px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontFamily: 'monospace'
                    }}>
                      <Cpu size={13} /> {vendor.vendor_name.toLowerCase()}.py
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      background: '#151515', 
                      border: '1px solid #333', 
                      fontSize: '0.75rem', 
                      borderRadius: '3px',
                      fontWeight: 600,
                      letterSpacing: '1px'
                    }}>
                      {vendor.country_code}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                      {vendor.currency?.currency_code || 'USD'}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.4rem' }}>
                      ({vendor.currency?.symbol || '$'})
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#fff' }}>
                      {vendor.total_catalogs || 0}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.3rem' }}>
                      ítems
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleToggleStatus(vendor.vendor_id)}
                      disabled={togglingId === vendor.vendor_id}
                      style={{ 
                        background: vendor.is_active ? 'rgba(0, 255, 102, 0.12)' : 'rgba(255, 51, 51, 0.12)', 
                        border: `1px solid ${vendor.is_active ? '#00ff66' : '#ff3333'}`, 
                        color: vendor.is_active ? '#00ff66' : '#ff3333',
                        padding: '0.45rem 1.2rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: togglingId === vendor.vendor_id ? 'wait' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '3px',
                        transition: 'all 0.2s',
                        minWidth: '125px'
                      }}
                      title={vendor.is_active ? 'Click para pausar scraping en esta tienda' : 'Click para activar scraping en esta tienda'}
                    >
                      {vendor.is_active ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      {vendor.is_active ? 'ACTIVO' : 'PAUSADO'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
