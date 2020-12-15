const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
