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

  if (loading) return <LoadingSpinner text="Connecting to MySQL database telemetry..." />;

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section - Futuristic Sports Command Center */}
      <section className="relative overflow-hidden rounded-3xl bg-[#101316] border border-white/10 shadow-2xl p-8 sm:p-12 lg:p-16 bg-speed-lines">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#C8FF00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#080A0C] border border-[#C8FF00]/30 text-[#C8FF00] text-xs font-mono font-bold tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5 text-[#C8FF00] animate-pulse" />
            <span>Academic DBMS Platform • MySQL 8.0 & 3NF Schema</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-tight uppercase">
            SPORTS COMMAND <br />
            <span className="text-[#C8FF00] drop-shadow-[0_0_25px_rgba(200,255,0,0.2)]">
              CENTER & INTELLIGENCE
            </span>
          </h1>

          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-sans font-normal">
            Manage players, teams, tournaments, match intelligence, and stadiums—all driven by a normalized 3NF relational database management system.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 font-mono">
            <Link
              to="/matches"
              className="px-6 py-3 rounded-xl bg-[#C8FF00] hover:bg-[#b5e600] text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(200,255,0,0.25)] transition-all flex items-center space-x-2"
            >
              <span>Match Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/database-insights"
              className="px-6 py-3 rounded-xl bg-[#080A0C] border border-white/10 text-neutral-200 font-bold text-xs uppercase tracking-wider hover:border-[#C8FF00]/40 transition-all flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4 text-[#C8FF00]" />
              <span>DB Insights & SQL</span>
            </Link>
          </div>
        </div>

        {/* Live Database Metrics Counters */}
        {metrics && (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
            <div className="p-4 rounded-xl bg-[#080A0C] border border-white/10 group hover:border-[#C8FF00]/30 transition-colors">
              <div className="flex items-center space-x-2 text-neutral-400 mb-1 font-mono">
                <Trophy className="w-4 h-4 text-[#C8FF00]" />
                <span className="text-xs uppercase font-bold text-neutral-400">Total Sports</span>
              </div>
              <span className="text-3xl font-display font-black text-white group-hover:text-[#C8FF00] transition-colors">{metrics.total_sports}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#080A0C] border border-white/10 group hover:border-[#C8FF00]/30 transition-colors">
              <div className="flex items-center space-x-2 text-neutral-400 mb-1 font-mono">
                <Shield className="w-4 h-4 text-[#39FF88]" />
                <span className="text-xs uppercase font-bold text-neutral-400">Registered Teams</span>
              </div>
              <span className="text-3xl font-display font-black text-white group-hover:text-[#39FF88] transition-colors">{metrics.total_teams}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#080A0C] border border-white/10 group hover:border-[#C8FF00]/30 transition-colors">
              <div className="flex items-center space-x-2 text-neutral-400 mb-1 font-mono">
                <Users className="w-4 h-4 text-[#C8FF00]" />
                <span className="text-xs uppercase font-bold text-neutral-400">Athletes</span>
              </div>
              <span className="text-3xl font-display font-black text-white group-hover:text-[#C8FF00] transition-colors">{metrics.total_players}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#080A0C] border border-white/10 group hover:border-[#C8FF00]/30 transition-colors">
              <div className="flex items-center space-x-2 text-neutral-400 mb-1 font-mono">
                <Activity className="w-4 h-4 text-[#FFB84D]" />
                <span className="text-xs uppercase font-bold text-neutral-400">Total Matches</span>
              </div>
              <span className="text-3xl font-display font-black text-white group-hover:text-[#FFB84D] transition-colors">{metrics.total_matches}</span>
            </div>
          </div>
        )}
      </section>

      {/* Featured Sports Grid */}
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
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{sport.description}</p>
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

      {/* Top Performers Leaderboard Preview */}
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
