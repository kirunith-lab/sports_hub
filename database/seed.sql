-- ============================================================================
-- SportsHub Enhanced Seed Data (MySQL 8.0)
-- Population script with realistic sports, teams, players, registrations & stats
-- ============================================================================

USE sportshub_db;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE player_statistics;
TRUNCATE TABLE team_statistics;
TRUNCATE TABLE matches;
TRUNCATE TABLE registrations;
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
-- 1. USERS
-- ----------------------------------------------------------------------------
INSERT INTO users (name, email, password_hash, role) VALUES
('System Administrator', 'admin@sportshub.com', '$2a$10$YTyzBG1DDruPcW3XzQs4ZOcnAifCXN60mT65KfibHb6Q6MVrId2hK', 'admin'),
('John Doe', 'user@sportshub.com', '$2a$10$SmjzRU.w18HKqqzWzg9oyeljfZ4NdDfjMfNUNsJZWx18K5TWZWpBq', 'user'),
('Sports Analyst', 'analyst@sportshub.com', '$2a$10$SmjzRU.w18HKqqzWzg9oyeljfZ4NdDfjMfNUNsJZWx18K5TWZWpBq', 'user');

-- ----------------------------------------------------------------------------
-- 2. SPORTS
-- ----------------------------------------------------------------------------
INSERT INTO sports (sport_id, name, description, category, icon_name) VALUES
(1, 'Cricket', 'Bat-and-ball game played between two teams of eleven players on a pitch.', 'Team', 'activity'),
(2, 'Football', 'Global team sport played with a spherical ball between two teams of 11 players.', 'Team', 'dribbble'),
(3, 'Basketball', 'High-paced game played on a rectangular court shooting a ball through a hoop.', 'Team', 'target'),
(4, 'Tennis', 'Racquet sport played individually or in doubles against an opponent.', 'Racquet', 'award');

