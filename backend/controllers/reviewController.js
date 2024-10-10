const Review = require('../models/Review');
const Event = require('../models/Event');

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const review = new Review({
      user: userId,
      event: eventId,
      rating,
      comment
    });

    await review.save();

    await Event.findByIdAndUpdate(eventId, { $push: { reviews: review._id } });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEventReviews = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const reviews = await Review.find({ event: eventId }).populate('user', 'fullName');
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
    try {
      const reviews = await Review.find({ user: req.user._id })
        .populate('event', 'title');
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await review.remove();
    await Event.findByIdAndUpdate(review.event, { $pull: { reviews: review._id } });

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};