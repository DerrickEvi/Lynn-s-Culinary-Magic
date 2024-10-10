const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/favorites", protect, getFavorites);
router.post("/favorites/:eventId", protect, addFavorite);
router.delete("/favorites/:eventId", protect, removeFavorite);

module.exports = router;