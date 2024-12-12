const express = require("express");
const {
  initializeCustomerStatement,
  addInvoiceToCustomerStatement,
  addPaymentToCustomerStatement,
  getCustomerStatements,
} = require("../controllers/customerStatementController");
const { protect } = require("../middlewares/middleware");

const router = express.Router();

// Initialize customer statement
router.post("/initializeCustomerStatement", protect, initializeCustomerStatement);

// Add invoice to customer statement
router.post("/add-invoiceToCustomerStatement", protect, addInvoiceToCustomerStatement);

// Add payment to customer statement
router.post("/add-payment-paymentToCustomerStatement", protect, addPaymentToCustomerStatement);

// Fetch customer statements
router.get("/get-particular-Customer-Statements", protect, getCustomerStatements);

module.exports = router;
