
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "./Alert";

const ProductCard = ({ product, loading }) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [showGuestSignin, setShowGuestSignin] = useState(false);
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "success"
    });

    // Load user ID from localStorage on component mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUserId(user?.id || "");
            }
        } catch (error) {
            console.error("Error retrieving user from localStorage:", error);
        }
    }, []);

    // Alert management functions
    const showAlert = (message, type = "success") => {
        setAlert({ show: true, message, type });
    };

    const hideAlert = () => {
        setAlert(prev => ({ ...prev, show: false }));
    };

    // Handle guest account creation
    const handleGuestAcct = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/guest-signup`);
            const user = response.data?.newUser;
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                console.log("Guest account created:", user);
                setShowGuestSignin(false); // Close guest signin prompt
                // Refresh the page to apply localStorage changes
                window.location.reload();
            } else {
                console.error("No user returned from guest-signup API");
                showAlert("Failed to create guest account", "error");
            }
        } catch (error) {
            console.error("Error creating guest account:", error);
            showAlert("Error creating guest account", "error");
        }
    };

    // Cart management functions
    const addToCart = async (productId, buyNow = false) => {
        if (!userId) {
            setShowGuestSignin(true); // Show guest signin prompt instead of error
            return;
        }

        // Set loading state based on action type
        buyNow ? setIsBuyingNow(true) : setIsAddingToCart(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/product/add-to-cart`, {
                productId,
                userId
            });

            showAlert(response.data.message, "success");

            // Navigate to profile page after short delay if buying now
            if (buyNow) {
                setTimeout(() => navigate('/profile'), 1000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to add product to cart";
            showAlert(errorMessage, "error");
            console.error("Error adding to cart:", error);
        } finally {
            setIsAddingToCart(false);
            setIsBuyingNow(false);
        }
    };

    // Loading skeleton UI
    if (loading) {
        return <ProductCardSkeleton />;
    }

    // Determine whether to show buttons in alerts based on alert type
    const shouldShowAlertButtons = alert.type !== "info" && alert.type !== "warning";

    return (
        <>
            {/* Alert component */}
            {alert.show && (
                <AlertMessage
                    message={alert.message}
                    type={alert.type}
                    onClose={hideAlert}
                    duration={5000}
                    showCloseButton={true}
                    showBtns={shouldShowAlertButtons}
                />
            )}

            {/* Guest Sign-in Component */}
            {showGuestSignin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Continue Without Account</h2>
                        <p className="text-gray-600 mb-4 text-sm">You can browse and use the app as a guest.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowGuestSignin(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGuestAcct}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                            >
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="border rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300">
                {/* Product Image and badges */}
                <ProductImageSection product={product} />

                {/* Action Buttons */}
            </div>
        </>
    );
};

// Component for product skeleton loading state
const ProductCardSkeleton = () => (
    <div className="border rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="relative">
            <div className="w-full h-52 bg-gray-300 animate-pulse" />
            <div className="absolute top-2 left-2 bg-gray-400 text-transparent px-3 py-1 text-xs font-semibold rounded-full shadow-md">
                <span className="w-12 h-4 bg-gray-300"></span>
            </div>
        </div>
        <div className="p-4">
            <div className="w-full h-6 bg-gray-300 animate-pulse mb-2"></div>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-16 h-4 bg-gray-300 animate-pulse" />
                <div className="w-24 h-4 bg-gray-300 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                <div className="w-16 h-4 bg-gray-300 animate-pulse" />
                <div className="w-16 h-4 bg-gray-300 animate-pulse" />
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <div className="w-full h-10 bg-gray-300 animate-pulse rounded-lg"></div>
                <div className="w-full h-10 bg-gray-300 animate-pulse rounded-lg"></div>
            </div>
        </div>
    </div>
);

// Component for product image section with badges
const ProductImageSection = ({ product }) => (
    <Link to={`/product/${product._id}`} className="block">
        <div className="product-card m-2 relative overflow-hidden border border-gray-200 rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
            {/* Product Image */}
            <div className="relative w-full h-32 sm:h-48 md:h-64">
                <img
                    src={product.img[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-2xl"
                />

       
                {/* Discount Badge */}
                {product.price > product.discountPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium z-10">
                        -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </div>
                )}

                {/* Stock Status */}
                {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute bottom-2 right-2 bg-amber-500 text-white px-2 py-0.5 text-xs font-semibold rounded-full shadow-md">
                        Only {product.stock} left
                    </div>
                )}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-2xl">
                        <span className="text-white text-sm font-bold">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
                {/* Category */}
                {product.category && (
                    <p className="text-xs uppercase text-gray-500 font-medium">{product.category}</p>
                )}

                {/* Name */}
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.85L19.336 24 12 19.938 4.664 24 6 15.6 0 9.75l8.332-1.595z" />
                        </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">5.0</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">₹{product.discountPrice}</span>
                    {product.price > product.discountPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                    )}
                </div>

                {/* CTA */}
                <button className="w-full mt-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm">
                    Add to Cart
                </button>
            </div>
        </div>

    </Link>

);



export default ProductCard;