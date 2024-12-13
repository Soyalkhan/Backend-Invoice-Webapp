// Import required modules
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;
const User = require("../models/userModel"); // Adjust the path as per your project structure

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle single file uploads
// const uploadMiddleware = upload.single("brandLogo");

// Upload Brand Logo
async function uploadLogo(req, res) {
    const file = req.file;

    if (!file) {
        return res
            .status(400)
            .json({ success: false, message: "Please provide a logo to upload." });
    }

    const fileName = `brand-logos/${uuid()}-${file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        // Fetch the user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Delete the old logo if it exists
        if (user.brandLogoUrl) {
            const oldKey = user.brandLogoUrl.split('/').slice(-2).join('/');
            console.log(`Deleting old logo: ${oldKey}`);
            await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: oldKey }).promise();
        }

        // Upload the new logo to S3
        console.log(`Uploading new logo: ${fileName}`);
        const data = await s3.upload(params).promise();

        // Update the user's brandLogoUrl in the database
        user.brandLogoUrl = data.Location;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Brand logo uploaded successfully.",
            brandLogoUrl: data.Location,
        });
    } catch (err) {
        console.error("Error during upload process:", err);
        res.status(500).json({ success: false, message: "Error uploading brand logo." });
    }
}


// Edit Brand Logo
async function editLogo(req, res) {
    const file = req.file;

    if (!file) {
        return res
            .status(400)
            .json({ success: false, message: "Please provide a logo to upload." });
    }

    const fileName = `brand-logos/${uuid()}-${file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        // Fetch the user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Delete the old logo if it exists
        if (user.brandLogoUrl) {
            const oldKey = user.brandLogoUrl.split('/').slice(-2).join('/');
            console.log(`Deleting old logo: ${oldKey}`);
            await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: oldKey }).promise();
        }

        // Upload the new logo to S3
        console.log(`Uploading new logo: ${fileName}`);
        const data = await s3.upload(params).promise();

        // Update the user's brandLogoUrl in the database
        user.brandLogoUrl = data.Location;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Brand logo updated successfully.",
            brandLogoUrl: data.Location,
        });
    } catch (err) {
        console.error("Error during edit process:", err);
        res.status(500).json({ success: false, message: "Error updating brand logo." });
    }
}


// Remove Brand Logo
async function removeLogo(req, res) {
    try {
        // Fetch the user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (!user.brandLogoUrl) {
            return res.status(400).json({ success: false, message: "No logo to delete." });
        }

        // Extract the old logo key
        const logoKey = user.brandLogoUrl.split('/').slice(-2).join('/');
        console.log(`Deleting logo: ${logoKey}`);

        // Delete the file from S3
        await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: logoKey }).promise();

        // Remove the logo URL from the database
        user.brandLogoUrl = '';
        await user.save();

        res.status(200).json({ success: true, message: "Brand logo removed successfully." });
    } catch (err) {
        console.error("Error during delete process:", err);
        res.status(500).json({ success: false, message: "Error removing brand logo." });
    }
}


module.exports = {
  uploadLogo,
  editLogo,
  removeLogo,
};
