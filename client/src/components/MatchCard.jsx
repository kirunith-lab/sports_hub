import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy } from 'lucide-react';

export default function MatchCard({ match }) {
  const isCompleted = match.status === 'Completed';
  const isLive = match.status === 'Live';

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
      {/* Top Header: Tournament & Status Tag */}
      <div className="flex items-center justify-between text-xs mb-4">
        <span className="font-semibold text-indigo-400 flex items-center gap-1.5 truncate">
          <Trophy className="w-3.5 h-3.5" />
          {match.tournament_name || 'Tournament'}
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
            isCompleted
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : isLive
              ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/30'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}
        >
          {match.status}
        </span>
      </div>

      {/* Teams & Scoreboard */}
      <div className="grid grid-cols-7 items-center gap-2 my-2 text-center">
        {/* Team 1 */}
        <div className="col-span-3 flex flex-col items-center">
          <img
            src={match.team1_logo || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=150&q=80'}
            alt={match.team1_name}
            className="w-12 h-12 object-cover rounded-xl border border-slate-700 shadow-md mb-2"
          />
          <span className="text-sm font-bold text-slate-100 line-clamp-1">{match.team1_name}</span>
        </div>

        {/* Score or vs */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          {isCompleted ? (
            <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-lg font-extrabold text-slate-100">{match.team1_score}</span>
              <span className="text-slate-500 mx-1">:</span>
              <span className="text-lg font-extrabold text-slate-100">{match.team2_score}</span>
            </div>
          ) : (
            <span className="text-xs font-black uppercase text-indigo-400 bg-indigo-950/60 px-2 py-1 rounded-md border border-indigo-800">
              VS
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="col-span-3 flex flex-col items-center">
          <img
            src={match.team2_logo || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=150&q=80'}
            alt={match.team2_name}
            className="w-12 h-12 object-cover rounded-xl border border-slate-700 shadow-md mb-2"
          />
          <span className="text-sm font-bold text-slate-100 line-clamp-1">{match.team2_name}</span>
        </div>
      </div>

      {/* Footer Info: Date & Venue */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{match.venue_name || 'Venue'}</span>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{match.match_date ? new Date(match.match_date).toLocaleDateString() : ''}</span>
        </div>
      </div>

      <Link
        to={`/matches/${match.match_id}`}
        className="mt-3 w-full py-1.5 text-center text-xs font-semibold text-indigo-400 bg-indigo-950/40 hover:bg-indigo-600 hover:text-white rounded-lg transition-all border border-indigo-500/20"
      >
        View Match Details →
      </Link>
    </div>
  );
}
