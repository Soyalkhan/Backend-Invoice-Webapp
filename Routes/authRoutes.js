const express = require('express');
const { registerUser, verifyEmail, login , updateProfile} = require('../controllers/authController');
const { protect } = require('../middlewares/middleware');
const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.put('/updatePofile', protect, updateProfile);

module.exports = router;
