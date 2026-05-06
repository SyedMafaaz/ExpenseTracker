import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Set title based on route
  useEffect(() => {
    const titles = {
      '/': 'Overview',
      '/expenses': 'Expenses',
      '/scanner': 'OCR Scanner'
    };
    document.title = titles[location.pathname] ? `${titles[location.pathname]} - SmartTrack` : 'SmartTrack';
  }, [location]);

  return (
    <div className="layout-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="main-content">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="page-content animate-fade-in" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
