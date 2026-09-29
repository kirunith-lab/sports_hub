# RESTful API Endpoints Documentation

## Overview
The SportsHub Express REST API exposes clean, stateless endpoints following standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).

---

## Base URL
`http://localhost:5000/api`

---

## Endpoints Specification

### 1. Authentication
- `POST /auth/login`
  - Body: `{ email, password }`
  - Returns: `{ success, token, user }`
- `POST /auth/register`
  - Body: `{ name, email, password, role }`
  - Returns: `{ success, token, user }`
- `GET /auth/me` [Headers: `Authorization: Bearer <JWT>`]
  - Returns: Current user profile

### 2. Sports
- `GET /sports` (Query params: `search`, `category`)
- `GET /sports/:id` (Returns sport info + linked teams, players, tournaments, matches)
- `POST /sports` [Admin] (Body: `{ name, description, category, icon_name }`)
- `PUT /sports/:id` [Admin]
- `DELETE /sports/:id` [Admin]

### 3. Teams
- `GET /teams` (Query params: `sport_id`, `search`, `country`)
- `GET /teams/:id` (Returns team info + roster + matches + stats)
- `POST /teams` [Admin] (Body: `{ sport_id, team_name, country, city, founded_year, logo_url }`)
- `PUT /teams/:id` [Admin]
- `DELETE /teams/:id` [Admin]

### 4. Players
- `GET /players` (Query params: `sport_id`, `team_id`, `search`, `nationality`, `position`)
- `GET /players/:id` (Returns player profile + career summary + match performances)
- `POST /players` [Admin] (Body: `{ sport_id, team_id, name, date_of_birth, nationality, gender, position, profile_image_url, jersey_number }`)
- `PUT /players/:id` [Admin]
- `DELETE /players/:id` [Admin]

### 5. Tournaments
- `GET /tournaments` (Query params: `sport_id`, `status`, `search`)
- `GET /tournaments/:id` (Returns tournament details + dynamic Points Table Standings + matches)
- `POST /tournaments` [Admin] (Body: `{ sport_id, tournament_name, start_date, end_date, location, status }`)
- `PUT /tournaments/:id` [Admin]
- `DELETE /tournaments/:id` [Admin]

### 6. Matches
- `GET /matches` (Query params: `sport_id`, `tournament_id`, `status`, `date`, `upcoming`, `completed`)
- `GET /matches/:id` (Returns scoreboard + venue + player match stats)
- `POST /matches` [Admin] (Body: `{ tournament_id, sport_id, team1_id, team2_id, venue_id, match_date, match_time, status }`)
- `PUT /matches/:id` [Admin] (Updates scoreline, winner, & recalculates standings)
- `DELETE /matches/:id` [Admin]

### 7. Statistics & Analytics
- `GET /stats/dashboard` (Returns metric counters & Recharts graph datasets)
- `GET /stats/players` (Returns player match statistics list)
- `POST /stats/players` [Admin] (Body: `{ player_id, match_id, points, assists, goals, wickets, runs, performance_rating }`)
- `PUT /stats/players/:id` [Admin]
- `DELETE /stats/players/:id` [Admin]

### 8. User Management
- `GET /users` [Admin]
- `PUT /users/:id/role` [Admin] (Body: `{ role: "admin" | "user" }`)
- `DELETE /users/:id` [Admin]
