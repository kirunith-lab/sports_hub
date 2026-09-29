# Entity-Relationship (ER) Diagram & Structural Documentation

## Overview
This document contains the Entity-Relationship (ER) diagram for **SportsHub — Sports Management & Information System**. The database model is designed to 3rd Normal Form (3NF) standards, enforcing strict relational integrity, foreign key constraints, unique constraints, and check constraints.

---

## ER Diagram (Mermaid Diagram)

```mermaid
erDiagram
    USERS {
        int user_id PK
        string name
        string email UK
        string password_hash
        enum role
        timestamp created_at
    }

    SPORTS {
        int sport_id PK
        string name UK
        text description
        enum category
        string icon_name
        timestamp created_at
    }

    TEAMS {
        int team_id PK
        int sport_id FK
        string team_name
        string country
        string city
        int founded_year
        string logo_url
    }

    PLAYERS {
        int player_id PK
        int sport_id FK
        string name
        date date_of_birth
        string nationality
        enum gender
        string position
        string profile_image_url
    }

    COACHES {
        int coach_id PK
        int sport_id FK
        int team_id FK
        string name
        string nationality
        int experience_years
    }

    TEAM_PLAYERS {
        int team_id PK,FK
        int player_id PK,FK
        int jersey_number
        date joined_date
        date left_date
    }

    TOURNAMENTS {
        int tournament_id PK
        int sport_id FK
        string tournament_name
        date start_date
        date end_date
        string location
        enum status
    }

    VENUES {
        int venue_id PK
        string venue_name
        string city
        string country
        int capacity
        string image_url
    }

    MATCHES {
        int match_id PK
        int tournament_id FK
        int sport_id FK
        int team1_id FK
        int team2_id FK
        int venue_id FK
        date match_date
        time match_time
        int team1_score
        int team2_score
        enum status
        int winner_team_id FK
    }

    PLAYER_STATISTICS {
        int stat_id PK
        int player_id FK
        int match_id FK
        int points
        int assists
        int goals
        int wickets
        int runs
        decimal performance_rating
    }

    TEAM_STATISTICS {
        int team_stat_id PK
        int team_id FK
        int tournament_id FK
        int matches_played
        int wins
        int losses
        int draws
        int points
    }

    SPORTS ||--|{ TEAMS : "1 to N"
    SPORTS ||--|{ PLAYERS : "1 to N"
    SPORTS ||--|{ TOURNAMENTS : "1 to N"
    SPORTS ||--|{ COACHES : "1 to N"
    TEAMS ||--o| COACHES : "1 to 1 (optional)"
    TEAMS ||--|{ TEAM_PLAYERS : "1 to N"
    PLAYERS ||--|{ TEAM_PLAYERS : "1 to N"
    TOURNAMENTS ||--|{ MATCHES : "1 to N"
    VENUES ||--|{ MATCHES : "1 to N"
    TEAMS ||--|{ MATCHES : "Team 1"
    TEAMS ||--|{ MATCHES : "Team 2"
    TEAMS ||--o| MATCHES : "Winner Team"
    PLAYERS ||--|{ PLAYER_STATISTICS : "1 to N"
    MATCHES ||--|{ PLAYER_STATISTICS : "1 to N"
    TEAMS ||--|{ TEAM_STATISTICS : "1 to N"
    TOURNAMENTS ||--|{ TEAM_STATISTICS : "1 to N"
```

---

## Entity Explanations & Cardinalities

1. **SPORTS to TEAMS (1 : N)**
   - One sport (e.g., Cricket) can feature many teams (Mumbai Indians, CSK).
   - Each team belongs strictly to one sport category (`sport_id` Foreign Key).

2. **TEAMS to PLAYERS (M : N via `TEAM_PLAYERS`)**
   - A team has multiple players, and over time an athlete can play for multiple teams.
   - Resolved using junction table `team_players` with Composite Primary Key `(team_id, player_id)` to avoid data duplication.

3. **TOURNAMENTS & VENUES to MATCHES (1 : N)**
   - A tournament hosts multiple match fixtures. Each match takes place at a specific venue.

4. **TEAMS to MATCHES (1 : N for Team1, Team2, and Winner)**
   - Each match references two distinct competing teams (`team1_id` & `team2_id`) via `CHECK (team1_id <> team2_id)`.
   - Optional `winner_team_id` FK references the winning team upon match completion.

5. **PLAYERS & MATCHES to PLAYER_STATISTICS (1 : N)**
   - Granular performance metrics (goals, wickets, runs, points) recorded per player per match. Unique constraint `(player_id, match_id)`.
