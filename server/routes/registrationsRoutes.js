const express = require('express');
const router = express.Router();
const { getAllRegistrations, createRegistration, updateRegistration, deleteRegistration } = require('../controllers/registrationsController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllRegistrations);
router.post('/', authenticateToken, requireAdmin, createRegistration);
router.put('/:id', authenticateToken, requireAdmin, updateRegistration);
router.delete('/:id', authenticateToken, requireAdmin, deleteRegistration);

module.exports = router;
