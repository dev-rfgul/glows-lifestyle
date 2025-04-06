// import { useState, useEffect, useRef } from "react";
// import { 
//   AiOutlineCheckCircle, 
//   AiOutlineCloseCircle, 
//   AiOutlineInfoCircle, 
//   AiOutlineWarning,
//   AiOutlineClose
// } from "react-icons/ai";

// /**
//  * Card-style alert message component
//  * @param {Object} props
//  * @param {string} props.message - The alert message text
//  * @param {string} props.type - Alert type: "success", "error", "warning", or "info"
//  * @param {Function} props.onClose - Function to call when alert is closed
//  * @param {number} [props.duration=3000] - How long the alert stays visible in ms
//  * @param {string} [props.logoUrl] - Optional custom logo URL
//  * @param {boolean} [props.showCloseButton=true] - Whether to show the close button
//  */
// const AlertMessage = ({ 
//   message, 
//   type = "success", 
//   onClose, 
//   duration = 5000,
//   logoUrl = "./images/logo.png",
//   showCloseButton = true
// }) => {
//     const [visible, setVisible] = useState(false);
//     const [leaving, setLeaving] = useState(false);
//     const timerRef = useRef(null);

//     // Define styles based on alert type
//     const alertStyles = {
//         success: {
//             bg: "bg-white",
//             text: "text-green-700",
//             border: "border-green-200",
//             iconBg: "bg-green-100",
//             icon: <AiOutlineCheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
//         },
//         error: {
//             bg: "bg-white",
//             text: "text-red-700",
//             border: "border-red-200",
//             iconBg: "bg-red-100",
//             icon: <AiOutlineCloseCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
//         },
//         warning: {
//             bg: "bg-white",
//             text: "text-yellow-700",
//             border: "border-yellow-200",
//             iconBg: "bg-yellow-100",
//             icon: <AiOutlineWarning className="w-8 h-8 text-yellow-600" aria-hidden="true" />
//         },
//         info: {
//             bg: "bg-white",
//             text: "text-blue-700",
//             border: "border-blue-200",
//             iconBg: "bg-blue-100",
//             icon: <AiOutlineInfoCircle className="w-8 h-8 text-blue-600" aria-hidden="true" />
//         }
//     };

//     const currentStyle = alertStyles[type] || alertStyles.info;
    
//     const handleClose = () => {
//         setLeaving(true);
//         // Wait for animation to complete before removing from DOM
//         setTimeout(() => {
//             setVisible(false);
//             onClose?.();
//         }, 300);
//     };
    
//     // Reset timers on unmount
//     useEffect(() => {
//         return () => {
//             if (timerRef.current) clearTimeout(timerRef.current);
//         };
//     }, []);

//     // Handle visibility when message changes
//     useEffect(() => {
//         if (message) {
//             // Clear any existing timers
//             if (timerRef.current) clearTimeout(timerRef.current);
            
//             setLeaving(false);
//             setVisible(true);
            
//             // Auto-dismiss after duration
//             if (duration !== Infinity) {
//                 timerRef.current = setTimeout(() => {
//                     handleClose();
//                 }, duration);
//             }
//         }
//     }, [message, duration]);

//     // Handle keyboard accessibility
//     useEffect(() => {
//         const handleEscape = (e) => {
//             if (e.key === 'Escape' && visible) {
//                 handleClose();
//             }
//         };
        
//         if (visible) {
//             document.addEventListener('keydown', handleEscape);
//         }
        
//         return () => {
//             document.removeEventListener('keydown', handleEscape);
//         };
//     }, [visible]);

//     if (!visible) return null;

//     return (
//         <div 
//             className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
//             role="alert"
//             aria-live="polite"
//         >
//             <div 
//                 className={`flex flex-col items-center max-w-md mx-4 rounded-lg shadow-xl border
//                     ${currentStyle.bg} ${currentStyle.border}
//                     transition-all duration-300 pointer-events-auto
//                     ${leaving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
//             >
//                 {/* Close button (top right) */}
//                 {showCloseButton && (
//                     <button 
//                         onClick={handleClose}
//                         className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                         aria-label="Close alert"
//                     >
//                         <AiOutlineClose className="w-4 h-4 text-gray-500" />
//                     </button>
//                 )}
                
//                 {/* Top Section with Icon */}
//                 <div className={`flex items-center justify-center w-full p-6 ${currentStyle.iconBg} rounded-t-lg`}>
//                     <div className="flex items-center justify-center">
//                         {currentStyle.icon}
//                     </div>
//                 </div>
                
//                 {/* Middle Section with Logo and Message */}
//                 <div className="flex items-center w-full p-5">
//                     {/* Logo */}
//                     {logoUrl && (
//                         <div className="flex-shrink-0 mr-4">
//                             <img src={logoUrl} alt="" className="w-14 h-14 object-contain" />
//                         </div>
//                     )}
//                     {/* Message */}
//                     <div className="flex-1">
//                         <p className={`font-medium ${currentStyle.text}`}>{message}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AlertMessage;

