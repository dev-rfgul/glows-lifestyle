

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faUser,
    faHeart,
    faShoppingCart,
    faBars,
    faTimes,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));

    const cartItems = useSelector((state) => state.cart.items);
    const cartLength = cartItems?.length || 0;
    const wishlistItems = useSelector((state) => state.wishlist?.items || []);
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

    // Listen for scroll events to apply shadow/background change
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Navbar menu items for better maintainability
    const navItems = [

    ];

    return (
        <header className={`bg-black text-blue-100 transition-all duration-300`}>
            {/* Banner Section */}
            <div className="bg-black  text-white text-sm md:text-lg lg:text-lg font-bold  italic text-black text-sm py-2 text-center border-b-2 border-white">
                <p>Shop the Latest Trends , Your Favourite Styles , Delievered  </p>
            </div>

            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo Section */}
                <Link
                    to="/"
                    className="flex items-center space-x-4 transition-transform hover:scale-105"
                >
                    <img
                        className="w-22 md:w-22 h-auto object-contain"
                        src="./images/logo.jpeg"
                        alt="Glowz Lifestyel Logo"
                        loading="eager"
                    />
                </Link>

                {/* Mobile Menu Button */}
                <div className="flex items-center space-x-4 md:hidden">
                    <button
                        aria-label="Search"
                        className="text-white text-xl focus:outline-none p-2"
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <button
                        aria-label={menuOpen ? "Close Menu" : "Open Menu"}
                        className="text-white text-2xl focus:outline-none p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
                    </button>
                </div>



                {/* User Account, Wishlist, and Cart - Desktop */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* User Account */}
                    <div className="flex items-center space-x-2 group">
                        <div>
                            {user ? (
                                <div>

                                    <Link
                                        to="/profile"
                                        className="text-white text-sm hover:text-lime-500 transition-colors"
                                    >
                                        My Account
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    {!isAuthenticated ? (
                                        <nav>
                                            <Link
                                                to="/signup"
                                                className="text-white font-semibold text-sm hover:text-lime-500 transition-colors"
                                            >
                                                Signup
                                            </Link>
                                            <span className="mx-2 text-gray-300">|</span>
                                            <Link
                                                to="/login"
                                                className="text-white font-semibold text-sm hover:text-lime-500 transition-colors"
                                            >
                                                Login
                                            </Link>
                                        </nav>
                                    ) : (
                                        <p className="text-sm text-lime-600">Welcome back!</p>
                                    )}
                                </div>
                            )}



                        </div>
                    </div>

                    {/* Cart Icon */}
                    <Link to="/profile" className="relative group">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-white text-lg group-hover:text-lime-500 transition-colors" />
                    </Link>
                    <Link to="/profile">
                        <FontAwesomeIcon icon={faUser} className="text-white text-lg group-hover:text-lime-500 transition-colors" />
                    </Link>
                </div>
            </div>

            {/* Mobile Search - Conditional rendering */}
            {searchOpen && (
                <div className="px-4 py-2 md:hidden">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-lime-500">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>
            )}


            {/* Mobile User Controls - Only visible when menu is open on mobile */}
            {menuOpen && (
                <div className="md:hidden bg-gray-100 p-4 flex justify-around">
                    <Link to="/profile" className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faUser} className="text-black text-lg mb-1" />
                        <span className="text-xs">Account</span>
                    </Link>
                    <Link to="/wishlist" className="flex flex-col items-center">
                        <div className="relative">
                            <FontAwesomeIcon icon={faHeart} className="text-black text-lg mb-1" />
                            <span className="absolute -top-2 -right-2 bg-lime-500 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {wishlistItems.length}
                            </span>
                        </div>
                        <span className="text-xs">Wishlist</span>
                    </Link>
                    <Link to="/profile" className="flex flex-col items-center">
                        <div className="relative">
                            <FontAwesomeIcon icon={faShoppingCart} className="text-black text-lg mb-1" />
                            <span className="absolute -top-2 -right-2 bg-lime-500 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {cartLength}
                            </span>
                        </div>
                        <span className="text-xs">Cart</span>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;