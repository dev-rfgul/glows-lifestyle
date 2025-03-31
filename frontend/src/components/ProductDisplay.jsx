
// import React, { useState, useEffect, useCallback } from "react";
// import {
//     FaShoppingCart,
//     FaBolt,
//     FaHeadphones,
//     FaCheckCircle,
//     FaPause,
//     FaPlay,
//     FaExpand
// } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const EarbudsProductDisplay = () => {
//     const id=useParams();
//     const[product,setProduct]=useState();
//     const [selectedColor, setSelectedColor] = useState('black');
//     const [quantity, setQuantity] = useState(1);
//     const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
//     const [isFullScreenImage, setIsFullScreenImage] = useState(false);


//     const getProduct = async (id) => {
//         const response = await axios.get(`${import.meta.env.VITE_FRONTEND_URL}/product/get-product/${id}`)
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         else{
//             console.log("product fetched successfully")
//             setProduct(response.data)

//         }
//         const data = await response.json();
//         console.log(data)
//     }
//     useEffect(() => {
//         getProduct()
//     }, [])
//     // Product Mock Data (replace with actual backend data)


//     const handleColorSelect = (color) => {
//         setSelectedColor(color.hex);
//     };

//     const renderTechnicalSpecs = () => (
//         <div className=" p-6 rounded-xl shadow-lg">
//             <h3 className="text-xl font-bold text-black mb-4 flex items-center">
//                 <FaBolt className="mr-2 text-blue-600" /> Technical Specifications
//             </h3>
//             <div className="grid grid-cols-2 gap-4 text-black">
//                 {Object.entries(product.technicalSpecs).map(([key, value]) => (
//                     <div key={key} className="bg-white p-3 rounded-lg shadow-md">
//                         <p className="text-sm text-black font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
//                         <p className="">{value}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen  py-12 px-4">
//             <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
//                 {/* Product Visual Section */}
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.5 }}
//                     className="relative group"
//                 >
//                     <div className=" rounded-3xl p-8 relative overflow-hidden">
//                         <motion.img
//                             src="https://www.rfgul.live/images/banner2-img.jpeg"  // Replace with actual image
//                             alt="SonicWave Pro X1 Earbuds"
//                             className="w-full h-96 object-contain transform transition-all duration-300 group-hover:scale-110"
//                             style={{ filter: `hue-rotate(${selectedColor === '#FFFFFF' ? '0deg' : '180deg'})` }}
//                         />
//                         <button
//                             onClick={() => setIsFullScreenImage(true)}
//                             className="absolute top-4 right-4 bg-white/50 hover:bg-white/80 p-2 rounded-full transition"
//                         >
//                             <FaExpand className="text-blue-800" />
//                         </button>
//                     </div>

//                     {/* Color Selection */}
//                     <div className="flex justify-center mt-6 space-x-4">
//                         {product.colors.map((color) => (
//                             <button
//                                 key={color.hex}
//                                 onClick={() => handleColorSelect(color)}
//                                 className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${selectedColor === color.hex
//                                     ? 'border-blue-500 scale-110'
//                                     : 'border-transparent hover:border-blue-300'
//                                     }`}
//                                 style={{ backgroundColor: color.hex }}
//                                 title={color.name}
//                             />
//                         ))}
//                     </div>
//                 </motion.div>

//                 {/* Product Details Section */}
//                 <div className="space-y-6">
//                     <motion.div
//                         initial={{ x: 50, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1 }}
//                         transition={{ delay: 0.2, duration: 0.5 }}
//                     >
//                         <h1 className="text-4xl font-black text-black mb-2">{product.name}</h1>
//                         <p className="text-xl text-black font-medium">{product.tagline}</p>
//                     </motion.div>

//                     {/* Price Section */}
//                     <div className="flex items-center space-x-4">
//                         <span className="text-3xl font-bold text-black">${product.discountPrice}</span>
//                         <span className="text-xl text-gray-900 line-through">${product.price}</span>
//                         <span className="bg-green-100 text-gray-900 px-3 py-1 rounded-full">
//                             Save ${(product.price - product.discountPrice).toFixed(2)}
//                         </span>
//                     </div>

//                     {/* Features */}
//                     <div className="space-y-2">
//                         {product.features.map((feature, index) => (
//                             <div key={index} className="flex items-center text-black">
//                                 <FaCheckCircle className="mr-2 text-black" />
//                                 <span>{feature}</span>
//                             </div>
//                         ))}
//                     </div>



//                     {/* Quantity & Add to Cart */}
//                     <div className="space-y-4">
//                         <div className="flex items-center space-x-4">
//                             <span className="text-black font-medium">Quantity:</span>
//                             <div className="flex items-center bg-blue-50 rounded-full">
//                                 <button
//                                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                     className="px-4 py-2 text-blue-800 hover:bg-gray-500 rounded-l-full"
//                                 >
//                                     -
//                                 </button>
//                                 <span className="px-4 py-2">{quantity}</span>
//                                 <button
//                                     onClick={() => setQuantity(quantity + 1)}
//                                     className="px-4 py-2 text-blue-800 hover:bg-gray-500 rounded-r-full"
//                                 >
//                                     +
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <button
//                                 className="bg-gray-100 border-2 border-black text-black py-4 rounded-xl hover:bg-blue-600 transition flex items-center justify-center space-x-2"
//                             >
//                                 <FaShoppingCart />
//                                 <span>Add to Cart</span>
//                             </button>
//                             <button
//                                 className="bg-black text-white py-4 rounded-xl hover:bg-blue-800 transition"
//                             >
//                                 Buy Now
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Technical Specs Section */}
//             <div className="max-w-6xl mx-auto mt-16">
//                 {renderTechnicalSpecs()}
//             </div>

