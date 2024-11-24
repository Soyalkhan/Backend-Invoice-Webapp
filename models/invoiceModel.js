const mongoose = require("mongoose");

const ProductDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hsnOrSac: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  tax: { type: Number, required: true }, // Tax in percentage
  amount: { type: Number, required: true }, // Calculated (rate * quantity + tax)
});

const InvoiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brandLogoUrl: { type: String, required: true },
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    invoiceDueDate: { type: Date, required: true },
    companyName: { type: String, required: true },
    poNumber: { type: String, default: '' },
    location: {
        country: { type: String, required: true },
        gstNumber: { type: String, required: true },
        placeOfSupply: { type: String, required: true },
    },
    billTo: {
        customerName: { type: String, required: true },
        address: { type: String, required: true },
        gstNumber: { type: String, required: true },
    },
    shipTo: {
        address: { type: String, required: true },
    },
    products: [
        {
            name: { type: String, required: true },
            hsnOrSac: { type: String, required: true },
            quantity: { type: Number, required: true },
            rate: { type: Number, required: true },
            tax: { type: Number, required: true },
            amount: { type: Number, required: true },
        },
    ],
    payment: {
        modeOfPayment: { type: String, default: '' },
        total: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        tax: { type: Number, required: true },
        paymentMade: { type: Number, default: 0 },
        balanceDue: { type: Number, required: true },
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