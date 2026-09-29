const express = require('express');
const router = express.Router();
const { getAllSports, getSportById, createSport, updateSport, deleteSport } = require('../controllers/sportsController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllSports);
router.get('/:id', getSportById);
router.post('/', authenticateToken, requireAdmin, createSport);
router.put('/:id', authenticateToken, requireAdmin, updateSport);
router.delete('/:id', authenticateToken, requireAdmin, deleteSport);

module.exports = router;
