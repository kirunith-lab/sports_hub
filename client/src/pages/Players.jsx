import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { playersAPI, sportsAPI, teamsAPI } from '../services/api';
import PlayerCard from '../components/PlayerCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Players() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [players, setPlayers] = useState([]);
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [sportId, setSportId] = useState('');
  const [teamId, setTeamId] = useState('');

  useEffect(() => {
    Promise.all([sportsAPI.getAll(), teamsAPI.getAll()]).then(([sRes, tRes]) => {
      if (sRes.success) setSports(sRes.sports);
      if (tRes.success) setTeams(tRes.teams);
    });
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [search, sportId, teamId]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await playersAPI.getAll({ search, sport_id: sportId, team_id: teamId });
      if (res.success) setPlayers(res.players);
    } catch (err) {
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Athletes & Players</h1>
          <p className="text-xs text-slate-400 mt-1">Player directory with position and team associations</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search player name or nationality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 text-xs text-slate-100 pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={sportId}
            onChange={(e) => {
              setSportId(e.target.value);
              setTeamId('');
            }}
            className="bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Sports</option>
            {sports.map((s) => (
              <option key={s.sport_id} value={s.sport_id}>{s.name}</option>
            ))}
          </select>

          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Teams</option>
            {teams
              .filter((t) => !sportId || parseInt(t.sport_id) === parseInt(sportId))
              .map((t) => (
                <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
              ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Performing SQL query on players table..." />
      ) : players.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
          No players match your search filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p) => (
            <PlayerCard key={p.player_id} player={p} />
          ))}
        </div>
      )}
    </div>
  );
}
