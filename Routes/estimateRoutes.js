const express = require('express');
const {createEstimate, deleteEstimate, getEstimates, getEstimateById, updateEstimate} = 
require('../controllers/estimateController');
const { protect } = require('../middlewares/middleware');
const router = express.Router();

router.post('/createEstimate', protect, createEstimate);
router.get('/getAllEstimates', protect, getEstimates);
router.get('/getEstimate/:estimateId', protect, getEstimateById);
router.put('/updateEstimate/:estimateId', protect, updateEstimate);
router.delete('/deleteEstimate/:id', protect, deleteEstimate);

module.exports = router;
