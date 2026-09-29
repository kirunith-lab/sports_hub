const express = require('express');
const router = express.Router();
const { getAllTournaments, getTournamentById, createTournament, updateTournament, deleteTournament } = require('../controllers/tournamentsController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllTournaments);
router.get('/:id', getTournamentById);
router.post('/', authenticateToken, requireAdmin, createTournament);
router.put('/:id', authenticateToken, requireAdmin, updateTournament);
router.delete('/:id', authenticateToken, requireAdmin, deleteTournament);

module.exports = router;
