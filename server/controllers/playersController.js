const db = require('../config/db');

// GET all players with filtering & pagination
const getAllPlayers = async (req, res, next) => {
  try {
    const { sport_id, team_id, search, nationality, position } = req.query;
    let query = `
      SELECT p.*, s.name AS sport_name, tm.team_id, tm.team_name, tm.logo_url AS team_logo,
             tp.jersey_number
      FROM players p
      JOIN sports s ON p.sport_id = s.sport_id
      LEFT JOIN team_players tp ON p.player_id = tp.player_id AND tp.left_date IS NULL
      LEFT JOIN teams tm ON tp.team_id = tm.team_id
      WHERE 1=1
    `;
    const params = [];

    if (sport_id) {
      query += ` AND p.sport_id = ?`;
      params.push(sport_id);
    }
    if (team_id) {
      query += ` AND tm.team_id = ?`;
      params.push(team_id);
    }
    if (search) {
      query += ` AND (p.name LIKE ? OR p.position LIKE ? OR p.nationality LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (nationality) {
      query += ` AND p.nationality = ?`;
      params.push(nationality);
    }
    if (position) {
      query += ` AND p.position LIKE ?`;
      params.push(`%${position}%`);
    }

    query += ` ORDER BY p.name ASC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, count: rows.length, players: rows });
  } catch (error) {
    next(error);
  }
};

// GET player details by ID with career statistics and match performances
const getPlayerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [players] = await db.query(
      `SELECT p.*, s.name AS sport_name, tm.team_id, tm.team_name, tm.logo_url AS team_logo,
              tp.jersey_number, tp.joined_date
       FROM players p
       JOIN sports s ON p.sport_id = s.sport_id
       LEFT JOIN team_players tp ON p.player_id = tp.player_id AND tp.left_date IS NULL
       LEFT JOIN teams tm ON tp.team_id = tm.team_id
       WHERE p.player_id = ?`,
      [id]
    );

    if (players.length === 0) {
      return res.status(404).json({ success: false, message: 'Player not found.' });
    }

    const player = players[0];

    // Aggregated statistics summary
    const [statsSummary] = await db.query(
      `SELECT 
         COUNT(stat_id) AS total_matches_played,
         COALESCE(SUM(goals), 0) AS total_goals,
         COALESCE(SUM(runs), 0) AS total_runs,
         COALESCE(SUM(wickets), 0) AS total_wickets,
         COALESCE(SUM(points), 0) AS total_points,
         COALESCE(SUM(assists), 0) AS total_assists,
         ROUND(AVG(performance_rating), 2) AS avg_rating
       FROM player_statistics
       WHERE player_id = ?`,
      [id]
    );

    // Detailed match performance records
    const [matchStats] = await db.query(
      `SELECT ps.*, m.match_date, tr.tournament_name,
              t1.team_name AS team1_name, t2.team_name AS team2_name
       FROM player_statistics ps
       JOIN matches m ON ps.match_id = m.match_id
       JOIN tournaments tr ON m.tournament_id = tr.tournament_id
       JOIN teams t1 ON m.team1_id = t1.team_id
       JOIN teams t2 ON m.team2_id = t2.team_id
       WHERE ps.player_id = ?
       ORDER BY m.match_date DESC`,
      [id]
    );

    res.json({
      success: true,
      player: {
        ...player,
        summary: statsSummary[0],
        performances: matchStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// CREATE player
const createPlayer = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { sport_id, team_id, name, date_of_birth, nationality, gender, position, profile_image_url, jersey_number } = req.body;
    if (!sport_id || !name || !date_of_birth || !nationality) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Sport, name, DOB, and nationality are required.' });
    }

    const [result] = await connection.query(
      'INSERT INTO players (sport_id, name, date_of_birth, nationality, gender, position, profile_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sport_id, name, date_of_birth, nationality, gender || 'Male', position || '', profile_image_url || '']
    );

    const playerId = result.insertId;

    // If team_id is provided, associate player in team_players junction table
    if (team_id) {
      await connection.query(
        'INSERT INTO team_players (team_id, player_id, jersey_number, joined_date) VALUES (?, ?, ?, CURDATE())',
        [team_id, playerId, jersey_number || 10]
      );
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Player created successfully.', player_id: playerId });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// UPDATE player
const updatePlayer = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const { sport_id, team_id, name, date_of_birth, nationality, gender, position, profile_image_url, jersey_number } = req.body;

    const [result] = await connection.query(
      'UPDATE players SET sport_id = ?, name = ?, date_of_birth = ?, nationality = ?, gender = ?, position = ?, profile_image_url = ? WHERE player_id = ?',
      [sport_id, name, date_of_birth, nationality, gender, position, profile_image_url, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Player not found.' });
    }

    // Update team assignment if team_id provided
    if (team_id) {
      // Remove old active team links
      await connection.query('DELETE FROM team_players WHERE player_id = ?', [id]);
      // Insert new team link
      await connection.query(
        'INSERT INTO team_players (team_id, player_id, jersey_number, joined_date) VALUES (?, ?, ?, CURDATE())',
        [team_id, id, jersey_number || 10]
      );
    }

    await connection.commit();
    res.json({ success: true, message: 'Player updated successfully.' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// DELETE player
const deletePlayer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM players WHERE player_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Player not found.' });
    }

    res.json({ success: true, message: 'Player deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};
