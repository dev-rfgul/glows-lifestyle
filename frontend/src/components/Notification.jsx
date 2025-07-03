import React, { useEffect, useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai'; // ✅ close (X) icon

const NotificationPopup = ({ message = "🔥 Big Sale Today! Don't Miss Out!" }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
            <div className="relative bg-white text-black px-6 py-5 rounded-xl shadow-xl max-w-sm w-full animate-fade-in">
                <button
                    onClick={() => setVisible(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    <AiOutlineClose size={20} />
                </button>
                <p className="text-center text-base">{message}</p>
            </div>
        </div>
    );
};

export default NotificationPopup;
