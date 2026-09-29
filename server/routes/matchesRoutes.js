const express = require('express');
const router = express.Router();
const { getAllMatches, getMatchById, createMatch, updateMatch, deleteMatch } = require('../controllers/matchesController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllMatches);
router.get('/:id', getMatchById);
router.post('/', authenticateToken, requireAdmin, createMatch);
router.put('/:id', authenticateToken, requireAdmin, updateMatch);
router.delete('/:id', authenticateToken, requireAdmin, deleteMatch);

module.exports = router;
