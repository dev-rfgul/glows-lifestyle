import React from 'react'
import Carousel from './components/Carousel'
import Explore from './components/Explore'
import Heading from './components/Heading'
import FeaturedProducts from './components/FeaturedProducts'
import FeatureSection from './components/Features'

const Home = () => {
    return (
        < >
        <div className='bg-gradient-to-br from-blue-50 to-blue-100'>
            <Carousel />
            <Heading heading={"Explore"} subHeading={"Explore our wide range of products"} />
            
            <Explore />
            <Heading heading={"Featured Products"} subHeading={"Check out our Featured Products"} />
            <FeaturedProducts />
            <FeatureSection />
        </div>
        </>
    )
}

export default Home