import { useState, useEffect, useRef } from "react";
import {
    AiOutlineCheckCircle,
    AiOutlineCloseCircle,
    AiOutlineInfoCircle,
    AiOutlineWarning,
    AiOutlineClose
} from "react-icons/ai";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

/**
 * Card-style alert message component
 * @param {Object} props
 * @param {string} props.message - The alert message text
 * @param {string} props.type - Alert type: "success", "error", "warning", or "info"
 * @param {Function} props.onClose - Function to call when alert is closed
 * @param {number} [props.duration=3000] - How long the alert stays visible in ms
 * @param {string} [props.logoUrl] - Optional custom logo URL
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button
 * @param {boolean} [props.showBtns=false] - Whether to show the guest action buttons
 */
const AlertMessage = ({
    message,
    type = "success",
    onClose,
    duration = 5000,
    logoUrl = "./images/logo.png",
    showBtns = false, // Add default value here
    showCloseButton = true,
}) => {
    // Debug log
    console.log("AlertMessage rendered with showBtns:", showBtns);

    const [visible, setVisible] = useState(true); // Start visible by default
    const [leaving, setLeaving] = useState(false);
    const timerRef = useRef(null);

    const navigate = useNavigate();
    
    // Define styles based on alert type
    const alertStyles = {
        success: {
            bg: "bg-white",
            text: "text-green-700",
            border: "border-green-200",
            iconBg: "bg-green-100",
            icon: <AiOutlineCheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
        },
        error: {
            bg: "bg-white",
            text: "text-red-700",
            border: "border-red-200",
            iconBg: "bg-red-100",
            icon: <AiOutlineCloseCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
        },
        warning: {
            bg: "bg-white",
            text: "text-yellow-700",
            border: "border-yellow-200",
            iconBg: "bg-yellow-100",
            icon: <AiOutlineWarning className="w-8 h-8 text-yellow-600" aria-hidden="true" />
        },
        info: {
            bg: "bg-white",
            text: "text-blue-700",
            border: "border-blue-200",
            iconBg: "bg-blue-100",
            icon: <AiOutlineInfoCircle className="w-8 h-8 text-blue-600" aria-hidden="true" />
        }
    };

    const currentStyle = alertStyles[type] || alertStyles.info;

    const handleClose = () => {
        setLeaving(true);
        // Wait for animation to complete before removing from DOM
        setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 300);
    };

    // Reset timers on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    // Handle visibility when message changes
    useEffect(() => {
        if (message) {
            // Clear any existing timers
            if (timerRef.current) clearTimeout(timerRef.current);

            setLeaving(false);
            setVisible(true);

            // Auto-dismiss after duration
            if (duration !== Infinity) {
                timerRef.current = setTimeout(() => {
                    handleClose();
                }, duration);
            }
        } else {
            setVisible(false);
        }
    }, [message, duration]);
    
    // Handle keyboard accessibility
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && visible) {
                handleClose();
            }
        };

        if (visible) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [visible]);

    if (!visible) return null;

    const handleGuestAcct = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/guest-signup`);
            const user = response.data?.newUser;
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                console.log("Guest account created:", user);
                handleClose(); // Close alert after successful guest login
                navigate('/');
            } else {
                console.error("No user returned from guest-signup API");
            }
        } catch (error) {
            console.error("Error creating guest account:", error);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            role="alert"
            aria-live="polite"
        >
            <div
                className={`flex flex-col items-center max-w-md mx-4 rounded-lg shadow-xl border
                    ${currentStyle.bg} ${currentStyle.border}
                    transition-all duration-300 pointer-events-auto
                    ${leaving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            >
                {/* Close button (top right) */}
                {showCloseButton && (
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        aria-label="Close alert"
                    >
                        <AiOutlineClose className="w-4 h-4 text-gray-500" />
                    </button>
                )}

                {/* Top Section with Icon */}
                <div className={`flex items-center justify-center w-full p-6 ${currentStyle.iconBg} rounded-t-lg`}>
                    <div className="flex items-center justify-center">
                        {currentStyle.icon}
                    </div>
                </div>

                {/* Middle Section with Logo and Message */}
                <div className="flex items-center w-full p-5">
                    {logoUrl && (
                        <div className="flex-shrink-0 mr-4">
                            <img src={logoUrl} alt="" className="w-14 h-14 object-contain" />
                        </div>
                    )}
                    <div className="flex-1">
                        <p className={`font-medium ${currentStyle.text}`}>{message}</p>
                    </div>
                </div>

                {/* Guest Action Button - Check explicitly for true */}
                {/* {showBtns === true && (
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
                )} */}
            </div>
        </div>
    );
};

export default AlertMessage;