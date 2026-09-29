import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Trophy, Shield, Users, UserCheck, Calendar, MapPin, Activity, BarChart2, UserCog, ArrowLeft, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-rose-400">Access Denied</h2>
        <p className="text-xs text-slate-400">You must be logged in as an Administrator to access this section.</p>
        <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
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
    { name: 'Manage Venues', path: '/admin/venues', icon: MapPin },
    { name: 'Manage Matches', path: '/admin/matches', icon: Activity },
    { name: 'Manage Statistics', path: '/admin/statistics', icon: BarChart2 },
    { name: 'Manage Users', path: '/admin/users', icon: UserCog },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-3 space-y-4">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Admin Control</span>
              <h2 className="text-lg font-black text-slate-100">{user.name}</h2>
            </div>
            <Link to="/" title="Exit to main site" className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800">
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
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-indigo-600/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-all border border-rose-500/20"
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
