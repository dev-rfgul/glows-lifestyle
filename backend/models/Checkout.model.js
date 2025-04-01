import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    orderedProducts: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    }],
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String, // Changed to String for phone number
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String, // Changed to String for postal code
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    orderNotes: {
        type: String,
        default: "", // Default empty string for orderNotes
    },
    latitude: {
        type: String,
        default: "", // Optional field for latitude
    },
    longitude: {
        type: String,
        default: "", // Optional field for longitude
    },
    orderTotal: {
        type: Number,
        required: true, // Total order price
    },
    orderDate: {
        type: Date,
        required: true, // Date the order was placed
        default: Date.now, // Default to current date if not provided
    }
});

export default mongoose.model('Checkout', checkoutSchema);
