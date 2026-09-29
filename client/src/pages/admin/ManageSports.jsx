import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Trophy, AlertTriangle } from 'lucide-react';
import { sportsAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageSports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Team',
    icon_name: 'trophy'
  });

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const res = await sportsAPI.getAll();
      if (res.success) setSports(res.sports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        category: item.category || 'Team',
        icon_name: item.icon_name || 'trophy'
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', category: 'Team', icon_name: 'trophy' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await sportsAPI.update(editingItem.sport_id, formData);
      } else {
        await sportsAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchSports();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await sportsAPI.delete(deleteId);
      setDeleteId(null);
      fetchSports();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading sports data..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Manage Sports</span>
          </h1>
          <p className="text-xs text-slate-400">Add, update, or remove sports categories in MySQL</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sport</span>
        </button>
      </div>

      {/* Sports Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Sport Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Teams</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sports.map((s) => (
              <tr key={s.sport_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{s.sport_id}</td>
                <td className="p-4 font-bold text-slate-100">{s.name}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {s.category}
                  </span>
                </td>
                <td className="p-4 text-slate-400 max-w-xs truncate">{s.description || 'N/A'}</td>
                <td className="p-4 text-center font-semibold text-slate-200">{s.total_teams || 0}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      title="Edit Sport"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(s.sport_id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Sport"
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
        title={editingItem ? 'Edit Sport Details' : 'Add New Sport Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Sport Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              placeholder="e.g. Cricket, Football"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
            >
              <option value="Team">Team</option>
              <option value="Individual">Individual</option>
              <option value="Racquet">Racquet</option>
              <option value="Combat">Combat</option>
              <option value="Motorsport">Motorsport</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              placeholder="Brief description of rules and gameplay..."
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
              {editingItem ? 'Save Changes' : 'Create Sport'}
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
            <p>Deleting this sport will also CASCADE delete all linked teams, players, tournaments, and matches in MySQL!</p>
          </div>
          <p>Are you sure you want to permanently delete this sport?</p>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
