import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasReviewed = reviews.some((review) => review.student?.id === user?.id);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/api/courses/${id}`);
        setCourse(response.data);
        const hasContent = response.data.lessons?.[0]?.content !== 'Enroll to see the content';
        setIsEnrolled(hasContent);
        const reviewsRes = await api.get(`/api/courses/${id}/reviews/`);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError('Error fetching course.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      await api.post(`/api/courses/${id}/enroll/`);
      window.location.reload();
    } catch (err) {
      console.error('Enrollment failed:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/courses/${id}/reviews/`, newReview);
      const reviewsRes = await api.get(`/api/courses/${id}/reviews/`);
      setReviews(reviewsRes.data);
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Failed to post review:', err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-screen-xl mx-auto p-6 space-y-10">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Course Details */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h1 className="text-4xl font-semibold">{course.title}</h1>
            <p className="text-lg text-gray-700">{course.description}</p>

            <div className="space-y-4">
              {course.lessons.map((lesson) => (
                <div key={lesson.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold">{lesson.title}</h3>
                  <p className="text-gray-600">{lesson.content}</p>
                  {lesson.video_url ? (
                    <video
                      src={lesson.video_url}
                      controls
                      className="w-full mt-4 rounded-lg shadow"
                    />
                  ) : (
                    <p className="text-red-500 italic mt-2">No video available</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Instructor, Price, Enrollment */}
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6 sticky top-6">
          <div className="flex items-center gap-3">
            <img src={course.instructor.profile_picture} className="w-16 h-16 rounded-full" />
            <div>
              <p className="text-lg font-medium">{course.instructor.username}</p>
              <p className="text-sm text-gray-500">Instructor</p>
            </div>
          </div>

          <p className="text-2xl font-bold text-purple-600">{course.price} USD</p>

          {/* Enroll Button */}
          {user?.id !== course.instructor.id && (
            <button
              onClick={handleEnroll}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition duration-200"
            >
              {isEnrolled ? 'You are enrolled' : 'Enroll Now'}
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-3xl font-bold">Student Reviews</h2>
        <div className="space-y-4 mt-6">
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <img src={review.student.profile_picture} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-medium">{review.student.username}</p>
                  <p className="text-gray-700">{review.rating} ⭐</p>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Review Form */}
        {isEnrolled && !hasReviewed && (
          <form onSubmit={handleReviewSubmit} className="mt-8 space-y-4">
            <h3 className="text-2xl font-semibold">Leave a Review</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Comment</label>
              <textarea
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Share your experience..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
