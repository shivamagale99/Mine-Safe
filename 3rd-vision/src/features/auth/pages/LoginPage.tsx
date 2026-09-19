import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ShieldAlert, Navigation, Activity, ArrowRight, Shield } from 'lucide-react';
import { useAuthStore } from '../auth.store';
import { UserRole } from '../../../types';
import { getDashboardPath } from '../../../utils/redirectByRole';

const ROLES: { id: UserRole; label: string; icon: any; iconColor: string; iconBg: string; desc: string }[] = [
  { id: 'SUPER_ADMIN', label: 'Super Admin', icon: Activity, iconColor: 'text-purple-600', iconBg: 'bg-purple-50 border-purple-200', desc: 'Platform-wide configuration' },
  { id: 'SITE_ADMIN', label: 'Site Admin', icon: ShieldAlert, iconColor: 'text-blue-600', iconBg: 'bg-blue-50 border-blue-200', desc: 'Manage site sensors & zones' },
  { id: 'CONTROL_ROOM_OPERATOR', label: 'Control Room', icon: Navigation, iconColor: 'text-amber-600', iconBg: 'bg-amber-50 border-amber-200', desc: 'Live map & alert handling' },
  { id: 'VEHICLE_OPERATOR', label: 'Vehicle Operator', icon: Truck, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50 border-emerald-200', desc: 'In-cab collision warnings' },
  { id: 'MANAGEMENT', label: 'Management', icon: Activity, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50 border-indigo-200', desc: 'Analytics & reporting' },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    loginAsDemoRole, 
    clearError 
  } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const path = getDashboardPath(user.role);
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleDemoLogin = (role: UserRole) => {
    clearError();
    loginAsDemoRole(role);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* LEFT: Branding & Aesthetics */}
      <div className="hidden md:flex md:w-1/2 bg-[#F1F5F9] border-r border-[#E2E8F0] relative flex-col justify-between p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
              <Shield className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">MineSafe <span className="text-blue-600">Operations</span></h1>
              <p className="text-slate-500 font-mono text-xs tracking-wider uppercase">Predictive Industrial IoT Platform</p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              Industrial Safety<br />
              <span className="text-blue-600">
                Command Center.
              </span>
            </h2>
            <p className="text-slate-600 text-base max-w-md leading-relaxed">
              Real-time V2X collision avoidance, predictive fog modeling, LiDAR telemetry, and fleet positioning. Zero compromise, complete visibility.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex gap-6">
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
            <div className="text-2xl font-black text-blue-600 mb-1">99.99%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold font-mono">Uptime SLA</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
            <div className="text-2xl font-black text-emerald-600 mb-1">&lt;10ms</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold font-mono">Telemetry Latency</div>
          </div>
        </div>
      </div>

      {/* RIGHT: Login Interface */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 md:hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm mx-auto mb-3">
              <Shield className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">MineSafe <span className="text-blue-600">Operations</span></h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Platform Access</h2>
              <p className="text-slate-500 text-sm">Select a role module to launch securely.</p>
            </div>

            <div className="space-y-3">
              {ROLES.map(({ id, label, icon: Icon, iconColor, iconBg, desc }) => (
                <button
                  key={id}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all duration-150 group cursor-pointer text-left shadow-sm"
                  onClick={() => handleDemoLogin(id)}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg border ${iconBg} ${iconColor}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>

          <p className="text-center mt-8 text-slate-400 text-xs font-mono uppercase tracking-wider">
            © 2026 MineSafe Operations Platform • Edge Telemetry Architecture
          </p>
        </div>
      </div>
    </div>
  );
};
