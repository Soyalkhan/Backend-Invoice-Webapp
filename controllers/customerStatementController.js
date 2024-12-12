const CustomerStatement = require("../models/customerStatementModel");

// Initialize customer statement with opening balance
exports.initializeCustomerStatement = async (req, res) => {
  const { customerId, userId } = req.body;

  try {
    // Check if the customer already has statements
    const existingStatement = await CustomerStatement.findOne({ customerId });
    if (existingStatement) {
      return res.status(400).json({
        success: false,
        message: "Statement already initialized for this customer.",
      });
    }

    // Create the opening balance statement
    const statement = new CustomerStatement({
      userId,
      customerId,
      transactionType: "Opening Balance",
      details: "Account initialized with an opening balance of 0.",
      amount: 0,
      paymentReceived: 0,
      balance: 0,
    });

    await statement.save();

    res.status(201).json({
      success: true,
      message: "Customer statement initialized successfully.",
      statement,
    });
  } catch (error) {
    console.error("Error initializing customer statement:", error);
    res.status(500).json({ success: false, message: "Error initializing customer statement." });
  }
};

// Add invoice to customer statement
exports.addInvoiceToCustomerStatement = async (req, res) => {
  const { customerId, userId, invoiceId, invoiceNumber, companyName, amount } = req.body;

  try {
    // Get the last balance for the customer
    const lastEntry = await CustomerStatement.findOne({ customerId }).sort({ date: -1 });
    const previousBalance = lastEntry ? lastEntry.balance : 0;

    // New balance after adding the invoice
    const newBalance = previousBalance + amount;

    // Create a new statement entry
    const statement = new CustomerStatement({
      date: new Date(),
      userId,
      customerId,
      invoiceId,
      transactionType: "Invoice",
      details: `Invoice: ${invoiceNumber}, ${companyName}`,
      amount,
      paymentReceived: 0,
      balance: newBalance,
    });

    await statement.save();

    res.status(201).json({
      success: true,
      message: "Invoice added to customer statement successfully.",
      statement,
    });
  } catch (error) {
    console.error("Error adding invoice to customer statement:", error);
    res.status(500).json({ success: false, message: "Error adding invoice to customer statement." });
  }
};

// Add payment to customer statement
exports.addPaymentToCustomerStatement = async (req, res) => {
  const { customerId, userId, paymentReference, amount } = req.body;

  try {
    // Get the last balance for the customer
    const lastEntry = await CustomerStatement.findOne({ customerId }).sort({ date: -1 });
    const previousBalance = lastEntry ? lastEntry.balance : 0;

    // New balance after payment
    const newBalance = previousBalance - amount;

    // Create a new statement entry
    const statement = new CustomerStatement({
      date: new Date(),
      userId,
      customerId,
      transactionType: "Payment Received",
      details: `Payment: ${paymentReference}`,
      amount: 0,
      paymentReceived: amount,
      balance: newBalance,
    });

    await statement.save();

    res.status(201).json({
      success: true,
      message: "Payment added to customer statement successfully.",
      statement,
    });
  } catch (error) {
    console.error("Error adding payment to customer statement:", error);
    res.status(500).json({ success: false, message: "Error adding payment to customer statement." });
  }
};

// Fetch customer statements
exports.getCustomerStatements = async (req, res) => {
  const { customerId } = req.query;

  try {
    // Fetch all statements for the customer, sorted by date (most recent first)
    const statements = await CustomerStatement.find({ customerId }).sort({ date: -1 });

    if (!statements || statements.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No statements found for this customer.",
      });
    }

    res.status(200).json({
      success: true,
      statements,
    });
  } catch (error) {
    console.error("Error fetching customer statements:", error);
    res.status(500).json({ success: false, message: "Error fetching customer statements." });
  }
};
