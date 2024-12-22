const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product", 
          required: true, 
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "pending" },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "creditCard", "paypal"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