-- ----------------------------------------------------------------------------
-- 3. TEAMS
-- ----------------------------------------------------------------------------
INSERT INTO teams (team_id, sport_id, team_name, country, city, founded_year, logo_url) VALUES
(1, 1, 'Mumbai Indians', 'India', 'Mumbai', 2008, 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=400&q=80'),
(2, 1, 'Chennai Super Kings', 'India', 'Chennai', 2008, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80'),
(3, 1, 'Royal Challengers Bengaluru', 'India', 'Bengaluru', 2008, 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=400&q=80'),
(4, 1, 'Australia National Team', 'Australia', 'Sydney', 1877, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80'),
(5, 2, 'Real Madrid', 'Spain', 'Madrid', 1902, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80'),
(6, 2, 'FC Barcelona', 'Spain', 'Barcelona', 1899, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80'),
(7, 2, 'Manchester City', 'England', 'Manchester', 1880, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80'),
(9, 3, 'Los Angeles Lakers', 'USA', 'Los Angeles', 1947, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80'),
(10, 3, 'Golden State Warriors', 'USA', 'San Francisco', 1946, 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=400&q=80');

-- ----------------------------------------------------------------------------
-- 4. PLAYERS
-- ----------------------------------------------------------------------------
INSERT INTO players (player_id, sport_id, name, date_of_birth, nationality, gender, position, email, contact_number, status, profile_image_url) VALUES
(1, 1, 'Rohit Sharma', '1987-04-30', 'India', 'Male', 'Right-handed Batsman', 'rohit@mi.com', '+91 9876543210', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Rohit_Sharma_in_2023_%28cropped%29.jpg'),
(2, 1, 'Jasprit Bumrah', '1993-12-06', 'India', 'Male', 'Fast Bowler', 'bumrah@mi.com', '+91 9876543211', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Jasprit_Bumrah.jpg'),
(3, 1, 'MS Dhoni', '1981-07-07', 'India', 'Male', 'Wicketkeeper Batsman', 'dhoni@csk.com', '+91 9876543212', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/c/c9/MS_Dhoni.jpg'),
(4, 1, 'Ravindra Jadeja', '1988-12-06', 'India', 'Male', 'All-Rounder', 'jadeja@csk.com', '+91 9876543213', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Virat_Kohli_portrait.jpg'),
(5, 1, 'Virat Kohli', '1988-11-05', 'India', 'Male', 'Top-order Batsman', 'kohli@rcb.com', '+91 9876543214', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Virat_Kohli_portrait.jpg'),
(7, 2, 'Jude Bellingham', '2003-06-29', 'England', 'Male', 'Midfielder', 'jude@realmadrid.com', '+34 612345678', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/5/56/Jude_Bellingham_2020_%28cropped2%29.jpg'),
(8, 2, 'Vinicius Junior', '2000-07-12', 'Brazil', 'Male', 'Winger', 'vini@realmadrid.com', '+34 612345679', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Vinicius_Jr_2021.jpg'),
(9, 2, 'Robert Lewandowski', '1988-08-21', 'Poland', 'Male', 'Striker', 'lewy@barca.com', '+34 612345680', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/5/56/Jude_Bellingham_2020_%28cropped2%29.jpg'),
(13, 3, 'LeBron James', '1984-12-30', 'USA', 'Male', 'Small Forward', 'kingjames@lakers.com', '+1 2135550199', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/5/5b/LeBron_James_Wiz.jpg'),
(14, 3, 'Stephen Curry', '1988-03-14', 'USA', 'Male', 'Point Guard', 'curry@warriors.com', '+1 4155550188', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/5/5b/LeBron_James_Wiz.jpg');

-- ----------------------------------------------------------------------------
-- 5. COACHES
-- ----------------------------------------------------------------------------
INSERT INTO coaches (coach_id, sport_id, team_id, name, nationality, experience_years) VALUES
(1, 1, 1, 'Mark Boucher', 'South Africa', 15),
(2, 1, 2, 'Stephen Fleming', 'New Zealand', 18),
(3, 1, 3, 'Andy Flower', 'Zimbabwe', 20),
(4, 2, 5, 'Carlo Ancelotti', 'Italy', 28),
(5, 2, 6, 'Hansi Flick', 'Germany', 22),
(7, 3, 9, 'JJ Redick', 'USA', 8);

-- ----------------------------------------------------------------------------
-- 6. TEAM_PLAYERS
-- ----------------------------------------------------------------------------
INSERT INTO team_players (team_id, player_id, jersey_number, joined_date) VALUES
(1, 1, 45, '2011-01-01'),
(1, 2, 93, '2013-01-01'),
(2, 3, 7,  '2008-01-01'),
(2, 4, 8,  '2012-01-01'),
(3, 5, 18, '2008-01-01'),
(5, 7, 5,  '2023-07-01'),
(5, 8, 7,  '2018-07-01'),
(6, 9, 9,  '2022-07-01'),
(9, 13, 23, '2018-07-01'),
(10, 14, 30, '2009-07-01');

-- ----------------------------------------------------------------------------
-- 7. TOURNAMENTS
-- ----------------------------------------------------------------------------
INSERT INTO tournaments (tournament_id, sport_id, tournament_name, start_date, end_date, location, max_teams, status, description) VALUES
(1, 1, 'Indian Premier League 2026', '2026-03-20', '2026-05-30', 'India', 10, 'Ongoing', 'Premier Twenty20 cricket league featuring franchise teams from across India.'),
(2, 2, 'UEFA Champions League 2026', '2025-09-15', '2026-06-01', 'Europe', 32, 'Ongoing', 'Europe premier club football tournament organized by UEFA.'),
(3, 3, 'NBA Finals 2026', '2026-06-01', '2026-06-25', 'USA', 16, 'Upcoming', 'Championship series of the National Basketball Association.');

-- ----------------------------------------------------------------------------
-- 8. REGISTRATIONS (Team → participates in → Tournament)
-- ----------------------------------------------------------------------------
INSERT INTO registrations (tournament_id, team_id, registration_date, status, notes) VALUES
(1, 1, '2026-01-10', 'Approved', 'Official franchise registration confirmed'),
(1, 2, '2026-01-12', 'Approved', 'Official franchise registration confirmed'),
(1, 3, '2026-01-15', 'Approved', 'Official franchise registration confirmed'),
(2, 5, '2025-08-01', 'Approved', 'Qualified automatically via league title'),
(2, 6, '2025-08-02', 'Approved', 'Qualified automatically via league standing'),
(2, 7, '2025-08-05', 'Approved', 'Qualified automatically via league title'),
(3, 9, '2026-05-01', 'Approved', 'Western Conference Champion entry'),
(3, 10, '2026-05-01', 'Approved', 'Western Conference Playoff entry');

-- ----------------------------------------------------------------------------
-- 9. VENUES
-- ----------------------------------------------------------------------------
INSERT INTO venues (venue_id, venue_name, city, country, capacity, image_url) VALUES
(1, 'Wankhede Stadium', 'Mumbai', 'India', 33108, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80'),
(2, 'MA Chidambaram Stadium', 'Chennai', 'India', 38000, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80'),
(3, 'Santiago Bernabéu', 'Madrid', 'Spain', 81044, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'),
(4, 'Spotify Camp Nou', 'Barcelona', 'Spain', 99354, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80'),
(6, 'Crypto.com Arena', 'Los Angeles', 'USA', 19068, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80');

-- ----------------------------------------------------------------------------
-- 10. MATCHES
-- ----------------------------------------------------------------------------
INSERT INTO matches (match_id, tournament_id, sport_id, team1_id, team2_id, venue_id, match_date, match_time, team1_score, team2_score, status, winner_team_id, man_of_match_player_id) VALUES
(1, 1, 1, 1, 2, 1, '2026-03-25', '19:30:00', 185, 180, 'Completed', 1, 1),
(2, 1, 1, 2, 3, 2, '2026-03-28', '19:30:00', 195, 192, 'Completed', 2, 3),
(3, 1, 1, 1, 3, 1, '2026-10-05', '19:30:00', 0, 0, 'Scheduled', NULL, NULL),
(4, 2, 2, 5, 6, 3, '2026-04-10', '21:00:00', 3, 2, 'Completed', 5, 8);

-- ----------------------------------------------------------------------------
-- 11. PLAYER STATISTICS
-- ----------------------------------------------------------------------------
INSERT INTO player_statistics (stat_id, player_id, match_id, points, assists, goals, wickets, runs, performance_rating) VALUES
(1, 1, 1, 0, 0, 0, 0, 78, 9.2),
(2, 2, 1, 0, 0, 0, 3, 0,  9.5),
(3, 3, 1, 0, 0, 0, 0, 45, 8.4),
(4, 3, 2, 0, 0, 0, 0, 52, 8.8),
(5, 5, 2, 0, 0, 0, 0, 84, 9.1),
(6, 7, 4, 0, 1, 1, 0, 0, 8.9),
(7, 8, 4, 0, 0, 2, 0, 0, 9.6),
(8, 9, 4, 0, 0, 1, 0, 0, 8.1);

-- ----------------------------------------------------------------------------
-- 12. TEAM STATISTICS
-- ----------------------------------------------------------------------------
INSERT INTO team_statistics (team_stat_id, team_id, tournament_id, matches_played, wins, losses, draws, points) VALUES
(1, 1, 1, 2, 1, 1, 0, 2),
(2, 2, 1, 2, 1, 1, 0, 2),
(3, 3, 1, 2, 0, 2, 0, 0),
(4, 5, 2, 1, 1, 0, 0, 3),
(5, 6, 2, 1, 0, 1, 0, 0);
