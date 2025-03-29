// import mongoose from "mongoose"
// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         lowercase: true,
//     },
//     picture:{
//         type:String,
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
//         required: true,
//     },
//     cart: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Products'
//     }],

// }, { timestamps: true })

// const User = mongoose.model('User', UserSchema)
// export default User;

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function() {
            // Only required for regular users, not Auth0
            return this.authProvider !== 'auth0';
        },
        lowercase: true,
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
    },
    password: {
        type: String,
        required: function() {
            // Only required for regular users, not Auth0
            return this.authProvider !== 'auth0';
        }
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }],
    // New Auth0-specific fields
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
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;