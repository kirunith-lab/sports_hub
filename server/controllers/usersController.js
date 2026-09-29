const db = require('../config/db');

// GET all users
const getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT user_id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, count: rows.length, users: rows });
  } catch (error) {
    next(error);
  }
};

// UPDATE user role
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified. Role must be admin or user.' });
    }

    const [result] = await db.query('UPDATE users SET role = ? WHERE user_id = ?', [role, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: `User role updated to ${role} successfully.` });
  } catch (error) {
    next(error);
  }
};

// DELETE user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting oneself
    if (parseInt(id) === parseInt(req.user.user_id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account while logged in.' });
    }

    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'User account deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser
};
