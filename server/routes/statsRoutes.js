const express = require('express');
const router = express.Router();
const { getDashboardStats, getPlayerStats, createPlayerStat, updatePlayerStat, deletePlayerStat } = require('../controllers/statsController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/dashboard', getDashboardStats);
router.get('/players', getPlayerStats);
router.post('/players', authenticateToken, requireAdmin, createPlayerStat);
router.put('/players/:id', authenticateToken, requireAdmin, updatePlayerStat);
router.delete('/players/:id', authenticateToken, requireAdmin, deletePlayerStat);

module.exports = router;
