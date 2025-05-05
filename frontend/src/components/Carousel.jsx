

// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const ImageCarouselWithStaticBanner = () => {
//     const carouselImages = [
//         "./images/carousel/banner-4.jpeg",
//         "./images/carousel/banner-1.jpeg",
//         // "./images/carousel/banner-2.jpeg",
//         // "./images/carousel/banner-3.jpeg",
   
//     ];

//     const settings = {
//         dots: true,
//         infinite: true,
//         speed: 500,
//         arrows: true,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//     };

//     return (
//         <div className="w-full px-4 py-6 max-w-7xl mx-auto">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Carousel (left) */}
//                 <div className="md:col-span-2 h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-md">
//                     <Slider {...settings}>
//                         {carouselImages.map((img, index) => (
//                             <div
//                                 key={index}
//                                 className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] relative"
//                             >
//                                 <img
//                                     src={img}
//                                     alt={`slide-${index}`}
//                                     className="absolute top-0 left-0 w-full h-full object-cover"
//                                 />
//                             </div>
//                         ))}
//                     </Slider>
//                 </div>

//                 {/* Static Banner (right) */}
//                 <div className="h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-md overflow-hidden">
//                     <img
//                         src="./images/carousel/static-banner.jpeg"
//                         alt="static banner"
//                         className="w-full h-full object-cover"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ImageCarouselWithStaticBanner;

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageCarouselWithStaticBanner = () => {
    const carouselImages = [
        "./images/carousel/banner-4.jpeg",
        "./images/carousel/banner-1.jpeg",
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
                <div className="md:col-span-2 overflow-hidden rounded-md bg-white">
                    <Slider {...settings}>
                        {carouselImages.map((img, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-center w-full"
                            >
                                <img
                                    src={img}
                                    alt={`slide-${index}`}
                                    className="w-full h-auto object-contain rounded-md"
                                />
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Static Banner (right) - Hidden on mobile */}
                <div className="hidden md:block h-[500px] rounded-md overflow-hidden">
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
