import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationForm = () => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [timer, setTimer] = useState(3000);
    const [currentNotification, setCurrentNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = `${import.meta.env.VITE_BACKEND_URL}/notification`; // Adjust if needed
    // alert(`API URL: ${API_URL}`); // Debugging line to check API URL
    // Fetch current notification
    useEffect(() => {
        axios.get(`${API_URL}/notification`)
            .then(res => {
                setCurrentNotification(res.data);
                console.log('Current notification:', res.data);
                setMessage(res.data.message);
                setType(res.data.type);
                setTimer(res.data.timer);
            })
            .catch(() => setCurrentNotification(null))
            .finally(() => setLoading(false));
    }, []);

    // Handle create/update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/add-notification`, {
                message, type, timer
            }, {
                withCredentials: true
            });

            setCurrentNotification(res.data);
            console.log('Notification saved:', res.data);
            alert('Notification saved successfully');
        } catch (err) {
            console.error(err);
            alert('Error saving notification');
        }
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/delete-notification`);
            setCurrentNotification(null);
            setMessage('');
            setType('info');
            setTimer(3000);
            alert('Notification deleted');
        } catch (err) {
            console.error(err);
            alert('Error deleting notification');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-10">
            <h2 className="text-2xl font-bold text-center">Notification Manager</h2>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Message</label>
                        <input
                            type="text"
                            className="mt-1 w-full border rounded p-2"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Type</label>
                        <select
                            className="mt-1 w-full border rounded p-2"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="info">Info</option>
                            <option value="sale">Sale</option>
                            <option value="warning">Warning</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Timer (ms)</label>
                        <input
                            type="number"
                            className="mt-1 w-full border rounded p-2"
                            value={timer}
                            onChange={(e) => setTimer(Number(e.target.value))}
                            min={100}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        Save Notification
                    </button>

                    {currentNotification && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-2"
                        >
                            Delete Notification
                        </button>
                    )}
                </form>
            )}
        </div>
    );
};

export default NotificationForm;
