import { useEffect, useState } from "react";
import { Star, StarHalf, Headphones } from "lucide-react";
import PropTypes from 'prop-types';

// Predefined reviews for each product to ensure consistency
const productReviews = {
  "Lenovo GM2 Pro Wireless Bluetooth Headset": [
    {
      name: "Ali Khan",
      review: "Crystal clear audio quality! The bass is incredible and highs are crisp. Perfect for my morning runs.",
      rating: 5.0,
      location: "Lahore, Punjab",
      daysAgo: 5,
      verified: true
    },
    {
      name: "Fatima Ahmed",
      review: "Battery life is outstanding - lasted me 8 hours straight during work. Highly recommend!",
      rating: 4.5,
      location: "Karachi, Sindh",
      daysAgo: 12,
      verified: true
    },
    {
      name: "Hamza Malik",
      review: "Noise cancellation works like magic. I can focus completely in noisy environments.",
      rating: 5.0,
      location: "Islamabad, Capital Territory",
      daysAgo: 8,
      verified: false
    },
    {
      name: "Ayesha Siddiqui",
      review: "Comfortable fit even after hours of use. The ergonomic design is spot on.",
      rating: 4.5,
      location: "Faisalabad, Punjab",
      daysAgo: 15,
      verified: true
    }
  ],
  "Hoco EQ2 earbuds": [
    {
      name: "Bilal Shah",
      review: "Bluetooth connectivity is seamless. Pairs instantly with my iPhone and Android.",
      rating: 4.5,
      location: "Rawalpindi, Punjab",
      daysAgo: 3,
      verified: true
    },
    {
      name: "Zainab Javed",
      review: "Sound quality rivals my expensive over-ear headphones. Amazing value for money!",
      rating: 5.0,
      location: "Multan, Punjab",
      daysAgo: 18,
      verified: true
    },
    {
      name: "Usman Raza",
      review: "Touch controls are intuitive and responsive. Love the gesture-based volume control.",
      rating: 4.0,
      location: "Peshawar, KPK",
      daysAgo: 7,
      verified: false
    },
    {
      name: "Mariam Qureshi",
      review: "Waterproof rating is legit - survived my intense gym sessions and rain.",
      rating: 4.5,
      location: "Gujranwala, Punjab",
      daysAgo: 22,
      verified: true
    }
  ],
  "Glowz-A6S TWS Headset Wireless Earphones Bluetooth Headphones": [
    {
      name: "Ahmad Sheikh",
      review: "The charging case is compact yet powerful. Quick charge feature is a lifesaver.",
      rating: 4.5,
      location: "Sialkot, Punjab",
      daysAgo: 4,
      verified: true
    },
    {
      name: "Noor Fatima",
      review: "Audio latency is minimal for gaming and videos. No sync issues whatsoever.",
      rating: 5.0,
      location: "Bahawalpur, Punjab",
      daysAgo: 11,
      verified: true
    },
    {
      name: "Saad Ali",
      review: "Deep bass without muddying the mids. Perfect for electronic and hip-hop music.",
      rating: 4.5,
      location: "Quetta, Balochistan",
      daysAgo: 16,
      verified: false
    },
    {
      name: "Hina Rizvi",
      review: "Call quality is excellent - crystal clear voice on both ends during conferences.",
      rating: 4.0,
      location: "Hyderabad, Sindh",
      daysAgo: 9,
      verified: true
    }
  ],
  "Glowz - 895B  Bluetooth TWS Wireless  Earphone": [
    {
      name: "Talha Yousaf",
      review: "Lightweight design makes me forget I'm wearing them. Truly wireless freedom!",
      rating: 4.5,
      location: "Sargodha, Punjab",
      daysAgo: 6,
      verified: true
    },
    {
      name: "Areeba Shahid",
      review: "Quick pairing with multiple devices. Seamless switching between phone and laptop.",
      rating: 4.5,
      location: "Abbottabad, KPK",
      daysAgo: 14,
      verified: true
    },
    {
      name: "Moiz Rehman",
      review: "Premium build quality with sleek aesthetics. Looks as good as it sounds.",
      rating: 5.0,
      location: "Mardan, KPK",
      daysAgo: 20,
      verified: false
    },
    {
      name: "Ali Khan",
      review: "Exceptional bass response for electronic music. These earbuds deliver powerful low-end.",
      rating: 4.5,
      location: "Lahore, Punjab",
      daysAgo: 13,
      verified: true
    }
  ],
  "Glowz-A9 Pro Touch Screen Airpods": [
    {
      name: "Fatima Ahmed",
      review: "Voice clarity is unmatched for calls. My colleagues say I sound like I'm in the room.",
      rating: 5.0,
      location: "Karachi, Sindh",
      daysAgo: 2,
      verified: true
    },
    {
      name: "Hamza Malik",
      review: "High-definition audio makes every song sound like a live performance.",
      rating: 4.5,
      location: "Islamabad, Capital Territory",
      daysAgo: 17,
      verified: true
    },
    {
      name: "Ayesha Siddiqui",
      review: "Crystal clear trebles without any harshness. Perfect for classical music.",
      rating: 4.5,
      location: "Faisalabad, Punjab",
      daysAgo: 10,
      verified: false
    },
    {
      name: "Bilal Shah",
      review: "Impressive sound stage for earbuds. Each instrument is clearly separated.",
      rating: 4.0,
      location: "Rawalpindi, Punjab",
      daysAgo: 25,
      verified: true
    }
  ],
  "Air31 Tws Earbuds": [
    {
      name: "Zainab Javed",
      review: "Perfect for workouts! Stays secure during intense training sessions.",
      rating: 5.0,
      location: "Multan, Punjab",
      daysAgo: 1,
      verified: true
    },
    {
      name: "Usman Raza",
      review: "Sweat-resistant and durable. Been using them daily at the gym for months.",
      rating: 4.5,
      location: "Peshawar, KPK",
      daysAgo: 19,
      verified: true
    },
    {
      name: "Mariam Qureshi",
      review: "Motivating bass beats keep me energized during my runs. Love the secure fit!",
      rating: 4.5,
      location: "Gujranwala, Punjab",
      daysAgo: 8,
      verified: false
    },
    {
      name: "Ahmad Sheikh",
      review: "No more wires getting in the way during exercises. Complete workout freedom!",
      rating: 4.0,
      location: "Sialkot, Punjab",
      daysAgo: 21,
      verified: true
    }
  ],
  "Acer OHR 503  Wireless Earbuds": [
    {
      name: "Noor Fatima",
      review: "Professional-grade audio quality. Perfect for my music production work.",
      rating: 5.0,
      location: "Bahawalpur, Punjab",
      daysAgo: 7,
      verified: true
    },
    {
      name: "Saad Ali",
      review: "Flat frequency response makes mixing so much easier. Highly recommend for producers.",
      rating: 4.5,
      location: "Quetta, Balochistan",
      daysAgo: 12,
      verified: true
    },
    {
      name: "Hina Rizvi",
      review: "Studio-quality sound in a wireless package. These are game-changers!",
      rating: 4.5,
      location: "Hyderabad, Sindh",
      daysAgo: 24,
      verified: false
    },
    {
      name: "Talha Yousaf",
      review: "Accurate sound reproduction across all frequencies. Perfect for critical listening.",
      rating: 4.0,
      location: "Sargodha, Punjab",
      daysAgo: 16,
      verified: true
    }
  ],
  "H9 Pro Max Series 9 Smart Watch": [
    {
      name: "Areeba Shahid",
      review: "Excellent smartwatch for fitness tracking. Love the accurate heart rate monitor and stylish look.",
      rating: 5.0,
      location: "Abbottabad, KPK",
      daysAgo: 3,
      verified: true
    },
    {
      name: "Moiz Rehman",
      review: "Battery lasts longer than expected. Easy to sync with both Android and iOS.",
      rating: 4.5,
      location: "Mardan, KPK",
      daysAgo: 10,
      verified: true
    },
    {
      name: "Ali Khan",
      review: "Tracks sleep and steps precisely. Sleek design goes with any outfit.",
      rating: 4.0,
      location: "Lahore, Punjab",
      daysAgo: 7,
      verified: false
    },
    {
      name: "Fatima Ahmed",
      review: "Notifications and calls right on my wrist. Great value for a smart watch!",
      rating: 4.5,
      location: "Karachi, Sindh",
      daysAgo: 6,
      verified: true
    }
  ]
};



