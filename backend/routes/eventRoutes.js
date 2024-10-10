const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  attendEvent,
  unattendEvent,
} = require("../controllers/eventController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, admin, upload.single('image'), createEvent);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.put("/:id", protect, admin, upload.single('image'), updateEvent);
router.delete("/:id", protect, admin, deleteEvent);
router.post("/:id/attend", protect, attendEvent);
router.delete("/:id/attend", protect, unattendEvent);

module.exports = router;