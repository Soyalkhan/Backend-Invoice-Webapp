import mongoose from 'mongoose';

const estimateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    brandLogoUrl: {type: String},
    estimateNumber: {type: Number , required: true},
    estimatedate: {type: Date , required: true},
    estimateDueDate: {type: Date , required: true},
    companyName: {type: String , required: true},
    poNumber: {type: Number},
    gstNumber: {type: Number},
    companyFullAddress: {type: String},
    city: {type: String},
    state: {type: String},
    country : {type: String},
    pincode: {type: Number},

    billTo:{
        customerName: {type: String},
        companyName: {type: String},
        phone : {type: Number},
        email: {type: String},
        address: {type: String},
        city: {type: String},
        gstNumber: {type: Number},
        state: {type: String},
        country: {type: String},
        pincode: {type: Number},
    },

    shipTo:{
        address: {type: String},
        city: {type: String},
        state: {type: String},
        country: {type: String},
        pincode: {type: Number},
    },

    products: [{
        Name: {type: String , required: true},
        hascode: {type: String , required: true},
        quantity: {type: Number , required: true},
        price: {type: Number , required: true},
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
        subTotalAmount: {type: Number, required: true}

    }],

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
    estimateNote: {
        type: String, 
        default: 'Thanks for business with us!' 
    },
    termsAndCondition: {
         type: String, 
        default: 'Make sure to clear raised invoice under 30 days! '
    },
}, { timestamps: true });

const Estimate = mongoose.model('Estimate', estimateSchema);

export default Estimate;