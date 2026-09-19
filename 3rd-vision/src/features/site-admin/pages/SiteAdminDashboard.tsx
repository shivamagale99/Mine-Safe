import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { UserRole } from '../../../types';
import {
  Shield,
  Building2,
  HardHat,
  Truck,
  ArrowRight,
  Lock,
  Radio,
  BarChart3,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

export const DemoLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemoRole, loginWithGoogle, isLoading, isAuthenticated } = useAppStore();

  const handleAccess = (role: UserRole, targetPath: string, siteId?: string) => {
    loginAsDemoRole(role);
    // You can also store the selected site in your app store if needed
    if (siteId) {
      // e.g., setSelectedSite(siteId);
    }
    navigate(targetPath);
  };

  const handleLogin = async () => {
    try {
      if (!isAuthenticated) {
        await loginWithGoogle();
      }
      navigate('/admin/dashboard');
    } catch {
      navigate('/admin/dashboard');
    }
  };

  const portalCards = [
    {
      id: 'state-gov',
      title: 'State Government',
      tag: 'Multi-Site Governance',
      description:
        'State-level oversight across mining sites. Live aggregated KPIs, regional safety alerts, interactive mine maps, and inter-site operational comparisons.',
      role: 'SUPER_ADMIN' as UserRole,
      path: '/super-admin/dashboard',
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      meta: 'Kirandul • Bacheli • Donimalai • Bailadila',
    },
    {
      id: 'site-admin',
      title: 'Site Administration',
      tag: 'Mine Operations Hub',
      description:
        'Full operational command of local mine pits. Real-time fleet tracking, radar/LiDAR telemetry, micro-climate weather conditions, and network health.',
      role: 'SITE_ADMIN' as UserRole,
      path: '/admin/dashboard',
      icon: <HardHat className="w-8 h-8 text-amber-600" />,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      meta: '100% Telemetry Active • Live Haulage',
    },
    {
      id: 'vehicle-operator',
      title: 'Vehicle Operator',
      tag: 'In-Cab Safety HUD',
      description:
        'High-contrast, distraction-free in-cab display. Instant speed advisory, optical fog visibility measurements, radar distance, and collision hazard warnings.',
      role: 'VEHICLE_OPERATOR' as UserRole,
      path: '/operator/dashboard',
      icon: <Truck className="w-8 h-8 text-emerald-600" />,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      meta: 'Operator D-104 • V2X Radar Proximity',
    },
  ];

  // 4 Specific Mining Sites with Image Previews
  const miningSites = [
    {
      id: 'kirandul',
      name: 'Kirandul Complex',
      region: 'Chhattisgarh',
      image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80', // Replace with your local/hosted image path
      status: 'Telemetry Active',
      role: 'SITE_ADMIN' as UserRole,
      path: '/admin/dashboard?site=kirandul',
    },
    {
      id: 'bacheli',
      name: 'Bacheli Complex',
      region: 'Chhattisgarh',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      status: 'Haulage Normal',
      role: 'SITE_ADMIN' as UserRole,
      path: '/admin/dashboard?site=bacheli',
    },
    {
      id: 'donimalai',
      name: 'Donimalai Mine',
      region: 'Karnataka',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
      status: 'Radar Online',
      role: 'SITE_ADMIN' as UserRole,
      path: '/admin/dashboard?site=donimalai',
    },
    {
      id: 'bailadila',
      name: 'Bailadila Deposit',
      region: 'Chhattisgarh',
      image: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16d66c?auto=format&fit=crop&w=600&q=80',
      status: 'High Visibility',
      role: 'SITE_ADMIN' as UserRole,
      path: '/admin/dashboard?site=bailadila',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ─── Top Bar Header ────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-2">
              MineSafe
              <span className="text-[11px] font-mono font-bold text-slate-600 border border-slate-200 bg-slate-100 px-2 py-0.5 rounded-md">
                v2.4
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono tracking-wide">
              Monitor • Predict • Prevent
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-mono font-medium text-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Login"
          >
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* ─── Hero & Portal Access Selection ─────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-600 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Industrial Safety Operations Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            MineSafe Operations Portal
          </h1>
          <p className="text-slate-600 text-base font-normal max-w-xl mx-auto">
            Select access role or choose an active mining site below
          </p>
        </div>

        {/* ─── Three Primary Access Cards ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {portalCards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${card.badgeClass}`}>
                    {card.tag}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {card.title}
                  </h2>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    {card.meta}
                  </p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to={card.path}
                  onClick={() => handleAccess(card.role, card.path)}
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-150 cursor-pointer shadow-sm ${card.buttonBg}`}
                  aria-label={`Launch ${card.title}`}
                >
                  <span>Launch {card.title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ─── 4 Site Visual Selection Grid ─────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Regional Sites</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Click any site to launch its localized telemetry feed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {miningSites.map((site) => (
              <div
                key={site.id}
                onClick={() => handleAccess(site.role, site.path, site.id)}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
              >
                {/* Site Image Container */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  {/* Status Tag Badge */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                    {site.status}
                  </div>

                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-xs font-mono opacity-80 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      {site.region}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {site.name}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Secondary Access Links ─────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500">
          <button
            onClick={() => handleAccess('CONTROL_ROOM_OPERATOR', '/control-room/dashboard')}
            className="hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            <span>Control Room Dispatch</span>
          </button>
          <span>•</span>
          <button
            onClick={() => handleAccess('MANAGEMENT', '/public')}
            className="hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Executive Analytics</span>
          </button>
          <span>•</span>
          <button
            onClick={() => navigate('/login')}
            className="hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Custom Credentials Login</span>
          </button>
        </div>
      </main>

      {/* ─── Minimal Industrial Footer ───────────────────────────────── */}
      <footer className="border-t border-slate-200 py-4 px-6 text-center text-xs font-mono text-slate-500 bg-white">
        MineSafe Operations Platform • Ministry of Mines & NMDC Telemetry Integration • Encrypted Edge Architecture
      </footer>
    </div>
  );
};