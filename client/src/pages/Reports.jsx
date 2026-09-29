import React, { useEffect, useState } from 'react';
import { FileText, Download, Filter, Search, Trophy, Shield, Users, Calendar, Table } from 'lucide-react';
import { sportsAPI, teamsAPI, tournamentsAPI, matchesAPI, playersAPI, registrationsAPI, statsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Reports() {
  const [reportType, setReportType] = useState('players_by_team');
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  // Filter States
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');
  const [matchStatus, setMatchStatus] = useState('');
  const [search, setSearch] = useState('');

  // Data States
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([sportsAPI.getAll(), teamsAPI.getAll(), tournamentsAPI.getAll()]).then(([sRes, tRes, trRes]) => {
      if (sRes.success) setSports(sRes.sports);
      if (tRes.success) setTeams(tRes.teams);
      if (trRes.success) setTournaments(trRes.tournaments);
    });
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [reportType, selectedSport, selectedTeam, selectedTournament, matchStatus, search]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      if (reportType === 'players_by_team') {
        const res = await playersAPI.getAll({ sport_id: selectedSport, team_id: selectedTeam, search });
        if (res.success) setReportData(res.players);
      } else if (reportType === 'tournament_teams') {
        const res = await registrationsAPI.getAll({ tournament_id: selectedTournament, team_id: selectedTeam });
        if (res.success) setReportData(res.registrations);
      } else if (reportType === 'match_results') {
        const res = await matchesAPI.getAll({ sport_id: selectedSport, tournament_id: selectedTournament, status: matchStatus });
        if (res.success) setReportData(res.matches);
      } else if (reportType === 'tournament_standings') {
        const res = await statsAPI.getDashboard();
        if (res.success && selectedTournament) {
          const detail = await tournamentsAPI.getById(selectedTournament || 1);
          if (detail.success) setReportData(detail.tournament.standings);
        } else {
          setReportData(res.charts.topPlayers || []);
        }
      } else if (reportType === 'player_stats') {
        const res = await statsAPI.getPlayerStats();
        if (res.success) setReportData(res.statistics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData || reportData.length === 0) return;
    const headers = Object.keys(reportData[0]).join(',');
    const rows = reportData.map((row) => Object.values(row).map((val) => `"${val}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SportsHub_Report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
            <FileText className="w-7 h-7 text-indigo-400" />
            <span>Reports & Analytical Insights</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Multi-criteria reporting engine executing SQL JOIN queries across core database entities</p>
        </div>

        <button
          onClick={exportToCSV}
          disabled={reportData.length === 0}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export Report CSV</span>
        </button>
      </div>

      {/* Report Selection Tabs */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap gap-2">
        {[
          { id: 'players_by_team', label: '1. Players by Team', icon: Users },
          { id: 'tournament_teams', label: '2. Registered Teams in Tournament', icon: Shield },
          { id: 'match_results', label: '3. Match Fixtures & Results', icon: Calendar },
          { id: 'tournament_standings', label: '4. Tournament Points Standings', icon: Trophy },
          { id: 'player_stats', label: '5. Player Performance Statistics', icon: Table }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = reportType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setReportType(t.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-amber-400" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold pr-2 border-r border-slate-800">
          <Filter className="w-4 h-4" />
          <span>Report Criteria:</span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Filter by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 text-xs text-slate-100 pl-8 pr-3 py-1.5 rounded-xl border border-slate-700"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
        </div>

        {/* Sport Select */}
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="bg-slate-900 text-xs text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700"
        >
          <option value="">All Sports</option>
          {sports.map((s) => (
            <option key={s.sport_id} value={s.sport_id}>{s.name}</option>
          ))}
        </select>

        {/* Team Select */}
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="bg-slate-900 text-xs text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700"
        >
          <option value="">All Teams</option>
          {teams.map((tm) => (
            <option key={tm.team_id} value={tm.team_id}>{tm.team_name}</option>
          ))}
        </select>

        {/* Tournament Select */}
        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="bg-slate-900 text-xs text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700"
        >
          <option value="">All Tournaments</option>
          {tournaments.map((tr) => (
            <option key={tr.tournament_id} value={tr.tournament_id}>{tr.tournament_name}</option>
          ))}
        </select>

        {/* Match Status Select */}
        {reportType === 'match_results' && (
          <select
            value={matchStatus}
            onChange={(e) => setMatchStatus(e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
          </select>
        )}
      </div>

      {/* Report Results Table */}
      {loading ? (
        <LoadingSpinner text="Executing parameterized relational SQL report query..." />
      ) : reportData.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
          No records match the selected report filter parameters.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300">
              Query Result: {reportData.length} records returned
            </span>
            <span className="text-[11px] text-indigo-400 font-mono">
              3NF Relational JOIN Execution
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  {Object.keys(reportData[0]).slice(0, 7).map((key) => (
                    <th key={key} className="p-4">{key.replace(/_/g, ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    {Object.values(row).slice(0, 7).map((val, i) => (
                      <td key={i} className="p-4">
                        {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? 'N/A')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
