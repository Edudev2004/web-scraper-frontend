import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Settings, Bell, Server, Users, ActivitySquare } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        CIRION // PRO
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink 
          to="/products" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <Database size={18} /> Términos & Objetivos
        </NavLink>
        
        <div style={{ padding: '1.5rem 1.5rem 0.5rem', color: '#555', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>ADMINISTRACIÓN</div>
        
        <NavLink 
          to="/vendors" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <Server size={18} /> Proveedores
        </NavLink>
        <NavLink 
          to="/alerts" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <Bell size={18} /> Alertas & Reglas
        </NavLink>
        <NavLink 
          to="/metrics" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <ActivitySquare size={18} /> Rendimiento
        </NavLink>
        
        <div style={{ flexGrow: 1 }}></div>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <Settings size={18} /> Configuración
        </NavLink>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <Users size={18} /> Admin (root)
        </div>
      </nav>
    </aside>
  );
};
