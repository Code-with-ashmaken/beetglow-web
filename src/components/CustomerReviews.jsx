import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { buttonClass } from './ui/Button';
import { useSiteData } from '../context/SiteDataContext';

export default function CustomerReviews() {
  const { settings, setSettings } = useSiteData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Get approved reviews from settings or use default testimonials
  const reviews = settings.reviews?.filter(review => review.approved) || settings.testimonials || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Create new review
    const newReview = {
      id: `review-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      rating: formData.rating,
      message: formData.message.trim(),
      date: new Date().toISOString(),
      approved: false // Reviews need admin approval
    };

    // Add to settings
    const currentReviews = settings.reviews || [];
    setSettings(prev => ({
      ...prev,
      reviews: [...currentReviews, newReview]
    }));

    // Reset form
    setFormData({
      name: '',
      email: '',
      rating: 5,
      message: ''
    });

    setSubmitMessage('Thank you! Your review has been submitted for approval.');
    setIsSubmitting(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="border-t border-neutral-200 bg-white px-4 py-14 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
            Customer Reviews
          </h2>
          <p className="mt-2 text-neutral-600 md:text-lg">
            See what our customers are saying about BeetGlow products
          </p>
        </div>

        {/* Reviews Display */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm"
            >
              <div className="flex items-center gap-1 mb-3">
                {renderStars(review.stars || review.rating || 5)}
              </div>
              <p className="text-neutral-700 mb-4 leading-relaxed">
                {review.quote || review.message}
              </p>
              <div>
                <p className="font-semibold text-neutral-900">{review.name}</p>
                <p className="text-sm text-neutral-500">{review.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="mt-10 text-center py-12">
            <p className="text-neutral-500">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}

        {/* Review Submission Form */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">Write a Review</h3>
            
            {submitMessage && (
              <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
                  placeholder="Share your experience with BeetGlow products..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${buttonClass({ variant: 'solid' })} w-full md:w-auto`}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
