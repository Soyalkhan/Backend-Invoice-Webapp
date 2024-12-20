const express = require('express');
const { registerUser, verifyEmail, login , updateProfile,FetchUserProfile, checkEmailVerfication , updatePaymentFields, UpdateSelectedTemplate} = require('../controllers/authController');
const { protect } = require('../middlewares/middleware');
const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.put('/updatePofile', protect, updateProfile);
router.get('/user-profile', protect, FetchUserProfile);
router.get('/isVerfied', protect,checkEmailVerfication );
router.put('/updatePaymentFields', protect,updatePaymentFields );
router.put('/UpdateSelectedTemplate', protect,UpdateSelectedTemplate );
module.exports = router;
