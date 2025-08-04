

import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "./ProductCard";

const ProductCarousel = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Optimized settings for more products with continuous movement
    const settings = {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 0,
        slidesToShow: 6, // Show 6 products on laptop screens
        slidesToScroll: 1, // Scroll one at a time for smoother continuous movement
        speed: 2000,
        arrows: false, // Remove arrows to save space
        dots: false, // Remove dots to save space
        cssEase: 'linear', // Linear for smoother continuous motion
        pauseOnHover: true, // Don't pause on hover to keep it always moving
        responsive: [
            {
                breakpoint: 1536, // 2xl
                settings: {
                    slidesToShow: 6,
                }
            },
            {
                breakpoint: 1280, // xl
                settings: {
                    slidesToShow: 5,
                }
            },
            {
                breakpoint: 1024, // lg
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768, // md
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 640, // sm
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 480, // xs
                settings: {
                    slidesToShow: 2,
                }
            }
        ]
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setData(data.products);
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

    if (loading) return <div className="text-center py-2">Loading...</div>;
    if (error) return <div className="text-center py-2 text-red-500">{error}</div>;
    if (data.length === 0) return <div className="text-center py-2">No products available</div>;

    return (
        <div className="carousel-container w-full mx-auto">
            <Slider {...settings}>
                {data.map((product) => (
                    <div key={product._id} className="px-2">
                        <Link to={`/product/${product._id}`} className="block">
                            <ProductCard product={product} />
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductCarousel;