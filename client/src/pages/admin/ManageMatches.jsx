import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Activity, AlertTriangle } from 'lucide-react';
import { matchesAPI, sportsAPI, tournamentsAPI, teamsAPI, venuesAPI } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageMatches() {
  const [matches, setMatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    sport_id: '',
    tournament_id: '',
    team1_id: '',
    team2_id: '',
    venue_id: '',
    match_date: '2026-04-01',
    match_time: '19:30',
    team1_score: 0,
    team2_score: 0,
    status: 'Scheduled'
  });

  useEffect(() => {
    Promise.all([
      matchesAPI.getAll(),
      sportsAPI.getAll(),
      tournamentsAPI.getAll(),
      teamsAPI.getAll(),
      venuesAPI.getAll()
    ]).then(([mRes, sRes, trRes, tRes, vRes]) => {
      if (mRes.success) setMatches(mRes.matches);
      if (sRes.success) setSports(sRes.sports);
      if (trRes.success) setTournaments(trRes.tournaments);
      if (tRes.success) setTeams(tRes.teams);
      if (vRes.success) setVenues(vRes.venues);
      setLoading(false);
    });
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await matchesAPI.getAll();
      if (res.success) setMatches(res.matches);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        sport_id: item.sport_id,
        tournament_id: item.tournament_id,
        team1_id: item.team1_id,
        team2_id: item.team2_id,
        venue_id: item.venue_id,
        match_date: item.match_date ? item.match_date.substring(0, 10) : '2026-04-01',
        match_time: item.match_time ? item.match_time.substring(0, 5) : '19:30',
        team1_score: item.team1_score || 0,
        team2_score: item.team2_score || 0,
        status: item.status || 'Scheduled'
      });
    } else {
      setEditingItem(null);
      setFormData({
        sport_id: sports.length > 0 ? sports[0].sport_id : '',
        tournament_id: tournaments.length > 0 ? tournaments[0].tournament_id : '',
        team1_id: teams.length > 0 ? teams[0].team_id : '',
        team2_id: teams.length > 1 ? teams[1].team_id : '',
        venue_id: venues.length > 0 ? venues[0].venue_id : '',
        match_date: '2026-04-01',
        match_time: '19:30',
        team1_score: 0,
        team2_score: 0,
        status: 'Scheduled'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await matchesAPI.update(editingItem.match_id, formData);
      } else {
        await matchesAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchMatches();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await matchesAPI.delete(deleteId);
      setDeleteId(null);
      fetchMatches();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading match fixtures..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            <span>Manage Match Fixtures & Results</span>
          </h1>
          <p className="text-xs text-slate-400">Schedule matches, enter live scores, and update standings automatically</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Match</span>
        </button>
      </div>

      {/* Matches Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4 w-12">ID</th>
              <th className="p-4">Tournament / Sport</th>
              <th className="p-4">Fixture (Team 1 vs Team 2)</th>
              <th className="p-4 text-center">Score</th>
              <th className="p-4">Date & Venue</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {matches.map((m) => (
              <tr key={m.match_id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-500">{m.match_id}</td>
                <td className="p-4">
                  <span className="font-bold text-slate-100 block">{m.tournament_name}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase">{m.sport_name}</span>
                </td>
                <td className="p-4 font-semibold text-slate-200">
                  {m.team1_name} <span className="text-indigo-400">vs</span> {m.team2_name}
                </td>
                <td className="p-4 text-center font-bold text-slate-100">
                  {m.status === 'Completed' ? `${m.team1_score} - ${m.team2_score}` : '-'}
                </td>
                <td className="p-4 text-slate-400">
                  <span className="block text-slate-200">{new Date(m.match_date).toLocaleDateString()}</span>
                  <span className="text-[11px]">{m.venue_name}</span>
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      m.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : m.status === 'Live'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(m)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      title="Edit Match / Scores"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(m.match_id)}
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
        title={editingItem ? 'Edit Match & Record Final Scores' : 'Schedule New Match Fixture'}
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tournament *</label>
              <select
                required
                value={formData.tournament_id}
                onChange={(e) => setFormData({ ...formData, tournament_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Select Tournament</option>
                {tournaments
                  .filter((tr) => !formData.sport_id || parseInt(tr.sport_id) === parseInt(formData.sport_id))
                  .map((tr) => (
                    <option key={tr.tournament_id} value={tr.tournament_id}>{tr.tournament_name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Team 1 *</label>
              <select
                required
                value={formData.team1_id}
                onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Select Team 1</option>
                {teams
                  .filter((t) => !formData.sport_id || parseInt(t.sport_id) === parseInt(formData.sport_id))
                  .map((t) => (
                    <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Team 2 *</label>
              <select
                required
                value={formData.team2_id}
                onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Select Team 2</option>
                {teams
                  .filter((t) => !formData.sport_id || parseInt(t.sport_id) === parseInt(formData.sport_id))
                  .map((t) => (
                    <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Venue *</label>
              <select
                required
                value={formData.venue_id}
                onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              >
                <option value="">Select Venue</option>
                {venues.map((v) => (
                  <option key={v.venue_id} value={v.venue_id}>{v.venue_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Match Date *</label>
              <input
                type="date"
                required
                value={formData.match_date}
                onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Match Time *</label>
              <input
                type="time"
                required
                value={formData.match_time}
                onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Match Status & Scoreline Setup
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Team 1 Score</label>
                <input
                  type="number"
                  value={formData.team1_score}
                  onChange={(e) => setFormData({ ...formData, team1_score: parseInt(e.target.value || '0') })}
                  className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Team 2 Score</label>
                <input
                  type="number"
                  value={formData.team2_score}
                  onChange={(e) => setFormData({ ...formData, team2_score: parseInt(e.target.value || '0') })}
                  className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Live">Live</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              * Setting status to <strong>Completed</strong> will execute a database transaction updating wins, losses, and tournament standings automatically!
            </p>
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
              {editingItem ? 'Save & Update Standings' : 'Schedule Match'}
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
          <p>Are you sure you want to delete this match record?</p>
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
