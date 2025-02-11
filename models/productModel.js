const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     productName: {
//         type: String,
//         required: [true, 'Please add a product title']
//     },
//     price: {
//         type: Number,
//         required: [true, 'Please add a price']
//     },
//     description: {  
//         type: String,
//         default: ''
//     },
//     hsnCode: {
//         type: String,
//         default: ''
//     },
//     tax: {
//         cgst: {
//             type: String,
//             default: ''
//         },
//         sgst: {
//             type: String,
//             default: ''
//         },
//         igst: {
//             type: String,
//             default: ''
//         }
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

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
    typeOfProduct: {
        type: String,
        enum: ['service', 'goods'],
        required: true
    },
    unit: {
        type: String,
        enum: ['box', 'cm', 'dz', 'ft', 'g', 'in', 'kg', 'km', 'lb', 'mg', 'ml', 'm', 'pcs'],
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        sale: {
            sellingPrice: {
                type: Number,
                required: true
            }, 
        },
        purchase: {
            costPrice: {
                type: Number,
                required: true
            },
            vendorDetails: {
                vendorId: {
                    type: String,
                    default: ''
                },
                vendorName: {
                    type: String,
                    default: ''
                },
                vendorCompanyName: {
                    type: String,
                    default: ''
                }
            }
        }
    },
    hsnAndSacCode: {
        type: String,
        default: ''
    },
    defaultTaxRates: {
        interStateRate: {
            type: String,
            default: ''
        },
        intraStateRate: {
            type: String,
            default: ''
        }
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Product', ProductSchema);
