import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/api/courses/${id}`);
        setCourse(response.data);

        // Check if actual content is present to decide enrollment
        const hasContent = response.data.lessons?.[0]?.content !== 'Enroll to see the content';
        setIsEnrolled(hasContent);

      } catch (err) {
        setError('Error fetching course.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await api.post(`/api/courses/${id}/enroll/`);
      window.location.reload(); // refresh to see real content
    } catch (err) {
      console.error('Enrollment failed:', err);
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
      {!isEnrolled && (
       <button onClick={handleEnroll}>Enroll to Unlock Full Content</button>)}
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
