import React, { useEffect, useState } from 'react';
import { BarChart3, Trophy, Award, Activity, Star, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { statsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Statistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsAPI.getDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Computing SQL analytics and compiling Recharts datasets..." />;
  if (!data) return <div className="p-8 text-center text-slate-400">Failed to load analytics data.</div>;

  const { charts } = data;
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e'];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
          <BarChart3 className="w-7 h-7 text-indigo-400" />
          <span>Analytics & Leaderboards</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time analytical metrics computed from MySQL JOIN & GROUP BY queries</p>
      </div>

      {/* Visual Recharts Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Teams Distribution Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Teams Count per Sport</h3>
            <span className="text-[10px] uppercase font-semibold text-slate-400">GROUP BY sport_id</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.teamsBySport}>
                <XAxis dataKey="sport" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Matches Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Match Share by Category</h3>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Proportional Analytics</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.matchesBySport}
                  dataKey="count"
                  nameKey="sport"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {charts.matchesBySport.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Players Global Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Top Performing Athletes Leaderboard</span>
          </h2>
          <span className="text-xs text-slate-400">ORDER BY avg_rating DESC</span>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 w-12 text-center">Rank</th>
                <th className="p-4">Athlete Name</th>
                <th className="p-4">Sport</th>
                <th className="p-4 text-center">Goals</th>
                <th className="p-4 text-center">Runs</th>
                <th className="p-4 text-center">Points</th>
                <th className="p-4 text-center font-bold text-amber-400">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {charts.topPlayers.map((player, idx) => (
                <tr key={player.player_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 text-center font-black text-amber-400">#{idx + 1}</td>
                  <td className="p-4 font-bold text-slate-100">{player.name}</td>
                  <td className="p-4 text-indigo-400 font-semibold">{player.sport}</td>
                  <td className="p-4 text-center font-bold text-emerald-400">{player.goals || 0}</td>
                  <td className="p-4 text-center font-bold text-amber-400">{player.runs || 0}</td>
                  <td className="p-4 text-center font-bold text-cyan-400">{player.points || 0}</td>
                  <td className="p-4 text-center font-black text-amber-400 text-sm">{player.rating} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
