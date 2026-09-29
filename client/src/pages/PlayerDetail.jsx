import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Shield, Globe, Calendar, Award, ArrowLeft, Star, Activity } from 'lucide-react';
import { playersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PlayerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await playersAPI.getById(id);
        if (res.success) {
          setData(res.player);
        }
      } catch (err) {
        console.error('Error fetching player detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) return <LoadingSpinner text="Fetching player career statistics..." />;
  if (!data) return <div className="p-8 text-center text-slate-400">Player profile not found.</div>;

  const { summary, performances } = data;

  return (
    <div className="space-y-8">
      {/* Header Profile Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <Link to="/players" className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Players</span>
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <img
              src={data.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={data.name}
              className="w-24 h-24 object-cover rounded-3xl border-2 border-indigo-500/30 shadow-2xl"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {data.sport_name}
                </span>
                {data.jersey_number && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    #{data.jersey_number}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black text-slate-100 mt-1">{data.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  {data.team_name || 'Free Agent'}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  {data.nationality}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {data.position || 'Athlete'}
                </span>
                {data.date_of_birth && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    DOB: {new Date(data.date_of_birth).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Average Performance Rating */}
          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-center min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">
              Performance Index
            </span>
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-3xl font-black text-slate-100">{summary?.avg_rating || 'N/A'}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">out of 10.0</span>
          </div>
        </div>
      </div>

      {/* Career Summary Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs uppercase font-semibold text-slate-400 block">Matches Played</span>
          <span className="text-2xl font-black text-slate-100 mt-2 block">{summary?.total_matches_played || 0}</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs uppercase font-semibold text-slate-400 block">Total Goals</span>
          <span className="text-2xl font-black text-emerald-400 mt-2 block">{summary?.total_goals || 0}</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs uppercase font-semibold text-slate-400 block">Cricket Runs</span>
          <span className="text-2xl font-black text-amber-400 mt-2 block">{summary?.total_runs || 0}</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs uppercase font-semibold text-slate-400 block">Total Points</span>
          <span className="text-2xl font-black text-cyan-400 mt-2 block">{summary?.total_points || 0}</span>
        </div>
      </div>

      {/* Match Performances Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <span>Match Performance Breakdown</span>
        </h2>

        {performances?.length > 0 ? (
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Match Date</th>
                  <th className="p-4">Tournament</th>
                  <th className="p-4">Fixture</th>
                  <th className="p-4 text-center">Goals</th>
                  <th className="p-4 text-center">Runs</th>
                  <th className="p-4 text-center">Wickets</th>
                  <th className="p-4 text-center">Points</th>
                  <th className="p-4 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {performances.map((perf) => (
                  <tr key={perf.stat_id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-semibold">{new Date(perf.match_date).toLocaleDateString()}</td>
                    <td className="p-4 text-indigo-400">{perf.tournament_name}</td>
                    <td className="p-4 text-slate-100 font-medium">{perf.team1_name} vs {perf.team2_name}</td>
                    <td className="p-4 text-center font-bold text-emerald-400">{perf.goals}</td>
                    <td className="p-4 text-center font-bold text-amber-400">{perf.runs}</td>
                    <td className="p-4 text-center font-bold text-cyan-400">{perf.wickets}</td>
                    <td className="p-4 text-center font-bold text-slate-100">{perf.points}</td>
                    <td className="p-4 text-center font-black text-amber-400">{perf.performance_rating} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs glass-panel rounded-2xl">
            No individual match statistics recorded for this player yet.
          </div>
        )}
      </div>
    </div>
  );
}
