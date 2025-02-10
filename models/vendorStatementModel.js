const mongoose = require("mongoose");

const VendorStatementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
    billId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
        required: true,
    },
    transactionType: {
        type: String,
        enum: ["Bill", "Payment Made"],
        required: true,
    },
    details: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMade: { type: Number, default: 0 },
    balance: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    });

module.exports = mongoose.model("VendorStatement", VendorStatementSchema);