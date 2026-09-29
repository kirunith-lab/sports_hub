-- ============================================================================
-- SportsHub Sample Seed Data (MySQL 8.0)
-- Population script with realistic sports, teams, players, matches & stats
-- ============================================================================

USE sportshub_db;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE player_statistics;
TRUNCATE TABLE team_statistics;
TRUNCATE TABLE matches;
TRUNCATE TABLE team_players;
TRUNCATE TABLE coaches;
TRUNCATE TABLE players;
TRUNCATE TABLE tournaments;
TRUNCATE TABLE venues;
TRUNCATE TABLE teams;
TRUNCATE TABLE sports;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. USERS (Pass: admin123 / user123 hashed using bcrypt)
-- ----------------------------------------------------------------------------
INSERT INTO users (name, email, password_hash, role) VALUES
('System Administrator', 'admin@sportshub.com', '$2a$10$WqN1xI7O01Hk12wXF8xW..hZ/L63R1Qx/1fX98l.wA1S0H0E2yq standard', 'admin'),
('John Doe', 'user@sportshub.com', '$2a$10$WqN1xI7O01Hk12wXF8xW..hZ/L63R1Qx/1fX98l.wA1S0H0E2yq standard', 'user'),
('Sports Analyst', 'analyst@sportshub.com', '$2a$10$WqN1xI7O01Hk12wXF8xW..hZ/L63R1Qx/1fX98l.wA1S0H0E2yq standard', 'user');

-- Note: The actual bcrypt hash for 'admin123' and 'user123' will be updated properly by the node dbInit script if needed.

-- ----------------------------------------------------------------------------
-- 2. SPORTS
-- ----------------------------------------------------------------------------
INSERT INTO sports (sport_id, name, description, category, icon_name) VALUES
(1, 'Cricket', 'Bat-and-ball game played between two teams of eleven players on a field with a 22-yard pitch.', 'Team', 'activity'),
(2, 'Football', 'Global team sport played with a spherical ball between two teams of 11 players.', 'Team', 'dribbble'),
(3, 'Basketball', 'High-paced game played on a rectangular court where teams score by shooting a ball through a hoop.', 'Team', 'target'),
(4, 'Tennis', 'Racquet sport played individually against a single opponent or between two teams of two players.', 'Racquet', 'award');

