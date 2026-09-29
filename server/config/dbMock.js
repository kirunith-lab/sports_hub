// In-memory relational database fallback engine for SportsHub
// Used seamlessly when local MySQL service is not running.

const bcrypt = require('bcryptjs');

let nextIds = {
  users: 10,
  sports: 10,
  teams: 20,
  players: 30,
  coaches: 10,
  tournaments: 10,
  registrations: 20,
  venues: 10,
  matches: 10,
  player_statistics: 20,
  team_statistics: 20
};

let mockDb = {
  users: [
    {
      user_id: 1,
      name: 'System Administrator',
      email: 'admin@sportshub.com',
      password_hash: '$2a$10$YTyzBG1DDruPcW3XzQs4ZOcnAifCXN60mT65KfibHb6Q6MVrId2hK', // admin123
      role: 'admin',
      created_at: new Date()
    },
    {
      user_id: 2,
      name: 'John Doe',
      email: 'user@sportshub.com',
      password_hash: '$2a$10$SmjzRU.w18HKqqzWzg9oyeljfZ4NdDfjMfNUNsJZWx18K5TWZWpBq', // user123
      role: 'user',
      created_at: new Date()
    }
  ],

  sports: [
    { sport_id: 1, name: 'Cricket', description: 'Bat-and-ball game played between two teams of eleven players.', category: 'Team', icon_name: 'activity' },
    { sport_id: 2, name: 'Football', description: 'Global team sport played with a spherical ball.', category: 'Team', icon_name: 'dribbble' },
    { sport_id: 3, name: 'Basketball', description: 'High-paced game played on a rectangular court.', category: 'Team', icon_name: 'target' },
    { sport_id: 4, name: 'Tennis', description: 'Racquet sport played individually or in doubles.', category: 'Racquet', icon_name: 'award' }
  ],

  teams: [
    { team_id: 1, sport_id: 1, team_name: 'Mumbai Indians', country: 'India', city: 'Mumbai', founded_year: 2008, logo_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80' },
    { team_id: 2, sport_id: 1, team_name: 'Chennai Super Kings', country: 'India', city: 'Chennai', founded_year: 2008, logo_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80' },
    { team_id: 3, sport_id: 1, team_name: 'Royal Challengers Bengaluru', country: 'India', city: 'Bengaluru', founded_year: 2008, logo_url: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=400&q=80' },
    { team_id: 5, sport_id: 2, team_name: 'Real Madrid', country: 'Spain', city: 'Madrid', founded_year: 1902, logo_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80' },
    { team_id: 6, sport_id: 2, team_name: 'FC Barcelona', country: 'Spain', city: 'Barcelona', founded_year: 1899, logo_url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80' },
    { team_id: 9, sport_id: 3, team_name: 'Los Angeles Lakers', country: 'USA', city: 'Los Angeles', founded_year: 1947, logo_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80' }
  ],

  players: [
    { player_id: 1, sport_id: 1, name: 'Rohit Sharma', date_of_birth: '1987-04-30', nationality: 'India', gender: 'Male', position: 'Right-handed Batsman', email: 'rohit@mi.com', contact_number: '+91 9876543210', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { player_id: 2, sport_id: 1, name: 'Jasprit Bumrah', date_of_birth: '1993-12-06', nationality: 'India', gender: 'Male', position: 'Fast Bowler', email: 'bumrah@mi.com', contact_number: '+91 9876543211', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { player_id: 3, sport_id: 1, name: 'MS Dhoni', date_of_birth: '1981-07-07', nationality: 'India', gender: 'Male', position: 'Wicketkeeper Batsman', email: 'dhoni@csk.com', contact_number: '+91 9876543212', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    { player_id: 5, sport_id: 1, name: 'Virat Kohli', date_of_birth: '1988-11-05', nationality: 'India', gender: 'Male', position: 'Top-order Batsman', email: 'kohli@rcb.com', contact_number: '+91 9876543214', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
    { player_id: 7, sport_id: 2, name: 'Jude Bellingham', date_of_birth: '2003-06-29', nationality: 'England', gender: 'Male', position: 'Midfielder', email: 'jude@realmadrid.com', contact_number: '+34 612345678', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
    { player_id: 8, sport_id: 2, name: 'Vinicius Junior', date_of_birth: '2000-07-12', nationality: 'Brazil', gender: 'Male', position: 'Winger', email: 'vini@realmadrid.com', contact_number: '+34 612345679', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80' },
    { player_id: 13, sport_id: 3, name: 'LeBron James', date_of_birth: '1984-12-30', nationality: 'USA', gender: 'Male', position: 'Small Forward', email: 'kingjames@lakers.com', contact_number: '+1 2135550199', status: 'Active', profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' }
  ],

  coaches: [
    { coach_id: 1, sport_id: 1, team_id: 1, name: 'Mark Boucher', nationality: 'South Africa', experience_years: 15 },
    { coach_id: 2, sport_id: 1, team_id: 2, name: 'Stephen Fleming', nationality: 'New Zealand', experience_years: 18 },
    { coach_id: 4, sport_id: 2, team_id: 5, name: 'Carlo Ancelotti', nationality: 'Italy', experience_years: 28 }
  ],

  team_players: [
    { team_id: 1, player_id: 1, jersey_number: 45, joined_date: '2011-01-01', left_date: null },
    { team_id: 1, player_id: 2, jersey_number: 93, joined_date: '2013-01-01', left_date: null },
    { team_id: 2, player_id: 3, jersey_number: 7, joined_date: '2008-01-01', left_date: null },
    { team_id: 3, player_id: 5, jersey_number: 18, joined_date: '2008-01-01', left_date: null },
    { team_id: 5, player_id: 7, jersey_number: 5, joined_date: '2023-07-01', left_date: null },
    { team_id: 5, player_id: 8, jersey_number: 7, joined_date: '2018-07-01', left_date: null },
    { team_id: 9, player_id: 13, jersey_number: 23, joined_date: '2018-07-01', left_date: null }
  ],

  tournaments: [
    { tournament_id: 1, sport_id: 1, tournament_name: 'Indian Premier League 2026', start_date: '2026-03-20', end_date: '2026-05-30', location: 'India', max_teams: 10, status: 'Ongoing', description: 'Premier Twenty20 cricket league featuring franchise teams.' },
    { tournament_id: 2, sport_id: 2, tournament_name: 'UEFA Champions League 2026', start_date: '2025-09-15', end_date: '2026-06-01', location: 'Europe', max_teams: 32, status: 'Ongoing', description: 'Europe premier club football tournament.' }
  ],

  registrations: [
    { registration_id: 1, tournament_id: 1, team_id: 1, registration_date: '2026-01-10', status: 'Approved', notes: 'Official franchise registration confirmed' },
    { registration_id: 2, tournament_id: 1, team_id: 2, registration_date: '2026-01-12', status: 'Approved', notes: 'Official franchise registration confirmed' },
    { registration_id: 3, tournament_id: 1, team_id: 3, registration_date: '2026-01-15', status: 'Approved', notes: 'Official franchise registration confirmed' },
    { registration_id: 4, tournament_id: 2, team_id: 5, registration_date: '2025-08-01', status: 'Approved', notes: 'Qualified automatically via league title' },
    { registration_id: 5, tournament_id: 2, team_id: 6, registration_date: '2025-08-02', status: 'Approved', notes: 'Qualified automatically via league standing' }
  ],

  venues: [
    { venue_id: 1, venue_name: 'Wankhede Stadium', city: 'Mumbai', country: 'India', capacity: 33108, image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80' },
    { venue_id: 2, venue_name: 'MA Chidambaram Stadium', city: 'Chennai', country: 'India', capacity: 38000, image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80' },
    { venue_id: 3, venue_name: 'Santiago Bernabéu', city: 'Madrid', country: 'Spain', capacity: 81044, image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80' }
  ],

  matches: [
    { match_id: 1, tournament_id: 1, sport_id: 1, team1_id: 1, team2_id: 2, venue_id: 1, match_date: '2026-03-25', match_time: '19:30:00', team1_score: 185, team2_score: 180, status: 'Completed', winner_team_id: 1, man_of_match_player_id: 1 },
    { match_id: 2, tournament_id: 1, sport_id: 1, team1_id: 2, team2_id: 3, venue_id: 2, match_date: '2026-03-28', match_time: '19:30:00', team1_score: 195, team2_score: 192, status: 'Completed', winner_team_id: 2, man_of_match_player_id: 3 },
    { match_id: 3, tournament_id: 1, sport_id: 1, team1_id: 1, team2_id: 3, venue_id: 1, match_date: '2026-10-05', match_time: '19:30:00', team1_score: 0, team2_score: 0, status: 'Scheduled', winner_team_id: null, man_of_match_player_id: null },
    { match_id: 4, tournament_id: 2, sport_id: 2, team1_id: 5, team2_id: 6, venue_id: 3, match_date: '2026-04-10', match_time: '21:00:00', team1_score: 3, team2_score: 2, status: 'Completed', winner_team_id: 5, man_of_match_player_id: 8 }
  ],

  player_statistics: [
    { stat_id: 1, player_id: 1, match_id: 1, points: 0, assists: 0, goals: 0, wickets: 0, runs: 78, performance_rating: 9.2 },
    { stat_id: 2, player_id: 2, match_id: 1, points: 0, assists: 0, goals: 0, wickets: 3, runs: 0, performance_rating: 9.5 },
    { stat_id: 3, player_id: 3, match_id: 1, points: 0, assists: 0, goals: 0, wickets: 0, runs: 45, performance_rating: 8.4 },
    { stat_id: 6, player_id: 7, match_id: 4, points: 0, assists: 1, goals: 1, wickets: 0, runs: 0, performance_rating: 8.9 },
    { stat_id: 7, player_id: 8, match_id: 4, points: 0, assists: 0, goals: 2, wickets: 0, runs: 0, performance_rating: 9.6 }
  ],

  team_statistics: [
    { team_stat_id: 1, team_id: 1, tournament_id: 1, matches_played: 2, wins: 1, losses: 1, draws: 0, points: 2 },
    { team_stat_id: 2, team_id: 2, tournament_id: 1, matches_played: 2, wins: 1, losses: 1, draws: 0, points: 2 },
    { team_stat_id: 3, team_id: 3, tournament_id: 1, matches_played: 2, wins: 0, losses: 2, draws: 0, points: 0 },
    { team_stat_id: 4, team_id: 5, tournament_id: 2, matches_played: 1, wins: 1, losses: 0, draws: 0, points: 3 },
    { team_stat_id: 5, team_id: 6, tournament_id: 2, matches_played: 1, wins: 0, losses: 1, draws: 0, points: 0 }
  ]
};

// Helper query function
const executeMockQuery = async (sql, params = []) => {
  const normalizedSql = sql.trim().toLowerCase();

  // 1. SELECT REGISTRATIONS
  if (normalizedSql.includes('from registrations r')) {
    const regList = mockDb.registrations.map((r) => {
      const tournament = mockDb.tournaments.find((tr) => tr.tournament_id === r.tournament_id);
      const sport = tournament ? mockDb.sports.find((s) => s.sport_id === tournament.sport_id) : null;
      const team = mockDb.teams.find((t) => t.team_id === r.team_id);
      return {
        ...r,
        tournament_name: tournament ? tournament.tournament_name : '',
        sport_name: sport ? sport.name : '',
        team_name: team ? team.team_name : '',
        team_country: team ? team.country : '',
        team_logo: team ? team.logo_url : ''
      };
    });
    return [regList, []];
  }

  // 2. INSERT REGISTRATION
  if (normalizedSql.includes('insert into registrations')) {
    const newReg = {
      registration_id: nextIds.registrations++,
      tournament_id: parseInt(params[0]),
      team_id: parseInt(params[1]),
      registration_date: params[2],
      status: params[3] || 'Approved',
      notes: params[4] || ''
    };
    mockDb.registrations.push(newReg);
    return [{ insertId: newReg.registration_id, affectedRows: 1 }, []];
  }

  // 3. UPDATE REGISTRATION
  if (normalizedSql.includes('update registrations set')) {
    const status = params[0];
    const notes = params[1];
    const id = parseInt(params[2]);
    const r = mockDb.registrations.find((reg) => reg.registration_id === id);
    if (r) {
      r.status = status;
      r.notes = notes;
    }
    return [{ affectedRows: r ? 1 : 0 }, []];
  }

  // 4. DELETE REGISTRATION
  if (normalizedSql.includes('delete from registrations where registration_id =')) {
    const id = parseInt(params[0]);
    const initLen = mockDb.registrations.length;
    mockDb.registrations = mockDb.registrations.filter((r) => r.registration_id !== id);
    return [{ affectedRows: initLen - mockDb.registrations.length }, []];
  }

  // 5. SELECT USERS by email
  if (normalizedSql.includes('select * from users where email =')) {
    const email = params[0];
    const found = mockDb.users.filter((u) => u.email.toLowerCase() === email.toLowerCase());
    return [found, []];
  }

  // 6. SELECT USER by user_id
  if (normalizedSql.includes('select user_id, name, email, role, created_at from users where user_id =')) {
    const id = parseInt(params[0]);
    const found = mockDb.users.filter((u) => u.user_id === id);
    return [found, []];
  }

  // 7. SELECT ALL USERS
  if (normalizedSql.includes('select user_id, name, email, role, created_at from users')) {
    return [[...mockDb.users], []];
  }

  // 8. INSERT USER
  if (normalizedSql.includes('insert into users')) {
    const newUser = {
      user_id: nextIds.users++,
      name: params[0],
      email: params[1],
      password_hash: params[2],
      role: params[3] || 'user',
      created_at: new Date()
    };
    mockDb.users.push(newUser);
    return [{ insertId: newUser.user_id, affectedRows: 1 }, []];
  }

  // 9. UPDATE USER ROLE
  if (normalizedSql.includes('update users set role =')) {
    const role = params[0];
    const id = parseInt(params[1]);
    const u = mockDb.users.find((user) => user.user_id === id);
    if (u) u.role = role;
    return [{ affectedRows: u ? 1 : 0 }, []];
  }

  // 10. DELETE USER
  if (normalizedSql.includes('delete from users where user_id =')) {
    const id = parseInt(params[0]);
    const initLen = mockDb.users.length;
    mockDb.users = mockDb.users.filter((u) => u.user_id !== id);
    return [{ affectedRows: initLen - mockDb.users.length }, []];
  }

  // 11. GET ALL SPORTS
  if (normalizedSql.includes('from sports s') || normalizedSql.includes('from sports')) {
    const sportsList = mockDb.sports.map((s) => {
      const teamsCount = mockDb.teams.filter((t) => t.sport_id === s.sport_id).length;
      const playersCount = mockDb.players.filter((p) => p.sport_id === s.sport_id).length;
      const tournamentsCount = mockDb.tournaments.filter((tr) => tr.sport_id === s.sport_id).length;
      return {
        ...s,
        total_teams: teamsCount,
        total_players: playersCount,
        total_tournaments: tournamentsCount
      };
    });
    return [sportsList, []];
  }

  // 12. GET SPORT BY ID
  if (normalizedSql.includes('select * from sports where sport_id =')) {
    const id = parseInt(params[0]);
    const found = mockDb.sports.filter((s) => s.sport_id === id);
    return [found, []];
  }

  // 13. INSERT SPORT
  if (normalizedSql.includes('insert into sports')) {
    const newSport = {
      sport_id: nextIds.sports++,
      name: params[0],
      description: params[1],
      category: params[2],
      icon_name: params[3]
    };
    mockDb.sports.push(newSport);
    return [{ insertId: newSport.sport_id, affectedRows: 1 }, []];
  }

  // 14. UPDATE SPORT
  if (normalizedSql.includes('update sports set')) {
    const id = parseInt(params[params.length - 1]);
    const s = mockDb.sports.find((sp) => sp.sport_id === id);
    if (s) {
      s.name = params[0];
      s.description = params[1];
      s.category = params[2];
      s.icon_name = params[3];
    }
    return [{ affectedRows: s ? 1 : 0 }, []];
  }

  // 15. DELETE SPORT
  if (normalizedSql.includes('delete from sports where sport_id =')) {
    const id = parseInt(params[0]);
    mockDb.sports = mockDb.sports.filter((sp) => sp.sport_id !== id);
    return [{ affectedRows: 1 }, []];
  }

  // 16. GET TEAMS
  if (normalizedSql.includes('from teams t')) {
    const teamsList = mockDb.teams.map((t) => {
      const sport = mockDb.sports.find((s) => s.sport_id === t.sport_id);
      const coach = mockDb.coaches.find((c) => c.team_id === t.team_id);
      const squadSize = mockDb.team_players.filter((tp) => tp.team_id === t.team_id && !tp.left_date).length;
      return {
        ...t,
        sport_name: sport ? sport.name : 'Unknown',
        coach_name: coach ? coach.name : null,
        squad_size: squadSize
      };
    });

    if (params.length > 0 && typeof params[0] === 'number') {
      const filtered = teamsList.filter((tm) => tm.team_id === parseInt(params[0]));
      return [filtered, []];
    }
    return [teamsList, []];
  }

  // 17. GET PLAYERS
  if (normalizedSql.includes('from players p')) {
    const playersList = mockDb.players.map((p) => {
      const sport = mockDb.sports.find((s) => s.sport_id === p.sport_id);
      const tp = mockDb.team_players.find((tlink) => tlink.player_id === p.player_id && !tlink.left_date);
      const team = tp ? mockDb.teams.find((tm) => tm.team_id === tp.team_id) : null;
      return {
        ...p,
        sport_name: sport ? sport.name : 'Unknown',
        team_id: team ? team.team_id : null,
        team_name: team ? team.team_name : null,
        team_logo: team ? team.logo_url : null,
        jersey_number: tp ? tp.jersey_number : null
      };
    });

    if (params.length > 0 && !isNaN(parseInt(params[0]))) {
      const single = playersList.filter((pl) => pl.player_id === parseInt(params[0]));
      return [single, []];
    }
    return [playersList, []];
  }

  // 18. GET COACHES
  if (normalizedSql.includes('from coaches c')) {
    const coachesList = mockDb.coaches.map((c) => {
      const sport = mockDb.sports.find((s) => s.sport_id === c.sport_id);
      const team = mockDb.teams.find((t) => t.team_id === c.team_id);
      return {
        ...c,
        sport_name: sport ? sport.name : 'Unknown',
        team_name: team ? team.team_name : null,
        team_logo: team ? team.logo_url : null
      };
    });
    return [coachesList, []];
  }

  // 19. GET TOURNAMENTS
  if (normalizedSql.includes('from tournaments t')) {
    const tournamentsList = mockDb.tournaments.map((tr) => {
      const sport = mockDb.sports.find((s) => s.sport_id === tr.sport_id);
      const matchesCount = mockDb.matches.filter((m) => m.tournament_id === tr.tournament_id).length;
      const teamsCount = mockDb.registrations.filter((rg) => rg.tournament_id === tr.tournament_id).length;
      return {
        ...tr,
        sport_name: sport ? sport.name : 'Unknown',
        total_matches: matchesCount,
        total_participating_teams: teamsCount
      };
    });

    if (params.length > 0 && !isNaN(parseInt(params[0]))) {
      const single = tournamentsList.filter((tr) => tr.tournament_id === parseInt(params[0]));
      return [single, []];
    }
    return [tournamentsList, []];
  }

  // 20. GET VENUES
  if (normalizedSql.includes('from venues v')) {
    const venuesList = mockDb.venues.map((v) => {
      const count = mockDb.matches.filter((m) => m.venue_id === v.venue_id).length;
      return { ...v, total_hosted_matches: count };
    });
    return [venuesList, []];
  }

  // 21. GET MATCHES
  if (normalizedSql.includes('from matches m')) {
    const matchesList = mockDb.matches.map((m) => {
      const sport = mockDb.sports.find((s) => s.sport_id === m.sport_id);
      const tournament = mockDb.tournaments.find((tr) => tr.tournament_id === m.tournament_id);
      const venue = mockDb.venues.find((v) => v.venue_id === m.venue_id);
      const team1 = mockDb.teams.find((t) => t.team_id === m.team1_id);
      const team2 = mockDb.teams.find((t) => t.team_id === m.team2_id);
      const winner = mockDb.teams.find((t) => t.team_id === m.winner_team_id);
      const mom = mockDb.players.find((p) => p.player_id === m.man_of_match_player_id);

      return {
        ...m,
        sport_name: sport ? sport.name : '',
        tournament_name: tournament ? tournament.tournament_name : '',
        venue_name: venue ? venue.venue_name : '',
        venue_city: venue ? venue.city : '',
        venue_country: venue ? venue.country : '',
        team1_name: team1 ? team1.team_name : '',
        team1_logo: team1 ? team1.logo_url : '',
        team1_country: team1 ? team1.country : '',
        team2_name: team2 ? team2.team_name : '',
        team2_logo: team2 ? team2.logo_url : '',
        team2_country: team2 ? team2.country : '',
        winner_name: winner ? winner.team_name : null,
        man_of_match_name: mom ? mom.name : null
      };
    });

    if (params.length > 0 && !isNaN(parseInt(params[0]))) {
      const single = matchesList.filter((mc) => mc.match_id === parseInt(params[0]));
      return [single, []];
    }
    return [matchesList, []];
  }

  // 22. GET PLAYER STATS
  if (normalizedSql.includes('from player_statistics')) {
    const statsList = mockDb.player_statistics.map((ps) => {
      const player = mockDb.players.find((p) => p.player_id === ps.player_id);
      const sport = player ? mockDb.sports.find((s) => s.sport_id === player.sport_id) : null;
      const match = mockDb.matches.find((m) => m.match_id === ps.match_id);
      const t1 = match ? mockDb.teams.find((t) => t.team_id === match.team1_id) : null;
      const t2 = match ? mockDb.teams.find((t) => t.team_id === match.team2_id) : null;

      return {
        ...ps,
        player_name: player ? player.name : '',
        position: player ? player.position : '',
        profile_image_url: player ? player.profile_image_url : '',
        sport_name: sport ? sport.name : '',
        match_date: match ? match.match_date : '',
        team1_name: t1 ? t1.team_name : '',
        team2_name: t2 ? t2.team_name : ''
      };
    });
    return [statsList, []];
  }

  // 23. GET TEAM STATS / STANDINGS
  if (normalizedSql.includes('from team_statistics')) {
    const standingsList = mockDb.team_statistics.map((ts) => {
      const team = mockDb.teams.find((t) => t.team_id === ts.team_id);
      const tournament = mockDb.tournaments.find((tr) => tr.tournament_id === ts.tournament_id);
      return {
        ...ts,
        team_name: team ? team.team_name : '',
        country: team ? team.country : '',
        logo_url: team ? team.logo_url : '',
        tournament_name: tournament ? tournament.tournament_name : ''
      };
    });
    return [standingsList, []];
  }

  // 24. COUNT METRICS DASHBOARD QUERY
  if (normalizedSql.includes('select \n        (select count(*) from sports) as total_sports') || normalizedSql.includes('select (select count(*) from sports)')) {
    return [
      [
        {
          total_sports: mockDb.sports.length,
          total_teams: mockDb.teams.length,
          total_players: mockDb.players.length,
          total_coaches: mockDb.coaches.length,
          total_tournaments: mockDb.tournaments.length,
          total_registrations: mockDb.registrations.length,
          total_matches: mockDb.matches.length,
          upcoming_matches: mockDb.matches.filter((m) => m.status === 'Scheduled').length,
          completed_matches: mockDb.matches.filter((m) => m.status === 'Completed').length,
          total_users: mockDb.users.length
        }
      ],
      []
    ];
  }

  // Generic Fallback
  return [[], []];
};

module.exports = { executeMockQuery, mockDb };
