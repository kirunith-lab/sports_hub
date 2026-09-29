const express = require('express');
const router = express.Router();
const { getAllVenues, getVenueById, createVenue, updateVenue, deleteVenue } = require('../controllers/venuesController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllVenues);
router.get('/:id', getVenueById);
router.post('/', authenticateToken, requireAdmin, createVenue);
router.put('/:id', authenticateToken, requireAdmin, updateVenue);
router.delete('/:id', authenticateToken, requireAdmin, deleteVenue);

module.exports = router;