//             {/* Product Description */}
//             <div className="max-w-6xl mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
//                 <h2 className="text-3xl font-bold text-black mb-6">Product Overview</h2>
//                 <p className="text-black text-lg leading-relaxed">{product.description}</p>
//             </div>
//         </div>
//     );
// };

// export default EarbudsProductDisplay;

import React, { useState, useEffect, useCallback } from "react";
import {
    FaShoppingCart,
    FaBolt,
    FaHeadphones,
    FaCheckCircle,
    FaPause,
    FaPlay,
    FaExpand
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from "axios";
import { useParams } from "react-router-dom";

const EarbudsProductDisplay = () => {
    const { id } = useParams(); // Fixed: extracting id correctly
    const [product, setProduct] = useState(null); // Initialize as null
    const [selectedColor, setSelectedColor] = useState('black');
    const [quantity, setQuantity] = useState(1);
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
    const [isFullScreenImage, setIsFullScreenImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getProduct = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/get-product/${id}`);
            // Axios directly gives the data property
            console.log("Product fetched successfully");
            console.log(response.data.product)
            setProduct(response.data.product);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product:", error);
            setError("Failed to load product data");
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            getProduct();
        }
    }, [id, getProduct]);

    const handleColorSelect = (color) => {
        setSelectedColor(color.hex);
    };

    // If loading or error, show appropriate message
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    const renderTechnicalSpecs = () => (
        <div className="p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-black mb-4 flex items-center">
                <FaBolt className="mr-2 text-blue-600" /> Technical Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 text-black">
                {Object.entries(product.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="bg-white p-3 rounded-lg shadow-md">
                        <p className="text-sm text-black font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                {/* Product Visual Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative group"
                >
                    <div className="rounded-3xl p-8 relative overflow-hidden">
                        <motion.img
                            src={product.img[0]} // Use the actual image from product data
                            alt={product.name}
                            className="w-full h-96 object-contain transform transition-all duration-300 group-hover:scale-110"
                            style={{ filter: `hue-rotate(${selectedColor === '#FFFFFF' ? '0deg' : '180deg'})` }}
                        />
                        <button
                            onClick={() => setIsFullScreenImage(true)}
                            className="absolute top-4 right-4 bg-white/50 hover:bg-white/80 p-2 rounded-full transition"
                        >
                            <FaExpand className="text-blue-800" />
                        </button>
                    </div>

                    {/* Color Selection */}
                    <div className="flex justify-center mt-6 space-x-4">
                        {product.colors.map((color) => (
                            <button
                                key={color._id}
                                onClick={() => handleColorSelect(color)}
                                className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${selectedColor === color.hex
                                        ? 'border-blue-500 scale-110'
                                        : 'border-transparent hover:border-blue-300'
                                    }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Product Details Section */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-black text-black mb-2">{product.name}</h1>
                        <p className="text-xl text-black font-medium">{product.tagline}</p>
                    </motion.div>

                    {/* Price Section */}
                    <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold text-black">${product.discountPrice}</span>
                        <span className="text-xl text-gray-900 line-through">${product.price}</span>
                        <span className="bg-green-100 text-gray-900 px-3 py-1 rounded-full">
                            Save ${(product.price - product.discountPrice).toFixed(2)}
                        </span>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                        {product.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-black">
                                <FaCheckCircle className="mr-2 text-black" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stock Information */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-800">
                            <FaCheckCircle className="inline mr-2" />
                            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                        </p>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-black font-medium">Quantity:</span>
                            <div className="flex items-center bg-blue-50 rounded-full">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 text-blue-800 hover:bg-gray-500 rounded-l-full"
                                    disabled={product.stock <= 0}
                                >
                                    -
                                </button>
                                <span className="px-4 py-2">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 py-2 text-blue-800 hover:bg-gray-500 rounded-r-full"
                                    disabled={quantity >= product.stock || product.stock <= 0}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className="bg-gray-100 border-2 border-black text-black py-4 rounded-xl hover:bg-blue-600 transition flex items-center justify-center space-x-2"
                                disabled={product.stock <= 0}
                            >
                                <FaShoppingCart />
                                <span>Add to Cart</span>
                            </button>
                            <button
                                className="bg-black text-white py-4 rounded-xl hover:bg-blue-800 transition"
                                disabled={product.stock <= 0}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Specs Section */}
            <div className="max-w-6xl mx-auto mt-16">
                {renderTechnicalSpecs()}
            </div>

            {/* Product Description */}
            <div className="max-w-6xl mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-black mb-6">Product Overview</h2>
                <p className="text-black text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Full Screen Image Modal */}
            {isFullScreenImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <button
                        className="absolute top-4 right-4 text-white text-2xl"
                        onClick={() => setIsFullScreenImage(false)}
                    >
                        ×
                    </button>
                    <img
                        src={product.img[0]}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}
        </div>
    );
};

export default EarbudsProductDisplay;