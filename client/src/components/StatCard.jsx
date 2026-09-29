import React from 'react';

export default function StatCard({ title, value, icon: Icon, change, subtitle, color = 'lime' }) {
  return (
    <div className="p-5 rounded-2xl bg-[#101316] border border-white/10 hover:border-[#C8FF00]/40 transition-all duration-300 shadow-xl group">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-[#080A0C] border border-white/10 flex items-center justify-center text-[#C8FF00] group-hover:scale-110 transition-transform">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-display font-black text-[#F5F5F5] group-hover:text-[#C8FF00] transition-colors tracking-tight">
          {value}
        </span>
        {change && (
          <span className="text-[11px] font-mono font-bold text-[#39FF88] bg-[#39FF88]/10 px-2 py-0.5 rounded border border-[#39FF88]/20">
            {change}
          </span>
        )}
        {subtitle && !change && <span className="text-xs text-neutral-500 font-mono">{subtitle}</span>}
      </div>
    </div>
  );
}
