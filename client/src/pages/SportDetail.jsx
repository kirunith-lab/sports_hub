import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Shield, Users, Calendar, ArrowLeft } from 'lucide-react';
import { sportsAPI } from '../services/api';
import TeamCard from '../components/TeamCard';
import PlayerCard from '../components/PlayerCard';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SportDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teams');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await sportsAPI.getById(id);
        if (res.success) {
          setData(res.sport);
        }
      } catch (err) {
        console.error('Error fetching sport details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <LoadingSpinner text="Fetching detailed sport records from MySQL..." />;
  if (!data) return <div className="p-8 text-center text-slate-400">Sport record not found.</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <Link to="/sports" className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sports</span>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {data.category} Sport
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 mt-2">{data.name}</h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">{data.description}</p>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex space-x-2">
          {[
            { id: 'teams', label: `Teams (${data.teams?.length || 0})`, icon: Shield },
            { id: 'players', label: `Players (${data.players?.length || 0})`, icon: Users },
            { id: 'tournaments', label: `Tournaments (${data.tournaments?.length || 0})`, icon: Calendar },
            { id: 'matches', label: `Matches (${data.matches?.length || 0})`, icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.teams?.length > 0 ? (
            data.teams.map((t) => <TeamCard key={t.team_id} team={{ ...t, sport_name: data.name }} />)
          ) : (
            <div className="col-span-full p-8 text-center text-slate-400 text-xs">No teams registered for this sport.</div>
          )}
        </div>
      )}

      {activeTab === 'players' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.players?.length > 0 ? (
            data.players.map((p) => <PlayerCard key={p.player_id} player={{ ...p, sport_name: data.name }} />)
          ) : (
            <div className="col-span-full p-8 text-center text-slate-400 text-xs">No players registered for this sport.</div>
          )}
        </div>
      )}

      {activeTab === 'tournaments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.tournaments?.length > 0 ? (
            data.tournaments.map((tr) => (
              <div key={tr.tournament_id} className="glass-card p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-indigo-400">{tr.status}</span>
                  <h3 className="text-lg font-bold text-slate-100">{tr.tournament_name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{tr.location} • Starts {new Date(tr.start_date).toLocaleDateString()}</p>
                </div>
                <Link to={`/tournaments/${tr.tournament_id}`} className="px-4 py-2 bg-slate-900 border border-slate-700 text-xs font-bold text-indigo-400 rounded-xl hover:bg-slate-800">
                  Standings →
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-slate-400 text-xs">No tournaments listed for this sport.</div>
          )}
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.matches?.length > 0 ? (
            data.matches.map((m) => <MatchCard key={m.match_id} match={m} />)
          ) : (
            <div className="col-span-full p-8 text-center text-slate-400 text-xs">No recent matches found.</div>
          )}
        </div>
      )}

    </div>
  );
}
