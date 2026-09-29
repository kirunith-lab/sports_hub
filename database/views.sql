-- ============================================================================
-- SportsHub Views Definition (MySQL 8.0)
-- Custom relational views for complex aggregations and standings
-- ============================================================================

USE sportshub_db;

-- 1. View for Tournament Standings / Points Table
CREATE OR REPLACE VIEW v_tournament_standings AS
SELECT 
    ts.tournament_id,
    t.tournament_name,
    s.name AS sport_name,
    tm.team_id,
    tm.team_name,
    tm.logo_url,
    ts.matches_played,
    ts.wins,
    ts.losses,
    ts.draws,
    ts.points
FROM team_statistics ts
JOIN teams tm ON ts.team_id = tm.team_id
JOIN tournaments t ON ts.tournament_id = t.tournament_id
JOIN sports s ON t.sport_id = s.sport_id
ORDER BY ts.tournament_id, ts.points DESC, ts.wins DESC;

-- 2. View for Detailed Match Overview (joining teams, venue, tournament, sport)
CREATE OR REPLACE VIEW v_match_details AS
SELECT 
    m.match_id,
    m.match_date,
    m.match_time,
    m.status,
    m.team1_score,
    m.team2_score,
    s.sport_id,
    s.name AS sport_name,
    t.tournament_id,
    t.tournament_name,
    v.venue_id,
    v.venue_name,
    v.city AS venue_city,
    t1.team_id AS team1_id,
    t1.team_name AS team1_name,
    t1.logo_url AS team1_logo,
    t2.team_id AS team2_id,
    t2.team_name AS team2_name,
    t2.logo_url AS team2_logo,
    w.team_id AS winner_team_id,
    w.team_name AS winner_team_name
FROM matches m
JOIN sports s ON m.sport_id = s.sport_id
JOIN tournaments t ON m.tournament_id = t.tournament_id
JOIN venues v ON m.venue_id = v.venue_id
JOIN teams t1 ON m.team1_id = t1.team_id
JOIN teams t2 ON m.team2_id = t2.team_id
LEFT JOIN teams w ON m.winner_team_id = w.team_id;

-- 3. View for Top Player Leaderboard across all matches
CREATE OR REPLACE VIEW v_player_leaderboard AS
SELECT 
    p.player_id,
    p.name AS player_name,
    p.nationality,
    p.position,
    s.name AS sport_name,
    tm.team_name,
    COUNT(ps.match_id) AS matches_played,
    SUM(ps.goals) AS total_goals,
    SUM(ps.runs) AS total_runs,
    SUM(ps.wickets) AS total_wickets,
    SUM(ps.points) AS total_points,
    SUM(ps.assists) AS total_assists,
    ROUND(AVG(ps.performance_rating), 2) AS avg_rating
FROM players p
JOIN sports s ON p.sport_id = s.sport_id
LEFT JOIN team_players tp ON p.player_id = tp.player_id AND tp.left_date IS NULL
LEFT JOIN teams tm ON tp.team_id = tm.team_id
LEFT JOIN player_statistics ps ON p.player_id = ps.player_id
GROUP BY p.player_id, p.name, p.nationality, p.position, s.name, tm.team_name;

-- 4. View for Team Summary & Win Ratios
CREATE OR REPLACE VIEW v_team_summary AS
SELECT 
    tm.team_id,
    tm.team_name,
    tm.country,
    tm.city,
    tm.founded_year,
    tm.logo_url,
    s.sport_id,
    s.name AS sport_name,
    c.name AS coach_name,
    COUNT(DISTINCT tp.player_id) AS squad_size,
    COALESCE(SUM(ts.matches_played), 0) AS total_matches,
    COALESCE(SUM(ts.wins), 0) AS total_wins,
    COALESCE(SUM(ts.losses), 0) AS total_losses,
    COALESCE(SUM(ts.draws), 0) AS total_draws,
    COALESCE(SUM(ts.points), 0) AS total_points
FROM teams tm
JOIN sports s ON tm.sport_id = s.sport_id
LEFT JOIN coaches c ON tm.team_id = c.team_id
LEFT JOIN team_players tp ON tm.team_id = tp.team_id AND tp.left_date IS NULL
LEFT JOIN team_statistics ts ON tm.team_id = ts.team_id
GROUP BY tm.team_id, tm.team_name, tm.country, tm.city, tm.founded_year, tm.logo_url, s.sport_id, s.name, c.name;
