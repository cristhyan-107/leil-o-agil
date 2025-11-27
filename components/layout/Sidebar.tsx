
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Briefcase, BarChart2, Settings, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

// A simple SVG logo
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" className="text-primary">
    <path fill="currentColor" d="M50 0L93.3 25v50L50 100 6.7 75V25L50 0zm0 10L16.7 31.7v36.6L50 90l33.3-21.7V31.7L50 10zM50 20l25 15v30L50 80 25 65V35L50 20z"></path>
  </svg>
);

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/properties', icon: Briefcase, label: 'Imóveis' },
    { to: '/reports', icon: BarChart2, label: 'Relatórios' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.push({ to: '/admin', icon: Shield, label: 'Admin' });
  }
  
  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? 'bg-primary text-white'
      : 'text-text-secondary hover:bg-secondary hover:text-text-primary';
  };

  return (
    <div className="w-64 bg-white border-r border-border flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-border">
         <Logo />
        <h1 className="text-xl font-bold ml-2 text-text-primary">Leilão Ágil</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${getLinkClass(item.to)}`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
      </div>
    </div>
  );
};

export default Sidebar;
