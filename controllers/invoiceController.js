const Invoice = require('../models/invoiceModel');

exports.createInvoice = async (req, res) => {
    const { 
        brandLogoUrl, invoiceNumber, invoiceDate, invoiceDueDate, companyName, 
        location, billTo, shipTo, products, payment 
    } = req.body;

    try {
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
            payment,  // Payment is passed directly without calculation
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
