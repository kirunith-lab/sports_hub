const db = require('../config/db');

// GET matches with advanced filters (sport, tournament, status, date range)
const getAllMatches = async (req, res, next) => {
  try {
    const { sport_id, tournament_id, status, date, upcoming, completed } = req.query;
    let query = `
      SELECT m.*, s.name AS sport_name, tr.tournament_name, v.venue_name, v.city AS venue_city,
             t1.team_name AS team1_name, t1.logo_url AS team1_logo,
             t2.team_name AS team2_name, t2.logo_url AS team2_logo,
             w.team_name AS winner_name
      FROM matches m
      JOIN sports s ON m.sport_id = s.sport_id
      JOIN tournaments tr ON m.tournament_id = tr.tournament_id
      JOIN venues v ON m.venue_id = v.venue_id
      JOIN teams t1 ON m.team1_id = t1.team_id
      JOIN teams t2 ON m.team2_id = t2.team_id
      LEFT JOIN teams w ON m.winner_team_id = w.team_id
      WHERE 1=1
    `;
    const params = [];

    if (sport_id) {
      query += ` AND m.sport_id = ?`;
      params.push(sport_id);
    }
    if (tournament_id) {
      query += ` AND m.tournament_id = ?`;
      params.push(tournament_id);
    }
    if (status) {
      query += ` AND m.status = ?`;
      params.push(status);
    }
    if (upcoming === 'true') {
      query += ` AND m.status = 'Scheduled'`;
    }
    if (completed === 'true') {
      query += ` AND m.status = 'Completed'`;
    }
    if (date) {
      query += ` AND m.match_date = ?`;
      params.push(date);
    }

    query += ` ORDER BY m.match_date DESC, m.match_time DESC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, count: rows.length, matches: rows });
  } catch (error) {
    next(error);
  }
};

// GET match by ID with team player stats
const getMatchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [matches] = await db.query(
      `SELECT m.*, s.name AS sport_name, tr.tournament_name, v.venue_name, v.city AS venue_city, v.country AS venue_country,
              t1.team_name AS team1_name, t1.logo_url AS team1_logo, t1.country AS team1_country,
              t2.team_name AS team2_name, t2.logo_url AS team2_logo, t2.country AS team2_country,
              w.team_name AS winner_name
       FROM matches m
       JOIN sports s ON m.sport_id = s.sport_id
       JOIN tournaments tr ON m.tournament_id = tr.tournament_id
       JOIN venues v ON m.venue_id = v.venue_id
       JOIN teams t1 ON m.team1_id = t1.team_id
       JOIN teams t2 ON m.team2_id = t2.team_id
       LEFT JOIN teams w ON m.winner_team_id = w.team_id
       WHERE m.match_id = ?`,
      [id]
    );

    if (matches.length === 0) {
      return res.status(404).json({ success: false, message: 'Match not found.' });
    }

    const match = matches[0];

    // Fetch player statistics recorded for this specific match
    const [playerStats] = await db.query(
      `SELECT ps.*, p.name AS player_name, p.position, p.profile_image_url,
              tm.team_name, tm.logo_url AS team_logo, tp.jersey_number
       FROM player_statistics ps
       JOIN players p ON ps.player_id = p.player_id
       LEFT JOIN team_players tp ON p.player_id = tp.player_id AND tp.left_date IS NULL
       LEFT JOIN teams tm ON tp.team_id = tm.team_id
       WHERE ps.match_id = ?
       ORDER BY tm.team_name, ps.performance_rating DESC`,
      [id]
    );

    res.json({
      success: true,
      match: {
        ...match,
        player_statistics: playerStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// CREATE match with validation
const createMatch = async (req, res, next) => {
  try {
    const { tournament_id, sport_id, team1_id, team2_id, venue_id, match_date, match_time, team1_score, team2_score, status } = req.body;

    if (!tournament_id || !sport_id || !team1_id || !team2_id || !venue_id || !match_date || !match_time) {
      return res.status(400).json({ success: false, message: 'All match parameters (tournament, sport, teams, venue, date, time) are required.' });
    }

    if (parseInt(team1_id) === parseInt(team2_id)) {
      return res.status(400).json({ success: false, message: 'Team 1 and Team 2 must be different teams.' });
    }

    let winner_team_id = null;
    const s1 = parseInt(team1_score || 0);
    const s2 = parseInt(team2_score || 0);
    if (status === 'Completed') {
      if (s1 > s2) winner_team_id = team1_id;
      else if (s2 > s1) winner_team_id = team2_id;
    }

    const [result] = await db.query(
      `INSERT INTO matches 
       (tournament_id, sport_id, team1_id, team2_id, venue_id, match_date, match_time, team1_score, team2_score, status, winner_team_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tournament_id, sport_id, team1_id, team2_id, venue_id, match_date, match_time, s1, s2, status || 'Scheduled', winner_team_id]
    );

    res.status(201).json({ success: true, message: 'Match created successfully.', match_id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// UPDATE match and recalculate team statistics transactionally
const updateMatch = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const { tournament_id, sport_id, team1_id, team2_id, venue_id, match_date, match_time, team1_score, team2_score, status } = req.body;

    if (parseInt(team1_id) === parseInt(team2_id)) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Team 1 and Team 2 must be different teams.' });
    }

    let winner_team_id = null;
    const s1 = parseInt(team1_score || 0);
    const s2 = parseInt(team2_score || 0);

    if (status === 'Completed') {
      if (s1 > s2) winner_team_id = team1_id;
      else if (s2 > s1) winner_team_id = team2_id;
    }

    const [result] = await connection.query(
      `UPDATE matches 
       SET tournament_id = ?, sport_id = ?, team1_id = ?, team2_id = ?, venue_id = ?, 
           match_date = ?, match_time = ?, team1_score = ?, team2_score = ?, status = ?, winner_team_id = ?
       WHERE match_id = ?`,
      [tournament_id, sport_id, team1_id, team2_id, venue_id, match_date, match_time, s1, s2, status, winner_team_id, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Match not found.' });
    }

    // Auto-update team_statistics if match is marked Completed
    if (status === 'Completed') {
      // Ensure team_statistics record exists for team1
      await connection.query(
        `INSERT INTO team_statistics (team_id, tournament_id, matches_played, wins, losses, draws, points)
         VALUES (?, ?, 0, 0, 0, 0, 0)
         ON DUPLICATE KEY UPDATE team_id = team_id`,
        [team1_id, tournament_id]
      );
      // Ensure team_statistics record exists for team2
      await connection.query(
        `INSERT INTO team_statistics (team_id, tournament_id, matches_played, wins, losses, draws, points)
         VALUES (?, ?, 0, 0, 0, 0, 0)
         ON DUPLICATE KEY UPDATE team_id = team_id`,
        [team2_id, tournament_id]
      );

      // Re-calculate aggregated team stats for this tournament
      const updateTeamStat = async (teamId) => {
        const [stats] = await connection.query(
          `SELECT 
             COUNT(match_id) AS played,
             SUM(CASE WHEN winner_team_id = ? THEN 1 ELSE 0 END) AS wins,
             SUM(CASE WHEN winner_team_id IS NOT NULL AND winner_team_id <> ? THEN 1 ELSE 0 END) AS losses,
             SUM(CASE WHEN winner_team_id IS NULL AND status = 'Completed' THEN 1 ELSE 0 END) AS draws
           FROM matches
           WHERE tournament_id = ? AND status = 'Completed' AND (team1_id = ? OR team2_id = ?)`,
          [teamId, teamId, tournament_id, teamId, teamId]
        );

        const row = stats[0];
        const played = row.played || 0;
        const wins = row.wins || 0;
        const losses = row.losses || 0;
        const draws = row.draws || 0;
        const points = (wins * 2) + draws; // 2 pts for win, 1 pt for draw

        await connection.query(
          `UPDATE team_statistics 
           SET matches_played = ?, wins = ?, losses = ?, draws = ?, points = ?
           WHERE team_id = ? AND tournament_id = ?`,
          [played, wins, losses, draws, points, teamId, tournament_id]
        );
      };

      await updateTeamStat(team1_id);
      await updateTeamStat(team2_id);
    }

    await connection.commit();
    res.json({ success: true, message: 'Match and tournament standings updated successfully.' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// DELETE match
const deleteMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM matches WHERE match_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Match not found.' });
    }

    res.json({ success: true, message: 'Match deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
};
