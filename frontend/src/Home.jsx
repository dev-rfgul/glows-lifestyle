import React from 'react'

import Carousel from './components/Carousel'
import Explore from './components/Explore'
import Heading from './components/Heading'
import FeaturedProducts from './components/FeaturedProducts'
import FeatureSection from './components/Features'
import ProductCarousel from './components/ProductCarousel'

const Home = () => {
    return (
        < >

            <Carousel />
            <Heading heading={"Flash Sale"} subHeading={"Purchase It, Before it run out of stock "} />
            <ProductCarousel />
            <FeatureSection />
            <Heading heading={"Explore"} subHeading={"Explore our wide range of products"} />
            <Explore />
            <Heading heading={"Featured Products"} subHeading={"Check out our Featured Products"} />
            {/* <FeaturedProducts /> */}
            <img
                src="/images/carousel/banner-5.jpeg"
                alt="Slim Banner"
                class="w-full h-[80px] sm:h-[100px] md:h-[120px] lg:h-[200px] object-cover"
            />


            <ProductCarousel />


        </>
    )
}

export default Home