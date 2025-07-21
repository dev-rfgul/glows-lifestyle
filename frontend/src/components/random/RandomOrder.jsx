// components/NotificationPopup.jsx
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

const names = [
  "Ahmed", "Ayesha", "Hassan", "Fatima", "Bilal", "Zainab",
  "Usman", "Maryam", "Ali", "Noor", "Ibrahim", "Hina"
];

const locations = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar",
  "Multan", "Faisalabad", "Hyderabad", "Quetta", "Sialkot"
];

const actions = ["has just ordered", "is viewing"];

const products = [
  "Acer OHR 503 Wireless Earbuds",
  "Air31 TWS Earbuds",
  "Glowz-A9 Pro Touch Screen Airpods",
  "Glowz - 895B Bluetooth TWS Wireless Earphone",
  "Glowz-A6S TWS Headset Wireless Earphones",
  "Hoco EQ2 Earbuds",
  "Lenovo GM2 Pro Wireless Bluetooth Headset"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// random time between min and max (ms)
const getRandomTime = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const NotificationPopup = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let hideTimeout, nextNotificationTimeout;

    const showNotification = () => {
      const name = getRandomItem(names);
      const location = getRandomItem(locations);
      const product = getRandomItem(products);
      const action = getRandomItem(actions);

      setMessage(`A user ${name} ${action} the ${product} from ${location}.`);
      setVisible(true);

      // Random duration between 4–6 seconds (4000–6000 ms)
      const displayDuration = getRandomTime(4000, 6000);
      hideTimeout = setTimeout(() => setVisible(false), displayDuration);

      // Random delay before next notification (7–10 seconds AFTER hiding)
      const nextDelay = getRandomTime(7000, 10000);
      nextNotificationTimeout = setTimeout(showNotification, displayDuration + nextDelay);
    };

    showNotification();

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(nextNotificationTimeout);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ease-in-out transform ${
        visible ? "translate-x-0 opacity-100" : "-translate-x-96 opacity-0"
      }`}
    >
      <div className="flex items-start gap-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg max-w-sm w-full border border-blue-400">
        <div className="p-2 bg-white rounded-full text-blue-600">
          <FaShoppingCart size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Live Activity</span>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
