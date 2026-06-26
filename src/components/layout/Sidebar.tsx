import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Boxes, 
  BellRing, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Truck,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAlertStore } from '@/store/alert.store';
import { APP_CONFIG } from '@/constants/app.constants';
import { Tooltip, Avatar } from '@/components/ui';

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const { user, logout } = useAuth();
  const unreadCount = useAlertStore((state) => state.unreadCount);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} /> },
    { name: 'Locations', path: '/locations', icon: <MapPin size={20} /> },
    { name: 'Batches', path: '/batches', icon: <Layers size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Boxes size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <BellRing size={20} />, badge: unreadCount },
  ];

  const renderNavLink = (item: any) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => 
        `flex items-center px-3 py-2.5 rounded-lg transition-colors
        ${isActive 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-muted hover:bg-surface hover:text-text'
        }
        ${isCollapsed ? 'justify-center' : ''}`
      }
    >
      <div className="flex-shrink-0 relative">
        {item.icon}
        {item.badge > 0 && (
          <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] text-white
            ${isCollapsed ? 'border-2 border-card' : ''}`}>
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </div>
      {!isCollapsed && (
        <span className="ml-3 whitespace-nowrap flex-1">{item.name}</span>
      )}
      {!isCollapsed && item.badge > 0 && (
        <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full ml-auto">
          {item.badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <div className={`relative flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-card border border-border text-muted hover:text-primary rounded-full p-1 z-20 shadow-sm focus:outline-none"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo Area */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
          <Leaf size={24} />
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-bold text-lg text-text whitespace-nowrap overflow-hidden">
            {APP_CONFIG.APP_NAME}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <div key={item.path}>
            {isCollapsed ? (
              <Tooltip content={item.name} position="right">
                {renderNavLink(item)}
              </Tooltip>
            ) : (
              renderNavLink(item)
            )}
          </div>
        ))}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-border">
        {isCollapsed ? (
          <Tooltip content="Logout" position="right">
            <button onClick={() => logout()} className="w-full flex justify-center hover:opacity-80 transition-opacity">
               <Avatar initials={user?.username?.charAt(0)?.toUpperCase() || 'U'} size="sm" />
            </button>
          </Tooltip>
        ) : (
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors">
            <Avatar initials={user?.username?.charAt(0)?.toUpperCase() || 'U'} size="md" />
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-text truncate">{user?.username || 'Guest User'}</p>
              <p className="text-xs text-muted truncate">{user?.role || 'VIEWER'}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); logout(); }} className="text-muted hover:text-danger p-1" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
