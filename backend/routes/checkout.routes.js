import express from 'express'
import mongoose from 'mongoose'
import Checkout from '../models/Checkout.model.js'



const app = express();

app.get('/order-products', async (req, res) => {
    const { id } = req.query;  // Use req.query to get query parameters
    console.log(id);  // Log the order ID for debugging

    try {
        // Find products based on the order ID
        const order = await Checkout.findById(id);  // Await the promise
        if (!order) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.status(200).json({ message: 'Products found', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default app;