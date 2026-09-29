import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Database, Server, Cpu, Activity, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080A0C] border-t border-white/10 text-neutral-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#101316] border border-[#C8FF00]/30 text-[#C8FF00] flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-lg font-display font-extrabold text-[#F5F5F5] tracking-tight">
                SPORTS<span className="text-[#C8FF00]">HUB</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-400 font-mono">
              Academic DBMS Management System featuring 3NF normalized schema, parameterized SQL execution engine, and real-time sports intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8FF00] mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li><Link to="/sports" className="hover:text-[#C8FF00] transition-colors">Sports Directory</Link></li>
              <li><Link to="/teams" className="hover:text-[#C8FF00] transition-colors">Sports Teams</Link></li>
              <li><Link to="/players" className="hover:text-[#C8FF00] transition-colors">Athletes & Players</Link></li>
              <li><Link to="/tournaments" className="hover:text-[#C8FF00] transition-colors">Tournaments & Standings</Link></li>
              <li><Link to="/matches" className="hover:text-[#C8FF00] transition-colors">Live & Past Matches</Link></li>
            </ul>
          </div>

          {/* DBMS Architecture */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8FF00] mb-3">
              DBMS Concepts
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span>3NF Relational Schema (12 Tables)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Server className="w-3.5 h-3.5 text-[#39FF88]" />
                <span>Express REST API & MySQL2 Pool</span>
              </li>
              <li className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-[#FFB84D]" />
                <span>Indexed & Parameterized SQL</span>
              </li>
              <li className="flex items-center space-x-2">
                <Activity className="w-3.5 h-3.5 text-[#8FAF00]" />
                <span>Dynamic Aggregation Views</span>
              </li>
            </ul>
          </div>

          {/* Technology Specs */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8FF00] mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              <span className="px-2 py-1 rounded bg-[#101316] border border-white/10 text-neutral-300">MySQL 8.0</span>
              <span className="px-2 py-1 rounded bg-[#101316] border border-white/10 text-neutral-300">Node.js</span>
              <span className="px-2 py-1 rounded bg-[#101316] border border-white/10 text-neutral-300">Express.js</span>
              <span className="px-2 py-1 rounded bg-[#101316] border border-white/10 text-neutral-300">React.js</span>
              <span className="px-2 py-1 rounded bg-[#101316] border border-white/10 text-neutral-300">Vite</span>
              <span className="px-2 py-1 rounded bg-[#101316] border border-white/10 text-neutral-300">Tailwind CSS</span>
              <span className="px-2 py-1 rounded bg-[#101316] border border-white/10 text-neutral-300">JWT & bcrypt</span>
              <span className="px-2 py-1 rounded bg-[#101316] border border-white/10 text-neutral-300">Recharts</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-mono">
          <p>© 2026 SportsHub DBMS Project. Built for college viva evaluation.</p>
          <div className="flex items-center space-x-2 mt-3 sm:mt-0 text-[#39FF88]">
            <Zap className="w-3.5 h-3.5" />
            <span>DB Status: Connected (3NF Verified)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
