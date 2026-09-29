const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/usersController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.put('/:id/role', authenticateToken, requireAdmin, updateUserRole);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router;
