import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/appStore';
import {
  LayoutDashboard,
  Truck,
  Radio,
  Map,
  ShieldAlert,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  const role = user?.role || 'SITE_ADMIN';

  // Core 7 navigation links specified in requirements
  const getDashboardPath = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return '/super-admin/dashboard';
      case 'SITE_ADMIN':
        return '/admin/dashboard';
      case 'CONTROL_ROOM_OPERATOR':
        return '/control-room/dashboard';
      case 'VEHICLE_OPERATOR':
        return '/operator/dashboard';
      case 'MANAGEMENT':
        return '/public';
      default:
        return '/admin/dashboard';
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: getDashboardPath(),
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      activeMatch: (p: string) =>
        p.endsWith('/dashboard') || p === '/public' || p === '/super-admin' || p === '/admin',
    },
    {
      label: 'Vehicles',
      path: role === 'CONTROL_ROOM_OPERATOR' ? '/control-room/vehicles' : '/admin/vehicles',
      icon: <Truck className="w-5 h-5 shrink-0" />,
      activeMatch: (p: string) => p.includes('/vehicles'),
    },
    {
      label: 'Sensors',
      path: role === 'SUPER_ADMIN' ? '/super-admin/devices' : '/admin/sensors',
      icon: <Radio className="w-5 h-5 shrink-0" />,
      activeMatch: (p: string) => p.includes('/sensors') || p.includes('/devices'),
    },
    {
      label: 'Map',
      path: role === 'CONTROL_ROOM_OPERATOR' ? '/control-room/map' : '/public/risk-map',
      icon: <Map className="w-5 h-5 shrink-0" />,
      activeMatch: (p: string) => p.includes('/map'),
    },
    {
      label: 'Alerts',
      path: role === 'CONTROL_ROOM_OPERATOR' ? '/control-room/alerts' : role === 'VEHICLE_OPERATOR' ? '/operator/warnings' : '/admin/alerts',
      icon: <ShieldAlert className="w-5 h-5 shrink-0" />,
      activeMatch: (p: string) => p.includes('/alerts') || p.includes('/warnings'),
    },
    {
      label: 'Reports',
      path: role === 'CONTROL_ROOM_OPERATOR' ? '/control-room/reports' : role === 'MANAGEMENT' ? '/public/reports' : '/admin/reports',
      icon: <FileText className="w-5 h-5 shrink-0" />,
      activeMatch: (p: string) => p.includes('/reports'),
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
      activeMatch: (p: string) => p.includes('/settings'),
    },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-[240px]' : 'w-[72px]'
      } bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out z-20 sticky top-16 h-[calc(100vh-4rem)] select-none shrink-0 overflow-hidden shadow-xs`}
    >
      <div className="p-3 space-y-2">
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = item.activeMatch(location.pathname);
            return (
              <NavLink
                key={item.label}
                to={item.path}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                {sidebarOpen && (
                  <span className="truncate tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Collapse / Expand Toggle Button */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-mono"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
};
