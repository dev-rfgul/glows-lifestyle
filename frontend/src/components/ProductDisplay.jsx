
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Reviews from "./random/Reviews"; // Import the Reviews component
// import logo from "../images/logo.png";

{/* <AlertMessage logoUrl={logo} /> */ }

import {
    FaShoppingCart,
    FaBolt,
    FaCheckCircle,
    FaExpand
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from "axios";
import { useParams } from "react-router-dom";
import AlertMessage from "./Alert"; // Import the AlertMessage component
// import DynamicProductSchema from "./DynamicProductScheme";

const EarbudsProductDisplay = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState('black');
    const [quantity, setQuantity] = useState(1);
    // const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
    const [isFullScreenImage, setIsFullScreenImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // Initialize as null
    const [showGuestSign, setShowGuestSignin] = useState(false)

    const navigate = useNavigate();

    // Alert state
    const [alertProps, setAlertProps] = useState({
        message: "",
        type: "success",
        visible: false
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            console.log("No user found in localStorage");
            return;
        }

        const user = JSON.parse(storedUser);
        setUserId(user?.id || "");
    }, []);

    const getProduct = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/get-product/${id}`);
            console.log("Product fetched successfully");
            console.log(response.data.product);
            const productData = response.data.product;
            setProduct(productData);
            // Set the default selected image after fetching the product
            setSelectedImage(productData.img[0]);
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

    // Updated showNotification function to use AlertMessage
    const showNotification = (message, type = "success") => {
        setAlertProps({
            message,
            type,
            visible: true
        });
    };

    // Handler to close the alert
    const handleCloseAlert = () => {
        setAlertProps(prev => ({
            ...prev,
            visible: false
        }));
    };
    const handleGuestAcct = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/guest-signup`);
            const user = response.data?.newUser;
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                console.log("Guest account created:", user);
                setShowGuestSignin(false); // Close alert after successful guest login
                setLoading(false)
                navigate('/');
            } else {
                console.error("No user returned from guest-signup API");
            }
        } catch (error) {
            console.error("Error creating guest account:", error);
        }
    };
    const addToCart = async (productId, buyNow = false) => {
        console.log("Adding to cart:", productId);
        if (!userId) {
            // showNotification("Please login to add items to cart hello", "error");
            setShowGuestSignin(true)
            return;
        }

        if (buyNow) {
            setIsBuyingNow(true);
        } else {
            setIsAddingToCart(true);
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/product/add-to-cart`, {
                productId,
                userId
            });
            console.log("Product added to cart:", response.data);

            showNotification(
                buyNow
                    ? "Product purchased successfully! Redirecting to profile..."
                    : "Product added to cart successfully!",
                "success"
            );

            // If buying now, redirect to cart page
            if (buyNow) {
                setTimeout(() => {
                    window.location.href = '/checkout';
                }, 2000); // Give time for the alert to be visible
            }
            else {
                // If just adding to cart, you can update the cart state or show a success message
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 2000); // Give time for the alert to be visible
            }
        } catch (error) {
            console.error("Error:", error.response?.data?.message || error.message);
            showNotification(
                "Error: " + (error.response?.data?.message || error.message),
                "error"
            );
        } finally {
            setIsAddingToCart(false);
            setIsBuyingNow(false);
        }
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
        <div className="min-h-screen  px-4">
            {/* <DynamicProductSchema product={product} /> */}
            {/* Alert Message Component */}
            {alertProps.visible && (
                <AlertMessage
                    message={alertProps.message}
                    type={alertProps.type}
                    onClose={handleCloseAlert}
                    duration={5000}
                    logoUrl={"../images/logo.png"}
                    showCloseButton={true}
                />
            )}
            {showGuestSign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-gray-400 w-full max-w-md px-6 py-6 text-center rounded-lg shadow-lg relative">
                        {/* Close Button (X) positioned at the top-right */}
                        <button
                            className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 font-semibold text-lg rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={() => setShowGuestSignin(false)}
                        >
                            X
                        </button>

                        {loading ? (
                            // Loader: Spinner shown while loading
                            <div className="flex justify-center items-center">
                                <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Continue Without Account</h2>
                                <p className="text-gray-600 mb-4 text-sm">You can browse and use the app as a guest.</p>
                                <button
                                    onClick={handleGuestAcct}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Continue as Guest
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}





            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                {/* Product Visual Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative group"
                >
                    <div className="rounded-3xl p-8 relative overflow-hidden">
                        {/* Main Image */}
                        <motion.img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-96 object-contain transform transition-all duration-300 group-hover:scale-110"
                        />

                        {/* Expand Button */}
                        <button
                            onClick={() => setIsFullScreenImage(true)}
                            className="absolute top-4 right-4 bg-white/50 hover:bg-white/80 p-2 rounded-full transition"
                        >
                            <FaExpand className="text-blue-800" />
                        </button>

                        {/* Thumbnail Images - Made responsive */}
                        <div className="flex flex-wrap justify-center gap-2 ">
                            {product.img.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Thumbnail ${index}`}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 object-contain cursor-pointer rounded-lg border-2 transition ${selectedImage === img ? "border-blue-500 scale-105" : "border-gray-300"
                                        }`}
                                    onClick={() => setSelectedImage(img)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className="flex justify-center mt-6 space-x-4">
                        {product.colors.map((color) => (
                            <button
                                key={color._id}
                                onClick={() => handleColorSelect(color)}
                                className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full border-4 transition-all duration-300 
                               ${selectedColor === color.hex ? 'border-blue-500 scale-110' : 'hover:border-blue-300'}
                               ${color.hex === '#FFFFFF' ? 'border-gray-400 shadow-md' : ''}`}
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
                    ><h1 className="text-2xl sm:text-4xl font-black text-black mb-2">{product.name}</h1>

                        <p className="text-xl text-black font-medium">{product.tagline}</p>
                    </motion.div>

                    {/* Price Section */}
                    <div className="w-full p-6 rounded-xl border border-gray-200 shadow-sm bg-white space-y-6">

                        {/* Price and Discount */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl sm:text-4xl font-extrabold text-black">
                                    PKR: {product.discountPrice}
                                </span>
                                <span className="text-xl text-gray-400 line-through">
                                    PKR: {product.price}
                                </span>
                            </div>
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full font-medium">
                                Save PKR {(product.price - product.discountPrice).toFixed(2)}
                            </span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4">
                            <span className="text-black font-medium">Quantity:</span>
                            <div className="flex items-center bg-blue-50 rounded-full overflow-hidden border border-blue-200">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 text-blue-800 hover:bg-blue-200 transition font-bold"
                                    disabled={product.stock <= 0}
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 py-2 text-blue-800 hover:bg-blue-200 transition font-bold"
                                    disabled={quantity >= product.stock || product.stock <= 0}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={() => addToCart(product._id, false)}
                                className="flex items-center justify-center bg-white border-2 border-black text-black py-3 rounded-xl hover:bg-blue-600 hover:text-white transition font-semibold"
                                disabled={isAddingToCart || isBuyingNow || product.stock <= 0}
                            >
                                {isAddingToCart ? (
                                    "Adding..."
                                ) : (
                                    <>
                                        <FaShoppingCart className="mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => addToCart(product._id, true)}
                                className="bg-black text-white py-3 rounded-xl hover:bg-blue-800 transition font-semibold"
                                disabled={isAddingToCart || isBuyingNow || product.stock <= 0}
                            >
                                {isBuyingNow ? "Processing..." : "Buy Now"}
                            </button>
                        </div>
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

            {/* Full Screen Image Modal - Fixed to show selected image */}
            {isFullScreenImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <button
                        className="absolute top-4 right-4 text-white text-2xl"
                        onClick={() => setIsFullScreenImage(false)}
                    >
                        ×
                    </button>
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}

            {/* ratings and reviews */}
            <Reviews selectedProduct={product.name}/>
        </div>
    );
};

export default EarbudsProductDisplay;