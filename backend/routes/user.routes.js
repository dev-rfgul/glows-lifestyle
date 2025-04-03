// import express from 'express';
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'





// import userModel from '../models/user.model.js';



// const router = express.Router();



// router.get('/test', (req, res) => {
//     res.send('test route')
//     console.log(process.env.JWT_SECRET)
// })
// router.post('/signup', async (req, res) => {
//     const { name, email, password } = req.body;

//     const existingUser = await userModel.findOne({ email })
//     if (existingUser) {
//         res.status(400).json('User already exists')
//     }
//     const hashPassword = await bcrypt.hash(password, 10);
//     const user = new userModel({
//         name,
//         email,
//         password: hashPassword,
//         isAdmin: "user"
//     });
//     await user.save();
//     res.status(200).json({ message: 'User Created', user })
// })

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await userModel.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             { id: user._id, email: user.email, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: 30 * 24 * 60 * 60 }
//         );

//         res.cookie("token", token, {
//             httpOnly: true,  // Prevents client-side access
//             secure: true,    // Required for SameSite=None on HTTPS
//             sameSite: "None", // Allows cross-origin cookie sharing
//             maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month expiration
//             domain: ".onrender.com", // Enables subdomain sharing
//         });


//         res.status(200).json({
//             message: 'Login successful',
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             },
//             token
//         });


//     } catch (err) {
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// });


// router.post('/logout', (req, res) => {
//     try {
//         res.clearCookie("token", {
//             httpOnly: true,
//             secure: true, // Must match the secure setting when cookie was set
//             sameSite: "None", // Must match SameSite when cookie was set
//             domain: ".onrender.com", // Ensure it's cleared across subdomains
//         });


//         res.status(200).json({ message: 'Logout successfull' })
//     } catch (error) {
//         res.send(500).json({ message: 'server error ', error: error.message })
//     }
// })
// router.put("/update-role", async (req, res) => {
//     const { userId, role } = req.body;

//     if (!userId || !role) {
//         return res.status(400).json({ message: "User ID and role are required." });
//     }

//     try {
//         const updatedUser = await userModel.findByIdAndUpdate(userId, { role }, { new: true });

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         res.json({ message: "Role updated successfully!", user: updatedUser });
//     } catch (error) {
//         console.error("Error updating role:", error);
//         res.status(500).json({ message: "Server error", error });
//     }
// });
// router.get('/get-users', async (req, res) => {
//     try {
//         const users = await userModel.find({})
//         res.status(200).json(users)
//     }
//     catch (error) {
//         console.log(error)
//     }
// })
// router.get('/get-user/:id', async (req, res) => {
//     const id = req.params.id;
//     try {
//         const user = await userModel.findOne({ _id: id })
//         if (!user) {
//             res.status(404).json({ message: "User not found" })
//         }
//         res.status(200).json({ message: "User found", user })
//     } catch (error) {
//         res.status(500).json({ message: "error while searching user", error: error })
//     }
// })


// export default router;
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import mongoose from 'mongoose';

import userModel from '../models/user.model.js';
import checkoutModel from '../models/Checkout.model.js'

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

        const isPasswordCorrect =bcrypt.compare(password, user.password);
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
        const users = await userModel.find({});
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

// Route to create a new checkout
router.post("/checkout2", async (req, res) => {
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
            latitude,
            longitude,
            orderTotal,
            orderDate,
        } = req.body;

        // Create a new Checkout document
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
            latitude,
            longitude,
            orderTotal,
            orderDate: new Date(orderDate), // Convert to Date if not already
        });
        console.log(checkout)
        // Save the checkout data to the database
        const savedCheckout = await checkout.save();

        // Return a success response
        res.status(201).json({
            success: true,
            message: "Checkout created successfully",
            data: savedCheckout,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error, could not create checkout",
            error: error.message,
        });
    }
});

router.post("/checkout", async (req, res) => {
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
            latitude,
            longitude,
            orderTotal,
            orderDate,
        } = req.body;

        // Create a new Checkout document
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
            latitude,
            longitude,
            orderTotal,
            orderDate: new Date(orderDate), // Convert to Date if not already
        });
        console.log(checkout);

        // Save the checkout data to the database
        const savedCheckout = await checkout.save();

        // Update the user's orderStatus to 'Pending'
        await userModel.findByIdAndUpdate(
            userId,
            { $set: { orderStatus: ['Pending'] } },
            { new: true }
        );
        await userModel.findByIdAndUpdate(
            userId,
            { $push: { orderHistory: savedCheckout._id } },
            { new: true }
        )
        await userModel.findByIdAndUpdate(
            userId,
            { $set: { cart: [] } },
            { new: true }
        );
        // Update the ordered products' stock
        for (const product of orderedProducts) {
            await checkoutModel.findByIdAndUpdate(
                product.productId,
                { $inc: { stock: -product.quantity } },
                { new: true }
            );
        }
        // Return a success response
        res.status(201).json({
            success: true,
            message: "Checkout created successfully",
            data: savedCheckout,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error, could not create checkout",
            error: error.message,
        });
    }
});

export default router;