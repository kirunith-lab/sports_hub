import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Database, Server, Cpu, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-100 tracking-tight">
                SportsHub
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              A submission-ready Database Management System (DBMS) project showcasing 3NF relational normalization, SQL JOIN aggregations, multi-entity relationships, and JWT role-based security.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/sports" className="hover:text-indigo-400 transition-colors">Sports Directory</Link></li>
              <li><Link to="/teams" className="hover:text-indigo-400 transition-colors">Sports Teams</Link></li>
              <li><Link to="/players" className="hover:text-indigo-400 transition-colors">Athletes & Players</Link></li>
              <li><Link to="/tournaments" className="hover:text-indigo-400 transition-colors">Tournaments & Standings</Link></li>
              <li><Link to="/matches" className="hover:text-indigo-400 transition-colors">Live & Past Matches</Link></li>
            </ul>
          </div>

          {/* DBMS Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              DBMS Concepts
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>3NF Relational Schema (11 Tables)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Express REST API & MySQL2 Pool</span>
              </li>
              <li className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Indexed & Parameterized SQL</span>
              </li>
              <li className="flex items-center space-x-2">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dynamic Standings Views</span>
              </li>
            </ul>
          </div>

          {/* Technology Specs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">MySQL 8.0</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Node.js</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Express.js</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">React.js</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Vite</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Tailwind CSS</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">JWT & bcrypt</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Recharts</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 SportsHub DBMS Project. Built for academic viva evaluation.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span className="text-slate-400">Strictly 3NF Normalized Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
