import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
      <Link to="/" className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.replace(/-/g, ' ').toUpperCase();

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            {isLast ? (
              <span className="font-semibold text-slate-200">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-indigo-400 transition-colors">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
