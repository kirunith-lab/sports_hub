const express = require('express');
const router = express.Router();
const { getAllTeams, getTeamById, createTeam, updateTeam, deleteTeam } = require('../controllers/teamsController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', authenticateToken, requireAdmin, createTeam);
router.put('/:id', authenticateToken, requireAdmin, updateTeam);
router.delete('/:id', authenticateToken, requireAdmin, deleteTeam);

module.exports = router;
