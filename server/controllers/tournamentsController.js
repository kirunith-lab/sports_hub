const db = require('../config/db');

// GET all tournaments with status filtering
const getAllTournaments = async (req, res, next) => {
  try {
    const { sport_id, status, search } = req.query;
    let query = `
      SELECT t.*, s.name AS sport_name,
        COUNT(DISTINCT m.match_id) AS total_matches,
        COUNT(DISTINCT ts.team_id) AS total_participating_teams
      FROM tournaments t
      JOIN sports s ON t.sport_id = s.sport_id
      LEFT JOIN matches m ON t.tournament_id = m.tournament_id
      LEFT JOIN team_statistics ts ON t.tournament_id = ts.tournament_id
      WHERE 1=1
    `;
    const params = [];

    if (sport_id) {
      query += ` AND t.sport_id = ?`;
      params.push(sport_id);
    }
    if (status) {
      query += ` AND t.status = ?`;
      params.push(status);
    }
    if (search) {
      query += ` AND (t.tournament_name LIKE ? OR t.location LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY t.tournament_id ORDER BY t.start_date DESC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, count: rows.length, tournaments: rows });
  } catch (error) {
    next(error);
  }
};

// GET tournament details with matches and generated Points Table Standings
const getTournamentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [tournaments] = await db.query(
      `SELECT t.*, s.name AS sport_name
       FROM tournaments t
       JOIN sports s ON t.sport_id = s.sport_id
       WHERE t.tournament_id = ?`,
      [id]
    );

    if (tournaments.length === 0) {
      return res.status(404).json({ success: false, message: 'Tournament not found.' });
    }

    const tournament = tournaments[0];

    // Fetch Points Table / Standings generated dynamically from team_statistics
    const [standings] = await db.query(
      `SELECT ts.*, tm.team_name, tm.country, tm.logo_url
       FROM team_statistics ts
       JOIN teams tm ON ts.team_id = tm.team_id
       WHERE ts.tournament_id = ?
       ORDER BY ts.points DESC, ts.wins DESC, ts.matches_played ASC`,
      [id]
    );

    // Fetch matches for this tournament
    const [matches] = await db.query(
      `SELECT m.*, v.venue_name, v.city AS venue_city,
              t1.team_name AS team1_name, t1.logo_url AS team1_logo,
              t2.team_name AS team2_name, t2.logo_url AS team2_logo,
              w.team_name AS winner_name
       FROM matches m
       JOIN venues v ON m.venue_id = v.venue_id
       JOIN teams t1 ON m.team1_id = t1.team_id
       JOIN teams t2 ON m.team2_id = t2.team_id
       LEFT JOIN teams w ON m.winner_team_id = w.team_id
       WHERE m.tournament_id = ?
       ORDER BY m.match_date ASC, m.match_time ASC`,
      [id]
    );

    res.json({
      success: true,
      tournament: {
        ...tournament,
        standings,
        matches
      }
    });
  } catch (error) {
    next(error);
  }
};

// CREATE tournament
const createTournament = async (req, res, next) => {
  try {
    const { sport_id, tournament_name, start_date, end_date, location, status } = req.body;
    if (!sport_id || !tournament_name || !start_date || !end_date || !location) {
      return res.status(400).json({ success: false, message: 'Sport, name, start date, end date, and location are required.' });
    }

    const [result] = await db.query(
      'INSERT INTO tournaments (sport_id, tournament_name, start_date, end_date, location, status) VALUES (?, ?, ?, ?, ?, ?)',
      [sport_id, tournament_name, start_date, end_date, location, status || 'Upcoming']
    );

    res.status(201).json({ success: true, message: 'Tournament created successfully.', tournament_id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// UPDATE tournament
const updateTournament = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sport_id, tournament_name, start_date, end_date, location, status } = req.body;

    const [result] = await db.query(
      'UPDATE tournaments SET sport_id = ?, tournament_name = ?, start_date = ?, end_date = ?, location = ?, status = ? WHERE tournament_id = ?',
      [sport_id, tournament_name, start_date, end_date, location, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Tournament not found.' });
    }

    res.json({ success: true, message: 'Tournament updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE tournament
const deleteTournament = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM tournaments WHERE tournament_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Tournament not found.' });
    }

    res.json({ success: true, message: 'Tournament deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
};
