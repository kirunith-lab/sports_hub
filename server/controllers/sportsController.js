const db = require('../config/db');

// GET all sports
const getAllSports = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = `
      SELECT s.*, 
        COUNT(DISTINCT t.team_id) AS total_teams,
        COUNT(DISTINCT p.player_id) AS total_players,
        COUNT(DISTINCT tr.tournament_id) AS total_tournaments
      FROM sports s
      LEFT JOIN teams t ON s.sport_id = t.sport_id
      LEFT JOIN players p ON s.sport_id = p.sport_id
      LEFT JOIN tournaments tr ON s.sport_id = tr.sport_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND s.name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (category) {
      query += ` AND s.category = ?`;
      params.push(category);
    }

    query += ` GROUP BY s.sport_id ORDER BY s.name ASC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, count: rows.length, sports: rows });
  } catch (error) {
    next(error);
  }
};

// GET sport by ID with related teams, players, and tournaments
const getSportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [sports] = await db.query('SELECT * FROM sports WHERE sport_id = ?', [id]);
    if (sports.length === 0) {
      return res.status(404).json({ success: false, message: 'Sport not found.' });
    }

    const sport = sports[0];

    // Fetch related teams
    const [teams] = await db.query('SELECT * FROM teams WHERE sport_id = ? ORDER BY team_name ASC', [id]);

    // Fetch related players
    const [players] = await db.query('SELECT * FROM players WHERE sport_id = ? ORDER BY name ASC', [id]);

    // Fetch related tournaments
    const [tournaments] = await db.query('SELECT * FROM tournaments WHERE sport_id = ? ORDER BY start_date DESC', [id]);

    // Fetch recent matches
    const [matches] = await db.query(
      `SELECT m.*, t1.team_name AS team1_name, t1.logo_url AS team1_logo,
              t2.team_name AS team2_name, t2.logo_url AS team2_logo, v.venue_name
       FROM matches m
       JOIN teams t1 ON m.team1_id = t1.team_id
       JOIN teams t2 ON m.team2_id = t2.team_id
       JOIN venues v ON m.venue_id = v.venue_id
       WHERE m.sport_id = ?
       ORDER BY m.match_date DESC LIMIT 5`,
      [id]
    );

    res.json({
      success: true,
      sport: {
        ...sport,
        teams,
        players,
        tournaments,
        matches
      }
    });
  } catch (error) {
    next(error);
  }
};

// CREATE new sport
const createSport = async (req, res, next) => {
  try {
    const { name, description, category, icon_name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Sport name is required.' });
    }

    const [result] = await db.query(
      'INSERT INTO sports (name, description, category, icon_name) VALUES (?, ?, ?, ?)',
      [name, description || '', category || 'Team', icon_name || 'trophy']
    );

    res.status(201).json({
      success: true,
      message: 'Sport created successfully.',
      sport_id: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE sport
const updateSport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, icon_name } = req.body;

    const [result] = await db.query(
      'UPDATE sports SET name = ?, description = ?, category = ?, icon_name = ? WHERE sport_id = ?',
      [name, description, category, icon_name, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sport not found.' });
    }

    res.json({ success: true, message: 'Sport updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE sport
const deleteSport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM sports WHERE sport_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sport not found.' });
    }

    res.json({ success: true, message: 'Sport deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport
};
