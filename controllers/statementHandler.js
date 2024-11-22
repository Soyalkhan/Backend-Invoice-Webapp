import Statement from '../models/statementModel'

//adding invoice statement when invoice created
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
        transactionType: 'Invoice',
        details: `Invoice: ${invoiceNumber}, ${companyName}, ${personName}`,
        amount,
        balance: newBalance,
      });
  
      await statement.save();
  
      res.status(201).json({
        success: true,
        message: 'Invoice added to statement successfully',
        statement,
      });
    } catch (error) {
      console.error('Error adding invoice to statement:', error);
      res.status(500).json({ success: false, message: 'Error adding invoice to statement' });
    }
  };
  


  //adding transection for payment recevied 
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
        transactionType: 'Payment Received',
        details: `Payment: ${paymentReference}, ${personName}`,
        paymentReceived: amount,
        balance: newBalance,
      });
  
      await statement.save();
  
      res.status(201).json({
        success: true,
        message: 'Payment added to statement successfully',
        statement,
      });
    } catch (error) {
      console.error('Error adding payment to statement:', error);
      res.status(500).json({ success: false, message: 'Error adding payment to statement' });
    }
  };
  