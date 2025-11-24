import React, { useState, useEffect } from 'react';
import AboutSection from './AboutSection';

const Footer = () => {
  const [footerData, setFooterData] = useState({ bio: '', profile: '' });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5, like: false });
  const [loading, setLoading] = useState(true);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    fetchFooterData();
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [reviews]);

  const fetchFooterData = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/footer');
      if (res.ok) {
        const data = await res.json();
        setFooterData(data);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        const addedReview = await res.json();
        setReviews([...reviews, addedReview]);
        setNewReview({ name: '', comment: '', rating: 5, like: false });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${id}/like`, {
        method: 'PUT',
      });
      if (res.ok) {
        const updatedReview = await res.json();
        setReviews(reviews.map(r => r._id === id ? updatedReview : r));
      }
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <footer className="bg-cyan-900 text-cyan-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin Biography */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <AboutSection />
            <p className="mb-2 mt-4">{footerData.bio || 'Admin biography will be displayed here.'}</p>
            <p>{footerData.profile || 'Profile content for user trust.'}</p>
          </div>

          {/* User Reviews */}
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
            <div className="mb-4">
              <p>Average Rating: {averageRating} / 5</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                ))}
              </div>
            </div>
            <form onSubmit={handleReviewSubmit} className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full p-2 mb-2 text-cyan-300"
                required
              />
              <textarea
                placeholder="Your Comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-2 mb-2 text-cyan-300"
                required
              />
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="w-full p-2 mb-2 text-cyan-300"
              >
                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <button type="submit" className="bg-cyan-800 px-4 py-2 rounded hover:bg-cyan-900">Submit Review</button>
            </form>
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
              >
                {reviews.map((review) => (
                  <div key={review._id} className="w-full flex-shrink-0 p-4">
                    <p><strong>{review.name}</strong>: {review.comment}</p>
                    <p>Rating: {review.rating} ★</p>
                    <button onClick={() => handleLike(review._id)} className={`px-2 py-1 rounded border-2 ${review.like ? 'bg-yellow-800' : 'bg-transparent'}`}>
                      {review.like ? 'Liked' : 'Like'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {reviews.length > 1 && (
              <div className="flex justify-center mt-4">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReviewIndex(index)}
                    className={`w-3 h-3 rounded-full mx-1 ${index === currentReviewIndex ? 'bg-yellow-500' : 'bg-cyan-800'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-8">
          <p>&copy; 2024 E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
