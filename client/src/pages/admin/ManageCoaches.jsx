import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, UserCheck, AlertTriangle } from 'lucide-react';
import { coachesAPI, sportsAPI, teamsAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    sport_id: '',
    team_id: '',
    name: '',
    nationality: '',
    experience_years: 5
  });

  useEffect(() => {
    Promise.all([coachesAPI.getAll(), sportsAPI.getAll(), teamsAPI.getAll()]).then(([cRes, sRes, tRes]) => {
      if (cRes.success) setCoaches(cRes.coaches);
      if (sRes.success) {
        setSports(sRes.sports);
        if (sRes.sports.length > 0) setFormData((prev) => ({ ...prev, sport_id: sRes.sports[0].sport_id }));
      }
      if (tRes.success) setTeams(tRes.teams);
      setLoading(false);
    });
  }, []);

  const fetchCoaches = async () => {
    try {
      const res = await coachesAPI.getAll();
      if (res.success) setCoaches(res.coaches);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        sport_id: item.sport_id,
        team_id: item.team_id || '',
        name: item.name,
        nationality: item.nationality,
        experience_years: item.experience_years || 5
      });
    } else {
      setEditingItem(null);
      setFormData({
        sport_id: sports.length > 0 ? sports[0].sport_id : '',
        team_id: '',
        name: '',
        nationality: '',
        experience_years: 5
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await coachesAPI.update(editingItem.coach_id, formData);
      } else {
        await coachesAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchCoaches();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await coachesAPI.delete(deleteId);
      setDeleteId(null);
      fetchCoaches();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading coaches data..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-400" />
            <span>Manage Coaches</span>
          </h1>
          <p className="text-xs text-slate-400">Manage team head coaches and trainers</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Coach</span>
        </button>
      </div>

      {/* Coaches Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Coach Name</th>
              <th className="p-4">Sport</th>
              <th className="p-4">Assigned Team</th>
              <th className="p-4">Nationality</th>
              <th className="p-4 text-center">Experience</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {coaches.map((c) => (
              <tr key={c.coach_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{c.coach_id}</td>
                <td className="p-4 font-bold text-slate-100">{c.name}</td>
                <td className="p-4 text-indigo-400 font-semibold">{c.sport_name}</td>
                <td className="p-4 text-slate-300 font-medium">{c.team_name || 'Unassigned'}</td>
                <td className="p-4 text-slate-400">{c.nationality}</td>
                <td className="p-4 text-center font-bold text-amber-400">{c.experience_years} yrs</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(c)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(c.coach_id)}
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
        title={editingItem ? 'Edit Coach Information' : 'Add New Coach'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sport *</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Team</label>
              <select
                value={formData.team_id}
                onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Unassigned</option>
                {teams
                  .filter((t) => !formData.sport_id || parseInt(t.sport_id) === parseInt(formData.sport_id))
                  .map((t) => (
                    <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Coach Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              placeholder="e.g. Pep Guardiola"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nationality *</label>
              <input
                type="text"
                required
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                placeholder="Spain"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
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
              {editingItem ? 'Save Changes' : 'Create Coach'}
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
          <p>Are you sure you want to remove this coach record from the database?</p>
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
