'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ThumbsUp, Calendar, User, Plus } from 'lucide-react';

export default function ReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const placeId = params.placeId as string;
  
  const [reviews, setReviews] = useState([
    {
      id: '1',
      userName: 'Travel Explorer',
      rating: 5,
      comment: 'Amazing place with incredible history! The architecture is breathtaking and the guided tours are very informative.',
      createdAt: '2024-02-15',
      helpful: 12,
      images: []
    },
    {
      id: '2',
      userName: 'Adventure Seeker',
      rating: 4,
      comment: 'Great experience overall. Can get quite crowded during peak hours, so I recommend visiting early morning.',
      createdAt: '2024-02-10',
      helpful: 8,
      images: []
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const review = {
      id: Date.now().toString(),
      userName: 'Current User',
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString().split('T')[0],
      helpful: 0,
      images: []
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Place
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= averageRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="ml-1 text-gray-500">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        {/* Add Review Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Write Your Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReview.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{review.createdAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.comment}</p>
              
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}