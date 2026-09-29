import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Shield, Users, Calendar, Activity, ArrowRight, Zap, Award, BarChart3, ChevronRight } from 'lucide-react';
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
        console.error('Error fetching Home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Fetching live sports data from MySQL database..." />;

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-2xl p-8 sm:p-12 lg:p-16">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Academic DBMS System • MySQL 8.0 & 3NF Normalized</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
            Sports Management & <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
              Information System
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Explore live matches, player career analytics, tournament standings, team statistics, and stadium details—all driven by a normalized relational database schema.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/matches"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all flex items-center space-x-2"
            >
              <span>Explore Fixtures</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/statistics"
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>View Analytics</span>
            </Link>
          </div>
        </div>

        {/* Live Database Metrics Counters */}
        {metrics && (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-400 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xs uppercase font-semibold text-slate-400">Sports</span>
              </div>
              <span className="text-2xl font-black text-slate-100">{metrics.total_sports}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs uppercase font-semibold text-slate-400">Teams</span>
              </div>
              <span className="text-2xl font-black text-slate-100">{metrics.total_teams}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-2 text-cyan-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs uppercase font-semibold text-slate-400">Athletes</span>
              </div>
              <span className="text-2xl font-black text-slate-100">{metrics.total_players}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-2 text-amber-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs uppercase font-semibold text-slate-400">Matches</span>
              </div>
              <span className="text-2xl font-black text-slate-100">{metrics.total_matches}</span>
            </div>
          </div>
        )}
      </section>

      {/* Featured Sports */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100">Featured Sports</h2>
            <p className="text-xs text-slate-400">Browse categories & tournaments in the database</p>
          </div>
          <Link to="/sports" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
            <span>View All Sports</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sports.map((sport) => (
            <Link
              key={sport.sport_id}
              to={`/sports/${sport.sport_id}`}
              className="glass-card p-6 rounded-2xl border border-slate-800 group hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">{sport.name}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{sport.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{sport.total_teams || 0} Teams</span>
                <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming & Recent Matches Dual Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Fixtures */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Upcoming Fixtures</span>
            </h3>
            <Link to="/matches?upcoming=true" className="text-xs text-indigo-400 font-semibold">View All</Link>
          </div>

          <div className="space-y-4">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((m) => <MatchCard key={m.match_id} match={m} />)
            ) : (
              <div className="p-8 rounded-2xl glass-card text-center text-xs text-slate-400">
                No upcoming matches currently scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Recent Results</span>
            </h3>
            <Link to="/matches?completed=true" className="text-xs text-indigo-400 font-semibold">View All</Link>
          </div>

          <div className="space-y-4">
            {recentMatches.length > 0 ? (
              recentMatches.map((m) => <MatchCard key={m.match_id} match={m} />)
            ) : (
              <div className="p-8 rounded-2xl glass-card text-center text-xs text-slate-400">
                No completed matches found.
              </div>
            )}
          </div>
        </div>

      </section>

      {/* Top Performers Leaderboard Preview */}
      {topPlayers.length > 0 && (
        <section className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Star Athletes</h2>
              <p className="text-xs text-slate-400">Top ratings generated from player match statistics</p>
            </div>
            <Link to="/statistics" className="text-xs font-semibold text-indigo-400">Full Leaderboard →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topPlayers.map((player, idx) => (
              <div key={player.player_id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-indigo-400">{player.rating} ★</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{player.name}</h4>
                  <span className="text-[11px] text-slate-400 block">{player.sport}</span>
                </div>
                <Link to={`/players/${player.player_id}`} className="mt-4 text-xs text-slate-400 hover:text-white font-medium">
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
