const express = require('express');
const router = express.Router();
const { getAllPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } = require('../controllers/playersController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.post('/', authenticateToken, requireAdmin, createPlayer);
router.put('/:id', authenticateToken, requireAdmin, updatePlayer);
router.delete('/:id', authenticateToken, requireAdmin, deletePlayer);

module.exports = router;
