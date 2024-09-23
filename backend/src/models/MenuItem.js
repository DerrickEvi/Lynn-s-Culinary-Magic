const mongoose = require("mongoose");

// MenuItem Schema
const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the menu item name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide the price"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
      enum: ["Appetizer", "Main Course", "Dessert", "Beverage"],
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Capitalize the first letter of the name before saving
MenuItemSchema.pre("save", function (next) {
  this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  next();
});

// MenuItem Model
const MenuItem = mongoose.model("MenuItem", MenuItemSchema);

module.exports = MenuItem;