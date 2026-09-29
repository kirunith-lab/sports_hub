import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, ArrowLeft, Shield } from 'lucide-react';
import { tournamentsAPI } from '../services/api';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TournamentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('standings');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await tournamentsAPI.getById(id);
        if (res.success) {
          setData(res.tournament);
        }
      } catch (err) {
        console.error('Error fetching tournament details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <LoadingSpinner text="Computing SQL tournament standings & fixtures..." />;
  if (!data) return <div className="p-8 text-center text-slate-400">Tournament not found.</div>;

  const { standings, matches } = data;

  return (
    <div className="space-y-8">
      {/* Tournament Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <Link to="/tournaments" className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tournaments</span>
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {data.sport_name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {data.status}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-100 mt-2">{data.tournament_name}</h1>
            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {data.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {new Date(data.start_date).toLocaleDateString()} to {new Date(data.end_date).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('standings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'standings'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Points Table
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'matches'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Fixtures & Results ({matches?.length || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Points Table View */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Dynamic Tournament Standings (Points Table)</span>
            </h2>
            <span className="text-xs text-slate-400">Generated dynamically via relational query</span>
          </div>

          {standings?.length > 0 ? (
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4 text-center w-12">#</th>
                    <th className="p-4">Team</th>
                    <th className="p-4 text-center">Played</th>
                    <th className="p-4 text-center text-emerald-400">Won</th>
                    <th className="p-4 text-center text-rose-400">Lost</th>
                    <th className="p-4 text-center text-amber-400">Drawn</th>
                    <th className="p-4 text-center font-extrabold text-indigo-400">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {standings.map((st, idx) => (
                    <tr key={st.team_stat_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-4">
                        <Link to={`/teams/${st.team_id}`} className="flex items-center space-x-3 group">
                          <img
                            src={st.logo_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=100&q=80'}
                            alt={st.team_name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                          />
                          <span className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                            {st.team_name}
                          </span>
                        </Link>
                      </td>
                      <td className="p-4 text-center font-semibold">{st.matches_played}</td>
                      <td className="p-4 text-center font-bold text-emerald-400">{st.wins}</td>
                      <td className="p-4 text-center font-bold text-rose-400">{st.losses}</td>
                      <td className="p-4 text-center font-bold text-amber-400">{st.draws}</td>
                      <td className="p-4 text-center font-black text-indigo-400 text-sm bg-indigo-500/5">{st.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs glass-panel rounded-2xl">
              No standings computed for this tournament yet.
            </div>
          )}
        </div>
      )}

      {/* Match Fixtures View */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Tournament Schedule & Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches?.length > 0 ? (
              matches.map((m) => <MatchCard key={m.match_id} match={{ ...m, tournament_name: data.tournament_name }} />)
            ) : (
              <div className="col-span-full p-8 text-center text-slate-400 text-xs">No match fixtures scheduled.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
