const db = require('../config/db');

// GET all coaches
const getAllCoaches = async (req, res, next) => {
  try {
    const { sport_id, search } = req.query;
    let query = `
      SELECT c.*, s.name AS sport_name, tm.team_name, tm.logo_url AS team_logo
      FROM coaches c
      JOIN sports s ON c.sport_id = s.sport_id
      LEFT JOIN teams tm ON c.team_id = tm.team_id
      WHERE 1=1
    `;
    const params = [];

    if (sport_id) {
      query += ` AND c.sport_id = ?`;
      params.push(sport_id);
    }
    if (search) {
      query += ` AND (c.name LIKE ? OR c.nationality LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY c.name ASC`;
    const [rows] = await db.query(query, params);
    res.json({ success: true, count: rows.length, coaches: rows });
  } catch (error) {
    next(error);
  }
};

// GET coach by ID
const getCoachById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT c.*, s.name AS sport_name, tm.team_name, tm.logo_url AS team_logo
       FROM coaches c
       JOIN sports s ON c.sport_id = s.sport_id
       LEFT JOIN teams tm ON c.team_id = tm.team_id
       WHERE c.coach_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Coach not found.' });
    }

    res.json({ success: true, coach: rows[0] });
  } catch (error) {
    next(error);
  }
};

// CREATE coach
const createCoach = async (req, res, next) => {
  try {
    const { sport_id, team_id, name, nationality, experience_years } = req.body;
    if (!sport_id || !name || !nationality) {
      return res.status(400).json({ success: false, message: 'Sport, name, and nationality are required.' });
    }

    const [result] = await db.query(
      'INSERT INTO coaches (sport_id, team_id, name, nationality, experience_years) VALUES (?, ?, ?, ?, ?)',
      [sport_id, team_id || null, name, nationality, experience_years || 0]
    );

    res.status(201).json({ success: true, message: 'Coach created successfully.', coach_id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// UPDATE coach
const updateCoach = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sport_id, team_id, name, nationality, experience_years } = req.body;

    const [result] = await db.query(
      'UPDATE coaches SET sport_id = ?, team_id = ?, name = ?, nationality = ?, experience_years = ? WHERE coach_id = ?',
      [sport_id, team_id || null, name, nationality, experience_years, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Coach not found.' });
    }

    res.json({ success: true, message: 'Coach updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE coach
const deleteCoach = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM coaches WHERE coach_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Coach not found.' });
    }

    res.json({ success: true, message: 'Coach deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach
};
