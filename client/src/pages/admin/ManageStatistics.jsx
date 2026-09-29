import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BarChart2, Star } from 'lucide-react';
import { statsAPI, playersAPI, matchesAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageStatistics() {
  const [stats, setStats] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    player_id: '',
    match_id: '',
    goals: 0,
    runs: 0,
    wickets: 0,
    points: 0,
    assists: 0,
    performance_rating: 8.5
  });

  useEffect(() => {
    Promise.all([statsAPI.getPlayerStats(), playersAPI.getAll(), matchesAPI.getAll()]).then(([stRes, pRes, mRes]) => {
      if (stRes.success) setStats(stRes.statistics);
      if (pRes.success) {
        setPlayers(pRes.players);
        if (pRes.players.length > 0) setFormData((prev) => ({ ...prev, player_id: pRes.players[0].player_id }));
      }
      if (mRes.success) {
        setMatches(mRes.matches);
        if (mRes.matches.length > 0) setFormData((prev) => ({ ...prev, match_id: mRes.matches[0].match_id }));
      }
      setLoading(false);
    });
  }, []);

  const fetchStats = async () => {
    try {
      const res = await statsAPI.getPlayerStats();
      if (res.success) setStats(res.statistics);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        player_id: item.player_id,
        match_id: item.match_id,
        goals: item.goals || 0,
        runs: item.runs || 0,
        wickets: item.wickets || 0,
        points: item.points || 0,
        assists: item.assists || 0,
        performance_rating: item.performance_rating || 8.5
      });
    } else {
      setEditingItem(null);
      setFormData({
        player_id: players.length > 0 ? players[0].player_id : '',
        match_id: matches.length > 0 ? matches[0].match_id : '',
        goals: 0,
        runs: 0,
        wickets: 0,
        points: 0,
        assists: 0,
        performance_rating: 8.5
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await statsAPI.updatePlayerStat(editingItem.stat_id, formData);
      } else {
        await statsAPI.createPlayerStat(formData);
      }
      setIsModalOpen(false);
      fetchStats();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await statsAPI.deletePlayerStat(deleteId);
      setDeleteId(null);
      fetchStats();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading player match statistics..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-amber-400" />
            <span>Manage Player Statistics</span>
          </h1>
          <p className="text-xs text-slate-400">Record individual athlete metrics for matches in MySQL</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Record Player Stat</span>
        </button>
      </div>

      {/* Stats Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Player Name</th>
              <th className="p-4">Match / Date</th>
              <th className="p-4 text-center">Goals</th>
              <th className="p-4 text-center">Runs</th>
              <th className="p-4 text-center">Wickets</th>
              <th className="p-4 text-center">Points</th>
              <th className="p-4 text-center font-bold text-amber-400">Rating</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {stats.map((st) => (
              <tr key={st.stat_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{st.stat_id}</td>
                <td className="p-4 font-bold text-slate-100">{st.player_name}</td>
                <td className="p-4 text-slate-300">
                  <span className="block font-semibold">{st.team1_name} vs {st.team2_name}</span>
                  <span className="text-[10px] text-slate-400">{new Date(st.match_date).toLocaleDateString()}</span>
                </td>
                <td className="p-4 text-center font-bold text-emerald-400">{st.goals}</td>
                <td className="p-4 text-center font-bold text-amber-400">{st.runs}</td>
                <td className="p-4 text-center font-bold text-cyan-400">{st.wickets}</td>
                <td className="p-4 text-center font-bold text-slate-100">{st.points}</td>
                <td className="p-4 text-center font-black text-amber-400">{st.performance_rating} ★</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(st)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(st.stat_id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Player Match Performance' : 'Record Player Performance'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Player *</label>
              <select
                required
                value={formData.player_id}
                onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Select Player</option>
                {players.map((p) => (
                  <option key={p.player_id} value={p.player_id}>{p.name} ({p.sport_name})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Match *</label>
              <select
                required
                value={formData.match_id}
                onChange={(e) => setFormData({ ...formData, match_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Select Match</option>
                {matches.map((m) => (
                  <option key={m.match_id} value={m.match_id}>
                    Match #{m.match_id}: {m.team1_name} vs {m.team2_name} ({new Date(m.match_date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Goals (Football)</label>
              <input
                type="number"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: parseInt(e.target.value || '0') })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Runs (Cricket)</label>
              <input
                type="number"
                value={formData.runs}
                onChange={(e) => setFormData({ ...formData, runs: parseInt(e.target.value || '0') })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Wickets (Cricket)</label>
              <input
                type="number"
                value={formData.wickets}
                onChange={(e) => setFormData({ ...formData, wickets: parseInt(e.target.value || '0') })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Points (Basketball)</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value || '0') })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assists</label>
              <input
                type="number"
                value={formData.assists}
                onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value || '0') })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (0.0 to 10.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.performance_rating}
                onChange={(e) => setFormData({ ...formData, performance_rating: parseFloat(e.target.value || '7.0') })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
            >
              {editingItem ? 'Save Stat Record' : 'Record Stat'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-slate-300 text-xs">
          <p>Are you sure you want to delete this player match statistic record?</p>
          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl">
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
