const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./utils/dbInit');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'SportsHub REST API Server is running clean.',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sports', require('./routes/sportsRoutes'));
app.use('/api/teams', require('./routes/teamsRoutes'));
app.use('/api/players', require('./routes/playersRoutes'));
app.use('/api/coaches', require('./routes/coachesRoutes'));
app.use('/api/tournaments', require('./routes/tournamentsRoutes'));
app.use('/api/registrations', require('./routes/registrationsRoutes'));
app.use('/api/venues', require('./routes/venuesRoutes'));
app.use('/api/matches', require('./routes/matchesRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/users', require('./routes/usersRoutes'));

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server & Initialize Database
app.listen(PORT, async () => {
  console.log(`==================================================`);
  console.log(`🏆 SportsHub Backend Server running on port ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
  console.log(`==================================================`);

  // Attempt database auto-initialization
  await initDatabase();
});
