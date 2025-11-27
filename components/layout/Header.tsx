
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-border flex items-center justify-between px-6">
      <div>
        {/* Can be dynamic based on route later */}
        <h2 className="text-2xl font-semibold text-text-primary">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-text-secondary hover:text-text-primary relative">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
            {user?.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
            <p className="text-xs text-text-secondary">{user?.subscriptionPlan} Plan</p>
          </div>
          <ChevronDown size={20} className="text-text-secondary" />
        </div>
      </div>
    </header>
  );
};

export default Header;
