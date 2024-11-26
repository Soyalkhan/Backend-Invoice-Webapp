const mongoose = require("mongoose");

const ProductDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hsnCode: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
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
    subTotalAmount: { type: Number, required: true }

});

const InvoiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brandLogoUrl: { type: String },
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    invoiceDueDate: { type: Date, required: true },
    companyName: { type: String, required: true },
    poNumber: { type: String, default: '' },
    gstNumber: { type: String },
    companyFullAddress: { type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    billTo: {
        customerName: { type: String, required: true },
        companyName: { type: String, required: true },
        phone: { type: String  },
        email: { type: String},
        address: { type: String, required: true },
        city: { type: String, required: true},
        gstNumber: { type: String  },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: String, required: true },
        placeOfSupply: { type: String, required: true }
    },
    shipTo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },    
        pincode: { type: String, required: true },

    },
    products: [
        {
            name: { type: String, required: true },
            hsnCode: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
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
            subTotalAmount: { type: Number, required: true },
        },
    ],
    payment: {
        modeOfPayment: { type: String, default: '' },
        discount: { type: Number, default: 0 },
        tax: { type: Number, required: true },
        paymentMade: { type: Number, default: 0 },
        balanceDue: { type: Number, required: true },
        grandTotal: { type: Number, required: true },
       
    },
    paymentStatus: { 
        type: String, 
        enum: ['paid', 'unpaid', 'partially paid'], 
        default: 'unpaid' 
    },
    customerInvoiceNote: { 
        type: String, 
        default: 'Thanks for business with us!' 
    },
    termsAndCondition: { 
        type: String, 
        default: 'Make sure to clear raised invoice under 30 days! '
    },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);