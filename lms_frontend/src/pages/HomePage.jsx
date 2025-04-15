// Home page displaying all courses
import React, { useEffect, useState } from 'react';
import api from '../utils/api'; // Import the API instance
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses'); // Use the API instance to get courses
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`); // Navigate to the course detail page
  };

  return (
    <div>
      <h1>Welcome to the LMS</h1>
      <h2>Featured Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <button onClick={() => handleCourseClick(course.id)}>
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt="Course Cover"
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '1rem' }}
                />
              )}
            {course.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
