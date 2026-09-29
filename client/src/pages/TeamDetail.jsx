import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Globe, Calendar, Users, ArrowLeft, Trophy, UserCheck } from 'lucide-react';
import { teamsAPI } from '../services/api';
import PlayerCard from '../components/PlayerCard';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TeamDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roster');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await teamsAPI.getById(id);
        if (res.success) {
          setData(res.team);
        }
      } catch (err) {
        console.error('Error fetching team details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) return <LoadingSpinner text="Fetching team squad roster and statistics..." />;
  if (!data) return <div className="p-8 text-center text-slate-400">Team record not found.</div>;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Link to="/teams" className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Teams</span>
          </Link>

          <div className="flex items-center space-x-4">
            <img
              src={data.logo_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=250&q=80'}
              alt={data.team_name}
              className="w-20 h-20 object-cover rounded-2xl border border-slate-700 shadow-xl"
            />
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {data.sport_name}
              </span>
              <h1 className="text-3xl font-black text-slate-100 mt-1">{data.team_name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  {data.city ? `${data.city}, ` : ''}{data.country}
                </span>
                {data.founded_year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Est. {data.founded_year}
                  </span>
                )}
                {data.coach_name && (
                  <span className="flex items-center gap-1 text-indigo-400 font-medium">
                    <UserCheck className="w-3.5 h-3.5" />
                    Head Coach: {data.coach_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="flex space-x-2">
          {['roster', 'matches', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {tab === 'roster' ? `Squad Roster (${data.players?.length || 0})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Roster View */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Active Squad Roster</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.players?.length > 0 ? (
              data.players.map((p) => (
                <PlayerCard key={p.player_id} player={{ ...p, team_name: data.team_name, sport_name: data.sport_name }} />
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-slate-400 text-xs">No active squad players found.</div>
            )}
          </div>
        </div>
      )}

      {/* Matches View */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Match Fixtures & Results</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.matches?.length > 0 ? (
              data.matches.map((m) => <MatchCard key={m.match_id} match={m} />)
            ) : (
              <div className="col-span-full p-8 text-center text-slate-400 text-xs">No matches found for this team.</div>
            )}
          </div>
        </div>
      )}

      {/* Stats View */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Tournament Performance Records</h2>

          {data.stats?.length > 0 ? (
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Tournament</th>
                    <th className="p-4 text-center">Played</th>
                    <th className="p-4 text-center text-emerald-400">Wins</th>
                    <th className="p-4 text-center text-rose-400">Losses</th>
                    <th className="p-4 text-center text-amber-400">Draws</th>
                    <th className="p-4 text-center font-bold text-indigo-400">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.stats.map((st) => (
                    <tr key={st.team_stat_id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-slate-100">{st.tournament_name}</td>
                      <td className="p-4 text-center">{st.matches_played}</td>
                      <td className="p-4 text-center font-semibold text-emerald-400">{st.wins}</td>
                      <td className="p-4 text-center font-semibold text-rose-400">{st.losses}</td>
                      <td className="p-4 text-center font-semibold text-amber-400">{st.draws}</td>
                      <td className="p-4 text-center font-extrabold text-indigo-400 text-sm">{st.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs glass-panel rounded-2xl">
              No tournament statistics recorded for this team yet.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
