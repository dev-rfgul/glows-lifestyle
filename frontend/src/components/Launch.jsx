import React, { useState } from 'react';
import { FaRocket, FaEnvelope } from 'react-icons/fa'; // Font Awesome

export default function WelcomePage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
      setSubscribed(true);
      // In a real application, you'd send this to your backend
      console.log('Subscribed email:', email);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center px-6 overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute animate-pulse top-10 left-10 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute animate-bounce top-1/4 right-1/4 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute animate-spin-slow bottom-1/4 left-1/3 w-32 h-32 border-4 border-white rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <FaRocket className="mx-auto mb-6 w-24 h-24 text-white animate-bounce" />
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
          Something Incredible is Coming
        </h1>
        
        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Get ready for a groundbreaking experience. We're working hard to bring you something truly special.
        </p>

        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-md mx-auto">
            <div className="relative w-full">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg whitespace-nowrap"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div className="bg-white bg-opacity-20 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
            <p className="text-lg">You'll be the first to know when we launch on 4-4-2025.</p>
          </div>
        )}

        <p className="mt-8 text-sm opacity-70">
          Launching on 4-4-2025 • Stay Excited!
        </p>
      </div>
    </div>
  );
}