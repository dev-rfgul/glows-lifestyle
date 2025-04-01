import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
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
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    orderNotes: {
        type: String,
    },

})

export default mongoose.model('Checkout', checkoutSchema)
