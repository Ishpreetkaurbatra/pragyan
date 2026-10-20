import React, { useState } from 'react';
import { 
  TrendingUp, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Layers, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api/client';
import { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('gayatri@freshbite.cafe');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Gayatri Patil');
  const [businessName, setBusinessName] = useState('FreshBite Café');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('BUSINESS');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        await api.switchRole(selectedRole);
      } else {
        await api.switchRole(selectedRole);
      }
      onLoginSuccess(selectedRole);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole, demoEmail: string) => {
    setLoading(true);
    setErrorMsg('');
    setEmail(demoEmail);
    setSelectedRole(role);

    try {
      await api.switchRole(role);
      onLoginSuccess(role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={onNavigateHome}
            className="inline-flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-blue via-teal to-growth flex items-center justify-center text-white shadow-soft-glass group-hover:scale-105 transition-transform">
              <TrendingUp className="w-7 h-7 stroke-[2.5]" />
            </div>
            <span className="font-display font-extrabold text-3xl tracking-tight text-navy">
              T<span className="text-growth">→</span>G
            </span>
          </div>

          <h2 className="font-display font-extrabold text-2xl text-navy">
            {isRegister ? 'Create your T→G account' : 'Welcome back to T→G'}
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Soft Glass. Strong Intelligence. Visible Growth.
          </p>
        </div>

        {/* Main Glassmorphic Auth Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass space-y-5">
          {/* Quick Demo 1-Click Login Banner */}
          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal" />
                <span>1-Click Instant Demo Login</span>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-light-green text-dark-green border border-growth/20">
                Zero Config
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('BUSINESS', 'gayatri@freshbite.cafe')}
                className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-left border border-white/90 shadow-sm transition-all hover:scale-[1.02] hover:border-growth/40"
              >
                <div className="flex items-center space-x-1 text-growth font-bold text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-growth" />
                  <span>Business</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">FreshBite Café</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('EXPERT', 'rajesh@growthworks.in')}
                className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-left border border-white/90 shadow-sm transition-all hover:scale-[1.02] hover:border-primary-blue/40"
              >
                <div className="flex items-center space-x-1 text-primary-blue font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-blue" />
                  <span>Expert</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">Retail Strategist</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN', 'admin@trendtogrowth.com')}
                className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-left border border-white/90 shadow-sm transition-all hover:scale-[1.02] hover:border-amber-400/40"
              >
                <div className="flex items-center space-x-1 text-amber-700 font-bold text-xs">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">Ops Mission Ctrl</div>
              </button>
            </div>
          </div>

          {/* Toggle between Sign In / Sign Up */}
          <div className="flex rounded-2xl bg-slate-200/50 p-1 border border-white/70 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 rounded-xl transition-all ${
                !isRegister ? 'bg-white text-navy shadow-sm font-bold' : 'text-slate-600 hover:text-navy'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 rounded-xl transition-all ${
                isRegister ? 'bg-white text-navy shadow-sm font-bold' : 'text-slate-600 hover:text-navy'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resetSent && (
            <div className="p-3.5 rounded-xl bg-light-green border border-growth/20 text-dark-green text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-growth" />
              <span>Demo password reset link dispatched to {email}.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Gayatri Patil"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="FreshBite Café"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yourbusiness.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setResetSent(true)}
                    className="text-[11px] font-semibold text-primary-blue hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role selection for signup */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Platform Persona Role
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('BUSINESS')}
                    className={`py-2 px-2.5 rounded-xl border font-bold text-center transition-all ${
                      selectedRole === 'BUSINESS'
                        ? 'bg-light-green border-growth text-dark-green'
                        : 'bg-white/80 border-slate-200 text-slate-600'
                    }`}
                  >
                    Business Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('EXPERT')}
                    className={`py-2 px-2.5 rounded-xl border font-bold text-center transition-all ${
                      selectedRole === 'EXPERT'
                        ? 'bg-light-blue border-primary-blue text-dark-blue'
                        : 'bg-white/80 border-slate-200 text-slate-600'
                    }`}
                  >
                    Domain Expert
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ADMIN')}
                    className={`py-2 px-2.5 rounded-xl border font-bold text-center transition-all ${
                      selectedRole === 'ADMIN'
                        ? 'bg-warning-bg border-warning-orange text-amber-800'
                        : 'bg-white/80 border-slate-200 text-slate-600'
                    }`}
                  >
                    Platform Admin
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-xs font-bold shadow-soft-glass flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account & Enter Platform' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom disclaimer */}
        <p className="text-center text-[11px] text-slate-500 font-medium">
          T→G Business Intelligence • Enterprise Soft Glassmorphism Architecture
        </p>
      </div>
    </div>
  );
};
