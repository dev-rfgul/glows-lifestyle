import { useEffect, useState, useCallback } from "react";

const names = [
    "Ahmed", "Ayesha", "Hassan", "Fatima", "Bilal", "Zainab",
    "Usman", "Maryam", "Ali", "Noor", "Ibrahim", "Hina",
    "Omar", "Khadija", "Tariq", "Saima", "Waleed", "Amina","Shahryar","Moeed","Saleem",
    "Sana", "Faisal", "Zara", "Asad", "Nida", "Rehan",
    "Sadia", "Bilqis", "Yasir", "Hira", "Saqib", "Nazia", "Tariq", "Areeba", "Hamza", "Sadia", "Raza", "Adeel", "Nazia", "Sami", "Hafsa", "Zeeshan", "Rabia", "Fahad", "Saira", "Bilal", "Ayesha", "Hassan", "Fatima", "Bilal", "Zainab",
    "Usman", "Maryam", "Ali", "Noor", "Ibrahim", "Hina",
    "Omar",
];

const locations = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar",
    "Multan", "Faisalabad", "Hyderabad", "Quetta", "Sialkot",
    "Gujranwala", "Bahawalpur", "Sargodha", "Sahiwal", "Gujrat",
    "Mardan", "Abbottabad", "Mirpur", "Skardu", "Muzaffarabad",
    "Gilgit", "Swat", "Bannu", "Dera Ismail Khan", "Kohat", "Nowshera",
    "Chitral", "Dera Ghazi Khan", "Jhelum", "Attock", "Multan",
    "Rahim Yar Khan", "Okara", "Kasur", "Larkana", "Jacobabad",
    "Sukkur", "Nawabshah", "Khairpur", "Tando Adam", "Mithi",
    "Dadu", "Thatta", "Badin", "Ghotki", "Shikarpur",
    "Layyyah", "Bhakkar", "Mianwali", "Jhang", "Toba Tek Singh",
    "Chiniot", "Sargodha", "Khanewal", "Vehari", "Pakpattan", "Sahiwal", "Layyah", "Bhakkar", "Mianwali", "Jhang", "Toba Tek Singh",
    "Chiniot", "Sargodha", "Khanewal", "Vehari", "Pakpattan", "Sahiwal", "Layyah", "Bhakkar", "Mianwali", "Jhang", "Toba Tek Singh",
    "Chiniot",
];

const actions = [
    { text: "just ordered", color: "from-emerald-500 to-green-600", icon: "🛒" },
    { text: "is viewing", color: "from-blue-500 to-indigo-600", icon: "👁️" },
    { text: "added to cart", color: "from-purple-500 to-violet-600", icon: "🛍️" },
    { text: "purchased", color: "from-rose-500 to-pink-600", icon: "✨" },
    { text: "is interested in", color: "from-amber-500 to-orange-600", icon: "💡" }
];

const products = [
    "Acer OHR 503 Wireless Earbuds",
    "Air31 TWS Earbuds",
    "Glowz-A9 Pro Touch Screen Airpods",
    "Glowz - 895B Bluetooth TWS Wireless Earphone",
    "Glowz-A6S TWS Headset Wireless Earphones",
    "Hoco EQ2 Earbuds",
    "Lenovo GM2 Pro Wireless Bluetooth Headset",
    "H9 Pro Max Series 9 Smart Watch"
];

const urgencyMessages = [
    "🔥 Limited stock!",
    "⚡ Flash sale active!",
    "🎯 Hot item!",
    "💫 Trending now!",
    "🏆 Best seller!",
    ""
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const getRandomTime = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const NotificationPopup = () => {
    const [visible, setVisible] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [progress, setProgress] = useState(100);

    const createNotification = useCallback(() => {
        const name = getRandomItem(names);
        const location = getRandomItem(locations);
        const product = getRandomItem(products);
        const action = getRandomItem(actions);
        const urgency = Math.random() < 0.3 ? getRandomItem(urgencyMessages) : "";

        return {
            name,
            location,
            product,
            action,
            urgency,
            timestamp: Date.now()
        };
    }, []);

    useEffect(() => {
        let showTimer, hideTimer, nextNotificationTimer;

        const showNotification = () => {
            // Create new notification
            const newNotification = createNotification();
            setNotification(newNotification);
            setVisible(true);
            setProgress(100);

            // Show for 4-5 seconds
            const displayDuration = getRandomTime(4000, 5000);

            hideTimer = setTimeout(() => {
                setVisible(false);

                // Wait for fade out animation to complete, then schedule next notification
                setTimeout(() => {
                    // Gap of 6-7 seconds before next notification
                    const gapDuration = getRandomTime(6000, 7000);
                    nextNotificationTimer = setTimeout(showNotification, gapDuration);
                }, 500); // Wait for fade out animation

            }, displayDuration);
        };

        // Show first notification immediately
        showNotification();

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            clearTimeout(nextNotificationTimer);
        };
    }, [createNotification]);

    // Progress bar animation
    useEffect(() => {
        if (!visible || isHovered) {
            return;
        }

        const duration = 5000;
        const interval = 50;
        const step = (100 / duration) * interval;

        const progressTimer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev - step;
                if (newProgress <= 0) {
                    clearInterval(progressTimer);
                    return 0;
                }
                return newProgress;
            });
        }, interval);

        return () => clearInterval(progressTimer);
    }, [visible, isHovered]);

    // Reset progress when hovered
    useEffect(() => {
        if (isHovered) {
            setProgress(100);
        }
    }, [isHovered]);

    const handleClose = () => {
        setVisible(false);
    };

    if (!notification) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <div
                className={`transform transition-all duration-700 ease-out ${visible
                        ? "translate-x-0 opacity-100 scale-100"
                        : "-translate-x-full opacity-0 scale-95"
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className={`relative overflow-hidden bg-gradient-to-r ${notification.action.color} rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm max-w-sm w-full group hover:shadow-3xl transition-all duration-300 hover:scale-105`}>
                    {/* Animated background particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-2 -left-2 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-300"></div>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
                        <div
                            className="h-full bg-white/80 transition-all duration-75 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xs transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                    >
                        ×
                    </button>

                    <div className="relative p-5 flex items-start gap-4">
                        {/* Animated icon */}
                        <div className="relative">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-2xl shadow-lg animate-bounce">
                                {notification.action.icon}
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-white/90 text-sm font-bold tracking-wide">LIVE ACTIVITY</span>
                                {notification.urgency && (
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white font-medium animate-pulse">
                                        {notification.urgency}
                                    </span>
                                )}
                            </div>

                            <p className="text-white text-sm leading-relaxed">
                                <span className="font-semibold">{notification.name}</span> {notification.action.text}{" "}
                                <span className="font-medium underline decoration-white/50">
                                    {notification.product}
                                </span>{" "}
                                from <span className="font-medium">{notification.location}</span>
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-white/80 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span>Just now</span>
                                </div>
                                <span>•</span>
                                <span className="hover:text-white cursor-pointer transition-colors">View details</span>
                            </div>
                        </div>
                    </div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;