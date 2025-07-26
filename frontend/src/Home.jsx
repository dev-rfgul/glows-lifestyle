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

            <CardCarousel/>
            <ProductCarousel />
            <FeatureSection />
            <Heading heading={"Explore"} subHeading={"Explore our wide range of products"} />
            <Explore />
            <Heading heading={"Featured Products"} subHeading={"Check out our Featured Products"} />
            <ProductCarousel />
            <TextScroll text="Shop Now Pay Later , No Fee" default_velocity={3} className="text-8xl font-bold text-center my-4" />
            <FeaturedProducts />


        </>
    )
}

export default Home