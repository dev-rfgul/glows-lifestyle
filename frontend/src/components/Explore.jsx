
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Explore = () => {
    const navigate = useNavigate();
    
    // Enhanced data with more information and options
    const data = [
        {
            id: 1,
            category: "Earbuds",
            images: ["/images/explore/earbuds.gif"],
        },
        {
            id: 2,
            category: "Smartwatches",
            images: ["/images/explore/smartwatch.webp"],
        },
        {
            id: 3,
            category: "HeadPhones",
            images: ["/images/explore/headphone.webp"],
        },
        {
            id: 3,
            category: "Accessories",
            images: ["/images/explore/accessories.jpeg"],
        },
    ];

    // Animation and state management
    const [currentImageIndices, setCurrentImageIndices] = useState(data.map(() => 0));
    const [fadeKeys, setFadeKeys] = useState(data.map(() => 0));
    const [animationPaused, setAnimationPaused] = useState(data.map(() => false));
    
    // Ref for scroll animations
    const categoryRefs = useRef([]);

    // Set up intersection observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appear');
                    }
                });
            },
            { threshold: 0.2 }
        );

        // Observe all category elements
        categoryRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            categoryRefs.current.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [data.length]);

    // Image rotation effect
    useEffect(() => {
        const intervals = data.map((category, categoryIndex) =>
            setInterval(() => {
                if (!animationPaused[categoryIndex] && category.images.length > 1) {
                    setCurrentImageIndices((prevIndices) => {
                        const newIndices = [...prevIndices];
                        const currentIndex = newIndices[categoryIndex];
                        const nextIndex = (currentIndex + 1) % category.images.length;
                        newIndices[categoryIndex] = nextIndex;
                        return newIndices;
                    });

                    // Trigger fade animation
                    setFadeKeys((prevKeys) => {
                        const newKeys = [...prevKeys];
                        newKeys[categoryIndex] += 1;
                        return newKeys;
                    });
                }
            }, 2500)
        );

        return () => {
            intervals.forEach(clearInterval);
        };
    }, [animationPaused]);

    // Mouse interaction handlers
    const handleMouseEnter = (index) => {
        setAnimationPaused(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    };

    const handleMouseLeave = (index) => {
        setAnimationPaused(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    // Navigation handler
    const handleCategory = (category) => {
        const formattedCategory = category.toLowerCase();
        navigate(`/product/categories/${formattedCategory}`);
    };

    return (
        <div className="py-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Simple header */}
               {/* Image Grid - Responsive for mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {data.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => handleCategory(item.category)}
                            ref={el => categoryRefs.current[index] = el}
                            className="opacity-0 translate-y-4 cursor-pointer"
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                        >
                            {/* Full rounded image container with hover effect */}
                            <div className="relative aspect-square overflow-hidden rounded-full bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 group">
                                <img
                                    key={fadeKeys[index]}
                                    src={item.images[currentImageIndices[index]]}
                                    alt={item.category}
                                    className="w-full h-full object-cover opacity-0 transform scale-100 group-hover:scale-110 transition-transform duration-500"
                                    onLoad={(e) => e.target.classList.replace("opacity-0", "opacity-100")}
                                />
                                
                                {/* Category overlay - only visible on hover */}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <h3 className="text-white font-medium text-lg">{item.category}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .appear {
                    animation: appear 0.8s forwards;
                }
                
                @keyframes appear {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Explore;