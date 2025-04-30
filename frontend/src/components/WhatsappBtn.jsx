import React from 'react';

const WhatsAppButton = () => {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <a
                href="https://wa.me/923136852594?text=Hello! I’ve visited your website and I'm interested in learning more about your products. Could you provide me with more details or answer a few questions? Looking forward to hearing from you!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-8 h-8"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.2.85-3.817-.235-.374a9.86 9.86 0 01-1.51-5.26A9.93 9.93 0 0112.04 2a9.93 9.93 0 017.054 2.923 9.93 9.93 0 012.919 7.052c-.002 5.464-4.476 9.928-9.973 9.928M20.992 3.031a11.93 11.93 0 00-8.503-3.524C5.648-.461.067 5.11 0 12C-.022 14.127.505 16.23 1.5 18.111L0 24l5.804-1.493A12.08 12.08 0 0012.06 24h.01c6.871 0 12.444-5.587 12.452-12.458.004-3.307-1.322-6.424-3.653-8.756" />
                </svg>
            </a>

            {/* Optional tooltip */}
            <div className="absolute right-0 mb-2 bottom-full bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Chat with us
            </div>
        </div>
    );
};

export default WhatsAppButton;