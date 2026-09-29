import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, AlertTriangle } from 'lucide-react';
import { venuesAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    venue_name: '',
    city: '',
    country: '',
    capacity: 40000,
    image_url: ''
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const res = await venuesAPI.getAll();
      if (res.success) setVenues(res.venues);
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
        venue_name: item.venue_name,
        city: item.city,
        country: item.country,
        capacity: item.capacity || 40000,
        image_url: item.image_url || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ venue_name: '', city: '', country: '', capacity: 40000, image_url: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await venuesAPI.update(editingItem.venue_id, formData);
      } else {
        await venuesAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchVenues();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await venuesAPI.delete(deleteId);
      setDeleteId(null);
      fetchVenues();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading stadium venues..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-rose-400" />
            <span>Manage Venues</span>
          </h1>
          <p className="text-xs text-slate-400">Configure stadiums, arenas, and ground capacity</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Venue</span>
        </button>
      </div>

      {/* Venues Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Venue Name</th>
              <th className="p-4">City</th>
              <th className="p-4">Country</th>
              <th className="p-4 text-center">Seating Capacity</th>
              <th className="p-4 text-center">Matches Hosted</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {venues.map((v) => (
              <tr key={v.venue_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{v.venue_id}</td>
                <td className="p-4 font-bold text-slate-100">{v.venue_name}</td>
                <td className="p-4 text-slate-300">{v.city}</td>
                <td className="p-4 text-slate-300">{v.country}</td>
                <td className="p-4 text-center font-bold text-indigo-400">
                  {v.capacity ? v.capacity.toLocaleString() : 'N/A'}
                </td>
                <td className="p-4 text-center font-bold text-emerald-400">{v.total_hosted_matches || 0}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(v)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(v.venue_id)}
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
        title={editingItem ? 'Edit Venue Information' : 'Add New Stadium Venue'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Stadium Name *</label>
            <input
              type="text"
              required
              value={formData.venue_name}
              onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              placeholder="e.g. Wankhede Stadium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                placeholder="Mumbai"
              />
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                placeholder="https://..."
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
              {editingItem ? 'Save Changes' : 'Create Venue'}
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
          <p>Are you sure you want to delete this venue from the database?</p>
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
