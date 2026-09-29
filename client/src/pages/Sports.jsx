import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Search, Shield, Users, Calendar } from 'lucide-react';
import { sportsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Sports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchSports();
  }, [search, category]);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const res = await sportsAPI.getAll({ search, category });
      if (res.success) {
        setSports(res.sports);
      }
    } catch (err) {
      console.error('Error fetching sports:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Sports Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Explore all registered sports disciplines in the relational database</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 text-xs text-slate-100 pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="Team">Team</option>
            <option value="Individual">Individual</option>
            <option value="Racquet">Racquet</option>
            <option value="Combat">Combat</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching sports categories from MySQL..." />
      ) : sports.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
          No sports found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport) => (
            <div key={sport.sport_id} className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-indigo-400 border border-indigo-500/20">
                    {sport.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-100">{sport.name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{sport.description}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    <span className="block font-bold text-slate-200">{sport.total_teams || 0}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Teams</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    <span className="block font-bold text-slate-200">{sport.total_players || 0}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Athletes</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    <span className="block font-bold text-slate-200">{sport.total_tournaments || 0}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Leagues</span>
                  </div>
                </div>

                <Link
                  to={`/sports/${sport.sport_id}`}
                  className="block w-full py-2.5 text-center text-xs font-bold text-indigo-400 bg-indigo-950/40 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-indigo-500/30 shadow-md"
                >
                  View Sport Hub & Teams →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
