import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Trophy, Shield, Users, UserCheck, Calendar, MapPin, Activity, BarChart2, UserCog, ArrowLeft, LogOut, FileCheck, Database, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-display font-bold text-[#FF4D5A]">Access Denied</h2>
        <p className="text-xs text-neutral-400">You must be logged in as an Administrator to access this section.</p>
        <Link to="/login" className="px-5 py-2.5 bg-[#C8FF00] text-black rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#b5e600]">
          Go to Login Page
        </Link>
      </div>
    );
  }

  const adminMenu = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Sports', path: '/admin/sports', icon: Trophy },
    { name: 'Manage Teams', path: '/admin/teams', icon: Shield },
    { name: 'Manage Players', path: '/admin/players', icon: Users },
    { name: 'Manage Coaches', path: '/admin/coaches', icon: UserCheck },
    { name: 'Manage Tournaments', path: '/admin/tournaments', icon: Calendar },
    { name: 'Manage Registrations', path: '/admin/registrations', icon: FileCheck },
    { name: 'Manage Venues', path: '/admin/venues', icon: MapPin },
    { name: 'Manage Matches', path: '/admin/matches', icon: Activity },
    { name: 'Manage Statistics', path: '/admin/statistics', icon: BarChart2 },
    { name: 'Manage Users', path: '/admin/users', icon: UserCog },
    { name: 'DB Insights & SQL', path: '/database-insights', icon: Database }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
      {/* Sidebar Navigation - Futuristic Sports Command Center */}
      <aside className="lg:col-span-3 space-y-4">
        <div className="bg-[#101316] p-5 rounded-2xl border border-white/10 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#C8FF00] uppercase tracking-widest block flex items-center gap-1">
                <Zap className="w-3 h-3" /> COMMAND CENTER
              </span>
              <h2 className="text-base font-display font-extrabold text-neutral-100 mt-0.5">{user.name}</h2>
            </div>
            <Link to="/" title="Exit to main site" className="p-2 text-neutral-400 hover:text-[#C8FF00] rounded-lg bg-[#080A0C] border border-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <nav className="space-y-1">
            {adminMenu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#C8FF00]/10 text-[#C8FF00] border-l-4 border-[#C8FF00] font-bold shadow-[0_0_15px_rgba(200,255,0,0.1)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8FF00]' : 'text-neutral-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#FF4D5A]/10 text-[#FF4D5A] text-xs font-bold uppercase tracking-wider hover:bg-[#FF4D5A]/20 transition-all border border-[#FF4D5A]/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Admin</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="lg:col-span-9">
        <Outlet />
      </main>
    </div>
  );
}
