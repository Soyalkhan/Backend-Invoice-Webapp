const express = require('express');
const { 
    createBill, 
    updateBill, 
    deleteBill, 
    getBills, 
    getBillBySearch 
} = require('../controllers/billController');
const { protect } = require('../middlewares/middleware');

const router = express.Router();

// Create a new vendor bill
router.post('/generateBill', protect, createBill);

// Update an existing vendor bill
router.put('/updateBill/:billId', protect, updateBill);

// Delete a vendor bill
router.delete('/deleteBill/:billId', protect, deleteBill);

// Fetch all vendor bills for the authenticated user
router.get('/fetchAllBills', protect, getBills);

// Search vendor bills based on various fields
router.get('/search', protect, getBillBySearch);

module.exports = router;
