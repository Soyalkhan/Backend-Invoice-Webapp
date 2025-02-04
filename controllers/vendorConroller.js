const Vendor = require('../models/vendorModel');

//create vendor
exports.createVendor = async (req, res) => {
    const userId = req.user._id; // Assume userId is extracted from JWT middleware
    const { firstName, lastName, companyName, email, phone, gstNumber, billingAddress, shippingAddress } = req.body;

    try {
        const newVendor = await Vendor.create({
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
            message: "Vendor created successfully",
            vendor: newVendor
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

//fetch all vendor
exports.fetchAllVendor = async (req, res) => {
    const userId = req.user._id; // Get the userId from the authenticated request

    try {
        const vendor = await Vendor.find({ userId: userId }); // Find  all vendor for this user
        res.status(200).json({
            success: true,
            vendor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

//fetch vendor by id
exports.fetchVendorById = async (req, res) => {
    const userId = req.user._id; // Get the userId from the authenticated request
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findOne({ userId: userId, _id: vendorId }); // Find vendor for this user
        res.status(200).json({
            success: true,
            vendor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

//update vendor
exports.updateVendor = async (req, res) => {
    const userId = req.user._id; // Get the userId from the authenticated request
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findOneAndUpdate({ userId: userId, _id: vendorId }, req.body, { new: true });
        res.status(200).json({
            success: true,
            vendor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}


//delete vendor
exports.deleteVendor = async (req, res) => {
    const userId = req.user._id; // Get the userId from the authenticated request
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findOneAndDelete({ userId: userId, _id: vendorId });
        res.status(200).json({
            success: true,
            message: "Vendor deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}