const getProductReviews = (productName ) => {
  return productReviews[productName] || [];
};

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" stroke="currentColor" />
        ))}
        {hasHalfStar && (
          <StarHalf size={16} fill="currentColor" stroke="currentColor" />
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars} size={16} className="text-gray-300" stroke="currentColor" />
        ))}
      </div>
      <span className="ml-1 text-sm font-medium text-gray-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

// Props validation
StarRating.propTypes = {
  rating: PropTypes.number.isRequired
};

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {review.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{review.name}</h3>
              <p className="text-xs text-gray-500">{review.location}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <StarRating rating={review.rating} />
          <p className="text-xs text-gray-500 mt-1">{review.daysAgo} days ago</p>
        </div>
      </div>

      {/* Product info */}
      <div className="mb-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Headphones size={12} className="mr-1" />
          {review.product}
        </span>
        {review.verified && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            ✓ Verified Purchase
          </span>
        )}
      </div>

      {/* Review text */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.review}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <span>👍</span> Helpful ({Math.floor(Math.random() * 20) + 5})
          </button>
          <button className="hover:text-blue-600 transition-colors">Reply</button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Audio Quality</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full mr-0.5 ${i < 4 ? 'bg-green-400' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Props validation for ReviewCard
ReviewCard.propTypes = {
  review: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    daysAgo: PropTypes.number.isRequired,
    product: PropTypes.string.isRequired,
    verified: PropTypes.bool.isRequired,
    review: PropTypes.string.isRequired
  }).isRequired
};

