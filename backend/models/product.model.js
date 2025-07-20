// import mongoose from 'mongoose'

// const ProductSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         unique: true,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     category: [
//         {
//             type: String,
//             required: true,
//         }
//     ],
//     SKU: {
//         type: String,
//         required: true
//     },
//     tag: {
//         type: String,
//     },
//     stock: {
//         type: Number,
//         required: true,
//     },
//     color: [{
//         type: String,
//     }],
//     images: [{
//         type: String,
//         required: true,
//     }],
//     size: {
//         type: String,
//     }
// })

// const Products = mongoose.model('Products', ProductSchema);
// export default Products;


import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    visitCount: {
        // it will keep the reocrd of the specific visited product 
        type: Number,
    },
    tagline: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['headphones', 'earbuds', 'smartwatches'],
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    colors: [
        {
            name: { type: String, required: true },
            hex: { type: String, required: true, match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/ }
        }
    ],
    features: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    technicalSpecs: {
        batteryLife: { type: String, required: true },
        connectivity: { type: String, required: true },
        noiseReduction: { type: String, required: true },
        waterResistance: { type: String, required: true }
    },
    img: {
        type: [String],
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
