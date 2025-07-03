
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Added missing import

// Create separate validation utility
const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = 'Name is required';
    if (!data.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = 'Email is invalid';
    }
    // Normalize the phone number
    if (data.phone.startsWith('0')) {
        data.phone = data.phone.replace(/^0/, '+92');
    }
    // Validation
    if (!data.phone.trim()) {
        errors.phone = 'Phone number is required';
    } else if (!/^\+92[0-9\s-()]{7,}$/.test(data.phone)) {
        errors.phone = 'Please enter a valid phone number starting with +92';
    }
    if (!data.address.trim()) errors.address = 'Address is required';
    if (!data.city.trim()) errors.city = 'City is required';
    if (!data.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!data.country.trim()) errors.country = 'Country is required';

    return errors;
};

const PaymentInfoCard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [cartProducts, setCartProducts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderTotal, setOrderTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
        orderNotes: '',
        latitude: '',
        longitude: '',
        orderedProducts: cartProducts.map(p => ({
            productId: p._id,
            productName: p.name,
            productColor: p.color || '',
            quantity: p.quantity || 1,
            price: p.price,
            img: p.img
        })),
    });

    const [errors, setErrors] = useState({});
    const [locationStatus, setLocationStatus] = useState({
        loading: false,
        error: null,
        success: false
    });
    console.log(cartProducts)
    // Pre-fill form with user data when it's loaded
    useEffect(() => {
        if (userData) {
            setFormData(prevData => ({
                ...prevData,
                name: '',
                email: '',
                phone: userData.phone || '',
                address: userData.address || '',
                city: userData.city || '',
                province: userData.province || '',
                postalCode: userData.postalCode || '',
                country: userData.country || ''
            }));
        }
    }, [userData]);
    console.log("cart products", cartProducts)

    // Calculate order total when cart products change
    useEffect(() => {
        if (cartProducts.length > 0) {
            const total = cartProducts.reduce((sum, product) => {
                return sum + (product.discountPrice * (product.quantity || 1));
            }, 0);
            setOrderTotal(total);
        }
    }, [cartProducts]);

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                throw new Error("No user found in localStorage");
            }
            const user = JSON.parse(storedUser);
            setUserId(user.id);
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/user/get-user/${user.id}`
            );
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch user data");
            }

            const data = await response.json();
            setUserData(data.user);

            if (data.user.role === "admin") {
                navigate("/admin");
                return;
            }

            if (data.user.cart && data.user.cart.length > 0) {
                await fetchCartProducts(data.user.cart);
            } else {
                // Redirect if cart is empty
                navigate("/products");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const fetchCartProducts = async (cartIds) => {
        if (!Array.isArray(cartIds) || cartIds.length === 0) {
            setCartProducts([]);
            return;
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/product/get-selected-products`,
                { ids: cartIds },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data && Array.isArray(response.data)) {
                setCartProducts(response.data);
            } else {
                throw new Error("Invalid product data received");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to load cart products");
        }
    };
    console.log(cartProducts)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const fetchUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus({
                loading: false,
                error: "Geolocation is not supported by your browser",
                success: false
            });
            return;
        }

        setLocationStatus({
            loading: true,
            error: null,
            success: false
        });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude.toFixed(6),
                    longitude: position.coords.longitude.toFixed(6)
                }));

                // Reverse geocoding to get address details
                reverseGeocode(position.coords.latitude, position.coords.longitude);

                setLocationStatus({
                    loading: false,
                    error: null,
                    success: true
                });
            },
            (error) => {
                // Error
                let errorMessage = "Unknown error occurred while fetching location";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access was denied by the user";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Request to get location timed out";
                        break;
                }

                setLocationStatus({
                    loading: false,
                    error: errorMessage,
                    success: false
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    // Function to convert coordinates to address using a free reverse geocoding service
    const reverseGeocode = async (latitude, longitude) => {
        try {
            setLocationStatus(prev => ({ ...prev, loading: true }));

            // Using OpenStreetMap Nominatim API - free and doesn't require API key
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en-US,en',
                        'User-Agent': 'MyShoppingApp' // Proper user-agent for Nominatim ToS
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch address data');

            const data = await response.json();

            // Extract address components
            if (data && data.address) {
                const address = data.address;

                setFormData(prev => ({
                    ...prev,
                    address: [address.name, address.house_number].filter(Boolean).join(' ') || prev.address,
                    city: address.city || address.town || address.village || prev.city,
                    province: address.state || prev.province,
                    postalCode: address.postcode || prev.postalCode,
                    country: address.country || prev.country
                }));

                setLocationStatus({
                    loading: false,
                    error: null,
                    success: true
                });
            }
        } catch (error) {
            console.error("Error during reverse geocoding:", error);
            setLocationStatus(prev => ({
                ...prev,
                loading: false,
                error: "Could not convert location to address, but coordinates were saved"
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm(formData);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            // Scroll to first error
            const firstErrorField = document.querySelector(`.border-red-500`);
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            }
            return;
        }

        setIsSubmitting(true);
        try {
            // Prepare complete order data
            const orderData = {
                ...formData,
                userId,
                orderedProducts: cartProducts.map(p => ({
                    productId: p._id,
                    productName: p.name,
                    productColor: p.color || p.colors[0].name,
                    productQuantity: p.quantity || 1,
                    productPrice: p.discountPrice,
                    productImg: p.img,
                })),
                orderTotal,
                orderDate: new Date().toISOString()
            };
            console.log(orderData)
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/checkout`,
                orderData,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.data && response.data.success) {
                setSubmitSuccess(true);
                // Clear cart after successful order
                localStorage.setItem('user', JSON.stringify({
                    ...JSON.parse(localStorage.getItem('user')),
                    cart: []
                }));

                // Show success message
                setTimeout(() => {
                    navigate('/order-confirmation', {
                        state: {
                            orderId: response.data.orderId,
                            orderTotal
                        }
                    });
                }, 2000);
            } else {
                throw new Error(response.data?.message || "Order submission failed");
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            setError(error.message || "Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-700">Loading your information...</p>
                </div>
            </div>
        );
    }

    if (error && !userData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
                    <div className="text-red-500 text-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold mt-2">Error Loading Data</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => {
                                setError(null);
                                fetchUserData();
                            }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mr-2"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (submitSuccess) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
                    <div className="text-green-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">Thank you for your order. We will contact you shortly.</p>
                    <div className="animate-pulse">
                        <p className="text-sm text-gray-500">Redirecting to order confirmation...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                        <h2 className="text-white text-2xl font-bold">Complete Your Order</h2>
                        <p className="text-purple-100 mt-2">Please provide your delivery information</p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                        <h3 className="font-medium text-indigo-800 mb-2">Order Summary</h3>
                        <div className="space-y-1">
                            {cartProducts.length > 0 ? (
                                <>
                                    <p className="text-sm text-gray-600">{cartProducts.length} item(s) in cart</p>
                                    {cartProducts.map((product, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <img src={product.img[0]} alt={product.name} className="w-12 h-12 object-cover" />
                                            <p className="text-sm text-gray-600">
                                                {product.name} - {product.quantity || 1}
                                            </p>
                                        </div>
                                    ))}
                                    <p className="font-medium text-indigo-900">Total:PKR {orderTotal.toFixed(2)}</p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-600">Your cart is empty</p>
                            )}
                        </div>
                    </div>
                    {/* Cash on Delivery Banner */}
                    <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <span className="font-medium">Cash on Delivery</span> - Pay when you receive your order.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Global Error Message */}
                    {error && (
                        <div className="bg-red-50 p-4 border-l-4 border-red-400">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* //just help me in changing the autofill up of name and email to make it empty so that user can manually entery his name and email */}
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (123) 456-7890"
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            {/* Location */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Location</label>
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={fetchUserLocation}
                                        disabled={locationStatus.loading}
                                        className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-300 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {locationStatus.loading ? (
                                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {locationStatus.loading ? "Detecting..." : "Detect My Location"}
                                    </button>
                                </div>

                                {locationStatus.error && (
                                    <p className="mt-2 text-sm text-red-600">{locationStatus.error}</p>
                                )}

                                {locationStatus.success && (
                                    <p className="mt-2 text-sm text-green-600">Location detected successfully!</p>
                                )}

                                {(formData.latitude && formData.longitude) && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        Coordinates: {formData.latitude}, {formData.longitude}
                                    </div>
                                )}
                            </div>

                            {/* Shipping Information */}
                            <div className="col-span-2 mt-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address*</label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                                <input
                                    type="text"
                                    name="province"
                                    id="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code*</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    id="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                                <input
                                    type="text"
                                    name="country"
                                    id="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                            </div>

                            {/* Order Notes */}
                            <div className="col-span-2 mt-4">
                                <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                                <textarea
                                    name="orderNotes"
                                    id="orderNotes"
                                    rows="3"
                                    value={formData.orderNotes}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="Special instructions for delivery"
                                ></textarea>
                            </div>
                        </div>

                        {/* Required fields note */}
                        <div className="mt-4 text-sm text-gray-500">
                            * Required fields
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting || cartProducts.length === 0}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform hover:scale-[1.02] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    "Confirm Order (Cash on Delivery)"
                                )}
                            </button>
                        </div>

                        {cartProducts.length === 0 && (
                            <p className="mt-2 text-center text-sm text-red-600">
                                Your cart is empty. Please add products before checkout.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentInfoCard;