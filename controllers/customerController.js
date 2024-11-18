const Customer = require('../models/customerModel');

exports.createCustomer = async (req, res) => {
    const  userId  = req.user._id; // Assume userId is extracted from JWT middleware
    const { firstName, lastName, companyName, email, phone, gstNumber, billingAddress, shippingAddress } = req.body;

    try {
        const newCustomer = await Customer.create({
            userId,
            firstName,
            lastName,
            companyName,
            email,
            phone,
            gstNumber,
            billingAddress,
            shippingAddress,
        });

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customer: newCustomer
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


// Get all customer for a specific user
exports.fetchAllcusomer = async (req, res) => {
    const userId = req.user._id; // Get the userId from the authenticated request

    try {
        const customer = await Customer.find({ userId: userId }); // Find products for this user
        res.status(200).json({
            success: true,
            customer
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};