const express = require('express');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');


// Create Express app
const app = express();
const port = 5000;

//creare the api
app.use(express.json());

// Connect to MongoDB

async function dbconnect() {
    if (mongoose.connection.readyState >= 1) {  
        console.log('MongoDB done');
        return;
    }
    try {
        await mongoose.connect('mongodb://localhost:27017/micro');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

dbconnect();


//Post Route
const Product = require('./models/products');

app.post('/api/products', async (req, res) => {
    try {
        const { name, category, price } = req.body;
        if (!name || !category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }
        const product = await Product.create({ name, category, price });

        res.status(200).json({
            success: true,
            message: "Successfully",
            data: product
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})



// GET 
app.get('/api/products',async (req , res) => {
    try {
        const products = await Product.find(req.query).sort({ createdAt: -1 });
        res.json({ success: true, data: products ,count:products.length})
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get products',  
            error: error.message
        });
    }
});





// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});