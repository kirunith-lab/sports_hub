import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { teamsAPI, sportsAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    sport_id: '',
    team_name: '',
    country: '',
    city: '',
    founded_year: 2000,
    logo_url: ''
  });

  useEffect(() => {
    Promise.all([teamsAPI.getAll(), sportsAPI.getAll()]).then(([tRes, sRes]) => {
      if (tRes.success) setTeams(tRes.teams);
      if (sRes.success) {
        setSports(sRes.sports);
        if (sRes.sports.length > 0) {
          setFormData((prev) => ({ ...prev, sport_id: sRes.sports[0].sport_id }));
        }
      }
      setLoading(false);
    });
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await teamsAPI.getAll();
      if (res.success) setTeams(res.teams);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        sport_id: item.sport_id,
        team_name: item.team_name,
        country: item.country,
        city: item.city || '',
        founded_year: item.founded_year || 2000,
        logo_url: item.logo_url || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        sport_id: sports.length > 0 ? sports[0].sport_id : '',
        team_name: '',
        country: '',
        city: '',
        founded_year: 2000,
        logo_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await teamsAPI.update(editingItem.team_id, formData);
      } else {
        await teamsAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchTeams();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await teamsAPI.delete(deleteId);
      setDeleteId(null);
      fetchTeams();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading teams list..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            <span>Manage Teams</span>
          </h1>
          <p className="text-xs text-slate-400">Configure sports teams and country affiliations</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Team</span>
        </button>
      </div>

      {/* Teams Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Team Name</th>
              <th className="p-4">Sport</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-center">Founded</th>
              <th className="p-4 text-center">Squad Size</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {teams.map((t) => (
              <tr key={t.team_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{t.team_id}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img src={t.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="font-bold text-slate-100">{t.team_name}</span>
                  </div>
                </td>
                <td className="p-4 text-indigo-400 font-semibold">{t.sport_name}</td>
                <td className="p-4 text-slate-300">{t.city ? `${t.city}, ` : ''}{t.country}</td>
                <td className="p-4 text-center text-slate-400">{t.founded_year || 'N/A'}</td>
                <td className="p-4 text-center font-bold text-emerald-400">{t.squad_size || 0}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(t)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(t.team_id)}
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
        title={editingItem ? 'Edit Team Information' : 'Add New Sports Team'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name *</label>
            <input
              type="text"
              required
              value={formData.team_name}
              onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              placeholder="e.g. Mumbai Indians"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Country *</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                placeholder="India"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                placeholder="Mumbai"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Founded Year</label>
              <input
                type="number"
                value={formData.founded_year}
                onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Team Logo (Upload or Paste URL)</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                  placeholder="Paste Image URL (https://...)"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, logo_url: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-lime-400/20 file:text-lime-400 hover:file:bg-lime-400/30"
                  />
                  {formData.logo_url && (
                    <img src={formData.logo_url} alt="Preview" className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0" />
                  )}
                </div>
              </div>
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
              {editingItem ? 'Save Changes' : 'Create Team'}
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
            <p>Deleting this team will unassign its players and delete linked statistics!</p>
          </div>
          <p>Are you sure you want to delete this team?</p>
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
