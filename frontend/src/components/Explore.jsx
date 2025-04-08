
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const Explore = () => {
//     const navigate = useNavigate();
//     // Enhanced data with more information and options
//     const data = [
//         {
//             id: 1,
//             category: "Earbuds",
//             description: "Premium Quality Earbuds",
//             images: [
//                 "/images/explore/earbuds.gif",
//             ],
//             featured: true,
//             new: false,
//             bestseller: true,
//             btn: "Shop Earbuds",
//         },
//         {
//             id: 2,
//             category: "Smartwatches",
//             description: "Innovative tech for modern lifestyle",
//             productCount: 36,
//             images: [
//                 "/images/explore/smartwatch.webp",
//             ],
//             featured: true,
//             new: true,
//             bestseller: false,
//             btn: "Shop Smartwatch",
//         },
//         {
//             id: 3,
//             category: "HeadPhones",
//             description: "Stylish & functional Headphones for every occasion",
//             productCount: 18,
//             images: [
//                 "/images/explore/headphone.webp",
//             ],
//             featured: false,
//             new: false,
//             bestseller: true,
//             btn: "Shop Headphones",
//         },

//     ];

//     // Animation control states
//     const [activeCategory, setActiveCategory] = useState(null);
//     const [currentImageIndices, setCurrentImageIndices] = useState(
//         data.map(() => 0)
//     );
//     const [fadeKeys, setFadeKeys] = useState(data.map(() => 0));
//     const [animationPaused, setAnimationPaused] = useState(
//         data.map(() => false)
//     );

//     // Filter controls
//     const [filterType, setFilterType] = useState("all");
//     const filteredData = filterType === "all"
//         ? data
//         : data.filter(item => item[filterType]);

//     // Intersection Observer for animation-on-scroll
//     const categoryRefs = useRef([]);

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach(entry => {
//                     if (entry.isIntersecting) {
//                         entry.target.classList.add('appear');
//                     }
//                 });
//             },
//             { threshold: 0.2 }
//         );

//         categoryRefs.current.forEach(ref => {
//             if (ref) observer.observe(ref);
//         });

//         return () => {
//             categoryRefs.current.forEach(ref => {
//                 if (ref) observer.unobserve(ref);
//             });
//         };
//     }, [filteredData.length]);

//     // Image rotation effect
//     useEffect(() => {
//         const intervals = data.map((category, categoryIndex) =>
//             setInterval(() => {
//                 if (!animationPaused[categoryIndex]) {
//                     setCurrentImageIndices((prevIndices) => {
//                         const newIndices = [...prevIndices];
//                         const currentIndex = newIndices[categoryIndex];
//                         const nextIndex = (currentIndex + 1) % category.images.length;
//                         newIndices[categoryIndex] = nextIndex;
//                         return newIndices;
//                     });

//                     // Trigger fade animation
//                     setFadeKeys((prevKeys) => {
//                         const newKeys = [...prevKeys];
//                         newKeys[categoryIndex] += 1;
//                         return newKeys;
//                     });
//                 }
//             }, 2000)
//         );

//         return () => {
//             intervals.forEach(clearInterval);
//         };
//     }, [animationPaused]);

//     // Handle mouse interactions
//     const handleMouseEnter = (index) => {
//         setActiveCategory(index);
//         setAnimationPaused(prev => {
//             const newState = [...prev];
//             newState[index] = true;
//             return newState;
//         });
//     };

//     const handleMouseLeave = (index) => {
//         setActiveCategory(null);
//         setAnimationPaused(prev => {
//             const newState = [...prev];
//             newState[index] = false;
//             return newState;
//         });
//     };

//     // Manual image navigation
//     const navigateImage = (categoryIndex, direction) => {
//         setCurrentImageIndices(prevIndices => {
//             const newIndices = [...prevIndices];
//             const category = data[categoryIndex];
//             const currentIndex = prevIndices[categoryIndex];

//             if (direction === 'next') {
//                 newIndices[categoryIndex] = (currentIndex + 1) % category.images.length;
//             } else {
//                 newIndices[categoryIndex] = currentIndex === 0
//                     ? category.images.length - 1
//                     : currentIndex - 1;
//             }

//             return newIndices;
//         });

//         // Trigger fade animation
//         setFadeKeys(prevKeys => {
//             const newKeys = [...prevKeys];
//             newKeys[categoryIndex] += 1;
//             return newKeys;
//         });
//     };
//     const hanldeCategory = (category) => {
//         const newcategory = category.toLowerCase()
//         navigate(`/product/categories/${newcategory}`)
//     }

//     return (
//         <div className="py-16 px-4 border-b-6 border-white">
//             <div className="max-w-6xl mx-auto">
//                 {/* heading */}
//                 <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
//                     <div>
//                         <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Explore Collections</h2>
//                         <p className="text-gray-600 max-w-xl">Discover our curated selection of premium products designed for modern living.</p>
//                     </div>

//                     {/* btns title eg:bestseller , new  */}
//                     <div className="flex space-x-2 mt-6 sm:mt-0">
//                         <button
//                             onClick={() => setFilterType('all')}
//                             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'all'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-white text-gray-700 hover:bg-gray-100'
//                                 }`}
//                         >
//                             All
//                         </button>
//                         <button
//                             onClick={() => setFilterType('new')}
//                             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'new'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-white text-gray-700 hover:bg-gray-100'
//                                 }`}
//                         >
//                             New
//                         </button>
//                         <button
//                             onClick={() => setFilterType('bestseller')}
//                             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'bestseller'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-white text-gray-700 hover:bg-gray-100'
//                                 }`}
//                         >
//                             Bestsellers
//                         </button>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {filteredData.map((item, categoryIndex) => {
//                         const actualIndex = data.findIndex(d => d.id === item.id);
//                         return (
//                             <div
//                                 key={item.id}
//                                 onClick={() => { hanldeCategory(item.category) }}
//                                 ref={el => categoryRefs.current[categoryIndex] = el}
//                                 onMouseEnter={() => handleMouseEnter(actualIndex)}
//                                 onMouseLeave={() => handleMouseLeave(actualIndex)}
//                             >
//                                 {/* Circular Image Container */}
//                                 <div className="absolute inset-0 flex items-center justify-center">
//                                     <div className="w-64 h-64 bg-gray-200 rounded-full overflow-hidden">
//                                         <img
//                                             key={fadeKeys[actualIndex]}
//                                             src={item.images[currentImageIndices[actualIndex]]}
//                                             alt={`Explore ${item.category}`}
//                                             className="w-full h-full object-cover opacity-0 transform scale-100 group-hover:scale-105 transition-transform duration-700"
//                                             onLoad={(e) => e.target.classList.replace("opacity-0", "opacity-100")}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             <style jsx>{`
//                 .appear {
//                     animation: appear 0.8s forwards;
//                     animation-delay: calc(var(--index) * 0.1s);
//                 }
                
//                 @keyframes appear {
//                     to {
//                         opacity: 1;
//                         transform: translateY(0) scale(1);
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default Explore;
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