-- ============================================================================
-- SportsHub Database Schema (MySQL 8.0)
-- DBMS Academic Project - Relational Schema Definition
-- ============================================================================

CREATE DATABASE IF NOT EXISTS sportshub_db;
USE sportshub_db;

-- Disable Foreign Key Checks during setup
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist (clean setup)
DROP TABLE IF EXISTS player_statistics;
DROP TABLE IF EXISTS team_statistics;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS team_players;
DROP TABLE IF EXISTS coaches;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS sports;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Entity for system users and administrative accounts
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 2. SPORTS TABLE
-- Core entity for sports categories (Cricket, Football, Basketball, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE sports (
    sport_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category ENUM('Team', 'Individual', 'Racquet', 'Combat', 'Motorsport') NOT NULL DEFAULT 'Team',
    icon_name VARCHAR(50) DEFAULT 'trophy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sports_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 3. TEAMS TABLE
-- Represents sports teams belonging to a specific sport
-- ----------------------------------------------------------------------------
CREATE TABLE teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    sport_id INT NOT NULL,
    team_name VARCHAR(120) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    founded_year INT CHECK (founded_year >= 1800 AND founded_year <= 2100),
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_team_sport UNIQUE (team_name, sport_id),
    INDEX idx_teams_name (team_name),
    INDEX idx_teams_sport (sport_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 4. PLAYERS TABLE
-- Individual sports athletes belonging to a sport
-- ----------------------------------------------------------------------------
CREATE TABLE players (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    sport_id INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL DEFAULT 'Male',
    position VARCHAR(80),
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_players_name (name),
    INDEX idx_players_sport (sport_id),
    INDEX idx_players_nationality (nationality)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 5. COACHES TABLE
-- Team / Sport coaches and trainers
-- ----------------------------------------------------------------------------
CREATE TABLE coaches (
    coach_id INT AUTO_INCREMENT PRIMARY KEY,
    sport_id INT NOT NULL,
    team_id INT UNIQUE, -- Optional 1-to-1 current team assignment
    name VARCHAR(120) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    experience_years INT CHECK (experience_years >= 0 AND experience_years <= 60),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_coaches_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 6. TEAM_PLAYERS TABLE (Junction Table for M:N Relationship between Teams and Players)
-- ----------------------------------------------------------------------------
CREATE TABLE team_players (
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    jersey_number INT CHECK (jersey_number >= 0 AND jersey_number <= 99),
    joined_date DATE NOT NULL,
    left_date DATE DEFAULT NULL,
    PRIMARY KEY (team_id, player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_tp_team (team_id),
    INDEX idx_tp_player (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 7. TOURNAMENTS TABLE
-- Competitions and leagues held for specific sports
-- ----------------------------------------------------------------------------
CREATE TABLE tournaments (
    tournament_id INT AUTO_INCREMENT PRIMARY KEY,
    sport_id INT NOT NULL,
    tournament_name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(150) NOT NULL,
    status ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_tournament_dates CHECK (end_date >= start_date),
    INDEX idx_tournaments_name (tournament_name),
    INDEX idx_tournaments_sport (sport_id),
    INDEX idx_tournaments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 8. VENUES TABLE
-- Stadiums, arenas, and sports grounds
-- ----------------------------------------------------------------------------
CREATE TABLE venues (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    capacity INT CHECK (capacity > 0),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_venues_name (venue_name),
    INDEX idx_venues_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 9. MATCHES TABLE
-- Specific fixtures between two teams in a tournament at a venue
-- ----------------------------------------------------------------------------
CREATE TABLE matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    sport_id INT NOT NULL,
    team1_id INT NOT NULL,
    team2_id INT NOT NULL,
    venue_id INT NOT NULL,
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    team1_score INT DEFAULT 0,
    team2_score INT DEFAULT 0,
    status ENUM('Scheduled', 'Live', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    winner_team_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (team1_id) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (team2_id) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (winner_team_id) REFERENCES teams(team_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_different_teams CHECK (team1_id <> team2_id),
    INDEX idx_matches_date (match_date),
    INDEX idx_matches_tournament (tournament_id),
    INDEX idx_matches_teams (team1_id, team2_id),
    INDEX idx_matches_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 10. PLAYER_STATISTICS TABLE
-- Granular performance stats for individual players in specific matches
-- ----------------------------------------------------------------------------
CREATE TABLE player_statistics (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    points INT DEFAULT 0,
    assists INT DEFAULT 0,
    goals INT DEFAULT 0,
    wickets INT DEFAULT 0,
    runs INT DEFAULT 0,
    performance_rating DECIMAL(3, 1) CHECK (performance_rating >= 0.0 AND performance_rating <= 10.0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_player_match_stat UNIQUE (player_id, match_id),
    INDEX idx_pstat_player (player_id),
    INDEX idx_pstat_match (match_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 11. TEAM_STATISTICS TABLE
-- Accumulated tournament standings & aggregated team statistics
-- ----------------------------------------------------------------------------
CREATE TABLE team_statistics (
    team_stat_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    tournament_id INT NOT NULL,
    matches_played INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    draws INT DEFAULT 0,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_team_tournament_stat UNIQUE (team_id, tournament_id),
    INDEX idx_tstat_team (team_id),
    INDEX idx_tstat_tournament (tournament_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
