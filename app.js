const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');


const app = express();

// Connect to the database
connectDB();

// Enable CORS for all routes
app.use(cors());


app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Mount routers
app.use('/api/auth', require('./Routes/authRoutes')); //auth resgiter
app.use('/api/customers', require('./Routes/customerRoutes'));// customers routes
app.use('/api/products' , require('./Routes/productRoutes'));// products routes
app.use('/api/invoice',require('./Routes/invoiceRoutes') )// invoice routes 
app.use('/api/statement',require('./Routes/statementRoutes') )// Statement routes 
app.use('/api/customerStatement',require('./Routes/customerStatementRoutes') )// customer Statement routes 
app.use('/api/brand-logo', require('./Routes/brandLogoRoutes')); // logo manage
app.use('/api/vendor', require('./Routes/vendorRoutes')); // vendor routes
app.use('/api/bill', require('./Routes/billRoutes')); // bill routes
app.use('/api/estimate', require('./Routes/estimateRoutes')); // estimate routes
module.exports = app;