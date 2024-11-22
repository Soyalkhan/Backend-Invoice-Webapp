const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    country: { type: String, required: true },
    address1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
    
});

const CustomerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, default: '' },
    email: { type: String, required: true},
    phone: { type: String, required: true },
    gstNumber: { type: String, default: '' },
    billingAddress: { type: AddressSchema, required: true },
    shippingAddress: { type: AddressSchema, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
