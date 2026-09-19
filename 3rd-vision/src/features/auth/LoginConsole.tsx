import React, { useState } from 'react';
import { 
  User, Shield, Briefcase, Eye, EyeOff, AlertTriangle, Check, Loader2, Info, Lock, Mail, ShieldCheck
} from 'lucide-react';
import { Role, NetworkStatus, TelemetryData } from '../types';

interface LoginConsoleProps {
  role: Role;
  setRole: (role: Role) => void;
  networkStatus: NetworkStatus;
  telemetry: TelemetryData;
  onLoginSubmit: (formData: any) => void;
}

export default function LoginConsole({
  role,
  setRole,
  networkStatus,
  telemetry,
  onLoginSubmit
}: LoginConsoleProps) {
  // Single, unified login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Mandatory DGMS Safety compliance checklist checkbox
  const [safetyComplianceChecked, setSafetyComplianceChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset demo accounts for rapid testing and evaluation
  const handleQuickLogin = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setSafetyComplianceChecked(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter your authorized email address and password.');
      return;
    }

    if (!safetyComplianceChecked) {
      alert('Please check the safety compliance declaration checkbox before authorizing your session.');
      return;
    }

    setIsSubmitting(true);

    // Auto-detect role and appropriate telemetry based on entered email
    const emailLower = email.toLowerCase();
    let detectedRole: Role = 'driver';
    let data: any = {};

    if (emailLower.includes('manager') || emailLower.includes('mgr')) {
      detectedRole = 'manager';
      data = {
        role: 'manager',
        email,
        employeeId: 'MGR-5021',
        zone: 'Bacheli Complex - Deposit 5 Main Pit',
        password
      };
    } else if (emailLower.includes('inspector') || emailLower.includes('insp') || emailLower.includes('dgms')) {
      detectedRole = 'inspector';
      data = {
        role: 'inspector',
        email,
        inspectorId: 'DGMS-INSP-202',
        regulatoryBody: 'Directorate General of Mines Safety (DGMS), Govt of India',
        passcode: password
      };
    } else {
      detectedRole = 'driver';
      data = {
        role: 'driver',
        email,
        truckId: 'HT-045',
        badgeNo: 'OP-8821',
        pin: password,
        checklist: {
          lidarWiped: true,
          iotCalibrated: true,
          brakesAudited: true
        }
      };
    }

    // Sync state to parent immediately
    setRole(detectedRole);

    // Simulated verification delay
    setTimeout(() => {
      onLoginSubmit(data);
      setIsSubmitting(false);
    }, 1000);
  };

  const inputBaseStyle = "w-full pl-10 pr-10 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl transition-all duration-150 focus:bg-white focus:ring-2 focus:ring-sky-500/10 focus:border-sky-600 focus:outline-hidden";
  const labelBaseStyle = "block text-xs font-semibold text-slate-700 mb-1.5";

  // Dynamic feedback on which role is auto-detected
  const getDetectedRoleBadge = () => {
    if (!email) return null;
    const emailLower = email.toLowerCase();
    if (emailLower.includes('manager') || emailLower.includes('mgr')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Briefcase className="w-3 h-3" /> Auto-detected: Dispatch Manager
        </span>
      );
    }
    if (emailLower.includes('inspector') || emailLower.includes('insp') || emailLower.includes('dgms')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <Shield className="w-3 h-3" /> Auto-detected: Safety Inspector
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
        <User className="w-3 h-3" /> Auto-detected: Haulage Driver Portal
      </span>
    );
  };

  return (
    // Outer Container: Full screen viewport, relative layout with hidden overflow
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 p-4 md:p-6" id="login-container">
      
      {/* Background Video Layer: Loops continuously, blurred slightly, unmounts automatically when submitting */}
<video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105"
>
  <source src="/minesite.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
      {/* Main Floating Login Card Container */}
      <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 text-slate-800 border border-white/20">
        
        {/* Upper Meta Info & Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80" 
              alt="NMDC Logo" 
              className="w-10 h-10 object-cover rounded-lg border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-base font-bold tracking-tight leading-none text-slate-900">
                NMDC LIMITED
              </h1>
              <p className="text-[10px] font-mono text-slate-500 font-bold tracking-wider mt-0.5">
                Govt. of India Enterprise
              </p>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">
              LiDAR IoT Assistance Active
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Mining Safety Login Portal
          </h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Sign in directly with your corporate email address to access your custom dispatch workspace.
          </p>
        </div>

        {/* Single, Unified Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
                NMDC Email Address
              </label>
              {getDetectedRoleBadge()}
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. driver@nmdc.co.in"
                required
                className={inputBaseStyle}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelBaseStyle}>Secure Password / Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputBaseStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dynamic Safety compliance seal */}
          <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
            <label className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={safetyComplianceChecked}
                onChange={e => setSafetyComplianceChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500/20"
              />
              <div>
                <span className="block font-bold text-slate-800 text-[11px] uppercase tracking-wide mb-0.5">
                  DGMS Rule 45 Safety Declaration
                </span>
                <span className="text-[11px] font-normal text-slate-500 leading-relaxed block">
                  I hereby declare compliance with low-visibility protocols. All on-board LiDAR sensors, cab-IoT modules, and brake retarders are audited & ready.
                </span>
              </div>
            </label>
          </div>

          {/* Submit action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 font-bold rounded-xl transition-all duration-150 cursor-pointer text-center flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-xs focus:ring-4 focus:ring-sky-500/20 hover:shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Portal...</span>
              </>
            ) : (
              <span>Authorize Portal Session</span>
            )}
          </button>
        </form>

        {/* Demo Account Presets */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Demo Preset Accounts (One-Click Autofill)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('driver@nmdc.co.in', '5022')}
              className="px-2 py-2 text-[11px] font-bold text-left rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all duration-150 cursor-pointer"
            >
              <div className="text-slate-800">Driver Portal</div>
              <div className="text-[9px] text-slate-400 font-normal truncate">driver@nmdc.co.in</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('manager@nmdc.co.in', 'MineAdmin#2026')}
              className="px-2 py-2 text-[11px] font-bold text-left rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all duration-150 cursor-pointer"
            >
              <div className="text-slate-800">Manager Portal</div>
              <div className="text-[9px] text-slate-400 font-normal truncate">manager@nmdc.co.in</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('inspector@nmdc.co.in', '990132')}
              className="px-2 py-2 text-[11px] font-bold text-left rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-150 cursor-pointer"
            >
              <div className="text-slate-800">Inspector Portal</div>
              <div className="text-[9px] text-slate-400 font-normal truncate">inspector@nmdc.co.in</div>
            </button>
          </div>
        </div>

        {/* Compliant Footer Seal */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-mono">
            <Info className="w-3 h-3 text-slate-400" /> ISO 27001 Secured • DGMS Rule 45 Compliant
          </p>
        </div>

      </div>
    </div>
  );
}


// src/features/auth/LoginConsole.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './auth.store';

export default function LoginConsole() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Mark the user as logged in
    login();
    
    // 2. Redirect to the main features page
    navigate('/', { replace: true });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLoginSubmit}>
        <h2>Login to 3rd-vision</h2>
        {/* Your existing inputs for username/password go here */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
} 