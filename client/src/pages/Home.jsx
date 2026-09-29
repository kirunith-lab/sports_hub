import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Shield, Users, Calendar, Activity, ArrowRight, Zap, Award, BarChart3, ChevronRight, Database, Server, Cpu, CheckCircle2, Lock, FileText, Code } from 'lucide-react';
import { sportsAPI, matchesAPI, playersAPI, statsAPI } from '../services/api';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [sports, setSports] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsRes, upcomingRes, recentRes, statsRes] = await Promise.all([
          sportsAPI.getAll(),
          matchesAPI.getAll({ upcoming: 'true' }),
          matchesAPI.getAll({ completed: 'true' }),
          statsAPI.getDashboard()
        ]);

        if (sportsRes.success) setSports(sportsRes.sports.slice(0, 4));
        if (upcomingRes.success) setUpcomingMatches(upcomingRes.matches.slice(0, 3));
        if (recentRes.success) setRecentMatches(recentRes.matches.slice(0, 3));
        if (statsRes.success) {
          setMetrics(statsRes.metrics);
          setTopPlayers(statsRes.charts.topPlayers);
        }
      } catch (err) {
        console.error('Error fetching Landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Initializing SportsHub database telemetry engine..." />;

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section - Next-Gen Futuristic Landing Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#101316] border border-white/10 shadow-2xl p-8 sm:p-12 lg:p-16 bg-speed-lines">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-[30rem] h-[30rem] bg-[#C8FF00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-[30rem] h-[30rem] bg-[#39FF88]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#080A0C] border border-[#C8FF00]/40 text-[#C8FF00] text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(200,255,0,0.15)]">
            <Zap className="w-4 h-4 text-[#C8FF00] animate-pulse" />
            <span>ACADEMIC DBMS PROJECT • MYSQL 8.0 & 3NF SCHEMA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-none uppercase">
            SPORTSHUB <br />
            <span className="text-[#C8FF00] drop-shadow-[0_0_30px_rgba(200,255,0,0.25)]">
              SPORTS MANAGEMENT SYSTEM
            </span>
          </h1>

          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-sans max-w-2xl">
            A submission-ready Database Management System featuring 12 normalized relational tables, Express REST APIs, JWT role authentication, exportable CSV analytics, and interactive SQL demonstrator console.
          </p>

          <div className="flex flex-wrap gap-4 pt-4 font-mono">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl bg-[#C8FF00] hover:bg-[#b5e600] text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(200,255,0,0.3)] transition-all flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Evaluator Demo Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/database-insights"
              className="px-6 py-3.5 rounded-xl bg-[#080A0C] border border-white/10 text-neutral-200 font-bold text-xs uppercase tracking-wider hover:border-[#C8FF00]/50 transition-all flex items-center space-x-2"
            >
              <Code className="w-4 h-4 text-[#C8FF00]" />
              <span>Interactive SQL Executor</span>
            </Link>

            <Link
              to="/sports"
              className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4 text-[#39FF88]" />
              <span>Sports Console</span>
            </Link>
          </div>
        </div>

        {/* Live Database Metrics Telemetry Bar */}
        {metrics && (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10 font-mono">
            <div className="p-4 rounded-xl bg-[#080A0C] border border-white/10 group hover:border-[#C8FF00]/40 transition-colors">
              <div className="flex items-center space-x-2 text-neutral-400 mb-1">
                <Trophy className="w-4 h-4 text-[#C8FF00]" />
                <span className="text-xs uppercase font-bold text-neutral-400">Sports</span>
              </div>
              <span className="text-3xl font-display font-black text-white group-hover:text-[#C8FF00] transition-colors">{metrics.total_sports}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#080A0C] border border-white/10 group hover:border-[#C8FF00]/40 transition-colors">
              <div className="flex items-center space-x-2 text-neutral-400 mb-1">
                <Shield className="w-4 h-4 text-[#39FF88]" />
                <span className="text-xs uppercase font-bold text-neutral-400">Teams</span>
              </div>
              <span className="text-3xl font-display font-black text-white group-hover:text-[#39FF88] transition-colors">{metrics.total_teams}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#080A0C] border border-white/10 group hover:border-[#C8FF00]/40 transition-colors">
              <div className="flex items-center space-x-2 text-neutral-400 mb-1">
                <Users className="w-4 h-4 text-[#C8FF00]" />
                <span className="text-xs uppercase font-bold text-neutral-400">Athletes</span>
              </div>
              <span className="text-3xl font-display font-black text-white group-hover:text-[#C8FF00] transition-colors">{metrics.total_players}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#080A0C] border border-white/10 group hover:border-[#C8FF00]/40 transition-colors">
              <div className="flex items-center space-x-2 text-neutral-400 mb-1">
                <Activity className="w-4 h-4 text-[#FFB84D]" />
                <span className="text-xs uppercase font-bold text-neutral-400">Matches</span>
              </div>
              <span className="text-3xl font-display font-black text-white group-hover:text-[#FFB84D] transition-colors">{metrics.total_matches}</span>
            </div>
          </div>
        )}
      </section>

      {/* College DBMS Viva Quick Guide Section */}
      <section className="bg-[#101316] p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#C8FF00] uppercase tracking-widest block">FOR EVALUATORS & VIVA EXAMINERS</span>
            <h2 className="text-2xl font-display font-extrabold text-neutral-100 uppercase tracking-tight mt-1">
              DBMS Viva Evaluation Shortcuts
            </h2>
          </div>
          <span className="px-3 py-1 rounded bg-[#39FF88]/10 text-[#39FF88] border border-[#39FF88]/30 font-mono text-xs font-bold uppercase">
            3NF Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          <Link to="/database-insights" className="p-4 rounded-xl bg-[#080A0C] border border-white/10 hover:border-[#C8FF00] transition-all space-y-2 group">
            <div className="w-8 h-8 rounded bg-[#C8FF00]/10 text-[#C8FF00] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white group-hover:text-[#C8FF00]">1. SQL & Architecture</h4>
            <p className="text-[11px] text-neutral-400 font-sans">Run live SQL INNER JOINs, GROUP BY, and view 3-tier architecture.</p>
          </Link>

          <Link to="/login" className="p-4 rounded-xl bg-[#080A0C] border border-white/10 hover:border-[#39FF88] transition-all space-y-2 group">
            <div className="w-8 h-8 rounded bg-[#39FF88]/10 text-[#39FF88] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white group-hover:text-[#39FF88]">2. Admin Panel CRUD</h4>
            <p className="text-[11px] text-neutral-400 font-sans">Click "Demo Admin" to manage players, teams, matches & statistics.</p>
          </Link>

          <Link to="/reports" className="p-4 rounded-xl bg-[#080A0C] border border-white/10 hover:border-[#FFB84D] transition-all space-y-2 group">
            <div className="w-8 h-8 rounded bg-[#FFB84D]/10 text-[#FFB84D] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white group-hover:text-[#FFB84D]">3. CSV Data Exporter</h4>
            <p className="text-[11px] text-neutral-400 font-sans">Export sports telemetry datasets to CSV files for database audit.</p>
          </Link>

          <Link to="/players" className="p-4 rounded-xl bg-[#080A0C] border border-white/10 hover:border-[#C8FF00] transition-all space-y-2 group">
            <div className="w-8 h-8 rounded bg-[#C8FF00]/10 text-[#C8FF00] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white group-hover:text-[#C8FF00]">4. Athlete Roster</h4>
            <p className="text-[11px] text-neutral-400 font-sans">Explore player statistics, positions, team links, and performance.</p>
          </Link>
        </div>
      </section>

      {/* Featured Sports Directory */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-neutral-100 uppercase tracking-tight">Featured Sports Directory</h2>
            <p className="text-xs font-mono text-neutral-400">Browse categories & tournaments in the relational schema</p>
          </div>
          <Link to="/sports" className="text-xs font-mono font-bold text-[#C8FF00] hover:underline flex items-center space-x-1 uppercase tracking-wider">
            <span>View All Sports</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sports.map((sport) => (
            <Link
              key={sport.sport_id}
              to={`/sports/${sport.sport_id}`}
              className="bg-[#101316] p-6 rounded-2xl border border-white/10 group hover:border-[#C8FF00]/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#080A0C] border border-white/10 text-[#C8FF00] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-extrabold text-neutral-100 group-hover:text-[#C8FF00] transition-colors">{sport.name}</h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2 font-sans">{sport.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>{sport.total_teams || 0} Teams</span>
                <span className="text-[#C8FF00] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center uppercase">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Match Center Dual Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Fixtures */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-extrabold text-neutral-100 uppercase tracking-tight flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#FFB84D]" />
              <span>Upcoming Fixtures</span>
            </h3>
            <Link to="/matches?upcoming=true" className="text-xs font-mono font-bold text-[#C8FF00] uppercase hover:underline">View All</Link>
          </div>

          <div className="space-y-4">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((m) => <MatchCard key={m.match_id} match={m} />)
            ) : (
              <div className="p-8 rounded-2xl bg-[#101316] border border-white/10 text-center text-xs font-mono text-neutral-400">
                No upcoming matches scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-extrabold text-neutral-100 uppercase tracking-tight flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#39FF88]" />
              <span>Recent Results</span>
            </h3>
            <Link to="/matches?completed=true" className="text-xs font-mono font-bold text-[#C8FF00] uppercase hover:underline">View All</Link>
          </div>

          <div className="space-y-4">
            {recentMatches.length > 0 ? (
              recentMatches.map((m) => <MatchCard key={m.match_id} match={m} />)
            ) : (
              <div className="p-8 rounded-2xl bg-[#101316] border border-white/10 text-center text-xs font-mono text-neutral-400">
                No completed matches found.
              </div>
            )}
          </div>
        </div>

      </section>

      {/* Star Athletes Leaderboard Preview */}
      {topPlayers.length > 0 && (
        <section className="bg-[#101316] p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-extrabold text-neutral-100 uppercase tracking-tight">Star Athletes</h2>
              <p className="text-xs font-mono text-neutral-400">Top performance ratings calculated from player_statistics table</p>
            </div>
            <Link to="/statistics" className="text-xs font-mono font-bold text-[#C8FF00] uppercase hover:underline">Full Leaderboard →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topPlayers.map((player, idx) => (
              <div key={player.player_id} className="p-4 rounded-2xl bg-[#080A0C] border border-white/10 flex flex-col justify-between hover:border-[#C8FF00]/30 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2 font-mono">
                    <span className="w-6 h-6 rounded bg-[#C8FF00]/10 text-[#C8FF00] text-xs font-bold flex items-center justify-center border border-[#C8FF00]/20">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-[#39FF88]">{player.rating} ★</span>
                  </div>
                  <h4 className="font-display font-extrabold text-sm text-neutral-100 line-clamp-1">{player.name}</h4>
                  <span className="text-[11px] font-mono text-neutral-400 block">{player.sport}</span>
                </div>
                <Link to={`/players/${player.player_id}`} className="mt-4 text-xs font-mono font-bold text-[#C8FF00] hover:underline uppercase tracking-wider">
                  Stats →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
