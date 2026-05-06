import React, { useContext } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';
import './Layout.css';

const Topbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ExpenseContext);

  return (
    <header className="topbar">
      <div className="flex-row items-center gap-4">
        <button 
          className="btn btn-secondary" 
          onClick={toggleSidebar}
          style={{ padding: '0.5rem', display: window.innerWidth <= 768 ? 'block' : 'none' }}
        >
          <Menu size={20} />
        </button>
        <h2 style={{ margin: 0 }}>Overview</h2>
      </div>

      <div className="flex-row items-center gap-4">
        <button 
          className="btn btn-secondary" 
          onClick={toggleTheme}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }}
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
