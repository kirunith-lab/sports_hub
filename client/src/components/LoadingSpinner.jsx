import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading data from MySQL...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
      <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{text}</p>
    </div>
  );
}
