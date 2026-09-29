import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { teamsAPI, sportsAPI } from '../services/api';
import TeamCard from '../components/TeamCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sportId, setSportId] = useState('');

  useEffect(() => {
    sportsAPI.getAll().then((res) => {
      if (res.success) setSports(res.sports);
    });
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [search, sportId]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await teamsAPI.getAll({ search, sport_id: sportId });
      if (res.success) setTeams(res.teams);
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Sports Teams</h1>
          <p className="text-xs text-slate-400 mt-1">Teams registered across sports disciplines and countries</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search team name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 text-xs text-slate-100 pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

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
        <LoadingSpinner text="Querying MySQL database for team profiles..." />
      ) : teams.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
          No teams found matching search parameters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((t) => (
            <TeamCard key={t.team_id} team={t} />
          ))}
        </div>
      )}
    </div>
  );
}
