const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createReview, 
  getEventReviews, 
  getUserReviews,
  updateReview, 
  deleteReview 
} = require('../controllers/reviewController');

router.post('/:eventId', protect, createReview);
router.get('/event/:eventId', getEventReviews);
router.get('/user', protect, getUserReviews);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;