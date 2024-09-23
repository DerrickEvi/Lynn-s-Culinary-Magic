const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require("../controllers/menuItemController");

// Create a new menu item
router.post("/", createMenuItem);

// Get all menu items
router.get("/", getMenuItems);

// Get a single menu item by ID
router.get("/:id", getMenuItem);

// Update a menu item
router.put("/:id", updateMenuItem);

// Delete a menu item
router.delete("/:id", deleteMenuItem);

module.exports = router;