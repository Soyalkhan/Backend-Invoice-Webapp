const express = require("express");
const router = express.Router();
const { protect} = require("../middlewares/middleware")

const { initializeCustomerStatement, addInvoiceToStatement, addPaymentToStatement} = require('../controllers/statementHandler');


// Initialize customer account statement
router.post("/initialize-statement",  protect, initializeCustomerStatement); // i have already initilized in regierter code where customer is creatong account
router.post("/add-invoice",  protect, addInvoiceToStatement);
router.post("/add-payment",  protect, addPaymentToStatement);


module.exports = router;