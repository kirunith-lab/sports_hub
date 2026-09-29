import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, LogIn, UserPlus, Key, Mail, ShieldAlert, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register(formData);
        if (res.success) {
          navigate(res.user.role === 'admin' ? '/admin' : '/');
        }
      } else {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          navigate(res.user.role === 'admin' ? '/admin' : '/');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setFormData({ name: 'System Administrator', email: 'admin@sportshub.com', password: 'admin123', role: 'admin' });
    setIsRegister(false);
  };

  const fillDemoUser = () => {
    setFormData({ name: 'John Doe', email: 'user@sportshub.com', password: 'user123', role: 'user' });
    setIsRegister(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-speed-lines">
      <div className="w-full max-w-md bg-[#101316] p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 relative overflow-hidden">
        
        {/* Subtle Lime Speed Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C8FF00]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#080A0C] border border-[#C8FF00]/40 text-[#C8FF00] flex items-center justify-center shadow-[0_0_20px_rgba(200,255,0,0.15)]">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-display font-black text-neutral-100 uppercase tracking-tight">
            {isRegister ? 'Create Account' : 'Command Auth'}
          </h2>
          <p className="text-xs font-mono text-neutral-400">
            {isRegister ? 'Register user account in MySQL database' : 'Sign in with your JWT credentials'}
          </p>
        </div>

        {/* Demo Preset Buttons for Evaluator Viva Ease */}
        <div className="p-3.5 rounded-2xl bg-[#080A0C] border border-[#C8FF00]/20 space-y-2">
          <span className="text-[10px] font-mono font-bold text-[#C8FF00] uppercase tracking-widest block text-center flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" /> Quick Demo Evaluator Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-2 px-3 rounded-xl bg-[#C8FF00]/10 hover:bg-[#C8FF00]/20 text-[#C8FF00] text-xs font-mono font-bold border border-[#C8FF00]/30 transition-all text-center"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={fillDemoUser}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-mono font-bold border border-white/10 transition-all text-center"
            >
              Demo User
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FF4D5A]/10 border border-[#FF4D5A]/30 text-[#FF4D5A] text-xs font-mono flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#080A0C] text-xs text-neutral-100 px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#C8FF00]/60 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@sportshub.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#080A0C] text-xs text-neutral-100 pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#C8FF00]/60 transition-colors"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#080A0C] text-xs text-neutral-100 pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#C8FF00]/60 transition-colors"
              />
              <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#C8FF00] hover:bg-[#b5e600] text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(200,255,0,0.25)] transition-all flex items-center justify-center space-x-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}</span>
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-white/10 text-xs font-mono text-neutral-400">
          {isRegister ? (
            <p>
              Already registered?{' '}
              <button onClick={() => setIsRegister(false)} className="text-[#C8FF00] font-bold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Need an account?{' '}
              <button onClick={() => setIsRegister(true)} className="text-[#C8FF00] font-bold hover:underline">
                Register New User
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
