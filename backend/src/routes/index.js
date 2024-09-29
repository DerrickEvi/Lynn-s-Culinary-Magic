const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { createMenuItem, getMenuItems, getMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuItemController');

router.post('/register', register);
router.post('/login', login);

router.route('/menu-items')
  .get(getMenuItems)
  .post(protect, authorize('admin'), createMenuItem);

router.route('/menu-items/:id')
  .get(getMenuItem)
  .put(protect, authorize('admin'), updateMenuItem)
  .delete(protect, authorize('admin'), deleteMenuItem);

module.exports = router;