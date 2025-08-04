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
            <TextScroll />
            <Heading heading={"Flash Sale"} subHeading={"Purchase It, Before it run out of stock "} />
            <CardCarousel />
            <FeatureSection />
            <ProductCarousel />
            <Heading heading={"Explore"} subHeading={"Explore our wide range of products"} />
            <Explore />
            <Heading heading={"Featured Products"} subHeading={"Check out our Featured Products"} />
            <ProductCarousel />
            <FeaturedProducts />
        </>
    )
}

export default Home