import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Admin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dashboard data states
    const [dashboardData, setDashboardData] = useState({
        usersCount: 0,
        productCount: 0,
        revenue: 0,
        pendingOrders: 0,
        packingOrders:0,
        shippedOrders: 0,
        delieveredOrders: 0,
        recentOrders: [] // Fixed naming
    });

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // API calls using useCallback to prevent unnecessary recreations
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Use Promise.all for parallel API requests
            const [usersResponse, productsResponse, revenueResponse, ordersResponse] = await Promise.all([
                fetch(`${import.meta.env.VITE_BACKEND_URL}/user/get-users`),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/analytics/total-revenue`),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/analytics/all-orders`)
            ]);

            // Check if any responses failed
            if (!usersResponse.ok || !productsResponse.ok || !revenueResponse.ok || !ordersResponse.ok) {
                throw new Error('One or more API requests failed');
            }

            // Parse JSON responses in parallel
            const [usersData, productsData, revenueData, ordersData] = await Promise.all([
                usersResponse.json(),
                productsResponse.json(),
                revenueResponse.json(),
                ordersResponse.json()
            ]);

            // Process orders data with validation
            const orders = ordersData?.orders || [];
            let pending = 0, packing = 0, shipped = 0, delievered=0;
            console.log(orders)
            orders.forEach(order => {
                const status = order?.orderStatus?.toLowerCase();
                if (status === "pending") pending++;
                else if (status === "packing") packing++;
                else if (status === "delievered") delievered++;
                else if (status === 'shipped') shipped++;
            });

            // Update state with all data
            setDashboardData({
                usersCount: usersData?.length || 0,
                productCount: productsData?.products?.length || 0,
                revenue: revenueData?.totalRevenue || 0,
                pendingOrders: pending,
                packingOrders: packing,
                shippedOrders: shipped,
                delieveredOrders: delievered,
                recentOrders: orders // Fixed naming
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []); // Dependencies are stable

    // Responsive sidebar handler
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else if (window.innerWidth < 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchData();

        // Optional: Set up polling for real-time updates (increased to 10 minutes)
        const intervalId = setInterval(fetchData, 600000);

        return () => clearInterval(intervalId);
    }, [fetchData]);

    // Dashboard stats with actual data
    const stats = [
        { title: "Total Users", value: dashboardData.usersCount, change: "+12%", isPositive: true, icon: "👥" },
        { title: "Total Products", value: dashboardData.productCount, change: "+7.2%", isPositive: true, icon: "📦" },
        { title: "Revenue", value: formatCurrency(dashboardData.revenue), change: "+22%", isPositive: true, icon: "💰" },
        { title: "Pending Orders", value: dashboardData.pendingOrders, change: "+8%", isPositive: true, icon: "⏳" },
        { title: "Packing Orders", value: dashboardData.packingOrders, change: "+15%", isPositive: true, icon: "🚚" },
        { title: "Shipped Orders", value: dashboardData.shippedOrders, change: "+10%", isPositive: true, icon: "✅" },
        { title: "Delievered Orders", value: dashboardData.delieveredOrders, change: "+10%", isPositive: true, icon: "✅" },
    ];
    

    // Navigation items
    const navItems = [
        { path: "/", label: "Dashboard", icon: "🏠" },
        { path: "/add-product", label: "Products", icon: "📦" },
        { path: "/add-users", label: "Users", icon: "👥" },
        { path: "/analytics", label: "Analytics", icon: "📊" },
        { path: "/orders", label: "Orders", icon: "🛒" },
        { path: "/notification", label: "Notifications", icon: "🔔" }
    ];

    const isActive = (path) => {
        return location.pathname === path ? "bg-blue-600" : "";
    };

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <button
                        onClick={fetchData}
                        className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar toggle */}
            <button
                className="fixed z-20 bottom-4 right-4 lg:hidden bg-blue-600 text-white p-2 rounded-full shadow-lg"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <nav className={`bg-blue-700 text-white ${sidebarOpen ? 'w-64' : 'w-0 -ml-64'} lg:w-64 p-0 fixed h-full z-10 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0`}>
                <div className="p-4 flex flex-col h-full">
                    <div className="pb-6 mb-6 border-b border-blue-600">
                        <h1 className="font-bold text-2xl flex items-center">
                            <span className="bg-white text-blue-700 p-1 rounded mr-2">AP</span>
                            Admin Panel
                        </h1>
                    </div>

                    <div className="flex-1">
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center hover:bg-blue-600 px-4 py-3 rounded transition-colors ${isActive(item.path)}`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-blue-600">
                        <button className="w-full flex items-center hover:bg-blue-600 px-4 py-3 rounded transition-colors">
                            <span className="mr-3">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                            <p className="text-gray-600">Welcome back, Admin</p>
                        </div>

                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <button className="bg-white shadow-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                                <span className="mr-2">📥</span> Export Data
                            </button>
                            <button className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors">
                                <span className="mr-2">➕</span> Create New
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-2">{stat.icon}</span>
                                            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                                        </div>
                                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 gap-8">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-medium">Recent Activity</h3>
                                <Link to={'/orders'}>
                                    <button className="text-blue-600 text-sm hover:underline">View All</button>
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6">
                                    {dashboardData.recentOrders.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {dashboardData.recentOrders.slice(0, 6).map((item, index) => (
                                                <div key={item._id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                                                            item.orderStatus === 'pending' ? 'bg-yellow-500' :
                                                            item.orderStatus === 'dispatched' ? 'bg-blue-500' : 'bg-green-500'
                                                        }`}>
                                                            {item.orderStatus === 'pending' ? '⏳' :
                                                             item.orderStatus === 'dispatched' ? '🚚' : '✅'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-800 text-sm">
                                                                Order from: <span className="text-blue-600">{item.name}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-1 text-sm">
                                                        <p className="text-gray-700">
                                                            Amount: <span className="font-medium text-green-600">{formatCurrency(item.orderTotal)}</span>
                                                        </p>
                                                        <p className="text-gray-700">
                                                            From: <span className="italic">{item.city}</span>
                                                        </p>
                                                        <p className="text-gray-500">
                                                            {formatDate(item.orderDate || new Date())}
                                                        </p>
                                                        <p className="text-gray-500">
                                                            Status: <span className={`font-medium ${
                                                                item.orderStatus === 'completed' ? 'text-green-500' : 
                                                                item.orderStatus === 'dispatched' ? 'text-blue-500' : 'text-yellow-500'
                                                            }`}>
                                                                {item.orderStatus}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    
                                                    <Link to={'/orders'}>
                                                        <button className="mt-3 text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                                            View Order
                                                        </button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No recent orders found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Admin;