const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide an event title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide an event description"],
    trim: true,
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  date: {
    type: Date,
    required: [true, "Please provide an event date"],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: {
      type: String,
      required: [true, "Please provide an event address"],
    },
  },
  price: {
    type: Number,
    required: [true, "Please provide an event price"],
    min: [0, "Price cannot be negative"],
  },
  image: {
    type: String,
    required: [true, "Please provide an event image URL"],
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Please provide an event host"],
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  capacity: {
    type: Number,
    required: [true, "Please provide event capacity"],
    min: [1, "Capacity must be at least 1"],
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);