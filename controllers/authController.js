const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.COMPANY_PASSWORD,
    },
});

exports.registerUser = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ $or: [{ email: email }] });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    try {
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create a new user instance
        const newUser = await User.create({
            email,
            password,
            isVerified: false, // Initially set to false
            verificationToken: verificationToken // Store the token for later verification
        });

        // Save the user instance
        await newUser.save();

        // Send a verification email
        const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: 'noreply@raseed.io',
            to: email,
            subject: 'Email Verification FROM RASEED.IO',
            text: `Please verify your email by clicking the following link: ${verificationLink}`,
        };
        await transporter.sendMail(mailOptions);

        // Use the newUser instance to get the token
        sendTokenResponse(newUser, 201, res, "User registered successfully, Please verify your email from your inbox.");

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = null; // Clear the token after verification
        await user.save();

        res.send("Email verified successfully!");
        res.status(200).json({ success: true, message: 'Email verified successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Generate JWT for user authentication and send in reponse 
const sendTokenResponse = (user, statusCode, res,message) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        message: message,
        user: user.toJSON()
        });
};



exports.login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {    
        return res.status(400).json({ message: 'Please provide email and password' });
    }

 try {
    const user = await User.findOne({ email}).select('+password');

    if (!user){
        return res.status(400).json({ success: false, message: 'User not found'})
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(400).json({ success: false, message: 'Invalid credentials'})   
    }

    sendTokenResponse(user, 200, res, "User logged in successfully");
    
 } catch (error) {
    console.log(err)

    res.status(400).json({success: false , message: 'An error occurred while trying to log in. Please try again later'})
 }
}


//update users profile with all deatils

exports.updateProfile = async (req, res) => {
    const { first_name, last_name, companyName, GST, profileImage, companyFullAddress, country, city, pincode, phone } = req.body;

    try {
        // Find user by ID (using the ID from the JWT token)
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the user's profile with the new data
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.companyName = companyName || user.companyName;
        user.GST = GST || user.GST;
        user.profileImage = profileImage || user.profileImage;
        user.companyFullAddress = companyFullAddress || user.companyFullAddress;
        user.country = country || user.country;
        user.city = city || user.city;
        user.pincode = pincode || user.pincode;
        user.phone = phone || user.phone;

        // Save the updated user data
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};