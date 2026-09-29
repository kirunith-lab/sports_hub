import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Shield, Calendar, AlertTriangle } from 'lucide-react';
import { registrationsAPI, tournamentsAPI, teamsAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    tournament_id: '',
    team_id: '',
    registration_date: new Date().toISOString().substring(0, 10),
    status: 'Approved',
    notes: ''
  });

  useEffect(() => {
    Promise.all([registrationsAPI.getAll(), tournamentsAPI.getAll(), teamsAPI.getAll()]).then(([rRes, trRes, tRes]) => {
      if (rRes.success) setRegistrations(rRes.registrations);
      if (trRes.success) {
        setTournaments(trRes.tournaments);
        if (trRes.tournaments.length > 0) setFormData((prev) => ({ ...prev, tournament_id: trRes.tournaments[0].tournament_id }));
      }
      if (tRes.success) {
        setTeams(tRes.teams);
        if (tRes.teams.length > 0) setFormData((prev) => ({ ...prev, team_id: tRes.teams[0].team_id }));
      }
      setLoading(false);
    });
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await registrationsAPI.getAll();
      if (res.success) setRegistrations(res.registrations);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        tournament_id: item.tournament_id,
        team_id: item.team_id,
        registration_date: item.registration_date ? item.registration_date.substring(0, 10) : new Date().toISOString().substring(0, 10),
        status: item.status || 'Approved',
        notes: item.notes || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        tournament_id: tournaments.length > 0 ? tournaments[0].tournament_id : '',
        team_id: teams.length > 0 ? teams[0].team_id : '',
        registration_date: new Date().toISOString().substring(0, 10),
        status: 'Approved',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await registrationsAPI.update(editingItem.registration_id, formData);
      } else {
        await registrationsAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchRegistrations();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await registrationsAPI.delete(deleteId);
      setDeleteId(null);
      fetchRegistrations();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading tournament team registrations..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <span>Tournament Registrations</span>
          </h1>
          <p className="text-xs text-slate-400">Manage team participation in tournaments (M:N Relationship)</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register Team to Tournament</span>
        </button>
      </div>

      {/* Registrations Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Tournament</th>
              <th className="p-4">Participating Team</th>
              <th className="p-4">Registration Date</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Notes</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {registrations.map((r) => (
              <tr key={r.registration_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{r.registration_id}</td>
                <td className="p-4 font-bold text-slate-100">{r.tournament_name}</td>
                <td className="p-4 text-indigo-400 font-semibold">{r.team_name} ({r.team_country})</td>
                <td className="p-4 text-slate-400">{new Date(r.registration_date).toLocaleDateString()}</td>
                <td className="p-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      r.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : r.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400 max-w-xs truncate">{r.notes || 'N/A'}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(r)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(r.registration_id)}
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
        title={editingItem ? 'Edit Registration Record' : 'Register Team to Tournament'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Tournament *</label>
              <select
                required
                disabled={!!editingItem}
                value={formData.tournament_id}
                onChange={(e) => setFormData({ ...formData, tournament_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Select Tournament</option>
                {tournaments.map((tr) => (
                  <option key={tr.tournament_id} value={tr.tournament_id}>{tr.tournament_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Team *</label>
              <select
                required
                disabled={!!editingItem}
                value={formData.team_id}
                onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Select Team</option>
                {teams.map((t) => (
                  <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Date *</label>
              <input
                type="date"
                required
                value={formData.registration_date}
                onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Approval Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Franchise Details</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              placeholder="e.g. Qualified via national championship"
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
              {editingItem ? 'Save Changes' : 'Register Team'}
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
          <p>Are you sure you want to delete this tournament registration record?</p>
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
