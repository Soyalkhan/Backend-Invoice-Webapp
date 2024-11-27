const Statement = require("../models/statementModel");

// Initialize statement with opening balance when customer account is created
exports.initializeCustomerStatement = async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if the user already has statements
    const existingStatement = await Statement.findOne({ userId });
    if (existingStatement) {
      return res.status(400).json({
        success: false,
        message: "Statement already initialized for this user.",
      });
    }

    // Create the opening balance statement
    const statement = new Statement({
      userId,
      transactionType: "Opening Balance",
      details: "Account initialized with an opening balance of 0.",
      amount: 0,
      paymentReceived: 0,
      balance: 0,
    });

    await statement.save();

    res.status(201).json({
      success: true,
      message: "Statement initialized successfully.",
      statement,
    });
  } catch (error) {
    console.error("Error initializing statement:", error);
    res.status(500).json({ success: false, message: "Error initializing statement." });
  }
};

// Add invoice to the statement
exports.addInvoiceToStatement = async (req, res) => {
  const { userId, invoiceNumber, companyName, personName, amount } = req.body;

  try {
    // Get the last balance
    const lastEntry = await Statement.findOne({ userId }).sort({ date: -1 });
    const previousBalance = lastEntry ? lastEntry.balance : 0;

    // New balance after adding the invoice
    const newBalance = previousBalance + amount;

    // Create a new statement entry
    const statement = new Statement({
      date: new Date(),
      userId,
      transactionType: "Invoice",
      details: `Invoice: ${invoiceNumber}, ${companyName}, ${personName}`,
      amount,
      balance: newBalance,
    });

    await statement.save();

    res.status(201).json({
      success: true,
      message: "Invoice added to statement successfully.",
      statement,
    });
  } catch (error) {
    console.error("Error adding invoice to statement:", error);
    res.status(500).json({ success: false, message: "Error adding invoice to statement." });
  }
};

// Add payment to the statement
exports.addPaymentToStatement = async (req, res) => {
  const { userId, paymentReference, personName, amount } = req.body;

  try {
    // Get the last balance
    const lastEntry = await Statement.findOne({ userId }).sort({ date: -1 });
    const previousBalance = lastEntry ? lastEntry.balance : 0;

    // New balance after payment
    const newBalance = previousBalance - amount;

    // Create a new statement entry
    const statement = new Statement({
      date: new Date(),
      userId,
      transactionType: "Payment Received",
      details: `Payment: ${paymentReference}, ${personName}`,
      paymentReceived: amount,
      balance: newBalance,
    });

    await statement.save();

    res.status(201).json({
      success: true,
      message: "Payment added to statement successfully.",
      statement,
    });
  } catch (error) {
    console.error("Error adding payment to statement:", error);
    res.status(500).json({ success: false, message: "Error adding payment to statement." });
  }
};




// Fetch all transactions for a user
exports.getUserStatements = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a route parameter

  try {
    // Fetch all statements for the user, sorted by date (most recent first)
    const statements = await Statement.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      statements,
    });
  } catch (error) {
    console.error("Error fetching user statements:", error);
    res.status(500).json({ success: false, message: "Error fetching user statements." });
  }
};