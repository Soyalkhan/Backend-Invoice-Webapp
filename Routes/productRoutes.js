const express = require('express');
const { createProduct , updateProduct , deleteProduct , getProducts} = require('../controllers/productController');
const { protect } = require('../middlewares/middleware');

const router = express.Router();

router.post('/addProduct', protect, createProduct);
router.put('/:productId', protect, updateProduct);
router.delete('/:productId', protect, deleteProduct);
router.get('/fetchProducts', protect, getProducts);

module.exports = router;
