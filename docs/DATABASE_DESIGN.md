# Database Design & 3NF Normalization Analysis

## Overview
This document provides a formal database design and normalization analysis for the **SportsHub Database Management System**. The schema complies with **Third Normal Form (3NF)** rules to eliminate redundant data, optimize storage efficiency, and enforce referential integrity across all entities.

---

## Normalization Steps (1NF → 2NF → 3NF)

### 1. First Normal Form (1NF)
**Requirements**:
- All attributes must contain atomic (indivisible) values.
- No repeating groups or comma-separated lists stored in a single cell.
- Each row must be uniquely identifiable by a Primary Key.

*Violation Example*: Storing player names as comma-separated values in `teams.players_list` ("Rohit, Bumrah, Pandya").
*Resolution*: Extracted individual player records into a dedicated `players` table and connected them via the `team_players` junction table.

### 2. Second Normal Form (2NF)
**Requirements**:
- Must be in 1NF.
- All non-key attributes must be fully functionally dependent on the entire Primary Key (no partial dependencies).

*Resolution*:
In `team_players` table, the Primary Key is composite: `(team_id, player_id)`. Attributes like `jersey_number` and `joined_date` depend on the *combination* of team and player, not just player alone. Player bio attributes (like `nationality`, `date_of_birth`) are isolated in the `players` entity to avoid partial dependency.

### 3. Third Normal Form (3NF)
**Requirements**:
- Must be in 2NF.
- No transitive dependencies (non-key attributes depending on other non-key attributes).

*Resolution*:
- Do not store `stadium_city` or `stadium_country` inside the `matches` table. Store `venue_id` in `matches` and look up venue details from `venues` entity.
- Points table standings (`wins`, `losses`, `points`) are aggregated dynamically or managed in `team_statistics` table via indexed relational queries, avoiding redundant text duplicates.

---

## Indexing Strategy

Indexes are added to high-cardinality search and foreign key join columns to accelerate query performance:

1. `idx_users_email`: B-Tree index on `users.email` for fast O(1) authentication lookups.
2. `idx_players_name`: Accelerates wildcard player search (`LIKE '%name%'`).
3. `idx_teams_name` & `idx_teams_sport`: Speeds up team filtering per sport category.
4. `idx_matches_date` & `idx_matches_tournament`: Optimizes date range queries and tournament fixture listings.
5. `idx_pstat_player` & `idx_pstat_match`: High speed lookup for composite player match statistics.

---

## Transaction Management & Safety

Multi-step operations execute within SQL Transactions:
- **Match Completion Transaction**: When an admin records match final scorelines (`matches` update), a transaction updates `team_statistics` (wins, losses, draws, points) atomically. If any part fails, `ROLLBACK` reverts changes cleanly.
- **Parameterized SQL Queries**: All backend queries utilize `mysql2` prepared statements (`?` placeholders) ensuring total immunity against SQL Injection attacks.
