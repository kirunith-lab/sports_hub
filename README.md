# 🏆 SportsHub — Sports Management & Information System (Full-Stack DBMS Project)

SportsHub is a submission-ready Database Management System (DBMS) academic project developed using **Node.js, Express.js, MySQL 8.0, React.js (Vite), and Tailwind CSS**.

The project showcases normalized 3NF database design, relational foreign keys, junction tables for many-to-many relationships, SQL JOIN operations, aggregate analytical queries, indexed searching, database transactions, JWT role-based security, and visual data analytics with Recharts.

---

## 🌟 Key Features

- **3NF Normalized MySQL Database**: 11 core relational entities (`users`, `sports`, `teams`, `players`, `coaches`, `team_players`, `tournaments`, `venues`, `matches`, `player_statistics`, `team_statistics`).
- **Dynamic Standings & Points Table**: Automatically computed using relational SQL queries from `matches` and `team_statistics`.
- **Full CRUD Administrative Dashboard**: Manage sports, teams, rosters, coaches, match fixtures, scores, venues, player stats, and system user roles.
- **Visual Analytics**: Interactive Recharts graphs displaying team distributions, match shares, and star athlete leaderboards.
- **Security & Safety**: Password hashing with `bcryptjs`, JWT token authentication, parameterized SQL queries preventing SQL injection.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, Axios, React Router v6.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, MySQL2 (`mysql2/promise`).
- **Database**: MySQL 8.0.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- MySQL Server (v8.0) running on `localhost:3306`

### 2. Backend Setup
```bash
cd server
npm install
npm start
```
*Note: On server startup, `utils/dbInit.js` will automatically connect to MySQL, create `sportshub_db`, run `schema.sql`, `views.sql`, and populate `seed.sql` with default demo data!*

Default Demo Credentials:
- **Admin**: `admin@sportshub.com` / `admin123`
- **User**: `user@sportshub.com` / `user123`

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 📁 Repository Structure

```
DBMS/
├── client/              # React + Vite + Tailwind CSS Frontend
├── server/              # Express REST API + MySQL2 Connection Pool
├── database/            # SQL DDL (schema.sql, seed.sql, views.sql, queries.sql)
├── docs/                # Academic Documentation (ER Diagram, DB Design, API Specs)
├── VIVA.md              # 30+ Q&A Guide for DBMS Viva Evaluation
└── README.md
```
