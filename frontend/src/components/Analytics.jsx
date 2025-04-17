

import React, { useState, useEffect } from 'react';
import axios from 'axios'

const Analytics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('visitCount');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [totalVisits, setTotalVisits] = useState('0')

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setData(data.products);
                setError(null);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter and sort data
    const filteredData = data
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });

    // For statistics
    // const totalVisits = data.reduce((sum, product) => sum + (product.visitCount || 0), 0);
    const getTotalVisits = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/globalVisitCount`)
        console.log(response.data.message)
        setTotalVisits(response.data.message.globalVisitCount)
    }
    // totalVisits()
    useEffect(() => {
        getTotalVisits()
    }, [])
    const totalProductVisits = data.reduce((total, product) => total + product.visitCount, 0);
    const avgVisits = data.length ? (totalProductVisits / data.length).toFixed(1) : 0;
    // const topProduct = data.length ? [...data].sort((a, b) => b.visitCount - a.visitCount)[0] : null;
    const topProducts = data.length ? [...data].sort((a, b) => b.visitCount - a.visitCount).slice(0, 3) : [];

    const productVisitRate = (totalProductVisits / totalVisits) * 100


    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Product Analytics Dashboard</h1>
                    <p className="text-gray-500 mt-2">Track product performance and visitor engagement</p>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-6 flex justify-center">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                            <p className="text-gray-600 mt-4">Loading analytics data...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Products</h3>
                                <p className="mt-2 text-4xl font-bold text-gray-900">{data.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Site  Visits</h3>
                                <p className="mt-2 text-4xl font-bold text-indigo-600">{totalVisits}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Product Visits</h3>
                                <p className="mt-2 text-4xl font-bold text-green-600">{totalProductVisits}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide"> Product Visit Rate</h3>
                                <p className="mt-2 text-4xl font-bold text-green-600">{productVisitRate.toFixed(2)}%</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide"> Avg Views per Product</h3>
                                <p className="mt-2 text-4xl font-bold text-green-600">{avgVisits}</p>
                            </div>
                        </div>

                        {/* Most Popular Products */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg border border-indigo-100">
                            <h3 className="text-indigo-700 text-base font-bold uppercase tracking-wide mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Top Performing Products
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {topProducts.map((topProduct, index) => (
                                    <div
                                        key={topProduct.id || index}
                                        className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300 ease-in-out flex flex-col"
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                                                <img
                                                    src={topProduct.img?.[0] || "/api/placeholder/64/64"}
                                                    alt={topProduct.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-md font-semibold text-gray-900 line-clamp-1">{topProduct.name}</h4>
                                                <div className="flex items-center mt-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        <span className="font-medium">{topProduct.visitCount || 0}</span> visits
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Product Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-700">Product Visit Details</h3>
                                <div className="mt-2 flex flex-col sm:flex-row justify-between gap-4">
                                    {/* Search bar */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full sm:w-64"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Sort options */}
                                    <div className="flex gap-2">
                                        <select
                                            className="border border-gray-300 rounded-md px-3 py-2"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="name">Name</option>
                                            <option value="visitCount">Visit Count</option>
                                        </select>
                                        <button
                                            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md"
                                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        >
                                            {sortOrder === 'asc' ? (
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {filteredData.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-gray-500">No products found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Visit Count
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredData.map((product) => (
                                                <tr key={product._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={product.img?.[0] || "/api/placeholder/40/40"}
                                                                    alt={product.name}
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                                <div className="text-sm text-gray-500">ID: {product._id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{product.visitCount || 0}</div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                                            <div
                                                                className="bg-blue-600 h-2.5 rounded-full"
                                                                style={{ width: `${((product.visitCount || 0) / (topProducts[0]?.visitCount || 1)) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Analytics;