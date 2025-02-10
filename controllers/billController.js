const Bill = require('../models/billModel');
const Statement = require('../models/statementModel');
const Vendor = require('../models/vendorModel');
const VendorStatement = require('../models/vendorStatementModel');

// Create and Save a new Bill
exports.createBill = async (req, res) => {
    const {
      brandLogoUrl,
      billNumber,
      billDate,
      billDueDate,
      companyName,
      billTo,
      shipTo,
      products,
      payment,
      vendorInvoiceNote,
      termsAndCondition,
      poNumber,
      gstNumber,
      companyFullAddress,
      city,
      state,
      country,
      pincode,
      paymentStatus,
      vendorId, // Mapping to vendor
    } = req.body;
  
    try {
      // Step 1: Validate if the vendor exists
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res
          .status(404)
          .json({ success: false, message: "Vendor not found." });
      }
  
      // Step 2: Create the bill
      const bill = new Bill({
        userId: req.user._id,
        vendorId, // Link to the vendor
        brandLogoUrl,
        billNumber,
        billDate,
        billDueDate,
        companyName,
        poNumber,
        gstNumber,
        companyFullAddress,
        city,
        state,
        country,
        pincode,
        paymentStatus,
        billTo,
        shipTo,
        products,
        payment,
        vendorInvoiceNote,
        termsAndCondition,
      });
  
      // Save the bill
      await bill.save();
  
      // Step 3: Get the last balance for the user (business) and the vendor
      const lastUserStatement = await Statement.findOne({ userId: req.user._id }).sort({ date: -1 });
      const previousUserBalance = lastUserStatement ? lastUserStatement.balance : 0;
  
      const lastVendorStatement = await VendorStatement.findOne({
        vendorId,
      }).sort({ date: -1 });
      const previousVendorBalance = lastVendorStatement
        ? lastVendorStatement.balance
        : 0;
  
      // Extract payment details
      const billAmount = payment.grandTotal || 0; // Total bill amount
      const balanceDue = payment.balanceDue || 0; // Unpaid amount
      const paymentMade = billAmount - balanceDue; // Amount paid
  
      // Step 4: Add an entry to the user's (business) statement
      const userStatement = new Statement({
        userId: req.user._id,
        transactionType: "Bill",
        details: `Bill: ${billNumber}, ${companyName}, ${billTo.vendorName}`,
        amount: -billAmount, // Expense for the business
        paymentMade: 0,
        balance: previousUserBalance - billAmount, // Reducing balance as it's an expense
      });
  
      await userStatement.save();
  
      // Step 5: Add an entry to the vendor's statement
      const vendorStatement = new VendorStatement({
        userId: req.user._id,
        vendorId,
        billId: bill._id,
        transactionType: "Bill",
        details: `Bill: ${billNumber}, ${companyName}`,
        amount: billAmount,
        paymentMade: 0,
        balance: previousVendorBalance + billAmount, // Vendor account balance increases
      });
  
      await vendorStatement.save();
  
      // Step 6: Add a payment entry if payment was made at the time of bill creation
      if (paymentMade > 0) {
        const userPaymentStatement = new Statement({
          userId: req.user._id,
          transactionType: "Payment Made",
          details: `Payment made for Bill: ${billNumber}.`,
          amount: 0,
          paymentMade,
          balance: previousUserBalance - billAmount + paymentMade, // Reduce expense from balance
        });
  
        await userPaymentStatement.save();
  
        const vendorPaymentStatement = new VendorStatement({
          userId: req.user._id,
          vendorId,
          billId: bill._id,
          transactionType: "Payment Made",
          details: `Payment made for Bill: ${billNumber}.`,
          amount: 0,
          paymentMade,
          balance: previousVendorBalance + billAmount - paymentMade, // Adjust vendor balance
        });
  
        await vendorPaymentStatement.save();
      }
  
      // Step 7: Respond to the client
      res.status(201).json({
        success: true,
        message: "Bill created successfully, user and vendor statements updated.",
        bill,
      });
    } catch (error) {
      // Catch any error and respond with a failure message
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
// Update a Bill
  exports.updateBill = async (req, res) => {
    const { billId } = req.params;
    const updates = req.body;
  
    try {
      // Step 1: Find the bill by ID and ensure it belongs to the authenticated user
      const bill = await Bill.findOne({
        _id: billId,
        userId: req.user._id,
      });
  
      if (!bill) {
        return res.status(404).json({
          success: false,
          message: "Bill not found or not authorized",
        });
      }
  
      // Step 2: Apply updates to the bill
      Object.keys(updates).forEach((key) => {
        bill[key] = updates[key];
      });
  
      // Step 3: Save the updated bill
      await bill.save();
  
      res.status(200).json({
        success: true,
        message: "Bill updated successfully",
        bill,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Delete a Bill
exports.deleteBill = async (req, res) => {
    const { billId } = req.params;
  
    try {
      const bill = await Bill.findOneAndDelete({
        _id: billId,
        userId: req.user._id,
      });
  
      if (!bill) {
        return res.status(404).json({
          success: false,
          message: "Bill not found or not authorized",
        });
      }
  
      res.status(200).json({ success: true, message: "Bill deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  
  //fetch all bills
  exports.getBills = async (req, res) => {
    try {
      const bills = await Bill.find({ userId: req.user._id });
  
      res.status(200).json({ success: true, bills });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  
  //fetch a single bill
  exports.getBillBySearch = async (req, res) => {
    const { search } = req.query;
  
    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search term is required.",
      });
    }
  
    try {
      const bills = await Bill.find({
        userId: req.user._id,
        $or: [
          { "billTo.vendorName": { $regex: search, $options: "i" } },
          { companyName: { $regex: search, $options: "i" } },
          { "billTo.mobileNumber": { $regex: search, $options: "i" } },
          { invoiceNumber: { $regex: search, $options: "i" } },
          { "billTo.gstNumber": { $regex: search, $options: "i" } },
        ],
      });
  
      if (bills.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No bills found matching the search criteria.",
        });
      }
  
      res.status(200).json({
        success: true,
        bills,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while searching for bills.",
        error: error.message,
      });
    }
  };
  