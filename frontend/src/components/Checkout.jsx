// src/components/PaymentInfoCard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios'
const PaymentInfoCard = () => {
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
        longitude: ''
    });

    const [errors, setErrors] = useState({});
    const [locationStatus, setLocationStatus] = useState({
        loading: false,
        error: null,
        success: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
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
                setFormData({
                    ...formData,
                    latitude: position.coords.latitude.toFixed(6),
                    longitude: position.coords.longitude.toFixed(6)
                });

                // Optional: Reverse geocoding to get address details
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
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Function to convert coordinates to address using a free reverse geocoding service
    const reverseGeocode = async (latitude, longitude) => {
        try {
            // Using OpenStreetMap Nominatim API - free and doesn't require API key
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                { headers: { 'Accept-Language': 'en-US,en' } }
            );

            if (!response.ok) throw new Error('Failed to fetch address data');

            const data = await response.json();
            console.log(data)
            // Extract address components
            if (data && data.address) {
                const address = data.address;

                setFormData(prev => ({
                    ...prev,
                    address: [address.road, address.house_number].filter(Boolean).join(' ') || prev.address,
                    city: address.city || address.town || address.village || prev.city,
                    province: address.state || prev.state,
                    postalCode: address.postcode || prev.postalCode,
                    country: address.country || prev.country
                }));
            }
        } catch (error) {
            console.error("Error during reverse geocoding:", error);
            // We don't show this error to the user, as we already have the coordinates
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        console.log(formData)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/checkout`, formData)
            console.log(response.data)

        } catch (error) {
            console.error(error)
        }
        // console.log('Form submitted:', formData);
        alert('Order information submitted successfully! We will contact you shortly.');

        // Reset form after successful submission`
        setFormData({
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
            longitude: ''
        });

        setLocationStatus({
            loading: false,
            error: null,
            success: false
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                        <h2 className="text-white text-2xl font-bold">Complete Your Order</h2>
                        <p className="text-purple-100 mt-2">Please provide your delivery information</p>
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
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
                                        className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-300 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
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
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
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
                                <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                                <input
                                    type="text"
                                    name="province"
                                    id="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
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
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    id="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
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

                        {/* Submit Button */}
                        <div className="mt-8">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform hover:scale-[1.02] font-medium"
                            >
                                Confirm Order (Cash on Delivery)
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentInfoCard;