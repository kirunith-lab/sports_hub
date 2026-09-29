const db = require('../config/db');

// GET aggregated stats for Admin Dashboard & Public Analytics charts
const getDashboardStats = async (req, res, next) => {
  try {
    const [counts] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM sports) AS total_sports,
        (SELECT COUNT(*) FROM teams) AS total_teams,
        (SELECT COUNT(*) FROM players) AS total_players,
        (SELECT COUNT(*) FROM tournaments) AS total_tournaments,
        (SELECT COUNT(*) FROM matches) AS total_matches,
        (SELECT COUNT(*) FROM matches WHERE status = 'Scheduled') AS upcoming_matches,
        (SELECT COUNT(*) FROM matches WHERE status = 'Completed') AS completed_matches,
        (SELECT COUNT(*) FROM users) AS total_users
    `);

    // Chart Data 1: Teams distribution per Sport
    const [teamsBySport] = await db.query(`
      SELECT s.name AS sport, COUNT(t.team_id) AS count
      FROM sports s
      LEFT JOIN teams t ON s.sport_id = t.sport_id
      GROUP BY s.sport_id, s.name
      ORDER BY count DESC
    `);

    // Chart Data 2: Matches distribution per Sport
    const [matchesBySport] = await db.query(`
      SELECT s.name AS sport, COUNT(m.match_id) AS count
      FROM sports s
      LEFT JOIN matches m ON s.sport_id = m.sport_id
      GROUP BY s.sport_id, s.name
      ORDER BY count DESC
    `);

    // Chart Data 3: Top 5 performing players across all sports
    const [topPlayers] = await db.query(`
      SELECT p.player_id, p.name, s.name AS sport, ROUND(AVG(ps.performance_rating), 1) AS rating,
             SUM(ps.goals) AS goals, SUM(ps.runs) AS runs, SUM(ps.points) AS points
      FROM player_statistics ps
      JOIN players p ON ps.player_id = p.player_id
      JOIN sports s ON p.sport_id = s.sport_id
      GROUP BY p.player_id, p.name, s.name
      ORDER BY rating DESC, points DESC
      LIMIT 5
    `);

    // Chart Data 4: Tournament Participation count
    const [tournamentsSummary] = await db.query(`
      SELECT t.tournament_name AS tournament, COUNT(ts.team_id) AS teams_count
      FROM tournaments t
      LEFT JOIN team_statistics ts ON t.tournament_id = ts.tournament_id
      GROUP BY t.tournament_id, t.tournament_name
    `);

    res.json({
      success: true,
      metrics: counts[0],
      charts: {
        teamsBySport,
        matchesBySport,
        topPlayers,
        tournamentsSummary
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET player match statistics list
const getPlayerStats = async (req, res, next) => {
  try {
    const { player_id, match_id } = req.query;
    let query = `
      SELECT ps.*, p.name AS player_name, s.name AS sport_name, m.match_date,
             t1.team_name AS team1_name, t2.team_name AS team2_name
      FROM player_statistics ps
      JOIN players p ON ps.player_id = p.player_id
      JOIN sports s ON p.sport_id = s.sport_id
      JOIN matches m ON ps.match_id = m.match_id
      JOIN teams t1 ON m.team1_id = t1.team_id
      JOIN teams t2 ON m.team2_id = t2.team_id
      WHERE 1=1
    `;
    const params = [];

    if (player_id) {
      query += ` AND ps.player_id = ?`;
      params.push(player_id);
    }
    if (match_id) {
      query += ` AND ps.match_id = ?`;
      params.push(match_id);
    }

    query += ` ORDER BY ps.created_at DESC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, count: rows.length, statistics: rows });
  } catch (error) {
    next(error);
  }
};

// CREATE player match stat
const createPlayerStat = async (req, res, next) => {
  try {
    const { player_id, match_id, points, assists, goals, wickets, runs, performance_rating } = req.body;
    if (!player_id || !match_id) {
      return res.status(400).json({ success: false, message: 'Player ID and Match ID are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO player_statistics (player_id, match_id, points, assists, goals, wickets, runs, performance_rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [player_id, match_id, points || 0, assists || 0, goals || 0, wickets || 0, runs || 0, performance_rating || 7.0]
    );

    res.status(201).json({ success: true, message: 'Player statistics recorded successfully.', stat_id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// UPDATE player match stat
const updatePlayerStat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { points, assists, goals, wickets, runs, performance_rating } = req.body;

    const [result] = await db.query(
      `UPDATE player_statistics 
       SET points = ?, assists = ?, goals = ?, wickets = ?, runs = ?, performance_rating = ?
       WHERE stat_id = ?`,
      [points, assists, goals, wickets, runs, performance_rating, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Statistic record not found.' });
    }

    res.json({ success: true, message: 'Player statistic updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE player match stat
const deletePlayerStat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM player_statistics WHERE stat_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Statistic record not found.' });
    }

    res.json({ success: true, message: 'Player statistic deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getPlayerStats,
  createPlayerStat,
  updatePlayerStat,
  deletePlayerStat
};
