import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Trophy, Shield, Users, Calendar, Activity } from 'lucide-react';
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

  if (loading) return <LoadingSpinner text="Compiling system telemetry from MySQL database..." />;
  if (!data) return <div className="p-8 text-center text-neutral-400 font-mono">Failed to load admin telemetry.</div>;

  const { metrics, charts } = data;
  const COLORS = ['#C8FF00', '#39FF88', '#FFB84D', '#8FAF00', '#FF4D5A'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-extrabold text-neutral-100 uppercase tracking-tight flex items-center space-x-2">
          <LayoutDashboard className="w-7 h-7 text-[#C8FF00]" />
          <span>SYSTEM CONTROL DASHBOARD</span>
        </h1>
        <p className="text-xs font-mono text-neutral-400 mt-1">Real-time relational database telemetry and CRUD management console</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Sports Categories" value={metrics.total_sports} icon={Trophy} change="+100%" />
        <StatCard title="Registered Teams" value={metrics.total_teams} icon={Shield} change="+12.4%" />
        <StatCard title="Total Players" value={metrics.total_players} icon={Users} change="+8.2%" />
        <StatCard title="Tournaments" value={metrics.total_tournaments} icon={Calendar} change="+4" />
        <StatCard title="Total Matches" value={metrics.total_matches} icon={Activity} />
        <StatCard title="Upcoming Matches" value={metrics.upcoming_matches} icon={Calendar} />
        <StatCard title="Completed Matches" value={metrics.completed_matches} icon={Trophy} />
        <StatCard title="Registered Users" value={metrics.total_users} icon={Users} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-[#101316] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8FF00]">Teams Count by Sport Category</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.teamsBySport}>
                <XAxis dataKey="sport" stroke="#9CA3AF" fontSize={11} fontStyle="normal" />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#080A0C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#F5F5F5' }} />
                <Bar dataKey="count" fill="#C8FF00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#101316] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#39FF88]">Matches Breakdown per Sport</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.matchesBySport} dataKey="count" nameKey="sport" cx="50%" cy="50%" outerRadius={75} label>
                  {charts.matchesBySport.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#080A0C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#F5F5F5' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
