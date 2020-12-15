const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  coupon: String,
  amount: {
    type: Number,
    required: true,
  },
  paid: Boolean,
  phone: Number,
  email: {
    type: String,
    required: true,
  },
  utm_params: [
    {
      source: String,
      medium: String,
      campaign: String,
      term: String,
    },
  ],
  order_id: String,
  payment_id: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: Date,
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "item",
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
