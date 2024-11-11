const express = require('express');
const { createCustomer } = require('../controllers/customerController');
const { protect } = require('../middlewares/middleware'); 

const router = express.Router();

router.post('/createCustomer', protect, createCustomer); 

module.exports = router;
