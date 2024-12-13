const express = require('express');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });
const { uploadLogo, editLogo, removeLogo } = require('../controllers/brandLogoController');
const { protect } = require('../middlewares/middleware'); 
const uploadMiddleware = upload.single("brandLogo");
// Express Router Setup
const router = express.Router();

router.post('/upload', protect, uploadMiddleware,  uploadLogo);
router.put('/edit', protect, uploadMiddleware,  editLogo);
router.delete('/remove', protect, removeLogo);



module.exports = router;
