-- ============================================================================
-- SportsHub Sample SQL Queries Demonstrating DBMS Concepts
-- Useful for Academic Viva & Schema Verification
-- ============================================================================

USE sportshub_db;

-- 1. List all teams for a specific sport (e.g. Cricket)
SELECT tm.team_id, tm.team_name, tm.country, tm.city, tm.founded_year 
FROM teams tm
JOIN sports s ON tm.sport_id = s.sport_id
WHERE s.name = 'Cricket';

-- 2. List players belonging to a team with their jersey numbers
SELECT p.player_id, p.name, p.position, p.nationality, tp.jersey_number, tp.joined_date
FROM players p
JOIN team_players tp ON p.player_id = tp.player_id
JOIN teams tm ON tp.team_id = tm.team_id
WHERE tm.team_name = 'Mumbai Indians' AND tp.left_date IS NULL;

-- 3. Find all upcoming scheduled matches with venue and sport details
SELECT m.match_id, s.name AS sport_name, t1.team_name AS team1, t2.team_name AS team2, 
       v.venue_name, v.city, m.match_date, m.match_time
FROM matches m
JOIN sports s ON m.sport_id = s.sport_id
JOIN teams t1 ON m.team1_id = t1.team_id
JOIN teams t2 ON m.team2_id = t2.team_id
JOIN venues v ON m.venue_id = v.venue_id
WHERE m.status = 'Scheduled' AND m.match_date >= CURDATE()
ORDER BY m.match_date ASC;

-- 4. Find completed matches with winner details
SELECT m.match_id, t.tournament_name, t1.team_name AS team1, m.team1_score,
       t2.team_name AS team2, m.team2_score, w.team_name AS winner
FROM matches m
JOIN tournaments t ON m.tournament_id = t.tournament_id
JOIN teams t1 ON m.team1_id = t1.team_id
JOIN teams t2 ON m.team2_id = t2.team_id
LEFT JOIN teams w ON m.winner_team_id = w.team_id
WHERE m.status = 'Completed'
ORDER BY m.match_date DESC;

-- 5. Find top-performing players sorted by performance rating
SELECT p.name AS player_name, s.name AS sport_name, ROUND(AVG(ps.performance_rating), 2) AS avg_rating,
       SUM(ps.goals) AS goals, SUM(ps.runs) AS runs, SUM(ps.points) AS points
FROM player_statistics ps
JOIN players p ON ps.player_id = p.player_id
JOIN sports s ON p.sport_id = s.sport_id
GROUP BY p.player_id, p.name, s.name
HAVING COUNT(ps.match_id) > 0
ORDER BY avg_rating DESC, points DESC
LIMIT 10;

-- 6. Calculate total matches played by each team across all tournaments
SELECT tm.team_name, s.name AS sport_name, COALESCE(SUM(ts.matches_played), 0) AS total_matches
FROM teams tm
JOIN sports s ON tm.sport_id = s.sport_id
LEFT JOIN team_statistics ts ON tm.team_id = ts.team_id
GROUP BY tm.team_id, tm.team_name, s.name
ORDER BY total_matches DESC;

-- 7. Calculate wins, losses, draws and overall win percentage for each team
SELECT tm.team_name, 
       SUM(ts.matches_played) AS total_played,
       SUM(ts.wins) AS wins,
       SUM(ts.losses) AS losses,
       SUM(ts.draws) AS draws,
       ROUND((SUM(ts.wins) / NULLIF(SUM(ts.matches_played), 0)) * 100, 2) AS win_percentage
FROM teams tm
JOIN team_statistics ts ON tm.team_id = ts.team_id
GROUP BY tm.team_id, tm.team_name
ORDER BY win_percentage DESC;

-- 8. Generate tournament standings (Points Table) for a tournament
SELECT tm.team_name, ts.matches_played, ts.wins, ts.losses, ts.draws, ts.points
FROM team_statistics ts
JOIN teams tm ON ts.team_id = tm.team_id
WHERE ts.tournament_id = 1
ORDER BY ts.points DESC, ts.wins DESC;

-- 9. Count teams grouped by sport
SELECT s.name AS sport_name, COUNT(t.team_id) AS total_teams
FROM sports s
LEFT JOIN teams t ON s.sport_id = t.sport_id
GROUP BY s.sport_id, s.name;

-- 10. Count players grouped by sport and gender
SELECT s.name AS sport_name, p.gender, COUNT(p.player_id) AS total_players
FROM sports s
JOIN players p ON s.sport_id = p.sport_id
GROUP BY s.sport_id, s.name, p.gender;

-- 11. Find teams with the highest number of total wins
SELECT tm.team_name, s.name AS sport_name, SUM(ts.wins) AS total_wins
FROM teams tm
JOIN sports s ON tm.sport_id = s.sport_id
JOIN team_statistics ts ON tm.team_id = ts.team_id
GROUP BY tm.team_id, tm.team_name, s.name
ORDER BY total_wins DESC
LIMIT 5;

-- 12. Search players by name or position pattern
SELECT p.player_id, p.name, p.nationality, p.position, s.name AS sport_name
FROM players p
JOIN sports s ON p.sport_id = s.sport_id
WHERE p.name LIKE '%Virat%' OR p.position LIKE '%Forward%';

-- 13. Search teams by name or country
SELECT tm.team_id, tm.team_name, tm.country, tm.city, s.name AS sport_name
FROM teams tm
JOIN sports s ON tm.sport_id = s.sport_id
WHERE tm.team_name LIKE '%Real%' OR tm.country = 'India';

-- 14. Retrieve complete match details using multi-table INNER and LEFT JOINs
SELECT m.match_id, m.match_date, s.name AS sport_name, tr.tournament_name,
       v.venue_name, v.city AS venue_city,
       t1.team_name AS team1, m.team1_score,
       t2.team_name AS team2, m.team2_score,
       COALESCE(tw.team_name, 'Draw / TBD') AS winner
FROM matches m
JOIN sports s ON m.sport_id = s.sport_id
JOIN tournaments tr ON m.tournament_id = tr.tournament_id
JOIN venues v ON m.venue_id = v.venue_id
JOIN teams t1 ON m.team1_id = t1.team_id
JOIN teams t2 ON m.team2_id = t2.team_id
LEFT JOIN teams tw ON m.winner_team_id = tw.team_id
WHERE m.match_id = 1;

-- 15. Retrieve player statistics in a match using JOINs
SELECT p.name AS player_name, tm.team_name, ps.runs, ps.wickets, ps.goals, ps.assists, ps.points, ps.performance_rating
FROM player_statistics ps
JOIN players p ON ps.player_id = p.player_id
JOIN team_players tp ON p.player_id = tp.player_id AND tp.left_date IS NULL
JOIN teams tm ON tp.team_id = tm.team_id
WHERE ps.match_id = 1;

-- 16. Retrieve tournament summary statistics (total matches, total points, ongoing status)
SELECT tr.tournament_id, tr.tournament_name, s.name AS sport_name,
       COUNT(DISTINCT m.match_id) AS total_matches_scheduled,
       SUM(CASE WHEN m.status = 'Completed' THEN 1 ELSE 0 END) AS completed_matches,
       COUNT(DISTINCT ts.team_id) AS participating_teams
FROM tournaments tr
JOIN sports s ON tr.sport_id = s.sport_id
LEFT JOIN matches m ON tr.tournament_id = m.tournament_id
LEFT JOIN team_statistics ts ON tr.tournament_id = ts.tournament_id
GROUP BY tr.tournament_id, tr.tournament_name, s.name;
