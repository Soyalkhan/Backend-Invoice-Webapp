const mongoose = require("mongoose");

const CustomerStatementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
  transactionType: { type: String, enum: ["Invoice", "Payment Received"], required: true },
  details: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentReceived: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CustomerStatement", CustomerStatementSchema);