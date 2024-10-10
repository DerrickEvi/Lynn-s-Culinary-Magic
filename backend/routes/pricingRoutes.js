const express = require("express");
const router = express.Router();
const calculateEventPrice = require("../utils/pricing");

router.post("/calculate", (req, res) => {
  const { duration, attendees } = req.body;
  
  if (!duration || !attendees) {
    return res.status(400).json({ message: "Duration and attendees are required" });
  }

  const price = calculateEventPrice(duration, attendees);
  res.json({ price });
});

module.exports = router;