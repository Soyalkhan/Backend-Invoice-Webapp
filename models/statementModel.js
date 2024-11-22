const mongoose = require("mongoose");

const StatementSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactionType: {
    type: String,
    enum: ["Invoice", "Payment Received"],
    required: true,
  },
  details: { type: String, required: true }, // Invoice number, person name, or company name
  amount: { type: Number, default: 0 }, // For invoices
  paymentReceived: { type: Number, default: 0 }, // For payments
  balance: { type: Number, required: true }, // Running balance
});

module.exports = mongoose.model("Statement", StatementSchema);
