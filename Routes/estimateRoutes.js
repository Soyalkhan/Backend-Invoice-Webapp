import express from 'express';
import { createEstimate, deleteEstimate, getEstimates, getEstimateById, updateEstimate } 
from '../controllers/estimateController.js';

const router = express.Router();

router.post('/createEstimate', createEstimate);
router.get('/getAllEstimates', getEstimates);
router.get('/getEstimate/:estimateId', getEstimateById);
router.put('/updateEstimate/:estimateId', updateEstimate);
router.delete('/deleteEstimate/:id', deleteEstimate);

export default router;
