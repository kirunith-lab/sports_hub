import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Activity, Search, Filter } from 'lucide-react';
import { matchesAPI, sportsAPI, tournamentsAPI } from '../services/api';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Matches() {
  const [searchParams] = useSearchParams();
  const initialUpcoming = searchParams.get('upcoming') === 'true';
  const initialCompleted = searchParams.get('completed') === 'true';

  const [matches, setMatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(initialUpcoming ? 'Scheduled' : initialCompleted ? 'Completed' : '');
  const [sportId, setSportId] = useState('');
  const [tournamentId, setTournamentId] = useState('');

  useEffect(() => {
    Promise.all([sportsAPI.getAll(), tournamentsAPI.getAll()]).then(([sRes, tRes]) => {
      if (sRes.success) setSports(sRes.sports);
      if (tRes.success) setTournaments(tRes.tournaments);
    });
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [status, sportId, tournamentId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await matchesAPI.getAll({ status, sport_id: sportId, tournament_id: tournamentId });
      if (res.success) setMatches(res.matches);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Match Fixtures & Results</h1>
          <p className="text-xs text-slate-400 mt-1">Live match scores, upcoming schedules, and historical results</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled (Upcoming)</option>
            <option value="Live">Live Now</option>
            <option value="Completed">Completed Results</option>
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

          <select
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Tournaments</option>
            {tournaments.map((tr) => (
              <option key={tr.tournament_id} value={tr.tournament_id}>{tr.tournament_name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Performing multi-table SQL JOIN to fetch match details..." />
      ) : matches.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
          No matches found matching filter parameters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((m) => (
            <MatchCard key={m.match_id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
