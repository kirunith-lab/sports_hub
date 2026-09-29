import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Sports from './pages/Sports';
import SportDetail from './pages/SportDetail';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Players from './pages/Players';
import PlayerDetail from './pages/PlayerDetail';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import Venues from './pages/Venues';
import Statistics from './pages/Statistics';
import Login from './pages/Login';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSports from './pages/admin/ManageSports';
import ManageTeams from './pages/admin/ManageTeams';
import ManagePlayers from './pages/admin/ManagePlayers';
import ManageCoaches from './pages/admin/ManageCoaches';
import ManageTournaments from './pages/admin/ManageTournaments';
import ManageVenues from './pages/admin/ManageVenues';
import ManageMatches from './pages/admin/ManageMatches';
import ManageStatistics from './pages/admin/ManageStatistics';
import ManageUsers from './pages/admin/ManageUsers';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/sports/:id" element={<SportDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:id" element={<TournamentDetail />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sports" element={<ManageSports />} />
            <Route path="teams" element={<ManageTeams />} />
            <Route path="players" element={<ManagePlayers />} />
            <Route path="coaches" element={<ManageCoaches />} />
            <Route path="tournaments" element={<ManageTournaments />} />
            <Route path="venues" element={<ManageVenues />} />
            <Route path="matches" element={<ManageMatches />} />
            <Route path="statistics" element={<ManageStatistics />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={
            <div className="py-20 text-center space-y-4">
              <h2 className="text-4xl font-extrabold text-indigo-400">404</h2>
              <p className="text-slate-400 text-sm">The page you requested could not be found.</p>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
