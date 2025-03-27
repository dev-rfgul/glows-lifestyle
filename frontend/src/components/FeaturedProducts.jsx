
// import React, { useState, useEffect, useCallback, memo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import AlertMessage from "./Alert";
// import ProductCard from './ProductCard'


// const ProductGrid = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [globalAlert, setGlobalAlert] = useState({ message: "", type: "" });
//     const [filters, setFilters] = useState({
//         sort: "newest",
//         category: "all",
//         priceRange: [0, 10000]
//     });
//     const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             try {
//                 const parsedUser = JSON.parse(storedUser);
//                 setUserId(parsedUser.user.id);
//             } catch (error) {
//                 console.error("Error parsing user data:", error);
//             }
//         }
//     }, []);

//     // Fetch categories


//     useEffect(() => {
//         const fetchProducts = async () => {
//             setLoading(true);
//             try {
//                 // You could add query params for filtering based on your filters state
//                 const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 setProducts(data.products);
//                 setError(null);
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//                 setError("Failed to load products. Please try again later.");
//                 setProducts([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, [filters.category]);

//     const addToCart = useCallback(async (productId) => {
//         if (!userId) {
//             setGlobalAlert({
//                 message: "Please log in to add items to your cart",
//                 type: "warning"
//             });
//             return Promise.reject(new Error("User not logged in"));
//         }

//         try {
//             const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/product/add-to-cart`, {
//                 productId,
//                 userId,
//             });

//             setGlobalAlert({ message: response.data.message, type: "success" });
//             return Promise.resolve(response.data);
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || error.message;
//             setGlobalAlert({
//                 message: "Error adding product to cart: " + errorMessage,
//                 type: "error",
//             });
//             return Promise.reject(error);
//         }
//     }, [userId]);

//     // Filter and sort products function
//     const filteredProducts = React.useMemo(() => {
//         let result = [...products];

//         // Apply category filter
//         if (filters.category !== "all") {
//             result = result.filter(product => product.category === filters.category);
//         }

//         // Apply price range filter
//         result = result.filter(product =>
//             product.price >= filters.priceRange[0] &&
//             product.price <= filters.priceRange[1]
//         );

//         // Apply sorting
//         switch (filters.sort) {
//             case "price-low":
//                 result.sort((a, b) => a.price - b.price);
//                 break;
//             case "price-high":
//                 result.sort((a, b) => b.price - a.price);
//                 break;
//             case "popular":
//                 result.sort((a, b) => (b.reviewCount || 0) * (b.rating || 0) - (a.reviewCount || 0) * (a.rating || 0));
//                 break;
//             case "newest":
//             default:
//                 // Assuming products have a createdAt field or similar
//                 result.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
//                 break;
//         }

//         return result;
//     }, [products, filters]);

//     // Handle price range change
//     const handlePriceRangeChange = (min, max) => {
//         setFilters(prev => ({
//             ...prev,
//             priceRange: [parseInt(min), parseInt(max)]
//         }));
//     };

//     return (
//         <div className="container mx-auto px-6 py-10">
//             {/* Global Alert */}
//             {globalAlert.message && (
//                 <div className="mb-6">
//                     <AlertMessage
//                         message={globalAlert.message}
//                         type={globalAlert.type}
//                         onClose={() => setGlobalAlert({ message: "", type: "" })}
//                     />
//                 </div>
//             )}

//             {/* Filter Controls */}
//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>

//                 <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
//                     <h3 className="font-semibold text-gray-700 mb-3">Filters</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         {/* Sort By Filter */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
//                             <select
//                                 className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 value={filters.sort}
//                                 onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
//                             >
//                                 <option value="newest">Newest</option>
//                                 <option value="price-low">Price: Low to High</option>
//                                 <option value="price-high">Price: High to Low</option>
//                                 <option value="popular">Most Popular</option>
//                             </select>
//                         </div>

//                         {/* Category Filter */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                             <select
//                                 className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 value={filters.category}
//                                 onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//                             >
//                                 <option value="all">All Categories</option>
//                                 {categories.map(category => (
//                                     <option key={category._id} value={category._id}>
//                                         {category.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Price Range Filter */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
//                             <div className="flex items-center">
//                                 <input
//                                     type="number"
//                                     className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     placeholder="Min"
//                                     value={filters.priceRange[0]}
//                                     onChange={(e) => handlePriceRangeChange(e.target.value, filters.priceRange[1])}
//                                     min="0"
//                                 />
//                                 <span className="mx-2">-</span>
//                                 <input
//                                     type="number"
//                                     className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     placeholder="Max"
//                                     value={filters.priceRange[1]}
//                                     onChange={(e) => handlePriceRangeChange(filters.priceRange[0], e.target.value)}
//                                     min={filters.priceRange[0]}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//                     <p>{error}</p>
//                 </div>
//             )}

//             {/* Results Summary */}
//             <div className="mb-4 flex justify-between items-center">
//                 <p className="text-gray-600">
//                     Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
//                 </p>

//                 {/* Mobile Sort Option */}
//                 <div className="md:hidden">
//                     <select
//                         className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         value={filters.sort}
//                         onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
//                     >
//                         <option value="newest">Newest</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="popular">Most Popular</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {loading
//                     ? Array.from({ length: 8 }).map((_, index) => (
//                         <ProductCard key={`skeleton-${index}`} loading={true} />
//                     ))
//                     : filteredProducts.length > 0
//                         ? filteredProducts.map((product) => (
//                             <ProductCard
//                                 key={product._id}
//                                 product={product}
//                                 loading={false}
//                                 onAddToCart={addToCart}
//                             />
//                         ))
//                         : (
//                             <div className="col-span-full text-center py-10">
//                                 <p className="text-gray-500 text-lg">No products found matching your filters</p>
//                                 <button
//                                     className="mt-4 text-blue-500 hover:text-blue-700"
//                                     onClick={() => setFilters({
//                                         sort: "newest",
//                                         category: "all",
//                                         priceRange: [0, 10000]
//                                     })}
//                                 >
//                                     Reset Filters
//                                 </button>
//                             </div>
//                         )
//                 }
//             </div>
//         </div>
//     );
// };

// export default ProductGrid;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaFilter, FaSearch, FaSlidersH, FaChevronDown } from "react-icons/fa";

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
        priceRange: [0, 1000],
        sortBy: "newest"
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`);
                const data = await response.json();
                setCategories(data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);
console.log(products)
    const filteredProducts = useMemo(() => {
        return products.filter(product => 
            (filters.category === "all" || product.category === filters.category) &&
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1] &&
            product.name.toLowerCase().includes(filters.search.toLowerCase())||
            product.description.toLowerCase().includes(filters.search.toLowerCase())
        ).sort((a, b) => {
            switch(filters.sortBy) {
                case "price-low": return a.price - b.price;
                case "price-high": return b.price - a.price;
                case "newest": 
                default: 
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
    }, [products, filters]);

    const handleAddToCart = async (productId) => {
        try {
            // Implement add to cart logic
            console.log(`Added product ${productId} to cart`);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div className="bg-blue-100 min-h-screen  p-6">
            <div className="container mx-auto">
                {/* Header and Search Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
                        >
                            <FaFilter className="mr-2" />
                            Filters
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <input 
                            type="text" 
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                            className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Filters Dropdown */}
                    {isFilterOpen && (
                        <div className="bg-white shadow-lg rounded-xl p-6 grid md:grid-cols-3 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select 
                                    value={filters.category}
                                    onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
                                    className="w-full px-3 py-2 border rounded-lg"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={filters.priceRange[0]}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev, 
                                            priceRange: [Number(e.target.value), prev.priceRange[1]]
                                        }))}
                                        className="w-1/2 px-3 py-2 border rounded-lg"
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev, 
                                            priceRange: [prev.priceRange[0], Number(e.target.value)]
                                        }))}
                                        className="w-1/2 px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Sort By Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select 
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value}))}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading 
                        ? Array.from({length: 8}).map((_, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-xl shadow-md animate-pulse h-80"
                            ></div>
                        ))
                        : filteredProducts.map(product => (
                            <div 
                                key={product._id} 
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
                            >
                                <div className="relative">
                                    <img 
                                        src={product.images[0]} 
                                        alt={product.name} 
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                                        ${product.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 truncate">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                                    <button 
                                        onClick={() => handleAddToCart(product._id)}
                                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* No Products Found */}
                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-500">No products found</p>
                        <button 
                            onClick={() => setFilters({
                                search: "",
                                category: "all",
                                priceRange: [0, 1000],
                                sortBy: "newest"
                            })}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;