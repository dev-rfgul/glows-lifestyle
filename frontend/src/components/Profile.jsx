import { useEffect, useState, useMemo } from "react";
import { FaShoppingCart, FaTrash, FaSpinner, FaUser, FaHistory, FaBox, FaSignOutAlt, FaStore } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [cartProducts, setCartProducts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // const [isProcessingPayment, ] = useState(false);
    const isProcessingPayment = false; // Placeholder for payment processing state
    const [error, setError] = useState(null);
    const [orderedProducts, setOrderedProducts] = useState({ orderedProducts: [] });
    const [activeTab, setActiveTab] = useState("cart"); // "cart", "orders"

    const navigate = useNavigate();

    // Calculate cart total
    const cartTotal = useMemo(() => {
        return cartProducts.reduce((sum, product) => sum + Number(product.discountPrice), 0).toFixed(2);
    }, [cartProducts]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    console.log("No user found in localStorage");
                    throw new Error("No user found in localStorage");
                }

                const user = JSON.parse(storedUser);
                setUserId(user.id);

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/user/get-user/${user.id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setUserData(data.user);
                console.log(data.user);

                if (data.user.role === "admin") {
                    navigate("/admin");
                }

                if (data.user.cart && data.user.cart.length > 0) {
                    await fetchCartProducts(data.user.cart);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);


    const fetchCartProducts = async (cartIds) => {
        if (!Array.isArray(cartIds) || cartIds.length === 0) {
            setCartProducts([]);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/product/get-selected-products`,
                { ids: cartIds }
            );
            setCartProducts(response.data);

        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to load cart products");
        }
    };


    const fetchOrder = async () => {
        const orderHistory = userData?.orderHistory;
        if (!orderHistory || orderHistory.length === 0) {
            console.log("No order history found");
            return;
        }

        console.log("orderHistory:", orderHistory);

        // No need to extract - orderHistory already contains the IDs
        const orderIDs = orderHistory; // orderHistory is already an array of order ID strings
        console.log("Order IDs to fetch:", orderIDs);

        try {
            // Create an array of promises for all the requests
            const requests = orderIDs.map(orderID =>
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/checkout/order-products?id=${orderID}`)
            );

            // Wait for all requests to finish
            const responses = await Promise.all(requests);
            console.log("All responses received:", responses.map((data) => data.data.order));

            // After all requests complete, update the state with the fetched data
            setOrderedProducts(responses.map((response, index) => ({
                orderID: orderIDs[index],
                products: response.data.order
            })));
        } catch (error) {
            console.error("Error fetching orders:", error.response?.data?.message || error.message);
        }
    };
    useEffect(() => {
        if (userData) {
            fetchOrder();
        }
    }, [userData]);
    console.log("orderd prods", orderedProducts)

    const handleLogout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
                {},
                { withCredentials: true }
            );
            localStorage.clear();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error.response?.data?.message || error.message);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/product/remove-from-cart`,
                { productId, userId }
            );

            // Update the cart products immediately for better UX
            setCartProducts((prev) => prev.filter((product) => product._id !== productId));

            // Also update the userData to reflect the current cart state
            if (userData) {
                setUserData({
                    ...userData,
                    cart: userData.cart.filter(id => id !== productId)
                });
            }
        } catch (error) {
            console.error("Error removing product:", error.response?.data?.message || error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg flex items-center space-x-4">
                    <FaSpinner className="animate-spin text-blue-600 text-3xl" />
                    <p className="text-lg font-medium text-gray-700">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto text-center mt-10 p-8 bg-red-50 rounded-lg border border-red-200 shadow-lg">
                <h2 className="text-2xl font-bold text-red-700 mb-3">Error Loading Profile</h2>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                    Return to Login
                </button>
            </div>
        );
    } console.log(cartProducts)

    if (!userData) {
        return (
            <div className="max-w-4xl mx-auto text-center mt-10 p-8 bg-yellow-50 rounded-lg border border-yellow-200 shadow-lg">
                <h2 className="text-2xl font-bold text-yellow-700 mb-3">Session Expired</h2>
                <p className="text-yellow-600 mb-6">Please log in again to access your profile.</p>
                <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    const renderCartContent = () => (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center mb-6 pb-3 border-b">
                <FaShoppingCart className="mr-3 text-blue-600" />
                Your Cart
                <span className="ml-auto text-lg font-normal text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'}
                </span>
            </h3>

            {cartProducts.length > 0 ? (
                <>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cartProducts.map((product) => (
                            <div key={product._id} className="border rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow overflow-hidden group">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={product.img?.[0] || "https://www.dewnor.com/wp-content/uploads/2021/01/cropped-cropped-logo.png"}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 h-12">{product.name}</h3>
                                    <span className="text-green-600 font-bold text-lg block mt-2">{product.discountPrice}</span>
                                    <button
                                        onClick={() => removeFromCart(product._id)}
                                        className="mt-4 w-full bg-red-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center transition-colors"
                                    >
                                        <FaTrash className="mr-2" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
                            <span className="text-xl font-semibold text-gray-800">Total:</span>
                            <span className="text-2xl font-bold text-green-600">{cartTotal}</span>
                        </div>
                        <Link to="/checkout" className="block">
                            <button
                                disabled={isProcessingPayment}
                                className={`w-full ${isProcessingPayment ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} 
                                text-white font-medium text-lg px-5 py-3 rounded-lg transition-colors flex items-center justify-center shadow-md`}
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    "Proceed to Checkout"
                                )}
                            </button>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <FaShoppingCart className="mx-auto text-gray-400 text-6xl mb-6" />
                    <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                        Browse Products
                    </button>
                </div>
            )}
        </div>
    );

    const renderOrderContent = () => (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center mb-6 pb-3 border-b">
                <FaHistory className="mr-3 text-blue-600" />
                Your Order History
            </h3>


            <div>

                {Array.isArray(orderedProducts) && orderedProducts.length > 0 ? (
                    <div className="space-y-8">
                        {orderedProducts.map((order, orderIndex) => (
                            <div key={orderIndex} className="border rounded-lg overflow-hidden bg-white shadow-lg">
                                <div className="bg-gray-50 p-4 border-b">
                                    <div className="flex justify-between items-center flex-wrap">
                                        <h5 className="font-medium text-gray-700 text-sm sm:text-base">Order ID: <span className="font-semibold">{order.orderID}</span></h5>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.products.orderStatus === "completed" ? "bg-green-100 text-green-800" :
                                            order.products.orderStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-blue-100 text-blue-800"
                                            }`}>
                                            {order.products.orderStatus?.toUpperCase() || "PENDING"}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm sm:text-base text-gray-600">
                                        <p>Date: {new Date(order.products.orderDate).toLocaleDateString()}</p>
                                        <p>Total: <span className="font-semibold text-green-600">PKR {order.products.orderTotal}</span></p>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h6 className="font-medium text-gray-700 mb-3">Products</h6>
                                    <div className="space-y-4">
                                        {Array.isArray(order.products.orderedProducts) && order.products.orderedProducts.map((product, productIndex) => (
                                            <div key={productIndex} className="border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col sm:flex-row">
                                                <div className="w-full sm:w-1/3 h-32 overflow-hidden">
                                                    <img
                                                        src={product.productImg?.[0] || "https://www.dewnor.com/wp-content/uploads/2021/01/cropped-cropped-logo.png"}
                                                        alt={product.productName || "Product"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="w-full sm:w-2/3 p-4">
                                                    <h5 className="font-semibold text-gray-800 mb-2">{product.productName || "Product Name"}</h5>
                                                    <div className="text-sm text-gray-600 flex flex-col space-y-1">
                                                        <p>Product ID: <span className="font-medium">{product.productId || "N/A"}</span></p>
                                                        <p>Price: <span className="font-medium text-green-600">PKR {product.productPrice}</span></p>
                                                        <p>Quantity: <span className="font-medium">{product.productQuantity}</span></p>
                                                        {product.productColor && (
                                                            <p>Color: <span className="font-medium">{product.productColor}</span></p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 border-t">
                                    <h6 className="font-medium text-gray-700 mb-2">Shipping Details</h6>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base text-gray-600">
                                        <p>Name: <span className="font-medium">{order.products.name}</span></p>
                                        <p>Email: <span className="font-medium">{order.products.email}</span></p>
                                        <p>Phone: <span className="font-medium">{order.products.phone}</span></p>
                                        <p>Address: <span className="font-medium">{order.products.address}, {order.products.city}, {order.products.province}, {order.products.country} {order.products.postalCode}</span></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl">
                        <FaBox className="mx-auto text-gray-400 text-6xl mb-4" />
                        <p className="text-gray-500 text-lg">No ordered products found.</p>
                    </div>
                )}
            </div>

        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 my-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header with user info */}
                <div className="bg-black p-6 md:p-10 text-white">
                    <div className="flex flex-col md:flex-row items-center md:space-x-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 md:mb-0 overflow-hidden">
                            {userData.picture ? (
                                <img
                                    src={userData.picture}
                                    alt={userData.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FaUser className="text-4xl md:text-5xl text-gray-400" />
                            )}
                        </div>
                        <div className="text-center md:text-left flex-grow">
                            <h2 className="text-3xl md:text-4xl font-bold">{userData.name}</h2>
                            <p className="text-lg opacity-90 capitalize">{userData.role}</p>
                            <p className="text-sm opacity-80 mt-1">{userData.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-4 md:mt-0 px-5 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition flex items-center"
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Navigation tabs */}
                <div className="flex border-b">
                    <button
                        className={`flex-1 py-4 px-6 text-center font-medium text-lg ${activeTab === "cart"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("cart")}
                    >
                        <div className="flex items-center justify-center">
                            <FaShoppingCart className="mr-2" />
                            Your Cart
                        </div>
                    </button>
                    <button
                        className={`flex-1 py-4 px-6 text-center font-medium text-lg ${activeTab === "orders"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("orders")}
                    >
                        <div className="flex items-center justify-center">
                            <FaHistory className="mr-2" />
                            Orders History
                        </div>
                    </button>
                </div>

                {/* Main content area */}
                <div className="p-6 bg-gray-50">
                    {activeTab === "cart" ? renderCartContent() : renderOrderContent()}
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-4 flex justify-center">
                    <button
                        onClick={() => navigate("/products")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center"
                    >
                        <FaStore className="mr-2" />
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;