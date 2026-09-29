import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy } from 'lucide-react';

export default function MatchCard({ match }) {
  const isCompleted = match.status === 'Completed';
  const isLive = match.status === 'Live';
  
  const team1Won = isCompleted && match.winner_team_id === match.team1_id;
  const team2Won = isCompleted && match.winner_team_id === match.team2_id;

  return (
    <div className="bg-[#101316] rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-[#C8FF00]/40 transition-all duration-300 shadow-xl group">
      {/* Top Header: Tournament & Status Tag */}
      <div className="flex items-center justify-between text-xs mb-4">
        <span className="font-mono text-[11px] text-neutral-400 flex items-center gap-1.5 truncate">
          <Trophy className="w-3.5 h-3.5 text-[#C8FF00]" />
          {match.tournament_name || 'Tournament'}
        </span>
        <span
          className={`px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 ${
            isCompleted
              ? 'bg-[#39FF88]/10 text-[#39FF88] border border-[#39FF88]/20'
              : isLive
              ? 'bg-[#FF4D5A]/20 text-[#FF4D5A] border border-[#FF4D5A]/30'
              : 'bg-[#FFB84D]/10 text-[#FFB84D] border border-[#FFB84D]/20'
          }`}
        >
          {isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D5A] animate-ping" />}
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
            className={`w-12 h-12 object-cover rounded-xl border ${team1Won ? 'border-[#C8FF00] shadow-[0_0_10px_rgba(200,255,0,0.3)]' : 'border-white/10'} mb-2`}
          />
          <span className={`text-xs font-bold ${team1Won ? 'text-[#C8FF00]' : 'text-neutral-200'} line-clamp-1`}>{match.team1_name}</span>
        </div>

        {/* Score or VS */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          {isCompleted ? (
            <div className="bg-[#080A0C] px-3 py-1.5 rounded-xl border border-white/10">
              <span className={`text-base font-display font-extrabold ${team1Won ? 'text-[#C8FF00]' : 'text-neutral-200'}`}>{match.team1_score}</span>
              <span className="text-neutral-600 mx-1 font-mono">:</span>
              <span className={`text-base font-display font-extrabold ${team2Won ? 'text-[#C8FF00]' : 'text-neutral-200'}`}>{match.team2_score}</span>
            </div>
          ) : (
            <span className="text-[10px] font-mono font-bold uppercase text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-1 rounded border border-[#C8FF00]/20">
              VS
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="col-span-3 flex flex-col items-center">
          <img
            src={match.team2_logo || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=150&q=80'}
            alt={match.team2_name}
            className={`w-12 h-12 object-cover rounded-xl border ${team2Won ? 'border-[#C8FF00] shadow-[0_0_10px_rgba(200,255,0,0.3)]' : 'border-white/10'} mb-2`}
          />
          <span className={`text-xs font-bold ${team2Won ? 'text-[#C8FF00]' : 'text-neutral-200'} line-clamp-1`}>{match.team2_name}</span>
        </div>
      </div>

      {/* Footer Info: Date & Venue */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
        <div className="flex items-center space-x-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span className="truncate">{match.venue_name || 'Venue'}</span>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
          <span>{match.match_date ? new Date(match.match_date).toLocaleDateString() : ''}</span>
        </div>
      </div>

      <Link
        to={`/matches/${match.match_id}`}
        className="mt-3 w-full py-2 text-center text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#C8FF00] hover:bg-[#b5e600] rounded-lg transition-all"
      >
        Match Details →
      </Link>
    </div>
  );
}
