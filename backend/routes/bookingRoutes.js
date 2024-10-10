const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getUserBookings,
  createBooking,
  cancelBooking
} = require('../controllers/bookingController');

router.get('/', protect, getUserBookings);
router.post('/:eventId', protect, createBooking);
router.delete('/:bookingId', protect, cancelBooking);

module.exports = router;