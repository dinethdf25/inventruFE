import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  // Map pathnames to readable titles
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-card border-b border-border z-10 sticky top-0">
      <h1 className="text-xl font-semibold text-text">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          onClick={() => navigate('/alerts')}
          className="relative p-2 text-muted hover:text-primary transition-colors focus:outline-none rounded-full hover:bg-surface"
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-danger ring-2 ring-card" />
          )}
        </button>

        {/* User avatar / name */}
        {user && (
          <div className="flex items-center gap-2 pl-4 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
              {(user.username || user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-text hidden sm:block">
              {user.username || user.name || 'User'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
