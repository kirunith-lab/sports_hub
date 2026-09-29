import React, { useEffect, useState } from 'react';
import { UserCog, ShieldCheck, User, Trash2 } from 'lucide-react';
import { usersAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getAll();
      if (res.success) setUsers(res.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersAPI.updateRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await usersAPI.delete(deleteId);
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching user accounts from MySQL..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <UserCog className="w-6 h-6 text-rose-400" />
          <span>User Management</span>
        </h1>
        <p className="text-xs text-slate-400">View registered system users and configure administrative role permissions</p>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 text-center">Role Permission</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.user_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{u.user_id}</td>
                <td className="p-4 font-bold text-slate-100">{u.name}</td>
                <td className="p-4 text-slate-300">{u.email}</td>
                <td className="p-4 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-center">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border focus:outline-none ${
                      u.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => setDeleteId(u.user_id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm User Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-slate-300 text-xs">
          <p>Are you sure you want to permanently delete this user account?</p>
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
