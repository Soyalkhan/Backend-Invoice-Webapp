const VendorStatement = require('../models/vendorStatementModel');

exports.initializeVendorStatement = async (req, res) => {
    const { vendorId, userId } = req.body;

    try {   
        // Check if the vendor already has statements
        const existingStatement = await VendorStatement.findOne({ vendorId });
        if (existingStatement) {
            return res.status(400).json({
                success: false,
                message: "Statement already initialized for this vendor.",
            });
        }

        // Create the opening balance statement
        const statement = new VendorStatement({
            userId,
            vendorId,
            transactionType: "Opening Balance",
            details: "Account initialized with an opening balance of 0.",
            amount: 0,
            paymentReceived: 0,
            balance: 0,     
        });

        await statement.save();

        res.status(201).json({
            success: true,
            message: "Vendor statement initialized successfully.",
            statement,
        });
    } catch (error) {
        console.error("Error initializing vendor statement:", error);   
        res.status(500).json({
            success: false,
            message: "Error initializing vendor statement.",
        });   
    }    
}   
      

exports.addBillToVendorStatement = async (req ,  res) =>{
    const { vendorId, userId, billId, billNo, companyName, amount } = req.body;

    try{
        //Get the last balance for the vendor
        const lastEntry = await VendorStatement.findOne({vendorId}).sort({date : -1});
        const previousBalance = lastEntry ? lastEntry.balance : 0;


        //New Balance after adding the bill
        const newBalance = previousBalance + amount;
        // Create a new statement entry
            const statement = new VendorStatement({
            date: new Date(),
            userId,
            vendorId,
            billId,
            transactionType: "Bill",
            details: `Bill: ${billNo}, ${companyName}`,
            amount,
            paymentReceived: 0,
            balance: newBalance,
            });

            await statement.save();

            res.status(201).json({
            success: true,
            message: "Bill added to vendor statement successfully.",
            statement,
            });
        } catch (error) {
            console.error("Error adding invoice to vendor statement:", error);
            res.status(500).json({ success: false, message: "Error adding invoice to vendor statement." });
        }
            
}


exports.addPaymentToVendorStatement = async (req, res) =>{
    const { vendorId, userId, paymentReference, amount } = req.body;

    try{

        //Get the last balance for the vendor
        const lastEntry = await VendorStatement.findOne({ vendorId }).sort({ date: -1 });
        const previousBalance = lastEntry ? lastEntry.balance : 0;

        //New balance after payment 
        const newBalance = previousBalance - amount;

        //Create a new statement entry
        const statement = new VendorStatement({
        date: new Date(),
        userId,
        vendorId,
        transactionType: "Payment Made",
        details: `Payment : ${paymentReference}`,
        amount: 0,
        paymentReceived: amount,
        balance: newBalance,
        });

        await statement.save();

        res.status(201).json({
            success: true,
            message: "Payment added to vendors statement successfully.",
        });
    }catch(error){
console.log("Error adding payment to vendor statement:", error);
res.status(500).json({ success: false, message: "Error adding payment to vendor statement." });

    }
}


exports.getVendorStatement = async (req, res) => {
    const vendorId = req.params.vendorId;

    try {
        const statement = await VendorStatement.find({ vendorId }).sort({ date: -1 });

        if (!statement || statement.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No statement found for this vendor.",
            });
        }
        res.status(200).json({
            success: true,
            statement,
        });
    } catch (error) {
        console.error("Error getting vendor statement:", error);
        res.status(500).json({
            success: false,
            message: "Error getting vendor statement.",
        });             
    }                                   
}   


