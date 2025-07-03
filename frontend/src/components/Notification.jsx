    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
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

    const NotificationPopup = () => {
        const [visible, setVisible] = useState(false);
        const [message, setMessage] = useState('');
        const [type, setType] = useState('info');
        const [timer, setTimer] = useState(3000);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/notification/notification`)
                .then(res => {
                    const { message, type, timer } = res.data;
                    setMessage(message || 'No message');
                    setType(type || 'info');
                    setTimer(timer || 3000);
                    setVisible(true);
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

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                <div className={`
                    relative bg-white text-black w-full max-w-md p-6 rounded-xl shadow-2xl border-l-4
                    transition-all animate-fade-in
                    ${type === 'success' && 'border-green-500'}
                    ${type === 'error' && 'border-red-500'}
                    ${type === 'info' && 'border-blue-500'}
                    ${type === 'sale' && 'border-pink-500'}
                `}>
                    <button
                        onClick={() => setVisible(false)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-black transition-colors"
                        aria-label="Close notification"
                    >
                        <AiOutlineClose size={20} />
                    </button>
                    <div className="flex items-start space-x-4">
                        {ICONS[type] || ICONS['info']}
                        <div>
                            <h4 className="text-lg font-semibold capitalize">{type} Notification</h4>
                            <p className="text-sm mt-1">{message}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default NotificationPopup;
