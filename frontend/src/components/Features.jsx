import { FaTruck, FaBoxOpen, FaShieldAlt } from "react-icons/fa";

const InfoBanner = () => {
    return (
        <div className="w-full bg-white py-6 px-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 text-center sm:text-left">
                {/* Fast Shipping */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-4 border-b sm:border-b-0 sm:border-r border-gray-200 sm:pr-4 pb-4 sm:pb-0 w-full sm:w-auto">
                    <FaTruck className="text-3xl text-black mb-2 sm:mb-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-black">Fast, Free Shipping</h4>
                        <p className="text-sm text-gray-600">All over Pakistan.</p>
                    </div>
                </div>

                {/* Open Parcel Delivery */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-4 border-b sm:border-b-0 sm:border-r border-gray-200 sm:pr-4 pb-4 sm:pb-0 w-full sm:w-auto">
                    <FaBoxOpen className="text-3xl text-black mb-2 sm:mb-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-black">Open Parcel Delivery</h4>
                        <p className="text-sm text-gray-600">Free – No Question Ask</p>
                    </div>
                </div>

                {/* Secure Payment */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-4 w-full sm:w-auto">
                    <FaShieldAlt className="text-3xl text-black mb-2 sm:mb-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-black">Secure Payment</h4>
                        <p className="text-sm text-gray-600">100% Safe Checkout</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoBanner;
