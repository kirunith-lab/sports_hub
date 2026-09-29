// Client-side fallback database engine for static Netlify deployments

let mockUsers = [
  {
    user_id: 1,
    name: 'System Administrator',
    email: 'admin@sportshub.com',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    user_id: 2,
    name: 'John Doe',
    email: 'user@sportshub.com',
    role: 'user',
    created_at: new Date().toISOString()
  }
];

let mockSports = [
  { sport_id: 1, name: 'Cricket', description: 'Bat-and-ball game played between two teams of eleven players on a pitch.', category: 'Team', icon_name: 'activity', total_teams: 3, total_players: 4, total_tournaments: 1 },
  { sport_id: 2, name: 'Football', description: 'Global team sport played with a spherical ball between two teams of 11 players.', category: 'Team', icon_name: 'dribbble', total_teams: 3, total_players: 3, total_tournaments: 1 },
  { sport_id: 3, name: 'Basketball', description: 'High-paced game played on a rectangular court shooting a ball through a hoop.', category: 'Team', icon_name: 'target', total_teams: 2, total_players: 2, total_tournaments: 1 },
  { sport_id: 4, name: 'Tennis', description: 'Racquet sport played individually or in doubles against an opponent.', category: 'Racquet', icon_name: 'award', total_teams: 0, total_players: 0, total_tournaments: 0 }
];

