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

  if (loading) return <div className="p-4 text-sm text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-sm text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 text-sm text-gray-800">
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Lessons */}
        <div className="flex-1 space-y-2">
          {course.lessons.map((lesson, index) => (
            <div key={lesson.id} className="border border-gray-200 rounded p-3 hover:bg-gray-50 transition">
              <h3 className="font-semibold">{index + 1}. {lesson.title}</h3>
              <p className="text-gray-600 mt-1">
              {isEnrolled ? (
                lesson.content.split('\n')[0] // This will show only the first line
              ) : (
                <em className="text-gray-400">Enroll to view content</em>
              )}
              </p>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 space-y-4 border-t md:border-t-0 md:border-l md:pl-4 border-gray-200 pt-4 md:pt-0">
          <div className="flex items-center gap-3">
            <img src={course.instructor.profile_picture} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-medium">{course.instructor.username}</p>
              <p className="text-gray-500 text-xs">Instructor</p>
              <p className="text-gray-600 text-xs">{course.instructor.bio}</p>
            </div>
          </div>

          <p className="text-base font-semibold text-purple-600">{course.price} USD</p>

          {user?.id !== course.instructor.id && (
            <button
              onClick={handleEnroll}
              className="w-full bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700"
            >
              {isEnrolled ? 'You are enrolled' : 'Enroll Now'}
            </button>
          )}

          {isEnrolled && (
            <button
              onClick={() => navigate(`/courses/${id}/learn`)}
              className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700"
            >
              Go to Lessons
            </button>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Student Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-100 rounded p-3">
                <div className="flex items-center gap-3 mb-1">
                  <img src={review.student.profile_picture} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-medium">{review.student.username}</p>
                    <p className="text-xs text-gray-500">{review.rating} ★</p>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {isEnrolled && !hasReviewed && (
          <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3">
            <h3 className="text-base font-semibold">Leave a Review</h3>
            <div>
              <label className="block mb-1 text-xs font-medium">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                className="w-full border px-2 py-1 rounded text-sm"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium">Comment</label>
              <textarea
                rows={3}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full border px-2 py-1 rounded text-sm"
                placeholder="Your thoughts..."
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white py-2 px-4 rounded text-sm hover:bg-purple-700"
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
