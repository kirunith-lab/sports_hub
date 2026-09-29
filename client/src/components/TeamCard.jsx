import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Users, Calendar } from 'lucide-react';

export default function TeamCard({ team }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
      <div>
        <div className="flex items-start justify-between">
          <img
            src={team.logo_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=200&q=80'}
            alt={team.team_name}
            className="w-16 h-16 object-cover rounded-2xl border border-slate-700/80 shadow-lg"
          />
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {team.sport_name || 'Sport'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-100 mt-4 line-clamp-1">{team.team_name}</h3>
        
        <div className="mt-2 space-y-1 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{team.city ? `${team.city}, ` : ''}{team.country}</span>
          </div>
          {team.founded_year && (
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Founded {team.founded_year}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-slate-400">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>{team.squad_size || 0} Players</span>
        </div>
        <Link
          to={`/teams/${team.team_id}`}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Team Roster →
        </Link>
      </div>
    </div>
  );
}
