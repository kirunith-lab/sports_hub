const db = require('../config/db');

// GET all teams with sport info and player count
const getAllTeams = async (req, res, next) => {
  try {
    const { sport_id, search, country } = req.query;
    let query = `
      SELECT t.*, s.name AS sport_name, c.name AS coach_name,
        COUNT(DISTINCT tp.player_id) AS squad_size
      FROM teams t
      JOIN sports s ON t.sport_id = s.sport_id
      LEFT JOIN coaches c ON t.team_id = c.team_id
      LEFT JOIN team_players tp ON t.team_id = tp.team_id AND tp.left_date IS NULL
      WHERE 1=1
    `;
    const params = [];

    if (sport_id) {
      query += ` AND t.sport_id = ?`;
      params.push(sport_id);
    }
    if (search) {
      query += ` AND (t.team_name LIKE ? OR t.city LIKE ? OR t.country LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (country) {
      query += ` AND t.country = ?`;
      params.push(country);
    }

    query += ` GROUP BY t.team_id ORDER BY t.team_name ASC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, count: rows.length, teams: rows });
  } catch (error) {
    next(error);
  }
};

// GET team details by ID with squad roster, coach, matches, and statistics
const getTeamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [teams] = await db.query(
      `SELECT t.*, s.name AS sport_name, c.coach_id, c.name AS coach_name, c.experience_years AS coach_experience
       FROM teams t
       JOIN sports s ON t.sport_id = s.sport_id
       LEFT JOIN coaches c ON t.team_id = c.team_id
       WHERE t.team_id = ?`,
      [id]
    );

    if (teams.length === 0) {
      return res.status(404).json({ success: false, message: 'Team not found.' });
    }

    const team = teams[0];

    // Fetch team players
    const [players] = await db.query(
      `SELECT p.*, tp.jersey_number, tp.joined_date
       FROM players p
       JOIN team_players tp ON p.player_id = tp.player_id
       WHERE tp.team_id = ? AND tp.left_date IS NULL
       ORDER BY tp.jersey_number ASC, p.name ASC`,
      [id]
    );

    // Fetch team matches
    const [matches] = await db.query(
      `SELECT m.*, tr.tournament_name, v.venue_name,
              t1.team_name AS team1_name, t1.logo_url AS team1_logo,
              t2.team_name AS team2_name, t2.logo_url AS team2_logo,
              w.team_name AS winner_name
       FROM matches m
       JOIN tournaments tr ON m.tournament_id = tr.tournament_id
       JOIN venues v ON m.venue_id = v.venue_id
       JOIN teams t1 ON m.team1_id = t1.team_id
       JOIN teams t2 ON m.team2_id = t2.team_id
       LEFT JOIN teams w ON m.winner_team_id = w.team_id
       WHERE m.team1_id = ? OR m.team2_id = ?
       ORDER BY m.match_date DESC`,
      [id, id]
    );

    // Fetch tournament standings / team stats
    const [stats] = await db.query(
      `SELECT ts.*, tr.tournament_name
       FROM team_statistics ts
       JOIN tournaments tr ON ts.tournament_id = tr.tournament_id
       WHERE ts.team_id = ?`,
      [id]
    );

    res.json({
      success: true,
      team: {
        ...team,
        players,
        matches,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// CREATE team
const createTeam = async (req, res, next) => {
  try {
    const { sport_id, team_name, country, city, founded_year, logo_url } = req.body;
    if (!sport_id || !team_name || !country) {
      return res.status(400).json({ success: false, message: 'Sport, team name, and country are required.' });
    }

    const [result] = await db.query(
      'INSERT INTO teams (sport_id, team_name, country, city, founded_year, logo_url) VALUES (?, ?, ?, ?, ?, ?)',
      [sport_id, team_name, country, city || null, founded_year || null, logo_url || '']
    );

    res.status(201).json({ success: true, message: 'Team created successfully.', team_id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// UPDATE team
const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sport_id, team_name, country, city, founded_year, logo_url } = req.body;

    const [result] = await db.query(
      'UPDATE teams SET sport_id = ?, team_name = ?, country = ?, city = ?, founded_year = ?, logo_url = ? WHERE team_id = ?',
      [sport_id, team_name, country, city, founded_year, logo_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Team not found.' });
    }

    res.json({ success: true, message: 'Team updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE team
const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM teams WHERE team_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Team not found.' });
    }

    res.json({ success: true, message: 'Team deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
};
