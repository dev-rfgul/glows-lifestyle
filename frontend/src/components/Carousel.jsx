
// import React from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const Carousel = () => {
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

// const data = [
//     "./images/carousel/carousel-image-4.jpg",
//     "./images/carousel/carousel-image-1.jpg",
//     "./images/carousel/carousel-image-7.jpg",
//     "./images/carousel/carousel-image-2.jpg",
//     "./images/carousel/carousel-image-5.jpg",
//     "./images/carousel/carousel-image-8.jpg",
//     "./images/carousel/carousel-image-3.jpg",
//     "./images/carousel/carousel-image-6.jpg",
//     "./images/carousel/carousel-image-9.jpg",

// ]

//     return (
//         <div className="carousel-container w-full md:w-3/4 mx-auto ">
//             <Slider {...settings}>
//                 {data.map((img, index) => (
//                     <div key={index} className="carousel-item bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
//                         <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[700px]">
//                             <img
//                                 src={img}
//                                 className="w-full h-full object-cover"
//                             />

//                         </div>
//                     </div>
//                 ))}
//             </Slider>
//         </div>
//     );
// };

// export default Carousel;

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageCarouselWithStaticBanner = () => {
    const carouselImages = [
        "./images/carousel/banner-4.jpeg",
        "./images/carousel/banner-1.jpeg",
        // "./images/carousel/banner-2.jpeg",
        // "./images/carousel/banner-3.jpeg",
   
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="w-full px-4 py-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Carousel (left) */}
                <div className="md:col-span-2 h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-md">
                    <Slider {...settings}>
                        {carouselImages.map((img, index) => (
                            <div
                                key={index}
                                className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] relative"
                            >
                                <img
                                    src={img}
                                    alt={`slide-${index}`}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Static Banner (right) */}
                <div className="h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-md overflow-hidden">
                    <img
                        src="./images/carousel/static-banner.jpeg"
                        alt="static banner"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageCarouselWithStaticBanner;
