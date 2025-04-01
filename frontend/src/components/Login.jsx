
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";

// const Login = () => {
//     const { user, loginWithRedirect, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
//     const navigate = useNavigate();
//     const [loginError, setLoginError] = useState(null);

//     // Form state for regular login
//     const [formData, setFormData] = useState({
//         email: "",
//         password: ""
//     });

//     // Handle regular login form changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };
//     // Handle regular login form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoginError(null);
//         try {
//             const response = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/user/login`,
//                 formData,
//                 { withCredentials: true }
//             );

//             // Store user data
//             localStorage.setItem("user", JSON.stringify(response.data.user));
//             localStorage.setItem("token", response.data.token);

//             // Redirect to profile or dashboard
//             navigate('/profile');
//         } catch (error) {
//             console.error("Login error:", error);
//             setLoginError(
//                 error.response?.data?.message ||
//                 "An error occurred during login. Please try again."
//             );
//         }
//     };

//     // Handle Auth0 login and backend sync
//     useEffect(() => {
//         if (!isLoading && isAuthenticated && user) {
//             const saveUserToBackend = async () => {
//                 try {
//                     const token = await getAccessTokenSilently();

//                     const response = await axios.post(
//                         `${import.meta.env.VITE_BACKEND_URL}/user/auth0-login`,
//                         {
//                             email: user.email,
//                             name: user.name,
//                             picture: user.picture,
//                             sub: user.sub  // Auth0 user ID
//                         },
//                         {
//                             headers: { Authorization: `Bearer ${token}` },
//                             withCredentials: true,
//                         }
//                     );

//                     console.log("Auth0 login successful:", response);

//                     // Store user data
//                     localStorage.setItem("user", JSON.stringify(response.data.user));
//                     localStorage.setItem("token", response.data.token);

//                     // Redirect to profile or dashboard
//                     navigate('/profile');
//                 } catch (error) {
//                     console.error("Error during Auth0 login:", error);
//                     setLoginError(
//                         error.response?.data?.message ||
//                         "An error occurred during Auth0 login. Please try again."
//                     );
//                 }
//             };

//             saveUserToBackend();
//         }
//     }, [isAuthenticated, user, navigate, getAccessTokenSilently, isLoading]);

//     if (isLoading) {
//         return <div className="loading">Loading authentication...</div>;
//     }

//     return (
//         <div className="login-container">
//             <h2>Login</h2>

//             {loginError && (
//                 <div className="error-message">{loginError}</div>
//             )}

//             {isAuthenticated ? (
//                 <div>You are logged in. Redirecting to your profile...</div>
//             ) : (
//                 <>
//                     {/* Auth0 Login Button */}
//                     <div className="auth0-login">
//                         <button
//                             onClick={() => loginWithRedirect()}
//                             className="auth0-button"
//                         >
//                             Login with Auth0
//                         </button>
//                     </div>

//                     <div className="divider">
//                         <span>OR</span>
//                     </div>

//                     {/* Regular Login Form */}
//                     <form onSubmit={handleSubmit} className="login-form">
//                         <div className="form-group">
//                             <label htmlFor="email">Email</label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="password">Password</label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>

//                         <button type="submit" className="login-button">
//                             Login
//                         </button>
//                     </form>

//                     <div className="signup-link">
//                         <p>
//                             Don't have an account? <Link to="/signup">Sign up</Link>
//                         </p>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Login;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
    const { user, loginWithRedirect, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle regular login form changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle regular login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);
        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/login`,
                formData,
                { withCredentials: true }
            );

            // Store user data
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);

            navigate('/profile');
        } catch (error) {
            console.error("Login error:", error);
            setLoginError(
                error.response?.data?.message ||
                "Invalid credentials. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Auth0 login and backend sync
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const saveUserToBackend = async () => {
                try {
                    const token = await getAccessTokenSilently();

                    const response = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/user/auth0-login`,
                        {
                            email: user.email,
                            name: user.name,
                            picture: user.picture,
                            sub: user.sub
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        }
                    );

                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    localStorage.setItem("token", response.data.token);
                    navigate('/profile');
                } catch (error) {
                    console.error("Error during Auth0 login:", error);
                    setLoginError(
                        error.response?.data?.message ||
                        "Authentication failed. Please try again."
                    );
                }
            };

            saveUserToBackend();
        }
    }, [isAuthenticated, user, navigate, getAccessTokenSilently, isLoading]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-gray-600">Loading authentication...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="text-green-600 mb-4">✓ Authentication successful</div>
                    <div className="text-gray-600">Redirecting to your profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>

                {loginError && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {loginError}
                    </div>
                )}

                {/* Auth0 Login Button */}
                <button
                    onClick={() => loginWithRedirect()}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Continue with Auth0
                </button>

                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">or continue with email</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Regular Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="flex justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                            } transition-colors`}
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;