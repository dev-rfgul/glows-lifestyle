import React from 'react'

import Carousel from './components/Carousel'
import Explore from './components/Explore'
import Heading from './components/Heading'
import FeaturedProducts from './components/FeaturedProducts'
import FeatureSection from './components/Features'
import ProductCarousel from './components/ProductCarousel'
import CardCarousel from './components/CardCarousel'
const Home = () => {
    const products = [
        {
            "_id": "681823882ce5ded94c8ae4a7",
            "name": "Lenovo GM2 Pro Bluetooth Headset",
            "category": "earbuds",
            "price": 4999,
            "discountPrice": 1999,
            "stock": 95,
            "tagline": "Upgrade Your audio experience with these top rated earbuds",
            "description": "Choice Lenovo GM2 Pro Bluetooth Headset In-ear 5.3 TWS Earbuds Waterproof Sports Binaural Stereo Button With Microphone Wireless",
            "features": [
                "Speak Unit : 10mm",
                "Battery Capacity : 40 mAh",
                "Charging Time : 1 Hour",
                "Frequency Range : 2.402-2.480 KHz",
                "Transmission Distance : Upto 10 meters"
            ],
            "colors": [
                { "name": "Black", "hex": "#000000", "_id": "687c99847283b59ec9849327" },
                { "name": "White", "hex": "#ededed", "_id": "687c99847283b59ec9849328" }
            ],
            "img": [
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/p59hf6is9mvzqnexqjqx.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/ywxp7spmnaeqh518wmp6.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685428/h3na7y0aelnlxikojuh4.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/mdemzenbs7p6mljkulfa.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/rjjy79hizjlv8fqfo5pc.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/y0pcxraxapzqqeembxou.jpg"
            ],
            "technicalSpecs": {
                "batteryLife": "5 hours",
                "connectivity": "Bluetooth v5.3",
                "noiseReduction": "Yes",
                "waterResistance": "Yes"
            },
            "visitCount": 54,
            "createdAt": "2025-04-03T13:03:49.146Z",
            "updatedAt": "2025-07-21T06:00:33.578Z",
            "__v": 0
        },
        {
            "_id": "681823882ce5ded94c8ae4a7",
            "name": "Lenovo GM2 Pro Bluetooth Headset",
            "category": "earbuds",
            "price": 4999,
            "discountPrice": 1999,
            "stock": 95,
            "tagline": "Upgrade Your audio experience with these top rated earbuds",
            "description": "Choice Lenovo GM2 Pro Bluetooth Headset In-ear 5.3 TWS Earbuds Waterproof Sports Binaural Stereo Button With Microphone Wireless",
            "features": [
                "Speak Unit : 10mm",
                "Battery Capacity : 40 mAh",
                "Charging Time : 1 Hour",
                "Frequency Range : 2.402-2.480 KHz",
                "Transmission Distance : Upto 10 meters"
            ],
            "colors": [
                { "name": "Black", "hex": "#000000", "_id": "687c99847283b59ec9849327" },
                { "name": "White", "hex": "#ededed", "_id": "687c99847283b59ec9849328" }
            ],
            "img": [
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/p59hf6is9mvzqnexqjqx.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/ywxp7spmnaeqh518wmp6.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685428/h3na7y0aelnlxikojuh4.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/mdemzenbs7p6mljkulfa.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/rjjy79hizjlv8fqfo5pc.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/y0pcxraxapzqqeembxou.jpg"
            ],
            "technicalSpecs": {
                "batteryLife": "5 hours",
                "connectivity": "Bluetooth v5.3",
                "noiseReduction": "Yes",
                "waterResistance": "Yes"
            },
            "visitCount": 54,
            "createdAt": "2025-04-03T13:03:49.146Z",
            "updatedAt": "2025-07-21T06:00:33.578Z",
            "__v": 0
        },
        {
            "_id": "681823882ce5ded94c8ae4a7",
            "name": "Lenovo GM2 Pro Bluetooth Headset",
            "category": "earbuds",
            "price": 4999,
            "discountPrice": 1999,
            "stock": 95,
            "tagline": "Upgrade Your audio experience with these top rated earbuds",
            "description": "Choice Lenovo GM2 Pro Bluetooth Headset In-ear 5.3 TWS Earbuds Waterproof Sports Binaural Stereo Button With Microphone Wireless",
            "features": [
                "Speak Unit : 10mm",
                "Battery Capacity : 40 mAh",
                "Charging Time : 1 Hour",
                "Frequency Range : 2.402-2.480 KHz",
                "Transmission Distance : Upto 10 meters"
            ],
            "colors": [
                { "name": "Black", "hex": "#000000", "_id": "687c99847283b59ec9849327" },
                { "name": "White", "hex": "#ededed", "_id": "687c99847283b59ec9849328" }
            ],
            "img": [
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/p59hf6is9mvzqnexqjqx.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/ywxp7spmnaeqh518wmp6.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685428/h3na7y0aelnlxikojuh4.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/mdemzenbs7p6mljkulfa.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/rjjy79hizjlv8fqfo5pc.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/y0pcxraxapzqqeembxou.jpg"
            ],
            "technicalSpecs": {
                "batteryLife": "5 hours",
                "connectivity": "Bluetooth v5.3",
                "noiseReduction": "Yes",
                "waterResistance": "Yes"
            },
            "visitCount": 54,
            "createdAt": "2025-04-03T13:03:49.146Z",
            "updatedAt": "2025-07-21T06:00:33.578Z",
            "__v": 0
        },
        {
            "_id": "681823882ce5ded94c8ae4a7",
            "name": "Lenovo GM2 Pro Bluetooth Headset",
            "category": "earbuds",
            "price": 4999,
            "discountPrice": 1999,
            "stock": 95,
            "tagline": "Upgrade Your audio experience with these top rated earbuds",
            "description": "Choice Lenovo GM2 Pro Bluetooth Headset In-ear 5.3 TWS Earbuds Waterproof Sports Binaural Stereo Button With Microphone Wireless",
            "features": [
                "Speak Unit : 10mm",
                "Battery Capacity : 40 mAh",
                "Charging Time : 1 Hour",
                "Frequency Range : 2.402-2.480 KHz",
                "Transmission Distance : Upto 10 meters"
            ],
            "colors": [
                { "name": "Black", "hex": "#000000", "_id": "687c99847283b59ec9849327" },
                { "name": "White", "hex": "#ededed", "_id": "687c99847283b59ec9849328" }
            ],
            "img": [
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/p59hf6is9mvzqnexqjqx.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/ywxp7spmnaeqh518wmp6.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685428/h3na7y0aelnlxikojuh4.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/mdemzenbs7p6mljkulfa.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/rjjy79hizjlv8fqfo5pc.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/y0pcxraxapzqqeembxou.jpg"
            ],
            "technicalSpecs": {
                "batteryLife": "5 hours",
                "connectivity": "Bluetooth v5.3",
                "noiseReduction": "Yes",
                "waterResistance": "Yes"
            },
            "visitCount": 54,
            "createdAt": "2025-04-03T13:03:49.146Z",
            "updatedAt": "2025-07-21T06:00:33.578Z",
            "__v": 0
        },
        {
            "_id": "681823882ce5ded94c8ae4a7",
            "name": "Lenovo GM2 Pro Bluetooth Headset",
            "category": "earbuds",
            "price": 4999,
            "discountPrice": 1999,
            "stock": 95,
            "tagline": "Upgrade Your audio experience with these top rated earbuds",
            "description": "Choice Lenovo GM2 Pro Bluetooth Headset In-ear 5.3 TWS Earbuds Waterproof Sports Binaural Stereo Button With Microphone Wireless",
            "features": [
                "Speak Unit : 10mm",
                "Battery Capacity : 40 mAh",
                "Charging Time : 1 Hour",
                "Frequency Range : 2.402-2.480 KHz",
                "Transmission Distance : Upto 10 meters"
            ],
            "colors": [
                { "name": "Black", "hex": "#000000", "_id": "687c99847283b59ec9849327" },
                { "name": "White", "hex": "#ededed", "_id": "687c99847283b59ec9849328" }
            ],
            "img": [
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/p59hf6is9mvzqnexqjqx.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/ywxp7spmnaeqh518wmp6.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685428/h3na7y0aelnlxikojuh4.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/mdemzenbs7p6mljkulfa.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/rjjy79hizjlv8fqfo5pc.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/y0pcxraxapzqqeembxou.jpg"
            ],
            "technicalSpecs": {
                "batteryLife": "5 hours",
                "connectivity": "Bluetooth v5.3",
                "noiseReduction": "Yes",
                "waterResistance": "Yes"
            },
            "visitCount": 54,
            "createdAt": "2025-04-03T13:03:49.146Z",
            "updatedAt": "2025-07-21T06:00:33.578Z",
            "__v": 0
        },
        {
            "_id": "681823882ce5ded94c8ae4a7",
            "name": "Lenovo GM2 Pro Bluetooth Headset",
            "category": "earbuds",
            "price": 4999,
            "discountPrice": 1999,
            "stock": 95,
            "tagline": "Upgrade Your audio experience with these top rated earbuds",
            "description": "Choice Lenovo GM2 Pro Bluetooth Headset In-ear 5.3 TWS Earbuds Waterproof Sports Binaural Stereo Button With Microphone Wireless",
            "features": [
                "Speak Unit : 10mm",
                "Battery Capacity : 40 mAh",
                "Charging Time : 1 Hour",
                "Frequency Range : 2.402-2.480 KHz",
                "Transmission Distance : Upto 10 meters"
            ],
            "colors": [
                { "name": "Black", "hex": "#000000", "_id": "687c99847283b59ec9849327" },
                { "name": "White", "hex": "#ededed", "_id": "687c99847283b59ec9849328" }
            ],
            "img": [
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/p59hf6is9mvzqnexqjqx.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/ywxp7spmnaeqh518wmp6.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685428/h3na7y0aelnlxikojuh4.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/mdemzenbs7p6mljkulfa.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/rjjy79hizjlv8fqfo5pc.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/y0pcxraxapzqqeembxou.jpg"
            ],
            "technicalSpecs": {
                "batteryLife": "5 hours",
                "connectivity": "Bluetooth v5.3",
                "noiseReduction": "Yes",
                "waterResistance": "Yes"
            },
            "visitCount": 54,
            "createdAt": "2025-04-03T13:03:49.146Z",
            "updatedAt": "2025-07-21T06:00:33.578Z",
            "__v": 0
        },
        {
            "_id": "681823882ce5ded94c8ae4a7",
            "name": "Lenovo GM2 Pro Bluetooth Headset",
            "category": "earbuds",
            "price": 4999,
            "discountPrice": 1999,
            "stock": 95,
            "tagline": "Upgrade Your audio experience with these top rated earbuds",
            "description": "Choice Lenovo GM2 Pro Bluetooth Headset In-ear 5.3 TWS Earbuds Waterproof Sports Binaural Stereo Button With Microphone Wireless",
            "features": [
                "Speak Unit : 10mm",
                "Battery Capacity : 40 mAh",
                "Charging Time : 1 Hour",
                "Frequency Range : 2.402-2.480 KHz",
                "Transmission Distance : Upto 10 meters"
            ],
            "colors": [
                { "name": "Black", "hex": "#000000", "_id": "687c99847283b59ec9849327" },
                { "name": "White", "hex": "#ededed", "_id": "687c99847283b59ec9849328" }
            ],
            "img": [
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/p59hf6is9mvzqnexqjqx.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/ywxp7spmnaeqh518wmp6.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685428/h3na7y0aelnlxikojuh4.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685425/mdemzenbs7p6mljkulfa.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/rjjy79hizjlv8fqfo5pc.jpg",
                "https://res.cloudinary.com/dnsvhrwct/image/upload/v1743685426/y0pcxraxapzqqeembxou.jpg"
            ],
            "technicalSpecs": {
                "batteryLife": "5 hours",
                "connectivity": "Bluetooth v5.3",
                "noiseReduction": "Yes",
                "waterResistance": "Yes"
            },
            "visitCount": 54,
            "createdAt": "2025-04-03T13:03:49.146Z",
            "updatedAt": "2025-07-21T06:00:33.578Z",
            "__v": 0
        },
    ]

    return (

        < >

            <Carousel />
            <Heading heading={"Flash Sale"} subHeading={"Purchase It, Before it run out of stock "} />

            <CardCarousel products={products} />
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