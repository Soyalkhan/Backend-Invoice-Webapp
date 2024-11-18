const express = require('express');
const { createCustomer, fetchAllcusomer } = require('../controllers/customerController');
const { protect } = require('../middlewares/middleware'); 

const router = express.Router();

router.post('/createCustomer', protect, createCustomer); 
router.get('/fetchAllCustomer', protect, fetchAllcusomer); 

module.exports = router;
