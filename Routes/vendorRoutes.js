const express = require('express');
const { createVendor, fetchAllVendor, fetchVendorById, updateVendor, deleteVendor  } = require('../controllers/vendorConroller');
const { protect } = require('../middlewares/middleware');

const router = express.Router();

router.post('/createVendor', protect, createVendor);
router.get('/fetchAllVendor', protect, fetchAllVendor);
router.get('/fetchVendorById/:id', protect, fetchVendorById);
router.put('/updateVendor/:id', protect, updateVendor);
router.delete('/deleteVendor/:id', protect, deleteVendor);


module.exports = router;