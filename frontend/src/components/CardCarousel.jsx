import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import {
    Autoplay,
    EffectCoverflow,
    Navigation,
    Pagination,
} from "swiper/modules"
import ProductCard from "./ProductCard"
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

                    <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
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
                                                <ProductCard product={product} />
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
