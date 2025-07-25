import React from 'react'

import Carousel from './components/Carousel'
import Explore from './components/Explore'
import Heading from './components/Heading'
import FeaturedProducts from './components/FeaturedProducts'
import FeatureSection from './components/Features'
import ProductCarousel from './components/ProductCarousel'
import CardCarousel from './components/CardCarousel'
const Home = () => {


    return (

        < >

            <Carousel />
            <Heading heading={"Flash Sale"} subHeading={"Purchase It, Before it run out of stock "} />

            <CardCarousel/>
            <ProductCarousel />
            <FeatureSection />
            <Heading heading={"Explore"} subHeading={"Explore our wide range of products"} />
            <Explore />
            <Heading heading={"Featured Products"} subHeading={"Check out our Featured Products"} />
            <ProductCarousel />
            <img
                src="/images/carousel/banner-5.jpeg"
                alt="Slim Banner"
                class=" mt-4  mb-4 w-full h-[80px] sm:h-[100px] md:h-[120px] lg:h-[200px] object-cover"
            />
            <FeaturedProducts />


        </>
    )
}

export default Home