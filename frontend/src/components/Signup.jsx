
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Signup = () => {
    const { user, loginWithRedirect, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
    const navigate = useNavigate();
    const [signupError, setSignupError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Handle form changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleGuestAcct = async () => {
        try {
            // Optional: Set loading state here (e.g., setIsLoading(true))
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/guest-signup`);
            const user = response.data?.newUser;
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                console.log("Guest account created:", user);
                navigate('/')
            } else {
                console.error("No user returned from guest-signup API");
                // Optional: show user-friendly error toast/message
            }

        } catch (error) {
            console.error("Error creating guest account:", error);
            // Optional: show toast or alert to user
        } finally {
            // Optional: Reset loading state here (e.g., setIsLoading(false))
        }
    };

    // Handle regular signup form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignupError(null);

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setSignupError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                },
                { withCredentials: true }
            );

            console.log('Signup successful:', response.data);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
            navigate('/profile');
        } catch (error) {
            console.error("Signup error:", error);
            setSignupError(
                error.response?.data?.message ||
                "An error occurred during signup. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    // Handle Auth0 redirect if user is already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            navigate('/profile');
        }
    }, [isAuthenticated, user, navigate, isLoading]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-gray-600">Loading authentication...</div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
                <p className="text-center text-gray-600 text-sm mb-6">
                    Join us to get started with your new account
                </p>

                {signupError && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {signupError}
                    </div>
                )}

                {/* Auth0 Signup Button */}
                <button
                    onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Sign up with Google
                </button>
                <button
                    onClick={handleGuestAcct}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700 transition-colors"
                >Continue wihtout account</button>


                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">or sign up with email</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Regular Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                            } transition-colors`}
                    >
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;