import React from 'react'

import Carousel from './components/Carousel'
import Explore from './components/Explore'
import Heading from './components/Heading'
import FeaturedProducts from './components/FeaturedProducts'
import FeatureSection from './components/Features'
import ProductCarousel from './components/ProductCarousel'
import CardCarousel from './components/CardCarousel'
import { TextScroll } from './components/ScrollText'
const Home = () => {


    return (

        < >

            <Carousel />
            <Heading heading={"Flash Sale"} subHeading={"Purchase It, Before it run out of stock "} />

            <CardCarousel />
            <FeatureSection />
            <ProductCarousel />
            <Heading heading={"Explore"} subHeading={"Explore our wide range of products"} />
            <Explore />
            <Heading heading={"Featured Products"} subHeading={"Check out our Featured Products"} />
            <ProductCarousel />
            <div className="w-full px-4 md:px-8">
                <TextScroll
                    text="Shop Now Pay Later , No Fee"
                    default_velocity={3}
                    className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-center my-4"
                />
            </div>
            <FeaturedProducts />


        </>
    )
}

export default Home