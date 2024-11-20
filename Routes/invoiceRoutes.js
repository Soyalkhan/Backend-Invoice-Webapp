const express = require('express');
const { createInvoice , updateInvoice , deleteInvoice , getInvoices , getInvoiceBySearch } = require('../controllers/invoiceController');
const { protect } = require('../middlewares/middleware');

const router = express.Router();

router.post('/generateInvoice', protect, createInvoice);
router.put('/updateInvoice/:invoiceId', protect, updateInvoice);
router.delete('/deleteInvoice/:invoiceId', protect, deleteInvoice);
router.get('/fetchAllInvoice', protect, getInvoices);
router.get('/SearchInvoice', protect, getInvoiceBySearch);

module.exports = router;
