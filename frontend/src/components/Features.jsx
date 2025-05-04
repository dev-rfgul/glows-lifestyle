import { useState } from 'react';
import { FaTruck, FaBoxOpen, FaShieldAlt } from "react-icons/fa";

const InfoBanner = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const features = [
    {
      icon: FaTruck,
      title: "Fast, Free Shipping",
      description: "All over Pakistan",
      color: "bg-blue-50"
    },
    {
      icon: FaBoxOpen,
      title: "Open Parcel Delivery",
      description: "Free – No Question Ask",
      color: "bg-green-50"
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payment",
      description: "100% Safe Checkout",
      color: "bg-purple-50"
    }
  ];

  return (
    <div className="w-full bg-white py-8 px-4 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-lg p-6 transition-all duration-300 ${feature.color} hover:shadow-md`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full bg-white ${hoveredIndex === index ? 'scale-110' : ''} transition-transform duration-300`}>
                  <feature.icon className="text-gray-800 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;