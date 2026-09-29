import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Users, AlertTriangle } from 'lucide-react';
import { playersAPI, sportsAPI, teamsAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManagePlayers() {
  const [players, setPlayers] = useState([]);
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
    date_of_birth: '1995-01-01',
    nationality: '',
    gender: 'Male',
    position: '',
    profile_image_url: '',
    jersey_number: 10
  });

  useEffect(() => {
    Promise.all([playersAPI.getAll(), sportsAPI.getAll(), teamsAPI.getAll()]).then(([pRes, sRes, tRes]) => {
      if (pRes.success) setPlayers(pRes.players);
      if (sRes.success) {
        setSports(sRes.sports);
        if (sRes.sports.length > 0) setFormData((prev) => ({ ...prev, sport_id: sRes.sports[0].sport_id }));
      }
      if (tRes.success) setTeams(tRes.teams);
      setLoading(false);
    });
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await playersAPI.getAll();
      if (res.success) setPlayers(res.players);
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
        date_of_birth: item.date_of_birth ? item.date_of_birth.substring(0, 10) : '1995-01-01',
        nationality: item.nationality,
        gender: item.gender || 'Male',
        position: item.position || '',
        profile_image_url: item.profile_image_url || '',
        jersey_number: item.jersey_number || 10
      });
    } else {
      setEditingItem(null);
      setFormData({
        sport_id: sports.length > 0 ? sports[0].sport_id : '',
        team_id: '',
        name: '',
        date_of_birth: '1995-01-01',
        nationality: '',
        gender: 'Male',
        position: '',
        profile_image_url: '',
        jersey_number: 10
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await playersAPI.update(editingItem.player_id, formData);
      } else {
        await playersAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchPlayers();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await playersAPI.delete(deleteId);
      setDeleteId(null);
      fetchPlayers();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading athletes..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Manage Players</span>
          </h1>
          <p className="text-xs text-slate-400">Add, edit, or remove athletes and manage team links</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Player</span>
        </button>
      </div>

      {/* Players Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Player Name</th>
              <th className="p-4">Sport</th>
              <th className="p-4">Team</th>
              <th className="p-4">Position</th>
              <th className="p-4">Nationality</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {players.map((p) => (
              <tr key={p.player_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{p.player_id}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img src={p.profile_image_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-bold text-slate-100">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-indigo-400 font-semibold">{p.sport_name}</td>
                <td className="p-4 text-slate-300 font-medium">{p.team_name || 'Free Agent'}</td>
                <td className="p-4 text-slate-400">{p.position || 'Athlete'}</td>
                <td className="p-4 text-slate-400">{p.nationality}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(p)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(p.player_id)}
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
        title={editingItem ? 'Edit Player Information' : 'Add New Athlete'}
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Team Assignment</label>
              <select
                value={formData.team_id}
                onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">None (Free Agent)</option>
                {teams
                  .filter((t) => !formData.sport_id || parseInt(t.sport_id) === parseInt(formData.sport_id))
                  .map((t) => (
                    <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              placeholder="e.g. Virat Kohli"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">DOB *</label>
              <input
                type="date"
                required
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nationality *</label>
              <input
                type="text"
                required
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                placeholder="India"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Jersey #</label>
              <input
                type="number"
                value={formData.jersey_number}
                onChange={(e) => setFormData({ ...formData, jersey_number: parseInt(e.target.value) })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Position / Role</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                placeholder="e.g. Forward, Batsman"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Profile Photo (Upload or Paste URL)</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.profile_image_url}
                  onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
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
                          setFormData({ ...formData, profile_image_url: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-lime-400/20 file:text-lime-400 hover:file:bg-lime-400/30"
                  />
                  {formData.profile_image_url && (
                    <img src={formData.profile_image_url} alt="Preview" className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0" />
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
              {editingItem ? 'Save Changes' : 'Create Player'}
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
            <p>Deleting this player record will cascade remove all recorded match statistics!</p>
          </div>
          <p>Are you sure you want to delete this player profile?</p>
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
