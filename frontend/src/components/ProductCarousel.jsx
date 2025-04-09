
// import React, { useState, useEffect } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const ProductCarousel = () => {

//     const [data, setData] = useState([])
//     const [loading, setLoading] = useState();
//     const [error, setError] = useState()

//     const settings = {
//         centerMode: true,      // Enable center mode for better focus on the current slide
//         infinite: true,
//         autoplay: true,
//         autoplaySpeed: 2000,
//         slidesToShow: 1,
//         speed: 500,
//         arrows: true,
//         dots: true,
//         cssEase: 'ease-in-out',   // Smooth transition
//         fade: true,               // Enable fade transition
//         pauseOnHover: true,      // Pause autoplay on hover
//         focusOnSelect: true,     // Click to focus on a slide
//         lazyLoad: "ondemand",    // Lazy load for better performance
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 2,
//                     centerPadding: "40px",
//                     dots: false,   // Hide dots on larger screens
//                 },
//             },
//             {
//                 breakpoint: 768,
//                 settings: {
//                     slidesToShow: 1,
//                     centerPadding: "20px",
//                     arrows: false, // Hide arrows on smaller screens
//                     dots: true,
//                 },
//             },
//             {
//                 breakpoint: 480,
//                 settings: {
//                     slidesToShow: 1,
//                     centerPadding: "10px",
//                     arrows: false,
//                     dots: true,
//                 },
//             },
//         ],
//         prevArrow: <button className="custom-prev-arrow">Previous</button>,
//         nextArrow: <button className="custom-next-arrow">Next</button>,
//     };


//     useEffect(() => {
//         const fetchProducts = async () => {
//             setLoading(true);
//             try {
//                 // You could add query params for filtering based on your filters state
//                 const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 console.log(data)
//                 setData(data.products);
//                 setError(null);
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//                 setError("Failed to load products. Please try again later.");
//                 setData([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     });

//     return (
//         <div className="carousel-container w-full md:w-3/4 mx-auto ">
//             <Slider {...settings}>
//                 {data.map((product, index) => (
//                     <div key={index} className="carousel-item bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
//                         <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[700px]">
//                             <img
//                                 src={product.img[0]}
//                                 className="w-full h-full object-cover"
//                             />
//                             <h1>{product.category}</h1>
//                             <h1>{product.discountPrice}</h1>
//                             <h1>{product.name}</h1>
//                             <h1>{product.stock}</h1>
//                             <h1>{product.description}</h1>

//                         </div>
//                     </div>
//                 ))}
//             </Slider>
//         </div>
//     );
// };

// export default ProductCarousel;

import React, { useState, useEffect } from "react";

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
        autoplaySpeed: 2000,
        slidesToShow: 6, // Show 6 products on laptop screens
        slidesToScroll: 1, // Scroll one at a time for smoother continuous movement
        speed: 500,
        arrows: false, // Remove arrows to save space
        dots: false, // Remove dots to save space
        cssEase: 'linear', // Linear for smoother continuous motion
        pauseOnHover: false, // Don't pause on hover to keep it always moving
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
                    slidesToShow: 3,
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
                {data.map((product, index) => (
                       <ProductCard
                       key={product._id}
                       product={product}
                       loading={false}
                    //    onAddToCart={addToCart}
                       compact={true}
                   />

                ))}
            </Slider>
        </div>
    );
};

export default ProductCarousel;