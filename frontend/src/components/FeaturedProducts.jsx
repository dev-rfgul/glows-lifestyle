
import React, { useState, useEffect, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "./Alert";
import ProductCard from './ProductCard'


const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [globalAlert, setGlobalAlert] = useState({ message: "", type: "" });
    const [filters, setFilters] = useState({
        sort: "newest",
        category: "all",
        priceRange: [0, 10000]
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserId(parsedUser.user.id);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    // Fetch categories


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
            setGlobalAlert({
                message: "Please log in to add items to your cart",
                type: "warning"
            });
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
            return Promise.reject(error);
        }
    }, [userId]);

    // Filter and sort products function
    const filteredProducts = React.useMemo(() => {
        let result = [...products];

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
    }, [products, filters]);

    // Handle price range change
    const handlePriceRangeChange = (min, max) => {
        setFilters(prev => ({
            ...prev,
            priceRange: [parseInt(min), parseInt(max)]
        }));
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

            {/* Filter Controls */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Sort By Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.sort}
                                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Min"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => handlePriceRangeChange(e.target.value, filters.priceRange[1])}
                                    min="0"
                                />
                                <span className="mx-2">-</span>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Max"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handlePriceRangeChange(filters.priceRange[0], e.target.value)}
                                    min={filters.priceRange[0]}
                                />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <ProductCard key={`skeleton-${index}`} loading={true} />
                    ))
                    : filteredProducts.length > 0
                        ? filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                loading={false}
                                onAddToCart={addToCart}
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