const Product = require('../models/productModel'); // Adjust path as needed

exports.createProduct = async (req, res) => {
    const userId = req.user._id; // Extract userId from authenticated request
    const { productName, price, description, hsnCode, tax } = req.body;

    try {
        const newProduct = await Product.create({
            userId,
            productName,
            price,
            description,
            hsnCode,
            tax
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


// Update Product
exports.updateProduct = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const updateData = req.body;

    try {
        // Find product by ID and ensure it belongs to the authenticated user
        const product = await Product.findOneAndUpdate(
            { _id: productId, userId: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found or not authorized' });
        }

        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


// Delete Product
exports.deleteProduct = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    try {
        // Find product by ID and ensure it belongs to the authenticated user
        const product = await Product.findOneAndDelete({ _id: productId, userId: userId });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found or not authorized' });
        }

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};