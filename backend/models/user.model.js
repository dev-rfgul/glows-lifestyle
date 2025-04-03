
// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: function() {
//             // Only required for regular users, not Auth0
//             return this.authProvider !== 'auth0';
//         },
//         lowercase: true,
//     },
//     picture: {
//         type: String,
//         default: "https://www.gravatar.com/avatar"
//     },
//     role: {
//         type: String,
//         enum: ["admin", "user"],
//         default: "user",
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//     },
//     password: {
//         type: String,
//         required: function() {
//             // Only required for regular users, not Auth0
//             return this.authProvider !== 'auth0';
//         }
//     },
//     cart: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Products'
//     }],
//     toDelievered: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Products'
//     }],
//     // New Auth0-specific fields
//     auth0Id: {
//         type: String,
//         sparse: true  // Allows null values but enforces uniqueness for non-null
//     },
//     authProvider: {
//         type: String,
//         enum: ['local', 'auth0'],
//         default: 'local'
//     },
//     lastLogin: {
//         type: Date,
//         default: Date.now
//     }
// }, { timestamps: true });

// const User = mongoose.model('User', UserSchema);
// export default User;

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return this.authProvider !== 'auth0';
        },
        lowercase: true,
        trim: true
    },
    picture: {
        type: String,
        default: "https://www.gravatar.com/avatar"
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider !== 'auth0';
        }
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }],
    orderStatus: [{
        type: String,
        enum: ['not ordered yet','Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'not ordered yet'
    }],
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkout'  // Assuming your checkout model is named 'Checkout'
    }],
    shippingAddresses: [{
        address: String,
        city: String,
        province: String,
        postalCode: String,
        country: String,
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    auth0Id: {
        type: String,
        sparse: true  // Allows null values but enforces uniqueness for non-null
    },
    authProvider: {
        type: String,
        enum: ['local', 'auth0'],
        default: 'local'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const User = mongoose.model('User', UserSchema);
export default User;