const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference to Product
      quantity: { type: Number, default: 1 }
    }
  ]
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
