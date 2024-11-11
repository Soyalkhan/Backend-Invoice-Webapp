const app = require('./app'); 

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`INVOICE WEB APP POWERED BY DDC RUNNING ON PORT ${PORT}`); 
});

const server = app.listen(PORT, ( req,res) => {
    console.log(`Server running on port ${PORT}`);
    
});

app.get('/', (req,res) =>{
    res.send()
});

// Catch-all route for 404 errors
app.use((req, res) => {
    res.status(404).send("404 NO RELEVENT API FOUND");
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
