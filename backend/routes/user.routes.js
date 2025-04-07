
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import mongoose from 'mongoose';

import userModel from '../models/user.model.js';
import checkoutModel from '../models/Checkout.model.js'
import Revenue from '../models/revenue.model.js';
import productModel from '../models/product.model.js'

const router = express.Router();

// Auth0 JWT validation middleware
const checkJwtAuth0 = expressjwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

// Test route
router.get('/test', (req, res) => {
    res.send('test route');
    console.log(process.env.JWT_SECRET);
});

// Regular signup route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json('User already exists');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
        name,
        email,
        password: hashPassword,
        authProvider: 'local',
        role: "user"
    });
    await user.save();
    res.status(200).json({ message: 'User Created', user });
});


router.get('/guest-signup', async (req, res) => {
    try {
        // Generate simple unique ID using timestamp + random number
        const timestamp = Date.now();
        const guestEmail = `guest_${timestamp}@glowzlifestyl.shop`;
        const guestPassword = '11221122'; // You can randomize this too
        const guestName = `Guest_${timestamp}`;

        // Check if somehow this generated email already exists
        const existingUser = await userModel.findOne({ email: guestEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Guest user already exists" });
        }

        const hashedPassword = await bcrypt.hash(guestPassword, 10);

        const newUser = new userModel({
            name: guestName,
            email: guestEmail,
            password: hashedPassword,
            authProvider: 'guest',
            role: 'guest'
        });

        await newUser.save();

        res.status(201).json({
            message: "Guest user created successfully",
            newUser
        });

    } catch (error) {
        console.error("Error during guest signup:", error);
        res.status(500).json({ message: "Server error during guest signup" });
    }
});
// Enhanced Auth0 login endpoint
router.post('/auth0-login', async (req, res) => {
    const { email, name, picture } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Find user by email
        let user = await userModel.findOne({ email });

        if (!user) {
            // Create new user if doesn't exist
            // Note: We don't need password for Auth0 users
            user = new userModel({
                email,
                name: name || email.split('@')[0], // Use part of email as name if not provided
                picture: picture || "https://www.gravatar.com/avatar",
                auth0Id: req.body.sub || `auth0|${Date.now()}`, // Use sub if available or generate a placeholder
                authProvider: "auth0",
                role: "user"
            });
            await user.save();
            console.log("New Auth0 user created:", email);
        } else {
            // Update existing user with latest Auth0 info
            user.name = name || user.name;
            user.picture = picture || user.picture;
            user.auth0Id = req.body.sub || user.auth0Id;
            user.authProvider = "auth0";
            user.lastLogin = new Date();
            await user.save();
            console.log("Auth0 user updated:", email);
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: 30 * 24 * 60 * 60 }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            domain: ".onrender.com",
        });

        res.status(200).json({
            success: true,
            message: 'Auth0 login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: user.picture
            },
            token
        });
    } catch (error) {
        console.error("Auth0 login error:", error);
        res.status(500).json({
            success: false,
            message: "Error processing Auth0 login",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
});

// Regular login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user was created with Auth0, prevent regular password login
        if (user.authProvider === 'auth0') {
            return res.status(400).json({
                message: 'This account uses Auth0 for authentication. Please login with Auth0.'
            });
        }

        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: 30 * 24 * 60 * 60 }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            domain: ".onrender.com",
        });

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: user.picture
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            domain: ".onrender.com",
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update role route
router.put("/update-role", async (req, res) => {
    const { userId, role } = req.body;

    if (!userId || !role) {
        return res.status(400).json({ message: "User ID and role are required." });
    }

    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, { role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "Role updated successfully!", user: updatedUser });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Get all users route
router.get('/get-users', async (req, res) => {
    try {
        const users = await userModel.find({})
        .populate('cart')
        .populate('orderHistory')
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// Get single user route
router.get('/get-user/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userModel.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User found", user });
    } catch (error) {
        res.status(500).json({ message: "Error while searching user", error: error });
    }
});

router.post("/checkout", async (req, res) => {
    // Start a MongoDB session for transactions
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            userId,
            orderedProducts,
            name,
            email,
            phone,
            address,
            city,
            province,
            postalCode,
            country,
            orderNotes,
            orderTotal,
            orderDate,
        } = req.body;

        // Validate required fields according to your schema
        if (!province) {
            return res.status(400).json({
                success: false,
                message: "Province is required"
            });
        }

        // Validate required fields
        if (!userId || !orderedProducts || !orderTotal || !name || !email || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        // Validate orderTotal is a number
        if (isNaN(parseFloat(orderTotal))) {
            return res.status(400).json({
                success: false,
                message: "Order total must be a number"
            });
        }

        // Check stock availability for all products
        for (const product of orderedProducts) {
            const productDoc = await productModel.findById(product.productId);
            const quantity = Number(product.productQuantity) || 1;

            if (!productDoc) {
                await session.abortTransaction();
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${product.productId} not found`
                });
            }

            if (productDoc.stock < quantity) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for product ${productDoc.name}`
                });
            }
        }

        // Create checkout with session
        const checkout = new checkoutModel({
            userId: new mongoose.Types.ObjectId(userId),
            orderedProducts,
            name,
            email,
            phone,
            address,
            city,
            province,
            postalCode,
            country,
            orderNotes,
            orderTotal: parseFloat(orderTotal),
            orderDate: new Date(orderDate || Date.now()),
        });

        const savedCheckout = await checkout.save({ session });

        // Update user data with session
        await userModel.findByIdAndUpdate(
            userId,
            {
                $set: { orderStatus: ['Pending'] },
                $push: { orderHistory: savedCheckout._id },
                $set: { cart: [] }
            },
            { new: true, session }
        );

        // Update product stock with session
        for (const product of orderedProducts) {
            const quantity = Number(product.productQuantity) || 1;
            await productModel.findByIdAndUpdate(
                product.productId,
                { $inc: { stock: -quantity } },
                { new: true, session }
            );
        }

        // Update revenue with session
        await Revenue.findOneAndUpdate(
            {},
            { $inc: { total: parseFloat(orderTotal) } },
            { upsert: true, new: true, session }
        );

        // Commit the transaction
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: "Checkout created successfully",
            data: savedCheckout,
        });
    } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error, could not create checkout",
            error: error.message,
        });
    } finally {
        session.endSession();
    }
});

export default router;