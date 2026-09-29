import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, ArrowLeft, Award, Star } from 'lucide-react';
import { matchesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MatchDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await matchesAPI.getById(id);
        if (res.success) {
          setData(res.match);
        }
      } catch (err) {
        console.error('Error fetching match detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  if (loading) return <LoadingSpinner text="Fetching match scorelines & player stats..." />;
  if (!data) return <div className="p-8 text-center text-slate-400">Match fixture not found.</div>;

  const { player_statistics } = data;
  const isCompleted = data.status === 'Completed';

  return (
    <div className="space-y-8">
      {/* Header Back Button */}
      <Link to="/matches" className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Matches</span>
      </Link>

      {/* Main Match Scoreboard Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-indigo-400 mb-6">
          <Trophy className="w-4 h-4" />
          <span>{data.tournament_name} • {data.sport_name}</span>
        </div>

        <div className="grid grid-cols-7 items-center max-w-3xl mx-auto my-4">
          {/* Team 1 */}
          <div className="col-span-3 flex flex-col items-center">
            <img
              src={data.team1_logo || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=200&q=80'}
              alt={data.team1_name}
              className="w-20 h-20 object-cover rounded-2xl border-2 border-slate-700 shadow-xl mb-3"
            />
            <h2 className="text-xl font-bold text-slate-100">{data.team1_name}</h2>
            <span className="text-xs text-slate-400">{data.team1_country}</span>
          </div>

          {/* Score or VS */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            {isCompleted ? (
              <div className="bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-700 shadow-inner">
                <span className="text-3xl font-black text-slate-100">{data.team1_score}</span>
                <span className="text-slate-500 mx-2 font-bold">:</span>
                <span className="text-3xl font-black text-slate-100">{data.team2_score}</span>
              </div>
            ) : (
              <span className="text-sm font-black text-indigo-400 bg-indigo-950/80 px-3 py-1.5 rounded-xl border border-indigo-800">
                VS
              </span>
            )}
            <span
              className={`mt-3 px-3 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                isCompleted
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {data.status}
            </span>
          </div>

          {/* Team 2 */}
          <div className="col-span-3 flex flex-col items-center">
            <img
              src={data.team2_logo || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=200&q=80'}
              alt={data.team2_name}
              className="w-20 h-20 object-cover rounded-2xl border-2 border-slate-700 shadow-xl mb-3"
            />
            <h2 className="text-xl font-bold text-slate-100">{data.team2_name}</h2>
            <span className="text-xs text-slate-400">{data.team2_country}</span>
          </div>
        </div>

        {/* Winner Highlight */}
        {isCompleted && data.winner_name && (
          <div className="mt-6 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Winner: {data.winner_name}</span>
          </div>
        )}

        {/* Venue & Time Meta */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-500" />
            {data.venue_name}, {data.venue_city} ({data.venue_country})
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            {new Date(data.match_date).toLocaleDateString()} at {data.match_time}
          </span>
        </div>
      </div>

      {/* Individual Player Match Performances */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" />
          <span>Player Match Statistics</span>
        </h2>

        {player_statistics?.length > 0 ? (
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Player</th>
                  <th className="p-4">Team</th>
                  <th className="p-4 text-center">Goals</th>
                  <th className="p-4 text-center">Runs</th>
                  <th className="p-4 text-center">Wickets</th>
                  <th className="p-4 text-center">Points</th>
                  <th className="p-4 text-center">Assists</th>
                  <th className="p-4 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {player_statistics.map((ps) => (
                  <tr key={ps.stat_id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-100">{ps.player_name}</td>
                    <td className="p-4 text-indigo-400 font-semibold">{ps.team_name}</td>
                    <td className="p-4 text-center font-bold text-emerald-400">{ps.goals}</td>
                    <td className="p-4 text-center font-bold text-amber-400">{ps.runs}</td>
                    <td className="p-4 text-center font-bold text-cyan-400">{ps.wickets}</td>
                    <td className="p-4 text-center font-bold text-slate-100">{ps.points}</td>
                    <td className="p-4 text-center text-slate-400">{ps.assists}</td>
                    <td className="p-4 text-center font-black text-amber-400">{ps.performance_rating} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs glass-panel rounded-2xl">
            No player stats recorded for this match yet.
          </div>
        )}
      </div>
    </div>
  );
}
