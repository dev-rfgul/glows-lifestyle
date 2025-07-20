

import React, { useEffect, useState } from 'react';
import {
    AiOutlineClose,
    AiOutlineCheckCircle,
    AiOutlineInfoCircle,
    AiOutlineWarning,
} from 'react-icons/ai';
import { MdOutlineLocalOffer } from 'react-icons/md';

const ICONS = {
    success: <AiOutlineCheckCircle className="text-green-500" size={28} />,
    error: <AiOutlineWarning className="text-red-500" size={28} />,
    info: <AiOutlineInfoCircle className="text-blue-500" size={28} />,
    sale: <MdOutlineLocalOffer className="text-pink-500" size={28} />,
};

const NOTIFICATION_STYLES = {
    success: {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        border: 'border-green-500',
        title: 'text-green-800',
        message: 'text-green-700',
        shadow: 'shadow-green-200/50',
        glow: 'shadow-green-400/30'
    },
    error: {
        bg: 'bg-gradient-to-r from-red-50 to-rose-50',
        border: 'border-red-500',
        title: 'text-red-900',
        message: 'text-red-800',
        shadow: 'shadow-red-200/60',
        glow: 'shadow-red-400/40'
    },
    info: {
        bg: 'bg-gradient-to-r from-blue-50 to-sky-50',
        border: 'border-blue-500',
        title: 'text-blue-800',
        message: 'text-blue-700',
        shadow: 'shadow-blue-200/50',
        glow: 'shadow-blue-400/30'
    },
    sale: {
        bg: 'bg-gradient-to-r from-pink-50 via-purple-50 to-yellow-50',
        border: 'border-pink-500',
        title: 'text-pink-800',
        message: 'text-pink-700',
        shadow: 'shadow-pink-200/50',
        glow: 'shadow-pink-400/30'
    }
};

const Sparkle = ({ style }) => (
    <div
        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
        style={style}
    />
);

const SparkleBurst = () => {
    const sparkles = Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const distance = 60 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const delay = Math.random() * 2;
        
        return {
            id: i,
            x,
            y,
            delay,
            size: Math.random() * 3 + 1
        };
    });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {sparkles.map(sparkle => (
                <Sparkle
                    key={sparkle.id}
                    style={{
                        left: `calc(50% + ${sparkle.x}px)`,
                        top: `calc(50% + ${sparkle.y}px)`,
                        width: `${sparkle.size}px`,
                        height: `${sparkle.size}px`,
                        animationDelay: `${sparkle.delay}s`,
                        animationDuration: '2s'
                    }}
                />
            ))}
        </div>
    );
};

const PulseRing = ({ type }) => {
    if (type !== 'error') return null;
    
    return (
        <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
            <div className="absolute inset-0 border-2 border-red-400 rounded-xl animate-ping opacity-30"></div>
            <div className="absolute inset-0 border-2 border-red-300 rounded-xl animate-pulse opacity-50"></div>
            <div className="absolute inset-0 bg-red-50 rounded-xl animate-pulse opacity-20"></div>
        </div>
    );
};

const FloatingIcon = ({ type }) => {
    const baseClass = "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm";
    
    switch (type) {
        case 'success':
            return <div className={`${baseClass} bg-green-500 animate-bounce`}>✓</div>;
        case 'error':
            return <div className={`${baseClass} bg-red-500 animate-pulse shadow-lg`}>!</div>;
        case 'info':
            return <div className={`${baseClass} bg-blue-500 animate-pulse`}>i</div>;
        case 'sale':
            return <div className={`${baseClass} bg-gradient-to-r from-pink-500 to-purple-500 animate-spin`}>%</div>;
        default:
            return null;
    }
};

const NotificationPopup = () => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [timer, setTimer] = useState(3000);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with your actual API call
        fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/notification`)
            .then(res => res.json())
            .then(data => {
                // Only show notification if we have valid data
                if (data && data.message && data.message.trim()) {
                    const { message, type, timer } = data;
                    setMessage(message);
                    setType(type || 'info');
                    setTimer(timer || 3000);
                    setVisible(true);

                } else {
                    setVisible(false);
                }
            })
            .catch(() => setVisible(false))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!visible) return;
        const timeout = setTimeout(() => setVisible(false), timer);
        return () => clearTimeout(timeout);
    }, [visible, timer]);

    if (!visible || loading) return null;

    const styles = NOTIFICATION_STYLES[type] || NOTIFICATION_STYLES.info;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className={`
                relative ${styles.bg} text-black w-full max-w-md p-6 rounded-xl 
                shadow-2xl ${styles.shadow} border-l-4 ${styles.border}
                transform transition-all duration-300 animate-bounce-in
                ${type === 'sale' ? 'shadow-2xl ' + styles.glow : ''}
                ${type === 'error' ? 'shadow-2xl ' + styles.glow : ''}
            `}>
                {/* Sparkle effect for sale notifications */}
                {type === 'sale' && <SparkleBurst />}
                
                {/* Pulse ring for error notifications */}
                <PulseRing type={type} />
                
                {/* Floating icon */}
                <FloatingIcon type={type} />
                
                <button
                    onClick={() => setVisible(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-black transition-colors z-10"
                    aria-label="Close notification"
                >
                    <AiOutlineClose size={20} />
                </button>
                
                <div className="flex items-start space-x-4">
                    <div className={`
                        flex-shrink-0 p-2 rounded-full 
                        ${type === 'success' && 'bg-green-100'}
                        ${type === 'error' && 'bg-red-100'}
                        ${type === 'info' && 'bg-blue-100'}
                        ${type === 'sale' && 'bg-gradient-to-r from-pink-100 to-purple-100'}
                    `}>
                        {ICONS[type] || ICONS['info']}
                    </div>
                    <div className="flex-1">
                        <h4 className={`text-lg font-bold capitalize ${styles.title} mb-1`}>
                            {type === 'success' && '✅ Success!'}
                            {type === 'error' && '⚠️ Warning!'}
                            {type === 'info' && 'ℹ️ Information'}
                            {type === 'sale' && '🎉 Special Offer!'}
                        </h4>
                        <p className={`text-sm ${styles.message} leading-relaxed`}>
                            {message}
                        </p>
                        {type === 'sale' && (
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs text-pink-600 font-medium">
                                    Limited Time Only!
                                </span>
                                <div className="flex space-x-1">
                                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                    <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                            type === 'success' ? 'bg-green-500' :
                            type === 'error' ? 'bg-red-500' :
                            type === 'info' ? 'bg-blue-500' :
                            'bg-gradient-to-r from-pink-500 to-purple-500'
                        }`}
                        style={{
                            width: '100%',
                            animation: `shrink ${timer}ms linear forwards`
                        }}
                    />
                </div>
            </div>
            
            <style jsx>{`
                @keyframes bounce-in {
                    0% { transform: scale(0.3) translateY(-100px); opacity: 0; }
                    50% { transform: scale(1.05) translateY(10px); }
                    70% { transform: scale(0.95) translateY(-5px); }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                
                .animate-bounce-in {
                    animation: bounce-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
};

export default NotificationPopup;