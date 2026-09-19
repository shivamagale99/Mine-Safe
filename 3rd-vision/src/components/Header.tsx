import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/appStore';
import { useSiteStore } from '../store/siteStore';
import { ROLES_CONFIG } from '../app/constants';
import { getDashboardPath } from '../utils/redirectByRole';
import {
  Shield,
  MapPin,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    selectedSiteId,
    setSelectedSiteId,
    connectionStatus,
    toggleNotifications,
    alerts,
  } = useAppStore();

  const { sites, selectedSite, setSelectedSite } = useSiteStore();

  const roleConfig = user ? ROLES_CONFIG[user.role] : null;
  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const handleSiteChange = (newSiteId: string) => {
    setSelectedSiteId(newSiteId);
    setSelectedSite(newSiteId);
  };

  // Determine system status
  const getStatusDisplay = () => {
    if (connectionStatus === 'LIVE') {
      return { label: 'LIVE', color: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50' };
    }
    if (connectionStatus === 'OFFLINE') {
      return { label: 'OFFLINE', color: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', bg: 'bg-red-50' };
    }
    return { label: 'SIMULATION', color: 'bg-amber-500', text: 'text-amber-800', border: 'border-amber-200', bg: 'bg-amber-50' };
  };

  const status = getStatusDisplay();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-xs">
      {/* Brand & Site Selector */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div
          onClick={() => navigate(isAuthenticated && user ? getDashboardPath(user.role) : '/')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm text-white font-bold transition-transform group-hover:scale-105">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
              MineSafe
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Operations Platform</div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Current Site Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 transition-colors">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <select
            value={selectedSite.id}
            onChange={(e) => handleSiteChange(e.target.value)}
            aria-label="Select Mining Site"
            className="bg-transparent text-slate-800 text-xs sm:text-sm font-semibold outline-none cursor-pointer pr-1"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id} className="bg-white text-slate-800">
                {site.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Toolbar: System Status, Notifications, User */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* System Status Pill (LIVE, SIMULATION, OFFLINE) */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${status.border} ${status.bg} text-xs font-mono font-bold select-none`}>
          <span className={`w-2 h-2 rounded-full ${status.color} animate-pulse`} />
          <span className={status.text}>{status.label}</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={toggleNotifications}
          aria-label="Open notifications feed"
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          title="Safety Notifications"
        >
          <Bell className="w-4 h-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-[10px] font-mono font-bold text-white flex items-center justify-center">
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* User Profile & Sign Out */}
        {user ? (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={user.displayName}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 line-clamp-1">{user.displayName}</div>
              <div className="text-[10px] font-mono text-blue-600 font-semibold">{roleConfig?.label || 'User'}</div>
            </div>
            <button
              onClick={logout}
              aria-label="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
