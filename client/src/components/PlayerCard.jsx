import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Globe } from 'lucide-react';

export default function PlayerCard({ player }) {
  return (
    <div className="bg-[#101316] rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-[#C8FF00]/40 transition-all duration-300 shadow-xl group">
      <div className="flex items-center space-x-4">
        <img
          src={player.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
          alt={player.name}
          className="w-16 h-16 object-cover rounded-xl border border-white/10 group-hover:border-[#C8FF00] transition-colors"
        />
        <div>
          <h3 className="text-base font-display font-extrabold text-[#F5F5F5] group-hover:text-[#C8FF00] transition-colors line-clamp-1">{player.name}</h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20">
            {player.position || 'Athlete'}
          </span>
          <div className="flex items-center space-x-2 mt-1 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-neutral-500" />
              {player.nationality}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-1.5 text-neutral-400 truncate max-w-[60%]">
          <Shield className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span className="truncate">{player.team_name || player.sport_name}</span>
        </div>
        <Link
          to={`/players/${player.player_id}`}
          className="text-xs font-mono font-bold text-[#C8FF00] hover:underline transition-colors shrink-0 uppercase tracking-wider"
        >
          Profile →
        </Link>
      </div>
    </div>
  );
}
