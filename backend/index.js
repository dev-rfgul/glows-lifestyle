import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Load environment variables first
dotenv.config();

import { connectDB } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import adminRoutes from './routes/admin.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import AnalyticsRoutes from './routes/analytics.routes.js';
import { cloudinaryConnect } from './config/cloudinary.js';
import CheckoutRoutes from './routes/checkout.routes.js';
import VisitCounter from './models/visitCount.model.js';
import visitCounter from './models/visitCount.model.js';
import notificationRoutes from './routes/notification.routes.js';

// Initialize app and services
const app = express();

// Properly handle CORS origins
const allowedOrigins = [
    "https://www.glowzlifestyle.shop",
    "https://glowzlifestyle.shop",
    "https://glows-lifestyle.vercel.app",
    "https://glows-lifestyle-chi.vercel.app",
    "http://localhost:5173"
];

if (process.env.FRONT_END_URL) {
    allowedOrigins.push(process.env.FRONT_END_URL);
}

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://glowslifestyle.onrender.com",
            "https://www.glowzlifestyle.shop",
            "https://glows-lifestyle.vercel.app",
            "https://glows-lifestyle-chi.vercel.app",
            "http://localhost:5173"
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ Handle preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Connect to database and services
connectDB();
cloudinaryConnect();

// Use express.json() for all non-webhook routes
app.use((req, res, next) => {
    if (req.originalUrl === '/payment/webhook') {
        next(); // Skip express.json for webhook route
    } else {
        express.json({ limit: "10mb" })(req, res, next);
    }
});

// Basic routes
app.get('/test', (req, res) => {
    res.send("Test route is working");
});

app.get('/', (req, res) => {
    res.send("The backend is working");
});

// API routes
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/admin', adminRoutes);
app.use('/payment', paymentRoutes);
app.use('/analytics', AnalyticsRoutes);
app.use('/checkout', CheckoutRoutes);
app.use('/notification', notificationRoutes);


// Global visit counter routes
app.get('/globalVisitCount', async (req, res) => {
    try {
        const visitorCount = await visitCounter.findOne({});
        res.status(200).json({ message: visitorCount });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put('/updateGlobalVisitCount', async (req, res) => {
    try {
        const visitCounter = await VisitCounter.findOneAndUpdate(
            {}, // Only one document exists
            {
                $inc: { globalVisitCount: 1 },
                $set: { lastUpdated: new Date() }
            },
            { new: true, upsert: true }
        );

        res.json({
            visitorCount: visitCounter.globalVisitCount,
            lastUpdated: visitCounter.lastUpdated,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating visit count');
    }
});

// Start server
const port = process.env.PORT || process.env.LOCALHOST || 5000;
app.listen(port, () => {
    console.log(`✅ Backend server running on port: ${port}`);
});

export default app;