const Reviews = ({ selectedProduct }) => {
  const [reviews, setReviews] = useState([]);
  const [currentProduct] = useState(selectedProduct);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const productReviewsData = getProductReviews(currentProduct);
    setReviews(productReviewsData);
    
    // Calculate stats for the current product
    if (productReviewsData.length > 0) {
      const total = productReviewsData.length;
      const avgRating = productReviewsData.reduce((sum, rev) => sum + rev.rating, 0) / total;
      const distribution = [0, 0, 0, 0, 0];
      
      productReviewsData.forEach(rev => {
        const starIndex = Math.floor(rev.rating) - 1;
        if (starIndex >= 0 && starIndex < 5) {
          distribution[starIndex]++;
        }
      });
      
      setStats({
        totalReviews: total + Math.floor(Math.random() * 500) + 200, // Simulate more reviews
        averageRating: avgRating,
        ratingDistribution: distribution
      });
    }
  }, [currentProduct]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          What Our Customers Say About {currentProduct}
        </h2>
      </div>





      {/* Stats Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating rating={stats.averageRating} />
            <p className="text-gray-600 mt-2">
              Based on {stats.totalReviews.toLocaleString()} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star - 1] || 0;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {star}★
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {reviews.map((review, idx) => (
          <ReviewCard key={`${currentProduct}-${idx}`} review={{...review, product: currentProduct}} />
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Ready to Experience Premium Audio?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join our community of satisfied customers and discover why our earbuds are rated among the best in the market.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Shop {currentProduct}
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            View All Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

// Props validation for Reviews component
Reviews.propTypes = {
  selectedProduct: PropTypes.string
};

// Default props
Reviews.defaultProps = {
  selectedProduct: "Lenovo GM2 Pro Wireless Bluetooth Headset"
};

export default Reviews;
