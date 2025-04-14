import React, { useEffect, useState } from 'react';
import api from '../utils/api';  // Assuming this is your axios instance
import { useNavigate } from 'react-router-dom';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/instructor/courses/');  // Fetch instructor's courses
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleEditCourse = (courseId) => {
    navigate(`/manage/course/${courseId}`);
  };
  return (
    <div>
      <h1>Instructor Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <button onClick={() => handleEditCourse(course.id)}>
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
            {/* Add buttons for editing and deleting */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseManagementPage;
