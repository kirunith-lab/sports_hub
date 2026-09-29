import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Globe } from 'lucide-react';

export default function PlayerCard({ player }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
      <div className="flex items-center space-x-4">
        <img
          src={player.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
          alt={player.name}
          className="w-16 h-16 object-cover rounded-2xl border border-slate-700 shadow-md"
        />
        <div>
          <h3 className="text-base font-bold text-slate-100 line-clamp-1">{player.name}</h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {player.position || 'Athlete'}
          </span>
          <div className="flex items-center space-x-2 mt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-500" />
              {player.nationality}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-slate-400 truncate max-w-[60%]">
          <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{player.team_name || player.sport_name}</span>
        </div>
        <Link
          to={`/players/${player.player_id}`}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}
