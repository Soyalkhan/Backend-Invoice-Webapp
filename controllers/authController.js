const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Statement = require("../models/statementModel.js")
dotenv.config({ path: "./.env" });

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.COMPANY_EMAIL,
    pass: process.env.COMPANY_PASSWORD,
  },
});

exports.registerUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const existingUser = await User.findOne({ $or: [{ email: email }] });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create a new user instance
    const newUser = await User.create({
      email,
      password,
      isVerified: false, // Initially set to false
      verificationToken: verificationToken, // Store the token for later verification
    });

    // Save the user instance
    await newUser.save();

     // Initialize the statement with an opening balance
     const statement = new Statement({
      userId: newUser._id,
      transactionType: "***Opening Balance***",
      details: " Account initialized with an opening balance of 0.",
      amount: 0,
      paymentReceived: 0,
      balance: 0,
    });

    await statement.save();

    // Send a verification email
    // const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
    // const mailOptions = {
    //   from: "noreply@raseed.io",
    //   to: email,
    //   subject: "Email Verification FROM RASEED.IO",
    //   text: `Please verify your email by clicking the following link: ${verificationLink}`,
    // };
    // await transporter.sendMail(mailOptions);

    // Use the newUser instance to get the token
    sendTokenResponse(
      newUser,
      201,
      res,
      "User registered successfully, Please verify your email from your inbox. Statment balance created with 0"
    );
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//email send verification check
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = null; // Clear the token after verification
    await user.save();

    res.send("Email verified successfully!");
    
    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.checkEmailVerfication = async (req, res) =>{
  const { token} = req.query;

  try {

    const user = await User.findOne({verificationToken: token});
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Check the isVerified status of the user
    if(user.isVerified){
      return res
      .status(200)
      .json({ 
      success: true,
      isVerified: true, 
      message: "Email is verfied successfully!" });
    }else{
      return res.status(200).json({
        success: true,
        isVerified: false,
        message: "Email not verified yet!"
      });
    }
    
  } catch (error) {
    console.error("Error checking email verification:", error);
    return res.status(500).json({
      success: false,
      isVerified: false,
      message: "An error occurred while verifying the email.",
    });
}
}
// Generate JWT for user authentication and send in reponse
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    message: message,
    user: user.toJSON(),
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res, "User logged in successfully");
  } catch (error) {
    console.log(err);

  
    res
      .status(400)
      .json({
        success: false,
        message:
          "An error occurred while trying to log in. Please try again later",
      });
  }
};

//update users profile with all deatils

exports.updateProfile = async (req, res) => {
  const {
    first_name,
    last_name,
    companyName,
    brandColor,
    GST,
    brandLogoUrl,
    companyFullAddress,
    country,
    city,
    state,
    pincode,
    phone,
    invoice_Number,
    invoice_Prefix,
    total_invoice_amount,
    total_invoice_balance,
    total_invoice_paid_amount
  } = req.body;

  try {
    // Find user by ID (using the ID from the JWT token)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the user's profile with the new data
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.companyName = companyName || user.companyName;
    user.GST = GST || user.GST;
    user.brandLogoUrl = brandLogoUrl || user.brandLogoUrl;
    user.companyFullAddress = companyFullAddress || user.companyFullAddress;
    user.country = country || user.country;
    user.city = city || user.city;
    user.pincode = pincode || user.pincode;
    user.phone = phone || user.phone;
    user.invoice_Number = invoice_Number || user.invoice_Number;
    user.invoice_Prefix = invoice_Prefix || user.invoice_Prefix;
    user.total_invoice_amount = total_invoice_amount || user.total_invoice_amount;
    user.total_invoice_balance = total_invoice_balance || user.total_invoice_balance;
    user.total_invoice_paid_amount = total_invoice_paid_amount || user.total_invoice_paid_amount;
    user.state = state || user.state;
    user.brandColor = brandColor || user.brandColor;
    
    // Save the updated user data
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.FetchUserProfile = async (req, res) => {
  try {

    
    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return user profile details
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        companyName: req.user.companyName,
        GST: req.user.GST,
        brandLogoUrl: req.user.brandLogoUrl,
        companyFullAddress: req.user.companyFullAddress,
        country: req.user.country,
        city: req.user.city,
        pincode: req.user.pincode,
        phone: req.user.phone,
        invoice_Number: req.user.invoice_Number,
        invoice_Prefix: req.user.invoice_Prefix,
        total_invoice_amount: req.user.total_invoice_amount,
        total_invoice_balance: req.user.total_invoice_balance,
        total_invoice_paid_amount: req.user.total_invoice_paid_amount,
        socialUrls: req.user.socialUrls,
        state: req.user.state,
        brandColor: req.user.brandColor,
        selectedInvoiceTemplate: req.user.selectedInvoiceTemplate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//update only payment fileds 
exports.updatePaymentFields = async (req, res) => {
  const {
    invoice_Number,
    total_invoice_amount,
    total_invoice_balance,
    total_invoice_paid_amount
  } = req.body;

  try {
    // Find user by ID (using the ID from the JWT token)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // update only user main amount 
   
    user.invoice_Number = invoice_Number || user.invoice_Number;
    user.total_invoice_amount = total_invoice_amount || user.total_invoice_amount;
    user.total_invoice_balance = total_invoice_balance || user.total_invoice_balance;
    user.total_invoice_paid_amount = total_invoice_paid_amount || user.total_invoice_paid_amount;
    
    // Save the updated user data
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Main amount and invoice number updated",
      user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


// to update invoice teplate 

exports.UpdateSelectedTemplate = async (req, res) => {
  try {
    const { selectedInvoiceTemplate } = req.body; // Get the template from the request body

    if (!req.user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!selectedInvoiceTemplate) {
      return res
        .status(400)
        .json({ success: false, message: "Selected template is required" });
    }

    // Update the selectedInvoiceTemplate in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // Find the user by their ID
      { selectedInvoiceTemplate }, // Update only the selectedInvoiceTemplate field
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found or update failed" });
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Selected invoice template updated successfully",
      user: {
        id: updatedUser._id,
        selectedInvoiceTemplate: updatedUser.selectedInvoiceTemplate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};