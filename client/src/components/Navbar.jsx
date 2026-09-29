import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Shield, Users, Calendar, MapPin, Activity, FileText, Database, LogIn, LogOut, LayoutDashboard, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Sports', path: '/sports', icon: Trophy, requiresAuth: true },
    { name: 'Teams', path: '/teams', icon: Shield, requiresAuth: true },
    { name: 'Players', path: '/players', icon: Users, requiresAuth: true },
    { name: 'Tournaments', path: '/tournaments', icon: Calendar, requiresAuth: true },
    { name: 'Matches', path: '/matches', icon: Activity, requiresAuth: true },
    { name: 'Venues', path: '/venues', icon: MapPin, requiresAuth: true },
    { name: 'Reports', path: '/reports', icon: FileText, requiresAuth: true },
    { name: 'DB Insights', path: '/database-insights', icon: Database, requiresAuth: false },
  ];

  const visibleNavLinks = navLinks.filter((link) => !link.requiresAuth || user);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/players?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080A0C]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#101316] border border-[#C8FF00]/30 text-[#C8FF00] flex items-center justify-center group-hover:scale-105 group-hover:border-[#C8FF00] transition-all shadow-[0_0_15px_rgba(200,255,0,0.15)]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-display font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SPORTS<span className="text-[#C8FF00]">HUB</span>
              </span>
              <span className="block text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400">
                DBMS COMMAND ENGINE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Only shown when logged in or for public DB Insights) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {visibleNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide uppercase transition-all ${
                    isActive
                      ? 'bg-[#C8FF00]/10 text-[#C8FF00] border-b-2 border-[#C8FF00] shadow-[0_4px_12px_rgba(200,255,0,0.1)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8FF00]' : 'text-neutral-400'}`} />
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
                placeholder="Search database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-48 bg-[#101316] text-xs text-neutral-200 pl-8 pr-3 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#C8FF00]/50 transition-all placeholder:text-neutral-600"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2" />
            </form>

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#C8FF00] text-black hover:bg-[#b5e600] transition-all shadow-[0_0_15px_rgba(200,255,0,0.2)]"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="text-right text-xs">
                  <span className="block font-semibold text-neutral-200">{user.name}</span>
                  <span className="block text-[10px] text-[#C8FF00] font-mono capitalize">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-neutral-400 hover:text-[#FF4D5A] hover:bg-[#FF4D5A]/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#C8FF00] text-black hover:bg-[#b5e600] transition-all shadow-[0_0_15px_rgba(200,255,0,0.2)]"
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
              className="p-2 text-neutral-300 hover:bg-white/5 rounded-lg focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#080A0C] px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101316] text-xs text-neutral-100 pl-8 pr-3 py-2 rounded-lg border border-white/10"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-2.5 top-2.5" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {visibleNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono uppercase text-neutral-300 hover:bg-white/5 hover:text-[#C8FF00]"
                >
                  <Icon className="w-4 h-4 text-[#C8FF00]" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            {user ? (
              <>
                <div>
                  <span className="block text-xs font-semibold">{user.name}</span>
                  <span className="text-[10px] text-[#C8FF00] uppercase font-mono">{user.role}</span>
                </div>
                <div className="flex space-x-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-1.5 text-xs font-bold bg-[#C8FF00] text-black rounded-md"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#FF4D5A]/20 text-[#FF4D5A] rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 bg-[#C8FF00] text-black rounded-lg text-xs font-bold uppercase"
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
