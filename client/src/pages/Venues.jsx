import React, { useEffect, useState } from 'react';
import { MapPin, Search, Users, Trophy } from 'lucide-react';
import { venuesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVenues();
  }, [search]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const res = await venuesAPI.getAll({ search });
      if (res.success) setVenues(res.venues);
    } catch (err) {
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Stadiums & Venues</h1>
          <p className="text-xs text-slate-400 mt-1">Sports arenas and grounds hosting official matches</p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search venue name, city, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 text-xs text-slate-100 pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 w-64"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching stadium capacity and venue records..." />
      ) : venues.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
          No stadiums found matching search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((v) => (
            <div key={v.venue_id} className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
              <img
                src={v.image_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80'}
                alt={v.venue_name}
                className="w-full h-44 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-100">{v.venue_name}</h3>
                
                <div className="mt-3 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{v.city}, {v.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Capacity: <strong className="text-slate-200">{v.capacity ? v.capacity.toLocaleString() : 'N/A'}</strong> seats</span>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                    <Trophy className="w-3.5 h-3.5" />
                    {v.total_hosted_matches || 0} Matches Hosted
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