-- ----------------------------------------------------------------------------
-- 3. TEAMS
-- ----------------------------------------------------------------------------
INSERT INTO teams (team_id, sport_id, team_name, country, city, founded_year, logo_url) VALUES
-- Cricket Teams
(1, 1, 'Mumbai Indians', 'India', 'Mumbai', 2008, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80'),
(2, 1, 'Chennai Super Kings', 'India', 'Chennai', 2008, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80'),
(3, 1, 'Royal Challengers Bengaluru', 'India', 'Bengaluru', 2008, 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=400&q=80'),
(4, 1, 'Australia National Team', 'Australia', 'Sydney', 1877, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80'),

-- Football Teams
(5, 2, 'Real Madrid', 'Spain', 'Madrid', 1902, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80'),
(6, 2, 'FC Barcelona', 'Spain', 'Barcelona', 1899, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80'),
(7, 2, 'Manchester City', 'England', 'Manchester', 1880, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80'),
(8, 2, 'Arsenal FC', 'England', 'London', 1886, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80'),

-- Basketball Teams
(9, 3, 'Los Angeles Lakers', 'USA', 'Los Angeles', 1947, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80'),
(10, 3, 'Golden State Warriors', 'USA', 'San Francisco', 1946, 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=400&q=80'),

-- Tennis Clubs / Representatives
(11, 4, 'Wimbledon Club Elite', 'United Kingdom', 'London', 1868, 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=400&q=80'),
(12, 4, 'Roland Garros Academy', 'France', 'Paris', 1891, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80');

-- ----------------------------------------------------------------------------
-- 4. PLAYERS
-- ----------------------------------------------------------------------------
INSERT INTO players (player_id, sport_id, name, date_of_birth, nationality, gender, position, profile_image_url) VALUES
-- Cricket Players
(1, 1, 'Rohit Sharma', '1987-04-30', 'India', 'Male', 'Right-handed Batsman', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
(2, 1, 'Jasprit Bumrah', '1993-12-06', 'India', 'Male', 'Fast Bowler', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
(3, 1, 'MS Dhoni', '1981-07-07', 'India', 'Male', 'Wicketkeeper Batsman', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
(4, 1, 'Ravindra Jadeja', '1988-12-06', 'India', 'Male', 'All-Rounder', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'),
(5, 1, 'Virat Kohli', '1988-11-05', 'India', 'Male', 'Top-order Batsman', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'),
(6, 1, 'Pat Cummins', '1993-05-08', 'Australia', 'Male', 'Fast Bowler', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'),

-- Football Players
(7, 2, 'Jude Bellingham', '2003-06-29', 'England', 'Male', 'Midfielder', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'),
(8, 2, 'Vinicius Junior', '2000-07-12', 'Brazil', 'Male', 'Winger', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'),
(9, 2, 'Robert Lewandowski', '1988-08-21', 'Poland', 'Male', 'Striker', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80'),
(10, 2, 'Pedri', '2002-11-25', 'Spain', 'Male', 'Central Midfielder', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'),
(11, 2, 'Erling Haaland', '2000-07-21', 'Norway', 'Male', 'Striker', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
(12, 2, 'Kevin De Bruyne', '1991-06-28', 'Belgium', 'Male', 'Attacking Midfielder', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),

-- Basketball Players
(13, 3, 'LeBron James', '1984-12-30', 'USA', 'Male', 'Small Forward', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
(14, 3, 'Stephen Curry', '1988-03-14', 'USA', 'Male', 'Point Guard', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'),

-- Tennis Players
(15, 4, 'Carlos Alcaraz', '2003-05-05', 'Spain', 'Male', 'Singles Player', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'),
(16, 4, 'Novak Djokovic', '1987-05-22', 'Serbia', 'Male', 'Singles Player', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80');

-- ----------------------------------------------------------------------------
-- 5. COACHES
-- ----------------------------------------------------------------------------
INSERT INTO coaches (coach_id, sport_id, team_id, name, nationality, experience_years) VALUES
(1, 1, 1, 'Mark Boucher', 'South Africa', 15),
(2, 1, 2, 'Stephen Fleming', 'New Zealand', 18),
(3, 1, 3, 'Andy Flower', 'Zimbabwe', 20),
(4, 2, 5, 'Carlo Ancelotti', 'Italy', 28),
(5, 2, 6, 'Hansi Flick', 'Germany', 22),
(6, 2, 7, 'Pep Guardiola', 'Spain', 16),
(7, 3, 9, 'JJ Redick', 'USA', 8),
(8, 3, 10, 'Steve Kerr', 'USA', 14);

-- ----------------------------------------------------------------------------
-- 6. TEAM_PLAYERS (Junction table linking players to teams)
-- ----------------------------------------------------------------------------
INSERT INTO team_players (team_id, player_id, jersey_number, joined_date) VALUES
(1, 1, 45, '2011-01-01'), -- Rohit in MI
(1, 2, 93, '2013-01-01'), -- Bumrah in MI
(2, 3, 7,  '2008-01-01'), -- Dhoni in CSK
(2, 4, 8,  '2012-01-01'), -- Jadeja in CSK
(3, 5, 18, '2008-01-01'), -- Kohli in RCB
(4, 6, 30, '2014-01-01'), -- Cummins in Aus
(5, 7, 5,  '2023-07-01'), -- Bellingham in Real Madrid
(5, 8, 7,  '2018-07-01'), -- Vini in Real Madrid
(6, 9, 9,  '2022-07-01'), -- Lewandowski in Barca
(6, 10, 8, '2020-07-01'), -- Pedri in Barca
(7, 11, 9, '2022-07-01'), -- Haaland in Man City
(7, 12, 17, '2015-07-01'), -- De Bruyne in Man City
(9, 13, 23, '2018-07-01'), -- LeBron in Lakers
(10, 14, 30, '2009-07-01'), -- Curry in Warriors
(11, 15, 1,  '2021-01-01'), -- Alcaraz in Wimbledon
(12, 16, 1,  '2003-01-01'); -- Djokovic in Roland Garros

-- ----------------------------------------------------------------------------
-- 7. TOURNAMENTS
-- ----------------------------------------------------------------------------
INSERT INTO tournaments (tournament_id, sport_id, tournament_name, start_date, end_date, location, status) VALUES
(1, 1, 'Indian Premier League 2026', '2026-03-20', '2026-05-30', 'India', 'Ongoing'),
(2, 2, 'UEFA Champions League 2026', '2025-09-15', '2026-06-01', 'Europe', 'Ongoing'),
(3, 3, 'NBA Finals 2026', '2026-06-01', '2026-06-25', 'USA', 'Upcoming'),
(4, 4, 'Wimbledon Championship 2026', '2026-07-01', '2026-07-15', 'London, UK', 'Upcoming');

-- ----------------------------------------------------------------------------
-- 8. VENUES
-- ----------------------------------------------------------------------------
INSERT INTO venues (venue_id, venue_name, city, country, capacity, image_url) VALUES
(1, 'Wankhede Stadium', 'Mumbai', 'India', 33108, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80'),
(2, 'MA Chidambaram Stadium', 'Chennai', 'India', 38000, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80'),
(3, 'Santiago Bernabéu', 'Madrid', 'Spain', 81044, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'),
(4, 'Spotify Camp Nou', 'Barcelona', 'Spain', 99354, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80'),
(5, 'Etihad Stadium', 'Manchester', 'England', 53400, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80'),
(6, 'Crypto.com Arena', 'Los Angeles', 'USA', 19068, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80');

-- ----------------------------------------------------------------------------
-- 9. MATCHES
-- ----------------------------------------------------------------------------
INSERT INTO matches (match_id, tournament_id, sport_id, team1_id, team2_id, venue_id, match_date, match_time, team1_score, team2_score, status, winner_team_id) VALUES
-- IPL Matches
(1, 1, 1, 1, 2, 1, '2026-03-25', '19:30:00', 185, 180, 'Completed', 1), -- MI vs CSK at Wankhede (MI won)
(2, 1, 1, 2, 3, 2, '2026-03-28', '19:30:00', 195, 192, 'Completed', 2), -- CSK vs RCB at Chennai (CSK won)
(3, 1, 1, 1, 3, 1, '2026-10-05', '19:30:00', 0, 0, 'Scheduled', NULL), -- MI vs RCB (Scheduled)

-- Champions League Matches
(4, 2, 2, 5, 6, 3, '2026-04-10', '21:00:00', 3, 2, 'Completed', 5), -- Real Madrid vs Barca (Real won)
(5, 2, 2, 6, 7, 4, '2026-04-18', '21:00:00', 1, 1, 'Completed', NULL), -- Barca vs Man City (Draw)
(6, 2, 2, 5, 7, 3, '2026-10-12', '21:00:00', 0, 0, 'Scheduled', NULL), -- Real Madrid vs Man City (Scheduled)

-- NBA Match
(7, 3, 3, 9, 10, 6, '2026-06-05', '20:00:00', 112, 108, 'Completed', 9); -- Lakers vs Warriors

-- ----------------------------------------------------------------------------
-- 10. PLAYER STATISTICS
-- ----------------------------------------------------------------------------
INSERT INTO player_statistics (stat_id, player_id, match_id, points, assists, goals, wickets, runs, performance_rating) VALUES
-- Match 1 (MI vs CSK)
(1, 1, 1, 0, 0, 0, 0, 78, 9.2), -- Rohit Sharma 78 runs
(2, 2, 1, 0, 0, 0, 3, 0,  9.5), -- Bumrah 3 wickets
(3, 3, 1, 0, 0, 0, 0, 45, 8.4), -- Dhoni 45 runs

-- Match 2 (CSK vs RCB)
(4, 3, 2, 0, 0, 0, 0, 52, 8.8), -- Dhoni 52 runs
(5, 5, 2, 0, 0, 0, 0, 84, 9.1), -- Kohli 84 runs

-- Match 4 (Real Madrid vs Barca)
(6, 7, 4, 0, 1, 1, 0, 0, 8.9), -- Bellingham 1 goal 1 assist
(7, 8, 4, 0, 0, 2, 0, 0, 9.6), -- Vinicius 2 goals
(8, 9, 4, 0, 0, 1, 0, 0, 8.1), -- Lewandowski 1 goal

-- Match 5 (Barca vs Man City)
(9, 10, 5, 0, 1, 0, 0, 0, 8.0), -- Pedri 1 assist
(10, 11, 5, 0, 0, 1, 0, 0, 8.5), -- Haaland 1 goal

-- Match 7 (Lakers vs Warriors)
(11, 13, 7, 34, 10, 0, 0, 0, 9.8), -- LeBron 34 pts, 10 assists
(12, 14, 7, 31, 6,  0, 0, 0, 9.4); -- Curry 31 pts

-- ----------------------------------------------------------------------------
-- 11. TEAM STATISTICS
-- ----------------------------------------------------------------------------
INSERT INTO team_statistics (team_stat_id, team_id, tournament_id, matches_played, wins, losses, draws, points) VALUES
-- IPL 2026 Standings
(1, 1, 1, 2, 1, 1, 0, 2), -- Mumbai Indians
(2, 2, 1, 2, 1, 1, 0, 2), -- Chennai Super Kings
(3, 3, 1, 2, 0, 2, 0, 0), -- Royal Challengers Bengaluru

-- Champions League 2026 Standings
(4, 5, 2, 2, 2, 0, 0, 6), -- Real Madrid
(5, 6, 2, 2, 0, 1, 1, 1), -- FC Barcelona
(6, 7, 2, 1, 0, 0, 1, 1), -- Manchester City

-- NBA Finals 2026 Standings
(7, 9, 3, 1, 1, 0, 0, 2), -- Lakers
(8, 10, 3, 1, 0, 1, 0, 0); -- Warriors
