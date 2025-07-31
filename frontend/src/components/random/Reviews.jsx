import React, { useEffect, useState } from "react";
import { Star, StarHalf, Headphones } from "lucide-react";

const sampleNames = [
  "Alex Johnson",
  "Maria Rodriguez", 
  "John Smith",
  "Sophia Chen",
  "Liam Thompson",
  "Emma Wilson",
  "Noah Davis",
  "Olivia Brown",
  "Ethan Martinez",
  "Ava Taylor",
  "Michael Lee",
  "Sarah Miller",
  "David Garcia",
  "Jessica White",
  "Ryan Anderson"
];

const earbudsReviews = [
  "Crystal clear audio quality! The bass is incredible and highs are crisp. Perfect for my morning runs.",
  "Battery life is outstanding - lasted me 8 hours straight during work. Highly recommend!",
  "Noise cancellation works like magic. I can focus completely in noisy environments.",
  "Comfortable fit even after hours of use. The ergonomic design is spot on.",
  "Bluetooth connectivity is seamless. Pairs instantly with my iPhone and Android.",
  "Sound quality rivals my expensive over-ear headphones. Amazing value for money!",
  "Touch controls are intuitive and responsive. Love the gesture-based volume control.",
  "Waterproof rating is legit - survived my intense gym sessions and rain.",
  "The charging case is compact yet powerful. Quick charge feature is a lifesaver.",
  "Audio latency is minimal for gaming and videos. No sync issues whatsoever.",
  "Deep bass without muddying the mids. Perfect for electronic and hip-hop music.",
  "Call quality is excellent - crystal clear voice on both ends during conferences.",
  "Lightweight design makes me forget I'm wearing them. Truly wireless freedom!",
  "Quick pairing with multiple devices. Seamless switching between phone and laptop.",
  "Premium build quality with sleek aesthetics. Looks as good as it sounds."
];

const productTypes = [
  "TWS Pro Max",
  "AirFlow Elite", 
  "SoundWave X1",
  "BassBoost Pro",
  "ClearTone HD",
  "SportBeat Active",
  "StudioPro Wireless"
];

const locations = [
  "New York, NY",
  "Los Angeles, CA", 
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "Austin, TX"
];

const generateRandomReview = () => {
  const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const review = earbudsReviews[Math.floor(Math.random() * earbudsReviews.length)];
  const product = productTypes[Math.floor(Math.random() * productTypes.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const rating = Math.round((Math.random() * 1.5 + 3.5) * 2) / 2; // 3.5 to 5 stars (more realistic for good products)
  const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
  const verified = Math.random() > 0.3; // 70% chance of verified purchase
  
  return { name, review, rating, product, location, daysAgo, verified };
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

const RandomReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const generated = Array.from({ length: 8 }, generateRandomReview);
    setReviews(generated);
    
    // Calculate stats
    const total = generated.length;
    const avgRating = generated.reduce((sum, rev) => sum + rev.rating, 0) / total;
    const distribution = [0, 0, 0, 0, 0];
    
    generated.forEach(rev => {
      const starIndex = Math.floor(rev.rating) - 1;
      if (starIndex >= 0 && starIndex < 5) {
        distribution[starIndex]++;
      }
    });
    
    setStats({
      totalReviews: total + Math.floor(Math.random() * 1000) + 500, // Simulate more reviews
      averageRating: avgRating,
      ratingDistribution: distribution
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join thousands of satisfied customers who have experienced premium audio quality with our wireless earbuds
        </p>
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
              const percentage = stats.totalReviews > 0 ? (count / reviews.length) * 100 : 0;
              
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
          <ReviewCard key={idx} review={review} />
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
            Shop Now
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            View All Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default RandomReviews;
