const express = require('express');
const { registerUser, verifyEmail, login , updateProfile,FetchUserProfile, checkEmailVerfication} = require('../controllers/authController');
const { protect } = require('../middlewares/middleware');
const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.put('/updatePofile', protect, updateProfile);
router.get('/user-profile', protect, FetchUserProfile);
router.get('/isVerfied', protect,checkEmailVerfication );
module.exports = router;
