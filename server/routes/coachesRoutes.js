const express = require('express');
const router = express.Router();
const { getAllCoaches, getCoachById, createCoach, updateCoach, deleteCoach } = require('../controllers/coachesController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllCoaches);
router.get('/:id', getCoachById);
router.post('/', authenticateToken, requireAdmin, createCoach);
router.put('/:id', authenticateToken, requireAdmin, updateCoach);
router.delete('/:id', authenticateToken, requireAdmin, deleteCoach);

module.exports = router;
