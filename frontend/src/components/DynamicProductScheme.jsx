import React from "react";

const DynamicProductSchema = ({ product }) => {
    const {
        name,
        description,
        price,
        discountPrice,
        stock,
        img,
        technicalSpecs,
        _id,
    } = product;

    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: name,
        image: img, // array of image URLs
        description: description,
        sku: _id,
        mpn: _id,
        brand: {
            "@type": "Brand",
            name: "Glowz Lifestyle"
        },
        offers: {
            "@type": "Offer",
            url: `https://www.glowzlifestyle.com/products/${_id}`,
            priceCurrency: "INR",
            price: discountPrice || price,
            itemCondition: "https://schema.org/NewCondition",
            availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        },
        additionalProperty: Object.entries(technicalSpecs || {}).map(([key, value]) => ({
            "@type": "PropertyValue",
            name: key,
            value: value
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
};

export default DynamicProductSchema;
