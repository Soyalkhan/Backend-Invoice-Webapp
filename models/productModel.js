const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productName: {
        type: String,
        required: [true, 'Please add a product title']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    description: {
        type: String,
        default: ''
    },
    hsnCode: {
        type: String,
        default: ''
    },
    tax: {
        cgst: {
            type: String,
            default: ''
        },
        sgst: {
            type: String,
            default: ''
        },
        igst: {
            type: String,
            default: ''
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
