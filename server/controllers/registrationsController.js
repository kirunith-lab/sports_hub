const db = require('../config/db');

// GET all registrations
const getAllRegistrations = async (req, res, next) => {
  try {
    const { tournament_id, team_id, status } = req.query;
    let query = `
      SELECT r.*, tr.tournament_name, s.name AS sport_name,
             tm.team_name, tm.country AS team_country, tm.logo_url AS team_logo
      FROM registrations r
      JOIN tournaments tr ON r.tournament_id = tr.tournament_id
      JOIN sports s ON tr.sport_id = s.sport_id
      JOIN teams tm ON r.team_id = tm.team_id
      WHERE 1=1
    `;
    const params = [];

    if (tournament_id) {
      query += ` AND r.tournament_id = ?`;
      params.push(tournament_id);
    }
    if (team_id) {
      query += ` AND r.team_id = ?`;
      params.push(team_id);
    }
    if (status) {
      query += ` AND r.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY r.registration_date DESC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, count: rows.length, registrations: rows });
  } catch (error) {
    next(error);
  }
};

// CREATE tournament registration (Team → Tournament)
const createRegistration = async (req, res, next) => {
  try {
    const { tournament_id, team_id, registration_date, status, notes } = req.body;

    if (!tournament_id || !team_id) {
      return res.status(400).json({ success: false, message: 'Tournament ID and Team ID are required.' });
    }

    // Check for duplicate registration
    const [existing] = await db.query(
      'SELECT registration_id FROM registrations WHERE tournament_id = ? AND team_id = ?',
      [tournament_id, team_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'This team is already registered for the selected tournament.' });
    }

    const regDate = registration_date || new Date().toISOString().substring(0, 10);

    const [result] = await db.query(
      'INSERT INTO registrations (tournament_id, team_id, registration_date, status, notes) VALUES (?, ?, ?, ?, ?)',
      [tournament_id, team_id, regDate, status || 'Approved', notes || '']
    );

    // Ensure team_statistics record exists for standings
    await db.query(
      `INSERT INTO team_statistics (team_id, tournament_id, matches_played, wins, losses, draws, points)
       VALUES (?, ?, 0, 0, 0, 0, 0)
       ON DUPLICATE KEY UPDATE team_id = team_id`,
      [team_id, tournament_id]
    );

    res.status(201).json({ success: true, message: 'Tournament team registration created successfully.', registration_id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// UPDATE registration status
const updateRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const [result] = await db.query(
      'UPDATE registrations SET status = ?, notes = ? WHERE registration_id = ?',
      [status, notes, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Registration record not found.' });
    }

    res.json({ success: true, message: 'Registration record updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE registration
const deleteRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM registrations WHERE registration_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Registration record not found.' });
    }

    res.json({ success: true, message: 'Registration deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRegistrations,
  createRegistration,
  updateRegistration,
  deleteRegistration
};
