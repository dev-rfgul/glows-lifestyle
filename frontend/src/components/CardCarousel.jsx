"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { SparklesIcon, ShoppingCart, Star } from "lucide-react"
import {
    Autoplay,
    EffectCoverflow,
    Navigation,
    Pagination,
} from "swiper/modules"
import { Badge } from "./Badge"

// Dummy ecommerce product data
const ecommerceProducts = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299.99,
        originalPrice: 399.99,
        rating: 4.8,
        reviews: 1250,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        category: "Electronics",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 199.99,
        originalPrice: 249.99,
        rating: 4.6,
        reviews: 890,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        category: "Wearables",
        badge: "New Arrival"
    },
    {
        id: 3,
        name: "Leather Laptop Bag",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.7,
        reviews: 456,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        category: "Accessories",
        badge: "Sale"
    },
    {
        id: 4,
        name: "Wireless Gaming Mouse",
        price: 79.99,
        originalPrice: 99.99,
        rating: 4.9,
        reviews: 2100,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
        category: "Gaming",
        badge: "Top Rated"
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        price: 149.99,
        originalPrice: 199.99,
        rating: 4.5,
        reviews: 675,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
        category: "Audio",
        badge: "Limited"
    },
    {
        id: 6,
        name: "Coffee Maker Pro",
        price: 249.99,
        originalPrice: 329.99,
        rating: 4.8,
        reviews: 1890,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop",
        category: "Home & Kitchen",
        badge: "Staff Pick"
    }
];

export const CardCarousel = ({
    products = ecommerceProducts,
    autoplayDelay = 3000,
    showPagination = true,
    showNavigation = true
}) => {
    const css = `
  .swiper {
    width: 100%;
    padding-bottom: 50px;
  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 320px;
    height: 450px;
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  
  .product-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    height: 100%;
    border: 1px solid #e5e7eb;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  `

    const getBadgeColor = (badge) => {
        const colors = {
            "Best Seller": "bg-blue-500",
            "New Arrival": "bg-green-500",
            "Sale": "bg-red-500",
            "Top Rated": "bg-purple-500",
            "Limited": "bg-orange-500",
            "Staff Pick": "bg-pink-500"
        };
        return colors[badge] || "bg-gray-500";
    };

    return (
        <section className="w-full space-y-4">
            <style>{css}</style>
            <div className="mx-auto w-full max-w-6xl rounded-[24px] border border-black/5 p-4 shadow-sm md:rounded-t-[44px]">
                <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 p-4 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-6">
                    <Badge
                        variant="outline"
                        className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6 z-10"
                    >
                        <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800 mr-2" />
                        Ecommerce Store
                    </Badge>
                    <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
                        <div className="flex gap-2">
                            <div className="text-center">
                                <h3 className="text-4xl opacity-85 font-bold tracking-tight">
                                    Product Showcase
                                </h3>
                                <p className="text-gray-600 mt-2">Discover amazing products with seamless carousel experience.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-center gap-4">
                        <div className="w-full">
                            <Swiper
                                spaceBetween={30}
                                autoplay={{
                                    delay: autoplayDelay,
                                    disableOnInteraction: false,
                                }}
                                effect={"coverflow"}
                                grabCursor={true}
                                centeredSlides={true}
                                loop={true}
                                slidesPerView={"auto"}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 2.5,
                                }}
                                pagination={showPagination ? { clickable: true } : false}
                                navigation={
                                    showNavigation
                                        ? {
                                            nextEl: ".swiper-button-next",
                                            prevEl: ".swiper-button-prev",
                                        }
                                        : false
                                }
                                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                                className="product-swiper"
                            >
                                {products.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <div className="product-card">
                                            {/* Product Image */}
                                            <div className="relative">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-medium ${getBadgeColor(product.badge)}`}>
                                                    {product.badge}
                                                </div>
                                                {product.originalPrice > product.price && (
                                                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4 flex flex-col justify-between h-56">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
                                                    <h4 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h4>

                                                    {/* Rating */}
                                                    <div className="flex items-center mb-3">
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={`${i < Math.floor(product.rating)
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "fill-gray-200 text-gray-200"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-600 ml-2">
                                                            {product.rating} ({product.reviews})
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Price and Action */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                                            {product.originalPrice > product.price && (
                                                                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                                        <ShoppingCart size={16} />
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CardCarousel;