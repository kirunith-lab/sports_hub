import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Shield, Users, Calendar, MapPin, BarChart3, LogIn, LogOut, LayoutDashboard, Search, Menu, X, Activity, FileText, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Sports', path: '/sports', icon: Trophy },
    { name: 'Teams', path: '/teams', icon: Shield },
    { name: 'Players', path: '/players', icon: Users },
    { name: 'Tournaments', path: '/tournaments', icon: Calendar },
    { name: 'Matches', path: '/matches', icon: Activity },
    { name: 'Venues', path: '/venues', icon: MapPin },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'DB Insights', path: '/database-insights', icon: Database },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/players?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                SportsHub
              </span>
              <span className="block text-[10px] font-semibold text-indigo-400 uppercase tracking-widest leading-none">
                DBMS System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar & User / Admin Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search players, teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-48 bg-slate-900/90 text-xs text-slate-100 pl-8 pr-3 py-1.5 rounded-full border border-slate-700/80 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </form>

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="text-right text-xs">
                  <span className="block font-semibold text-slate-200">{user.name}</span>
                  <span className="block text-[10px] text-slate-400 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search players, teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-100 pl-8 pr-3 py-2 rounded-lg border border-slate-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <>
                <div>
                  <span className="block text-xs font-semibold">{user.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase">{user.role}</span>
                </div>
                <div className="flex space-x-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-500 text-slate-950 rounded-md"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-600/20 text-rose-400 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
              >
                Login to SportsHub
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
