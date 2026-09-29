import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Trophy, Shield, Users, Calendar, Activity, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { statsAPI } from '../../services/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
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
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Compiling admin system telemetry..." />;
  if (!data) return <div className="p-8 text-center text-slate-400">Failed to load admin telemetry.</div>;

  const { metrics, charts } = data;
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
          <LayoutDashboard className="w-7 h-7 text-amber-400" />
          <span>System Administration Dashboard</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time relational database telemetry and CRUD management console</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Sports Categories" value={metrics.total_sports} icon={Trophy} color="indigo" />
        <StatCard title="Registered Teams" value={metrics.total_teams} icon={Shield} color="emerald" />
        <StatCard title="Total Players" value={metrics.total_players} icon={Users} color="amber" />
        <StatCard title="Tournaments" value={metrics.total_tournaments} icon={Calendar} color="cyan" />
        <StatCard title="Total Matches" value={metrics.total_matches} icon={Activity} color="indigo" />
        <StatCard title="Upcoming Matches" value={metrics.upcoming_matches} icon={Calendar} color="amber" />
        <StatCard title="Completed Matches" value={metrics.completed_matches} icon={Trophy} color="emerald" />
        <StatCard title="Registered Users" value={metrics.total_users} icon={Users} color="rose" />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Teams Count by Sport Category</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.teamsBySport}>
                <XAxis dataKey="sport" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Matches Breakdown per Sport</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.matchesBySport} dataKey="count" nameKey="sport" cx="50%" cy="50%" outerRadius={75} label>
                  {charts.matchesBySport.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
