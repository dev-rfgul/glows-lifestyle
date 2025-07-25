import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
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

export const CardCarousel = ({
    autoplayDelay = 3000,
    showPagination = true,
    showNavigation = true,
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
    .swiper-3d .swiper-slide-shadow-right {
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
    `;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setData(result.products || []);
                setError(null);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products");
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
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
                    {loading && <p className="text-center text-gray-500">Loading products...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && (
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
                                    {data.map((product) => (
                                        <SwiperSlide key={product._id}>
                                            <Link to={`/product/${product._id}`} className="block">
                                                <div className="product-card">
                                                    <div className="relative">
                                                        <img
                                                            src={product.img?.[0]}
                                                            alt={product.name}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-medium bg-blue-500">
                                                            {product.tagline || "Top Pick"}
                                                        </div>
                                                        {product.price > product.discountPrice && (
                                                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-4 flex flex-col justify-between h-56">
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
                                                            <h4 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h4>
                                                            <div className="flex items-center mb-3">
                                                                <div className="flex items-center">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            size={14}
                                                                            className={`fill-yellow-400 text-yellow-400`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm text-gray-600 ml-2">
                                                                    5.0 (100+)
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xl font-bold text-gray-900">PKR :{product.discountPrice}</span>
                                                                    {product.price > product.discountPrice && (
                                                                        <span className="text-sm text-gray-500 line-through">PKR: {product.price}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <Link to={`/product/${product._id}`} className="block">
                                                                {console.log("🔵 Rendering product:", product.name)}
                                                                <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                                                    <ShoppingCart size={16} />
                                                                    Visit Product
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CardCarousel;
