import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { user, isAuthenticated } = useAuth();  // Access user from context
  const hasReviewed = reviews.some(review => review.user === user?.id); // User can only make one comment
  
  const location = useLocation();// to take user to the same place before login
  
  const isInstructor = user?.role === 'instructor'; // Check if the user is an instructor
  const isStudent = user?.role === 'student';
  const isVisitor = !isAuthenticated;
 
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/api/courses/${id}`);
        setCourse(response.data);

        // Check if actual content is present to decide enrollment
        const hasContent = response.data.lessons?.[0]?.content !== 'Enroll to see the content';
        setIsEnrolled(hasContent);

        // Fetch reviews
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
  
  // Enrollment button handler and refresh page
  const handleEnroll = async () => {
    if (!user) {
    navigate('/login', { state: { from: location.pathname } });  //to take user to the same place before login
    return;
    }
  
    try {
      await api.post(`/api/courses/${id}/enroll/`);
      window.location.reload(); // refresh to see real content
    } catch (err) {
      console.error('Enrollment failed:', err);
    }
  };
  
  // Fetch Reviews When Course Loads
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting review:", newReview); //test
      await api.post(`/api/courses/${id}/reviews/`, newReview);
      // Refresh reviews
      const reviewsRes = await api.get(`/api/courses/${id}/reviews/`);
      setReviews(reviewsRes.data);
      setNewReview({ rating: 5, comment: '' }); // Reset form  
     
    } catch (err) {
      console.error('Failed to post review:', err);
    }
  };



  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <h2>Lessons</h2>
      <p>{course.lessons.length} lessons available</p>
      {/* <p>Instructor: {course.instructor.username}</p>    */}
      <p>Price: {course.price} USD</p>
      
      {isVisitor && (<button onClick={handleEnroll}>Enroll to Unlock Full Content</button>)}

      {isInstructor && (<button disabled>You can't enroll</button>)}
      
      {isEnrolled && (<p>You are enrolled in this course.</p> )}
      
      {(isStudent && !isEnrolled) &&(
        <button onClick={handleEnroll}>Enroll to Unlock Full Content</button>
      )}
      <ul>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <li key={review.id}>
               <strong>{review.username}</strong> : {review.rating} ⭐
              <p>{review.comment}</p>
            </li>
          ))
        )}
      </ul>
      {isEnrolled && (
        <form onSubmit={handleReviewSubmit}>
          <h3>Leave a Review</h3>
          <label>
            Rating:
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              disabled={hasReviewed}>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star}</option>
              ))}
            </select>
          </label>
          <br />
          <textarea
            placeholder="Write your review..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            disabled={hasReviewed}/>
          <br />
          <button type="submit" disabled={hasReviewed}>Submit Review</button>
        </form>
      )}
      <ul>

        {course.lessons.map((lesson) => (
          <li key={lesson.id} >
            <h3>{lesson.title}</h3>
            <p>{lesson.content}</p>
            {lesson.video_url ? (
              <video
                src={lesson.video_url}
                controls
                width="640"
                height="360"
                style={{ marginTop: '10px' }}
                crossOrigin="anonymous"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <p style={{ color: 'red', fontStyle: 'italic' }}>
                No video available
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursePage;
