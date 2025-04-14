import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/student/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching student courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Enrolled Courses</h1>
      {courses.length === 0 ? (
        <p>You are not enrolled in any courses yet.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <button onClick={() => navigate(`/courses/${course.id}`)}>
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt="Course Cover"
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '1rem' }}
                  />
                )}
              {course.title}
              </button>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCoursesPage;
