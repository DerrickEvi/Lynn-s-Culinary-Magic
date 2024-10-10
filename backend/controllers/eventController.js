const Event = require("../models/Event");
const { io } = require('../server');
const geocodeAddress = require('../utils/geocode');
const fs = require('fs');
const path = require('path');

exports.createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, host: req.user._id };
    if (req.file) {
      eventData.image = `/uploads/${req.file.filename}`;
    }

    // Geocode the address
    const { lat, lng } = await geocodeAddress(eventData.location.address);
    eventData.location.coordinates = [lng, lat];

    const event = await Event.create(eventData);
    
    io.emit('newEvent', { message: 'A new event has been created!', event });

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("host", "fullName");
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("host", "fullName");
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      // Handle image update
      if (req.file) {
        // Delete old image if it exists
        if (event.image) {
          const oldImagePath = path.join(__dirname, '..', event.image);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }
        event.image = `/uploads/${req.file.filename}`;
      }

      // Update other fields
      Object.keys(req.body).forEach(key => {
        event[key] = req.body[key];
      });

      // Geocode the address if it's updated
      if (req.body.location && req.body.location.address) {
        const { lat, lng } = await geocodeAddress(req.body.location.address);
        event.location.coordinates = [lng, lat];
      }

      const updatedEvent = await event.save();
      
      io.emit('eventUpdated', { message: 'An event has been updated!', event: updatedEvent });

      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      // Delete associated image
      if (event.image) {
        const imagePath = path.join(__dirname, '..', event.image);
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }

      await event.remove();
      
      io.emit('eventDeleted', { message: 'An event has been deleted!', eventId: req.params.id });

      res.json({ message: "Event removed" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.attendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      if (event.attendees.includes(req.user._id)) {
        return res.status(400).json({ message: "Already attending this event" });
      }
      event.attendees.push(req.user._id);
      await event.save();
      
      io.emit('eventAttended', { message: 'A user has attended an event!', event });

      res.json({ message: "Successfully attending the event" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.unattendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      event.attendees = event.attendees.filter(
        (attendee) => attendee.toString() !== req.user._id.toString()
      );
      await event.save();
      
      io.emit('eventUnattended', { message: 'A user has unattended an event!', event });

      res.json({ message: "Successfully unattended the event" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};