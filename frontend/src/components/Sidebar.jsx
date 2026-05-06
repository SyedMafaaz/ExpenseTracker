import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, ScanLine, Wallet } from 'lucide-react';
import './Layout.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <Wallet size={28} />
        <span>SmartTrack</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={() => { if (window.innerWidth <= 768) toggleSidebar(); }}
          end
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={() => { if (window.innerWidth <= 768) toggleSidebar(); }}
        >
          <Receipt size={20} />
          <span>Expenses</span>
        </NavLink>

        <NavLink
          to="/scanner"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={() => { if (window.innerWidth <= 768) toggleSidebar(); }}
        >
          <ScanLine size={20} />
          <span>Smart OCR Scanner</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>
          <Wallet size={20} color="var(--accent-primary)" />
          <span>© 2026 SmartTrack</span>
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: '500' }}>
          Created by Syed Mafaaz.
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginTop: '0.25rem', fontWeight: '500' }}>
          "Keeping your budget tighter than skinny jeans."
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
