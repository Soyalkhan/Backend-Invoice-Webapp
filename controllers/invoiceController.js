const Invoice = require('../models/invoiceModel')

exports.createInvoice = async (req, res) => {
    const { 
        brandLogoUrl, invoiceNumber, invoiceDate, invoiceDueDate, companyName, 
        location, billTo, shipTo, productDetails, payment 
    } = req.body;

    try {
        // Calculate subtotal, tax, and balance due from product details
        const subtotal = productDetails.reduce((sum, product) => sum + (product.quantity * product.rate), 0);
        const tax = productDetails.reduce((sum, product) => sum + product.tax, 0);
        const balanceDue = subtotal - payment.discount + tax - payment.paymentMade;

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
            productDetails,
            payment: { ...payment, subtotal, tax, balanceDue },
        });

        await invoice.save();

        res.status(201).json({ success: true, message: 'Invoice created successfully', invoice });
    } catch (error) {
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

        // Recalculate balance due
        const subtotal = invoice.productDetails.reduce((sum, product) => sum + (product.quantity * product.rate), 0);
        const tax = invoice.productDetails.reduce((sum, product) => sum + product.tax, 0);
        invoice.payment.subtotal = subtotal;
        invoice.payment.tax = tax;
        invoice.payment.balanceDue = subtotal - invoice.payment.discount + tax - invoice.payment.paymentMade;

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


exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ userId: req.user._id });
        res.status(200).json({ success: true, invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getInvoiceBySearch = async (req, res) => {
    const { search } = req.query;

    try {
        // Perform a case-insensitive search on the specified fields
        const invoice = await Invoice.findOne({
            userId: req.user._id, // Ensure it belongs to the authenticated user
            $or: [
                { 'billTo.customerName': { $regex: search, $options: 'i' } }, // Customer Name
                { companyName: { $regex: search, $options: 'i' } }, // Company Name
                { 'billTo.mobileNumber': { $regex: search, $options: 'i' } }, // Mobile Number
                { invoiceNumber: { $regex: search, $options: 'i' } }, // Invoice Number
                { 'billTo.gstNumber': { $regex: search, $options: 'i' } }, // GST Number
            ],
        });

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'No invoice found matching the search criteria' });
        }

        res.status(200).json({ success: true, invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
