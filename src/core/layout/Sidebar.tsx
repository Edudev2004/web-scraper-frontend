import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Settings, Bell, Server, Users, ActivitySquare } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/sw-isologo.webp"  className="logo-collapsed" alt="Icon" />
        <img src="/sw-imagotipo.webp" className="logo-expanded" alt="Scraping Web Logo" />
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Database size={20} className="nav-icon" />
          <span className="nav-text">Términos & Objetivos</span>
        </NavLink>

        <div className="nav-group-title">
          <span className="nav-text">ADMINISTRACIÓN</span>
        </div>

        <NavLink to="/vendors" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Server size={20} className="nav-icon" />
          <span className="nav-text">Proveedores</span>
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Bell size={20} className="nav-icon" />
          <span className="nav-text">Alertas & Reglas</span>
        </NavLink>
        <NavLink to="/metrics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <ActivitySquare size={20} className="nav-icon" />
          <span className="nav-text">Rendimiento</span>
        </NavLink>

        <div style={{ flexGrow: 1 }}></div>

        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Settings size={20} className="nav-icon" />
          <span className="nav-text">Configuración</span>
        </NavLink>
        <div className="nav-user">
          <Users size={20} className="nav-icon" />
          <span className="nav-text">Admin (root)</span>
        </div>
      </nav>
    </aside>
  );
};

