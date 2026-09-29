import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { tournamentsAPI, sportsAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    sport_id: '',
    tournament_name: '',
    start_date: '2026-03-01',
    end_date: '2026-05-30',
    location: '',
    status: 'Upcoming'
  });

  useEffect(() => {
    Promise.all([tournamentsAPI.getAll(), sportsAPI.getAll()]).then(([trRes, sRes]) => {
      if (trRes.success) setTournaments(trRes.tournaments);
      if (sRes.success) {
        setSports(sRes.sports);
        if (sRes.sports.length > 0) setFormData((prev) => ({ ...prev, sport_id: sRes.sports[0].sport_id }));
      }
      setLoading(false);
    });
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await tournamentsAPI.getAll();
      if (res.success) setTournaments(res.tournaments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        sport_id: item.sport_id,
        tournament_name: item.tournament_name,
        start_date: item.start_date ? item.start_date.substring(0, 10) : '2026-03-01',
        end_date: item.end_date ? item.end_date.substring(0, 10) : '2026-05-30',
        location: item.location,
        status: item.status || 'Upcoming'
      });
    } else {
      setEditingItem(null);
      setFormData({
        sport_id: sports.length > 0 ? sports[0].sport_id : '',
        tournament_name: '',
        start_date: '2026-03-01',
        end_date: '2026-05-30',
        location: '',
        status: 'Upcoming'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await tournamentsAPI.update(editingItem.tournament_id, formData);
      } else {
        await tournamentsAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchTournaments();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await tournamentsAPI.delete(deleteId);
      setDeleteId(null);
      fetchTournaments();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading tournaments..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            <span>Manage Tournaments</span>
          </h1>
          <p className="text-xs text-slate-400">Configure sports tournaments and leagues</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tournament</span>
        </button>
      </div>

      {/* Tournaments Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Tournament Name</th>
              <th className="p-4">Sport</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tournaments.map((t) => (
              <tr key={t.tournament_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{t.tournament_id}</td>
                <td className="p-4 font-bold text-slate-100">{t.tournament_name}</td>
                <td className="p-4 text-indigo-400 font-semibold">{t.sport_name}</td>
                <td className="p-4 text-slate-400">
                  {new Date(t.start_date).toLocaleDateString()} - {new Date(t.end_date).toLocaleDateString()}
                </td>
                <td className="p-4 text-slate-300">{t.location}</td>
                <td className="p-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'Ongoing'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : t.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(t)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(t.tournament_id)}
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
        title={editingItem ? 'Edit Tournament' : 'Create New Tournament'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sport Category *</label>
              <select
                required
                value={formData.sport_id}
                onChange={(e) => setFormData({ ...formData, sport_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Select Sport</option>
                {sports.map((s) => (
                  <option key={s.sport_id} value={s.sport_id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tournament Name *</label>
            <input
              type="text"
              required
              value={formData.tournament_name}
              onChange={(e) => setFormData({ ...formData, tournament_name: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              placeholder="e.g. IPL 2026, Champions League"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              placeholder="e.g. India, Europe"
            />
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
              {editingItem ? 'Save Changes' : 'Create Tournament'}
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
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>Deleting this tournament will cascade delete all scheduled matches and standings!</p>
          </div>
          <p>Are you sure you want to delete this tournament?</p>
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
