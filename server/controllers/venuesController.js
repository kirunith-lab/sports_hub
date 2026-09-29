const db = require('../config/db');

// GET all venues
const getAllVenues = async (req, res, next) => {
  try {
    const { search, city, country } = req.query;
    let query = `
      SELECT v.*, COUNT(m.match_id) AS total_hosted_matches
      FROM venues v
      LEFT JOIN matches m ON v.venue_id = m.venue_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (v.venue_name LIKE ? OR v.city LIKE ? OR v.country LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (city) {
      query += ` AND v.city = ?`;
      params.push(city);
    }
    if (country) {
      query += ` AND v.country = ?`;
      params.push(country);
    }

    query += ` GROUP BY v.venue_id ORDER BY v.venue_name ASC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, count: rows.length, venues: rows });
  } catch (error) {
    next(error);
  }
};

// GET venue by ID with hosted match history
const getVenueById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [venues] = await db.query('SELECT * FROM venues WHERE venue_id = ?', [id]);
    if (venues.length === 0) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }

    const venue = venues[0];

    const [matches] = await db.query(
      `SELECT m.*, s.name AS sport_name, tr.tournament_name,
              t1.team_name AS team1_name, t1.logo_url AS team1_logo,
              t2.team_name AS team2_name, t2.logo_url AS team2_logo
       FROM matches m
       JOIN sports s ON m.sport_id = s.sport_id
       JOIN tournaments tr ON m.tournament_id = tr.tournament_id
       JOIN teams t1 ON m.team1_id = t1.team_id
       JOIN teams t2 ON m.team2_id = t2.team_id
       WHERE m.venue_id = ?
       ORDER BY m.match_date DESC`,
      [id]
    );

    res.json({
      success: true,
      venue: {
        ...venue,
        matches
      }
    });
  } catch (error) {
    next(error);
  }
};

// CREATE venue
const createVenue = async (req, res, next) => {
  try {
    const { venue_name, city, country, capacity, image_url } = req.body;
    if (!venue_name || !city || !country) {
      return res.status(400).json({ success: false, message: 'Venue name, city, and country are required.' });
    }

    const [result] = await db.query(
      'INSERT INTO venues (venue_name, city, country, capacity, image_url) VALUES (?, ?, ?, ?, ?)',
      [venue_name, city, country, capacity || 20000, image_url || '']
    );

    res.status(201).json({ success: true, message: 'Venue created successfully.', venue_id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// UPDATE venue
const updateVenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { venue_name, city, country, capacity, image_url } = req.body;

    const [result] = await db.query(
      'UPDATE venues SET venue_name = ?, city = ?, country = ?, capacity = ?, image_url = ? WHERE venue_id = ?',
      [venue_name, city, country, capacity, image_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }

    res.json({ success: true, message: 'Venue updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE venue
const deleteVenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM venues WHERE venue_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }

    res.json({ success: true, message: 'Venue deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue
};
