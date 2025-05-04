

import express from 'express';
import cloudinary, { cloudinaryConnect } from '../config/cloudinary.js';
import upload from '../middleware/multer.js';
import productModel from '../models/product.model.js';
import orderModel from '../models/Checkout.model.js'
import userModel from '../models/user.model.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import bcrypt from 'bcrypt'


const router = express();
cloudinaryConnect();

// Helper function to upload images to Cloudinary
const uploadImgsToCloudinary = async (files) => {
    try {
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file.path)
        );
        const results = await Promise.all(uploadPromises);
        return results.map(result => result.secure_url);
    } catch (error) {
        console.error('Error uploading images:', error);
    }
};


``

router.post('/add-product', verifyAdmin, upload.array('images'), async (req, res) => {
    try {
        // Parse the product data from the JSON string
        const productData = JSON.parse(req.body.productData);
        console.log(productData)

        // Validate required fields
        if (!productData.name || !productData.price || !productData.description ||
            !productData.stock || !productData.category) {
            return res.status(400).json({
                message: 'Name, price, stock, and description are required fields'
            });
        }


        // Upload images to Cloudinary
        const imageUrls = req.files?.length ? await uploadImgsToCloudinary(req.files) : [];

        // Create new product document
        const newProduct = new productModel({
            ...productData,
            img: imageUrls // Make sure this matches your schema
        });

        // Save product to database
        const savedProduct = await newProduct.save();

        // Return success response
        res.status(201).json({
            message: 'Product added successfully',
            product: savedProduct
        });
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({
            message: 'Failed to add product',
            error: error.message
        });
    }
});
// Product routes (Protected)
router.post('/add-product2', verifyAdmin, upload.array('image'), async (req, res) => {
    try {
        const { name, tagline, price, discountPrice, description, stock, size, SKU, category, tag } = req.body;

        if (!name || !price || !stock) {
            return res.status(400).json({ message: 'Name, price, and stock are required' });
        }



        const imageUrls = req.files?.length ? await uploadImgsToCloudinary(req.files) : [];

        const product = new productModel({
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            images: imageUrls,
            size,
            SKU,
            category,
            tag,
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.delete('/delete-product/:id', verifyAdmin, async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted", product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/edit-product/:id', verifyAdmin, upload.array('images', 5), async (req, res) => {
    try {

        const productData = JSON.parse(req.body.productData);
        // Destructure the required fields
        const { name, tagline, price, discountPrice, description, stock, size, SKU, category, tag, color, technicalSpecs, features } = productData;

        // Handle the images coming in the form
        let imageUrls = req.body.images || [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = await uploadImgsToCloudinary(req.files);  // Assume this uploads images to Cloudinary
            imageUrls = [...imageUrls, ...uploadedImages];
        }

        // Handle color format: frontend sends an array of objects { name, hex }
        const colors = Array.isArray(color)
            ? color.map(c => c.trim()).filter(c => c !== "")  // If color is an array, handle it
            : color ? color.split(',').map(c => c.trim()).filter(c => c !== "") : [];  // If it's a string, split and trim it

        // Handling image removal (if any)
        let existingImages = JSON.parse(req.body.existingImages || '[]');
        let imagesToRemove = JSON.parse(req.body.imagesToRemove || '[]');

        // Filter out images to remove from the existing images array
        imageUrls = existingImages.filter(img => !imagesToRemove.includes(img));

        // Update the product in the database
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                stock,
                color: colors,  // Update color
                images: imageUrls,  // Update images (including uploaded and removed ones)
                size,
                category,
                tag,
                SKU,
                tagline,  // New field to save tagline
                technicalSpecs,  // New field to save technical specs
                features,  // New field to save features
                discountPrice,  // New field to save discount price
            },
            { new: true }
        );
console.log(updatedProduct)
        // Check if product is found
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Send the updated product details
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error while updating the product", error: error.message });
    }
});


router.post('/add-user', verifyAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await user.save();

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

router.post('/delete-user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userModel.findByIdAndDelete(userId);
        if (user) {
            res.status(200).json({ message: "User deleted successfully", user });
        } else {
            res.status(404).json({ message: "User with this ID does not exist" });
        }
    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
});
router.delete('/cancel-order/:id', async (req, res) => {
    const orderId = req.params.id;
    console.log(orderId)
    try {
        const order = await orderModel.findOneAndDelete({ _id: orderId })
        console.log(order)
        if (!order) {
            return res.status(404).json({ message: "no order found" })
        }
        res.status(200).json({ message: "order deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
})




export default router;
