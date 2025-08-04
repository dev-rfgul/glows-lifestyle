
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AlertMessage from "./Alert";
import ProductCard from './ProductCard'


const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [globalAlert, setGlobalAlert] = useState({ message: "", type: "" });
    const [showGuestSign, setShowGuestSignin] = useState(false)
    const [filters, setFilters] = useState({
        sort: "newest",
        category: "all",
        priceRange: [0, 100000]
    });
    // const [categories, setCategories] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log(parsedUser.id)
                // Adjust based on the actual structure
                setUserId(parsedUser.id ?? parsedUser.user?.id);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }

    }, []);

    // Fetch categories

    useEffect(() => {
        let result = [...products];
        console.log("result from featured products", result, "and search term is ", searchTerm)
        // Apply search filter
        if (searchTerm) {
            result = result.filter(product =>
                product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.tag && typeof product.tag === 'string' && product.tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
    }, [products, searchTerm]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // You could add query params for filtering based on your filters state
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data)
                setProducts(data.products);
                setError(null);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products. Please try again later.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters.category]);

    const addToCart = useCallback(async (productId) => {
        if (!userId) {
            // setGlobalAlert({
            //     message: "Please log in to add items to your cart",
            //     type: "warning"
            // });
            setShowGuestSignin(true)
            return Promise.reject(new Error("User not logged in"));
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/product/add-to-cart`, {
                productId,
                userId,
            });

            setGlobalAlert({ message: response.data.message, type: "success" });
            return Promise.resolve(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            
            setGlobalAlert({
                message: "Error adding product to cart: " + errorMessage,
                type: "error",
            });
            // return Promise.reject(error);
        }
    }, [userId]);

    // Filter and sort products function
    const filteredProducts = React.useMemo(() => {
        let result = [...products];


        if (searchTerm) {
            result = result.filter(product =>
                product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.tag && typeof product.tag === 'string' && product.tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        // Apply category filter
        if (filters.category !== "all") {
            result = result.filter(product => product.category === filters.category);
        }

        // Apply price range filter
        result = result.filter(product =>
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1]
        );

        // Apply sorting
        switch (filters.sort) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "popular":
                result.sort((a, b) => (b.reviewCount || 0) * (b.rating || 0) - (a.reviewCount || 0) * (a.rating || 0));
                break;
            case "newest":
            default:
                // Assuming products have a createdAt field or similar
                result.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
                break;
        }

        return result;
    }, [products, filters, searchTerm]);


    const handleGuestAcct = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/guest-signup`);
            const user = response.data?.newUser;
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                console.log("Guest account created:", user);
            } else {
                console.error("No user returned from guest-signup API");
            }
        } catch (error) {
            console.error("Error creating guest account:", error);
        }
    };
    return (
        <div className="container mx-auto px-6 py-10">
            {/* Global Alert */}
            {globalAlert.message && (
                <div className="mb-6">
                    <AlertMessage
                        message={globalAlert.message}
                        type={globalAlert.type}
                        onClose={() => setGlobalAlert({ message: "", type: "" })}
                    />
                </div>
            )}

            {showGuestSign && (
                <div className="w-full px-6 pb-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Continue Without Account</h2>
                    <p className="text-gray-600 mb-4 text-sm">You can browse and use the app as a guest.</p>
                    <button
                        onClick={handleGuestAcct}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Continue as Guest
                    </button>
                </div>
            )}
            {/* Filter Controls */}
            <div className="mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">

                    <div className="flex justify-center">
                        <div className="w-full max-w-sm">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                <span className="absolute right-3 top-2.5 text-gray-400">
                                    {/* Search icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p>{error}</p>
                </div>
            )}

            {/* Results Summary */}
            <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>

                {/* Mobile Sort Option */}
                <div className="md:hidden">
                    <select
                        className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.sort}
                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="popular">Most Popular</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
                {loading
                    ? Array.from({ length: 10 }).map((_, index) => (
                        <ProductCard key={`skeleton-${index}`} loading={true} />
                    ))
                    : filteredProducts.length > 0
                        ? filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                loading={false}
                                onAddToCart={addToCart}
                                compact={true}
                            />
                        ))
                        : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-500 text-lg">No products found matching your filters</p>
                                <button
                                    className="mt-4 text-blue-500 hover:text-blue-700"
                                    onClick={() => setFilters({
                                        sort: "newest",
                                        category: "all",
                                        priceRange: [0, 10000]
                                    })}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )
                }
            </div>
        </div>
    );
};

export default ProductGrid;