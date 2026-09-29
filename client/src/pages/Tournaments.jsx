import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Search, ArrowRight } from 'lucide-react';
import { tournamentsAPI, sportsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sportId, setSportId] = useState('');

  useEffect(() => {
    sportsAPI.getAll().then((res) => {
      if (res.success) setSports(res.sports);
    });
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [search, status, sportId]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await tournamentsAPI.getAll({ search, status, sport_id: sportId });
      if (res.success) setTournaments(res.tournaments);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Tournaments & Leagues</h1>
          <p className="text-xs text-slate-400 mt-1">Championship competitions and dynamic tournament standings tables</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tournament..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 text-xs text-slate-100 pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={sportId}
            onChange={(e) => setSportId(e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Sports</option>
            {sports.map((s) => (
              <option key={s.sport_id} value={s.sport_id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching tournaments and generating dynamic standings..." />
      ) : tournaments.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
          No tournaments match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournaments.map((t) => (
            <div key={t.tournament_id} className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {t.sport_name}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      t.status === 'Ongoing'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                        : t.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-100">{t.tournament_name}</h3>
                
                <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Location: {t.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {new Date(t.start_date).toLocaleDateString()} — {new Date(t.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {t.total_participating_teams || 0} Teams • {t.total_matches || 0} Matches
                </span>
                <Link
                  to={`/tournaments/${t.tournament_id}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
                >
                  <span>Points Table</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
