import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Users, Calendar } from 'lucide-react';

export default function TeamCard({ team }) {
  return (
    <div className="bg-[#101316] rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-[#C8FF00]/40 transition-all duration-300 shadow-xl group">
      <div>
        <div className="flex items-start justify-between">
          <img
            src={team.logo_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=200&q=80'}
            alt={team.team_name}
            className="w-16 h-16 object-cover rounded-xl border border-white/10 group-hover:border-[#C8FF00] transition-colors"
          />
          <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20">
            {team.sport_name || 'Sport'}
          </span>
        </div>

        <h3 className="text-lg font-display font-extrabold text-[#F5F5F5] group-hover:text-[#C8FF00] transition-colors mt-4 line-clamp-1">{team.team_name}</h3>
        
        <div className="mt-2 space-y-1 text-xs text-neutral-400 font-mono">
          <div className="flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span>{team.city ? `${team.city}, ` : ''}{team.country}</span>
          </div>
          {team.founded_year && (
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>Founded {team.founded_year}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between font-mono">
        <div className="flex items-center space-x-1.5 text-xs text-neutral-400">
          <Users className="w-3.5 h-3.5 text-[#C8FF00]" />
          <span>{team.squad_size || 0} Players</span>
        </div>
        <Link
          to={`/teams/${team.team_id}`}
          className="text-xs font-mono font-bold text-[#C8FF00] hover:underline transition-colors uppercase tracking-wider"
        >
          Roster →
        </Link>
      </div>
    </div>
  );
}
