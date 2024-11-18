const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    companyName: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    profileImage: {
        type: String,
        default: '' // URL of the profile image
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        select: false // hides password by default in queries
    },
    GST: {
        type: String,
        default: ''
    },
    companyFullAddress: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    pincode: {
        type: String,
        default: ''
    },
    socialUrls: {
        facebook: { type: String, default: '' },
        x: { type: String, default: '' },
        youtube: { type: String, default: '' },
        instagram: { type: String, default: '' }
    },
    isVerified: {
        type: Boolean,
        default: false // Set to true after email confirmation
    },
    selectedInvoiceTemplate: {
        type: String,
        default: '1' // Set to true after email confirmation
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    verificationToken: String, // Token for email verification
    verificationTokenExpiry: Date // Expiry date for verification token
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT for user authentication
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('User', UserSchema);
