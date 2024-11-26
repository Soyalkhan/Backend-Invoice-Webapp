const Invoice = require('../models/invoiceModel');
const Statement = require("../models/statementModel");


// exports.createInvoice = async (req, res) => {
//     const { 
//         brandLogoUrl, invoiceNumber, invoiceDate, invoiceDueDate, companyName, 
//         location, billTo, shipTo, products, payment, customerInvoiceNote, termsAndCondition
//     } = req.body;

//     try {
//         // Step 1: Create the invoice
//         const invoice = new Invoice({
//             userId: req.user._id,
//             brandLogoUrl,
//             invoiceNumber,
//             invoiceDate,
//             invoiceDueDate,
//             companyName,
//             location,
//             billTo,
//             shipTo,
//             products,
//             payment,
//             customerInvoiceNote,
//             termsAndCondition  
//         });

//         // Save the invoice to the database
//         await invoice.save();

//         // Step 2: Get the last balance for the logged-in user
//         const lastEntry = await Statement.findOne({ userId: req.user._id }).sort({ date: -1 });
//         const previousBalance = lastEntry ? lastEntry.balance : 0;

//         // Step 3: Check payment status
//         const invoiceAmount = payment.total; // Total amount from the invoice
//         const balanceDue = payment.balanceDue; // Balance due from the payment details
//         const paymentReceived = invoiceAmount - balanceDue; // Payment received (if any)

//         if (balanceDue > 0) {
//             // Invoice is unpaid or partially paid
//             const newBalance = previousBalance + balanceDue;

//             // Add a statement entry for the unpaid invoice
//             const unpaidStatement = new Statement({
//                 userId: req.user._id,
//                 transactionType: "Invoice",
//                 details: `Invoice: ${invoiceNumber}, ${companyName}, ${billTo.customerName} (Unpaid)`,
//                 amount: balanceDue,
//                 balance: newBalance,
//             });

//             await unpaidStatement.save();
//         } else {
//             // Invoice is fully paid
//             const newBalance = previousBalance;

//             // Add a statement entry for the invoice creation
//             const invoiceStatement = new Statement({
//                 userId: req.user._id,
//                 transactionType: "Invoice",
//                 details: `Invoice: ${invoiceNumber}, ${companyName}, ${billTo.customerName} (Paid)`,
//                 amount: invoiceAmount,
//                 balance: newBalance,
//             });

//             await invoiceStatement.save();

//             // Add a statement entry for the payment received
//             const paymentStatement = new Statement({
//                 userId: req.user._id,
//                 transactionType: "Payment Received",
//                 details: `Payment received for Invoice: ${invoiceNumber}`,
//                 paymentReceived: paymentReceived,
//                 balance: newBalance - paymentReceived, // Reflecting the updated balance
//             });

//             await paymentStatement.save();
//         }

//         // Step 4: Respond to the client
//         res.status(201).json({ 
//             success: true, 
//             message: 'Invoice created successfully and payment status tracked in the statement.',
//             invoice,
//         });
//     } catch (error) {
//         // Catch any error and respond with a failure message
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


exports.createInvoice = async (req, res) => {
    const { 
        brandLogoUrl, invoiceNumber, invoiceDate, invoiceDueDate, companyName, 
        location, billTo, shipTo, products, payment, customerInvoiceNote, termsAndCondition
    } = req.body;

    try {
        // Step 1: Create the invoice
        const invoice = new Invoice({
            userId: req.user._id,
            brandLogoUrl,
            invoiceNumber,
            invoiceDate,
            invoiceDueDate,
            companyName,
            location,
            billTo,
            shipTo,
            products,
            payment,
            customerInvoiceNote,
            termsAndCondition  
        });

        // Save the invoice
        await invoice.save();

        // Step 2: Get the last balance for the logged-in user
        const lastEntry = await Statement.findOne({ userId: req.user._id }).sort({ date: -1 });
        const previousBalance = lastEntry ? lastEntry.balance : 0;

        // Step 3: Create a statement entry for the invoice
        const invoiceAmount = payment.total; // Total invoice amount
        const balanceDue = payment.balanceDue; // Balance due (unpaid amount)
        const paymentReceived = invoiceAmount - balanceDue; // Payment received at creation

        // Add the first statement for the invoice
        const invoiceStatement = new Statement({
            userId: req.user._id,
            transactionType: "Invoice",
            details: `Invoice: ${invoiceNumber}, ${companyName}, ${billTo.customerName}`,
            amount: invoiceAmount, // Invoice amount added
            paymentReceived: 0, // No payment received initially
            balance: previousBalance + invoiceAmount, // Update balance with invoice amount
        });

        await invoiceStatement.save();

        // Step 4: If payment is received at creation, add a payment statement
        if (paymentReceived > 0) {
            const paymentStatement = new Statement({
                userId: req.user._id,
                transactionType: "Payment Received",
                details: `Payment received for Invoice: ${invoiceNumber}.`,
                amount: 0, // No additional amount added
                paymentReceived, // Payment received
                balance: previousBalance + invoiceAmount - paymentReceived, // Updated balance
            });

            await paymentStatement.save();
        }

        // Step 5: Respond to the client
        res.status(201).json({ 
            success: true, 
            message: 'Invoice created successfully, payment status updated in the statement.',
            invoice,
        });
    } catch (error) {
        // Catch any error and respond with a failure message
        res.status(500).json({ success: false, message: error.message });
    }
};




exports.updateInvoice = async (req, res) => {
    const { invoiceId } = req.params;
    const updates = req.body;

    try {
        // Find the invoice by ID and ensure it belongs to the authenticated user
        const invoice = await Invoice.findOne({ _id: invoiceId, userId: req.user._id });
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found or not authorized' });
        }

        // Apply updates
        Object.keys(updates).forEach((key) => {
            invoice[key] = updates[key];
        });

        await invoice.save();

        res.status(200).json({ success: true, message: 'Invoice updated successfully', invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.deleteInvoice = async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const invoice = await Invoice.findOneAndDelete({ _id: invoiceId, userId: req.user._id });
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found or not authorized' });
        }

        res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch all invoices for the authenticated user
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ userId: req.user._id });
        
        res.status(200).json({ success: true, invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search invoices based on various fields
exports.getInvoiceBySearch = async (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({ 
            success: false, 
            message: "Search term is required." 
        });
    }

    try {
        const invoices = await Invoice.find({
            userId: req.user._id,
            $or: [
                { 'billTo.customerName': { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { 'billTo.mobileNumber': { $regex: search, $options: 'i' } },
                { invoiceNumber: { $regex: search, $options: 'i' } },
                { 'billTo.gstNumber': { $regex: search, $options: 'i' } },
            ],
        });

        if (invoices.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No invoices found matching the search criteria.',
            });
        }

        res.status(200).json({
            success: true,
            invoices,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "An error occurred while searching for invoices.", 
            error: error.message 
        });
    }
};
