const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is already at full capacity' });
    }

    const booking = new Booking({
      user: req.user._id,
      event: event._id
    });

    await booking.save();

    event.attendees.push(req.user._id);
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Event.findByIdAndUpdate(booking.event, {
      $pull: { attendees: req.user._id }
    });

    await booking.remove();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};