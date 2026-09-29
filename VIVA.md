# 🎓 DBMS Academic Viva Preparation & Defense Guide

This document contains expected questions and concise, authoritative answers for your college DBMS project viva evaluation.

---

### Q1: What is a Database Management System (DBMS)?
**Answer**: A DBMS is software software that interacts with end-users, applications, and the database itself to capture and analyze data. It provides systematic creation, retrieval, updating, and management of data while ensuring data security, integrity, and transaction consistency (ACID properties).

### Q2: Why did you choose MySQL for this project?
**Answer**: MySQL is an open-source, enterprise-grade Relational Database Management System (RDBMS) that supports ACID transactions, foreign key referential integrity constraints, multi-table JOIN operations, views, stored procedures, and B-Tree indexes. It pairs seamlessly with Node.js via non-blocking async drivers like `mysql2`.

### Q3: What is a Primary Key?
**Answer**: A Primary Key (PK) is a column (or set of columns) that uniquely identifies each row in a table. It must contain unique values and cannot contain NULL values (`NOT NULL`). In our schema, `user_id`, `sport_id`, `team_id`, and `match_id` serve as primary keys.

### Q4: What is a Foreign Key?
**Answer**: A Foreign Key (FK) is a column or group of columns in a relational table that provides a link between data in two tables. It references the Primary Key of another table, enforcing referential integrity. For example, `sport_id` in `teams` references `sport_id` in `sports`.

### Q5: What is Normalization? Why is your database in 3NF?
**Answer**: Normalization is the process of organizing data in a database to reduce data redundancy and improve data integrity. Our schema is in Third Normal Form (3NF) because:
1. **1NF**: All table columns contain atomic, indivisible values.
2. **2NF**: All non-key columns fully depend on the complete Primary Key (no partial dependencies).
3. **3NF**: There are no transitive dependencies (non-key columns depending on other non-key columns).

### Q6: Why did you use a Junction Table (`team_players`)?
**Answer**: The relationship between `teams` and `players` is Many-to-Many (M:N) over time (a player can belong to different teams across seasons, and a team has many players). Relational databases cannot directly model M:N relationships. The `team_players` junction table converts M:N into two 1:N relationships (`teams` 1--N `team_players` and `players` 1--N `team_players`) with a composite primary key `(team_id, player_id)`.

### Q7: What is the difference between INNER JOIN and LEFT JOIN?
**Answer**: 
- **INNER JOIN**: Returns only rows where there is a match in both joined tables. (e.g., matching teams and sports).
- **LEFT JOIN**: Returns all rows from the left table, and matched rows from the right table. If no match exists, NULL values are returned for right-table columns. (e.g., fetching a team and its optional coach via `LEFT JOIN coaches`).

### Q8: What is an Index and why did you create them?
**Answer**: An index is a data structure (typically a B-Tree in MySQL InnoDB) that improves the speed of data retrieval operations at the cost of additional write time and storage space. We created indexes on `users.email`, `players.name`, `teams.team_name`, and `matches.match_date` to accelerate high-frequency searches and foreign key JOIN lookups.

### Q9: What is Referential Integrity and how is it enforced?
**Answer**: Referential integrity guarantees that relationships between tables remain valid and consistent. In MySQL, it is enforced using Foreign Key constraints with `ON DELETE CASCADE` (automatically removing child records if a parent is deleted) or `SET NULL`.

### Q10: What is a Database Transaction?
**Answer**: A transaction is a single logical unit of work that contains one or more database operations. It follows ACID properties:
- **Atomicity**: All operations succeed or all are rolled back.
- **Consistency**: Database transitions from one valid state to another.
- **Isolation**: Concurrent transactions do not interfere with each other.
- **Durability**: Committed changes persist permanently.

In SportsHub, updating a match score to 'Completed' triggers a transaction that updates `matches` and recalculates wins/losses/points in `team_statistics`.

### Q11: What is SQL Injection and how did you prevent it?
**Answer**: SQL Injection (SQLi) occurs when untrusted user input is directly concatenated into SQL query strings, allowing attackers to manipulate query execution. We prevented SQL injection by using **Parameterized Queries (Prepared Statements)** via `mysql2` (`db.query('SELECT * FROM users WHERE email = ?', [email])`), separating SQL logic from user data.

### Q12: How are tournament standings calculated in SportsHub?
**Answer**: Standings (Points Table) are generated dynamically using SQL aggregation queries and `team_statistics` table views (`v_tournament_standings`). Wins yield 2 points, draws yield 1 point, and teams are sorted using `ORDER BY points DESC, wins DESC`.

### Q13: Why shouldn't a React frontend connect directly to MySQL?
**Answer**: Connecting a frontend directly to a database exposes database credentials in client-side JavaScript code, creating massive security vulnerabilities. It also bypasses business logic, role-based authorization, and request rate-limiting.

### Q14: Explain the 3-Tier Architecture of SportsHub.
**Answer**:
1. **Presentation Tier**: React.js SPA (Vite) rendered in browser.
2. **Application Tier**: Express.js REST API on Node.js handling authentication (JWT), request routing, and business logic.
3. **Data Tier**: MySQL 8.0 RDBMS executing schema queries and transactions.

### Q15: Why are passwords hashed using bcrypt instead of plain-text?
**Answer**: Plain-text passwords risk exposure in case of data breaches. Bcrypt uses a cryptographic key-derivation function with configurable salt rounds and one-way hashing (`$2a$10$...`), making it computationally infeasible for attackers to reverse hashes or use rainbow tables.

---

## 20 Additional Quick Fire Viva Questions

| Question | Answer Summary |
|---|---|
| **Q16: What is a View?** | A virtual table based on the result-set of a SELECT query (e.g., `v_tournament_standings`). |
| **Q17: Difference between HAVING and WHERE?** | `WHERE` filters rows before aggregation; `HAVING` filters aggregated groups after `GROUP BY`. |
| **Q18: What is a Composite Key?** | A primary key composed of two or more columns (e.g. `PRIMARY KEY(team_id, player_id)`). |
| **Q19: What is UNIQUE constraint?** | Ensures all values in a column are distinct (e.g., `users.email`, `sports.name`). |
| **Q20: What is CHECK constraint?** | Validates that column values satisfy a boolean condition (e.g., `founded_year >= 1800`). |
| **Q21: What is AUTO_INCREMENT?** | Automatically generates sequential integer IDs for primary keys upon row insertion. |
| **Q22: What is JWT?** | JSON Web Token used for stateless, tamper-proof user authentication between React and Express. |
| **Q23: What is CORS?** | Cross-Origin Resource Sharing allowing React (`localhost:3000`) to communicate with Express (`localhost:5000`). |
| **Q24: What is Axios?** | Promise-based HTTP client for making async API calls from React to Express REST API. |
| **Q25: What is Recharts?** | Declarative charting library built for React rendering interactive SVG graphs. |
| **Q26: What is Lucide React?** | Lightweight icon set library used across SportsHub UI. |
| **Q27: What is Tailwind CSS?** | Utility-first CSS framework used for responsive, modern glassmorphic application UI design. |
| **Q28: What is dotenv?** | Zero-dependency module that loads environment variables from a `.env` file into `process.env`. |
| **Q29: How is CASCADE delete handled?** | Deleting a sport automatically cascades to delete related teams, players, and match records. |
| **Q30: What is the role of `mysql2/promise`?** | Provides async/await Promise wrapper for MySQL database connection pooling. |