let mockTeams = [
  { team_id: 1, sport_id: 1, sport_name: 'Cricket', team_name: 'Mumbai Indians', country: 'India', city: 'Mumbai', founded_year: 2008, squad_size: 2, logo_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80' },
  { team_id: 2, sport_id: 1, sport_name: 'Cricket', team_name: 'Chennai Super Kings', country: 'India', city: 'Chennai', founded_year: 2008, squad_size: 2, logo_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80' },
  { team_id: 3, sport_id: 1, sport_name: 'Cricket', team_name: 'Royal Challengers Bengaluru', country: 'India', city: 'Bengaluru', founded_year: 2008, squad_size: 1, logo_url: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=400&q=80' },
  { team_id: 5, sport_id: 2, sport_name: 'Football', team_name: 'Real Madrid', country: 'Spain', city: 'Madrid', founded_year: 1902, squad_size: 2, logo_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80' },
  { team_id: 6, sport_id: 2, sport_name: 'Football', team_name: 'FC Barcelona', country: 'Spain', city: 'Barcelona', founded_year: 1899, squad_size: 1, logo_url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80' },
  { team_id: 9, sport_id: 3, sport_name: 'Basketball', team_name: 'Los Angeles Lakers', country: 'USA', city: 'Los Angeles', founded_year: 1947, squad_size: 1, logo_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80' }
];

let mockPlayers = [
  { player_id: 1, sport_id: 1, sport_name: 'Cricket', team_id: 1, team_name: 'Mumbai Indians', name: 'Rohit Sharma', date_of_birth: '1987-04-30', nationality: 'India', gender: 'Male', position: 'Right-handed Batsman', email: 'rohit@mi.com', contact_number: '+91 9876543210', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', jersey_number: 45 },
  { player_id: 2, sport_id: 1, sport_name: 'Cricket', team_id: 1, team_name: 'Mumbai Indians', name: 'Jasprit Bumrah', date_of_birth: '1993-12-06', nationality: 'India', gender: 'Male', position: 'Fast Bowler', email: 'bumrah@mi.com', contact_number: '+91 9876543211', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', jersey_number: 93 },
  { player_id: 3, sport_id: 1, sport_name: 'Cricket', team_id: 2, team_name: 'Chennai Super Kings', name: 'MS Dhoni', date_of_birth: '1981-07-07', nationality: 'India', gender: 'Male', position: 'Wicketkeeper Batsman', email: 'dhoni@csk.com', contact_number: '+91 9876543212', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', jersey_number: 7 },
  { player_id: 5, sport_id: 1, sport_name: 'Cricket', team_id: 3, team_name: 'Royal Challengers Bengaluru', name: 'Virat Kohli', date_of_birth: '1988-11-05', nationality: 'India', gender: 'Male', position: 'Top-order Batsman', email: 'kohli@rcb.com', contact_number: '+91 9876543214', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', jersey_number: 18 },
  { player_id: 7, sport_id: 2, sport_name: 'Football', team_id: 5, team_name: 'Real Madrid', name: 'Jude Bellingham', date_of_birth: '2003-06-29', nationality: 'England', gender: 'Male', position: 'Midfielder', email: 'jude@realmadrid.com', contact_number: '+34 612345678', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', jersey_number: 5 },
  { player_id: 8, sport_id: 2, sport_name: 'Football', team_id: 5, team_name: 'Real Madrid', name: 'Vinicius Junior', date_of_birth: '2000-07-12', nationality: 'Brazil', gender: 'Male', position: 'Winger', email: 'vini@realmadrid.com', contact_number: '+34 612345679', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80', jersey_number: 7 },
  { player_id: 13, sport_id: 3, sport_name: 'Basketball', team_id: 9, team_name: 'Los Angeles Lakers', name: 'LeBron James', date_of_birth: '1984-12-30', nationality: 'USA', gender: 'Male', position: 'Small Forward', email: 'kingjames@lakers.com', contact_number: '+1 2135550199', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', jersey_number: 23 }
];

let mockCoaches = [
  { coach_id: 1, sport_id: 1, sport_name: 'Cricket', team_id: 1, team_name: 'Mumbai Indians', name: 'Mark Boucher', nationality: 'South Africa', experience_years: 15 },
  { coach_id: 2, sport_id: 1, sport_name: 'Cricket', team_id: 2, team_name: 'Chennai Super Kings', name: 'Stephen Fleming', nationality: 'New Zealand', experience_years: 18 },
  { coach_id: 4, sport_id: 2, sport_name: 'Football', team_id: 5, team_name: 'Real Madrid', name: 'Carlo Ancelotti', nationality: 'Italy', experience_years: 28 }
];

let mockTournaments = [
  { tournament_id: 1, sport_id: 1, sport_name: 'Cricket', tournament_name: 'Indian Premier League 2026', start_date: '2026-03-20', end_date: '2026-05-30', location: 'India', max_teams: 10, status: 'Ongoing', description: 'Premier Twenty20 cricket league featuring franchise teams.' },
  { tournament_id: 2, sport_id: 2, sport_name: 'Football', tournament_name: 'UEFA Champions League 2026', start_date: '2025-09-15', end_date: '2026-06-01', location: 'Europe', max_teams: 32, status: 'Ongoing', description: 'Europe premier club football tournament.' }
];

let mockRegistrations = [
  { registration_id: 1, tournament_id: 1, tournament_name: 'Indian Premier League 2026', team_id: 1, team_name: 'Mumbai Indians', team_country: 'India', registration_date: '2026-01-10', status: 'Approved', notes: 'Official franchise registration confirmed' },
  { registration_id: 2, tournament_id: 1, tournament_name: 'Indian Premier League 2026', team_id: 2, team_name: 'Chennai Super Kings', team_country: 'India', registration_date: '2026-01-12', status: 'Approved', notes: 'Official franchise registration confirmed' },
  { registration_id: 3, tournament_id: 1, tournament_name: 'Indian Premier League 2026', team_id: 3, team_name: 'Royal Challengers Bengaluru', team_country: 'India', registration_date: '2026-01-15', status: 'Approved', notes: 'Official franchise registration confirmed' },
  { registration_id: 4, tournament_id: 2, tournament_name: 'UEFA Champions League 2026', team_id: 5, team_name: 'Real Madrid', team_country: 'Spain', registration_date: '2025-08-01', status: 'Approved', notes: 'Qualified automatically via league title' }
];

let mockVenues = [
  { venue_id: 1, venue_name: 'Wankhede Stadium', city: 'Mumbai', country: 'India', capacity: 33108, image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80', total_hosted_matches: 2 },
  { venue_id: 2, venue_name: 'MA Chidambaram Stadium', city: 'Chennai', country: 'India', capacity: 38000, image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80', total_hosted_matches: 1 },
  { venue_id: 3, venue_name: 'Santiago Bernabéu', city: 'Madrid', country: 'Spain', capacity: 81044, image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80', total_hosted_matches: 1 }
];

let mockMatches = [
  { match_id: 1, tournament_id: 1, tournament_name: 'Indian Premier League 2026', sport_id: 1, sport_name: 'Cricket', team1_id: 1, team1_name: 'Mumbai Indians', team1_logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80', team2_id: 2, team2_name: 'Chennai Super Kings', team2_logo: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80', venue_id: 1, venue_name: 'Wankhede Stadium', match_date: '2026-03-25', match_time: '19:30:00', team1_score: 185, team2_score: 180, status: 'Completed', winner_team_id: 1, winner_name: 'Mumbai Indians' },
  { match_id: 2, tournament_id: 1, tournament_name: 'Indian Premier League 2026', sport_id: 1, sport_name: 'Cricket', team1_id: 2, team1_name: 'Chennai Super Kings', team1_logo: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80', team2_id: 3, team2_name: 'Royal Challengers Bengaluru', team2_logo: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=400&q=80', venue_id: 2, venue_name: 'MA Chidambaram Stadium', match_date: '2026-03-28', match_time: '19:30:00', team1_score: 195, team2_score: 192, status: 'Completed', winner_team_id: 2, winner_name: 'Chennai Super Kings' },
  { match_id: 3, tournament_id: 1, tournament_name: 'Indian Premier League 2026', sport_id: 1, sport_name: 'Cricket', team1_id: 1, team1_name: 'Mumbai Indians', team1_logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80', team2_id: 3, team2_name: 'Royal Challengers Bengaluru', team2_logo: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=400&q=80', venue_id: 1, venue_name: 'Wankhede Stadium', match_date: '2026-10-05', match_time: '19:30:00', team1_score: 0, team2_score: 0, status: 'Scheduled', winner_team_id: null, winner_name: null },
  { match_id: 4, tournament_id: 2, tournament_name: 'UEFA Champions League 2026', sport_id: 2, sport_name: 'Football', team1_id: 5, team1_name: 'Real Madrid', team1_logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80', team2_id: 6, team2_name: 'FC Barcelona', team2_logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80', venue_id: 3, venue_name: 'Santiago Bernabéu', match_date: '2026-04-10', match_time: '21:00:00', team1_score: 3, team2_score: 2, status: 'Completed', winner_team_id: 5, winner_name: 'Real Madrid' }
];

let mockStats = [
  { stat_id: 1, player_id: 1, player_name: 'Rohit Sharma', match_id: 1, team1_name: 'Mumbai Indians', team2_name: 'Chennai Super Kings', match_date: '2026-03-25', points: 0, assists: 0, goals: 0, wickets: 0, runs: 78, performance_rating: 9.2 },
  { stat_id: 2, player_id: 2, player_name: 'Jasprit Bumrah', match_id: 1, team1_name: 'Mumbai Indians', team2_name: 'Chennai Super Kings', match_date: '2026-03-25', points: 0, assists: 0, goals: 0, wickets: 3, runs: 0, performance_rating: 9.5 },
  { stat_id: 3, player_id: 3, player_name: 'MS Dhoni', match_id: 1, team1_name: 'Mumbai Indians', team2_name: 'Chennai Super Kings', match_date: '2026-03-25', points: 0, assists: 0, goals: 0, wickets: 0, runs: 45, performance_rating: 8.4 },
  { stat_id: 6, player_id: 7, player_name: 'Jude Bellingham', match_id: 4, team1_name: 'Real Madrid', team2_name: 'FC Barcelona', match_date: '2026-04-10', points: 0, assists: 1, goals: 1, wickets: 0, runs: 0, performance_rating: 8.9 },
  { stat_id: 7, player_id: 8, player_name: 'Vinicius Junior', match_id: 4, team1_name: 'Real Madrid', team2_name: 'FC Barcelona', match_date: '2026-04-10', points: 0, assists: 0, goals: 2, wickets: 0, runs: 0, performance_rating: 9.6 }
];

let mockStandings = [
  { team_stat_id: 1, team_id: 1, team_name: 'Mumbai Indians', logo_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80', tournament_id: 1, matches_played: 2, wins: 1, losses: 1, draws: 0, points: 2 },
  { team_stat_id: 2, team_id: 2, team_name: 'Chennai Super Kings', logo_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80', tournament_id: 1, matches_played: 2, wins: 1, losses: 1, draws: 0, points: 2 },
  { team_stat_id: 3, team_id: 3, team_name: 'Royal Challengers Bengaluru', logo_url: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=400&q=80', tournament_id: 1, matches_played: 2, wins: 0, losses: 2, draws: 0, points: 0 }
];

export const handleMockRequest = async (url, method, data) => {
  // Authentication
  if (url.includes('/auth/login')) {
    const { email } = data || {};
    const isAdmin = email && email.includes('admin');
    const user = isAdmin
      ? { user_id: 1, name: 'System Administrator', email: 'admin@sportshub.com', role: 'admin' }
      : { user_id: 2, name: 'John Doe', email: 'user@sportshub.com', role: 'user' };
    return {
      success: true,
      token: 'mock_jwt_token_for_netlify_demo',
      user
    };
  }

  if (url.includes('/auth/register')) {
    const user = { user_id: Date.now(), name: data.name, email: data.email, role: data.role || 'user' };
    mockUsers.push(user);
    return { success: true, token: 'mock_jwt_token_for_netlify_demo', user };
  }

  if (url.includes('/auth/me')) {
    return { success: true, user: mockUsers[0] };
  }

  // Dashboard Stats
  if (url.includes('/stats/dashboard')) {
    return {
      success: true,
      metrics: {
        total_sports: mockSports.length,
        total_teams: mockTeams.length,
        total_players: mockPlayers.length,
        total_coaches: mockCoaches.length,
        total_tournaments: mockTournaments.length,
        total_registrations: mockRegistrations.length,
        total_matches: mockMatches.length,
        upcoming_matches: mockMatches.filter(m => m.status === 'Scheduled').length,
        completed_matches: mockMatches.filter(m => m.status === 'Completed').length,
        total_users: mockUsers.length
      },
      charts: {
        teamsBySport: mockSports.map(s => ({ sport: s.name, count: mockTeams.filter(t => t.sport_id === s.sport_id).length })),
        matchesBySport: mockSports.map(s => ({ sport: s.name, count: mockMatches.filter(m => m.sport_id === s.sport_id).length })),
        topPlayers: mockPlayers.slice(0, 5).map(p => ({
          player_id: p.player_id,
          name: p.name,
          sport: p.sport_name,
          rating: 9.2,
          goals: 2,
          runs: 78,
          points: 0
        })),
        tournamentsSummary: mockTournaments.map(tr => ({ tournament: tr.tournament_name, teams_count: 3 }))
      }
    };
  }

  // Sports
  if (url.includes('/sports')) {
    if (url.match(/\/sports\/\d+/)) {
      const id = parseInt(url.split('/').pop());
      const sport = mockSports.find(s => s.sport_id === id) || mockSports[0];
      return {
        success: true,
        sport: {
          ...sport,
          teams: mockTeams.filter(t => t.sport_id === id),
          players: mockPlayers.filter(p => p.sport_id === id),
          tournaments: mockTournaments.filter(tr => tr.sport_id === id),
          matches: mockMatches.filter(m => m.sport_id === id)
        }
      };
    }
    return { success: true, count: mockSports.length, sports: mockSports };
  }

  // Teams
  if (url.includes('/teams')) {
    if (url.match(/\/teams\/\d+/)) {
      const id = parseInt(url.split('/').pop());
      const team = mockTeams.find(t => t.team_id === id) || mockTeams[0];
      return {
        success: true,
        team: {
          ...team,
          players: mockPlayers.filter(p => p.team_id === id),
          matches: mockMatches.filter(m => m.team1_id === id || m.team2_id === id),
          stats: mockStandings.filter(st => st.team_id === id)
        }
      };
    }
    return { success: true, count: mockTeams.length, teams: mockTeams };
  }

  // Players
  if (url.includes('/players')) {
    if (url.match(/\/players\/\d+/)) {
      const id = parseInt(url.split('/').pop());
      const player = mockPlayers.find(p => p.player_id === id) || mockPlayers[0];
      return {
        success: true,
        player: {
          ...player,
          summary: { total_matches_played: 2, total_goals: 1, total_runs: 78, total_wickets: 0, total_points: 0, avg_rating: 9.2 },
          performances: mockStats.filter(st => st.player_id === id)
        }
      };
    }
    return { success: true, count: mockPlayers.length, players: mockPlayers };
  }

  // Coaches
  if (url.includes('/coaches')) {
    return { success: true, count: mockCoaches.length, coaches: mockCoaches };
  }

  // Tournaments
  if (url.includes('/tournaments')) {
    if (url.match(/\/tournaments\/\d+/)) {
      const id = parseInt(url.split('/').pop());
      const tournament = mockTournaments.find(tr => tr.tournament_id === id) || mockTournaments[0];
      return {
        success: true,
        tournament: {
          ...tournament,
          standings: mockStandings.filter(st => st.tournament_id === id),
          matches: mockMatches.filter(m => m.tournament_id === id)
        }
      };
    }
    return { success: true, count: mockTournaments.length, tournaments: mockTournaments };
  }

  // Registrations
  if (url.includes('/registrations')) {
    return { success: true, count: mockRegistrations.length, registrations: mockRegistrations };
  }

  // Venues
  if (url.includes('/venues')) {
    return { success: true, count: mockVenues.length, venues: mockVenues };
  }

  // Matches
  if (url.includes('/matches')) {
    if (url.match(/\/matches\/\d+/)) {
      const id = parseInt(url.split('/').pop());
      const match = mockMatches.find(m => m.match_id === id) || mockMatches[0];
      return {
        success: true,
        match: {
          ...match,
          player_statistics: mockStats.filter(st => st.match_id === id)
        }
      };
    }
    return { success: true, count: mockMatches.length, matches: mockMatches };
  }

  // Stats Players
  if (url.includes('/stats/players')) {
    return { success: true, count: mockStats.length, statistics: mockStats };
  }

  // Users
  if (url.includes('/users')) {
    return { success: true, count: mockUsers.length, users: mockUsers };
  }

  return { success: true, data: [] };
};
