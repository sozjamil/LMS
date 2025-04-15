// This is instructor's course management page where they can view, delete, and publish/unpublish their courses.
import React, { useEffect, useState } from 'react';
import api from '../utils/api';  // Assuming this is your axios instance
import { useNavigate } from 'react-router-dom';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Get the navigate function

  // fetch instructor's courses
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

  // Handles course by clicking on it redirects to edit page
  const handleEditCourse = (courseId) => {
    navigate(`/manage/course/${courseId}`);
  };
  
  // Handles course deletion
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/api/instructor/courses/${courseId}/delete/`);
        // Remove the course from state
        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Something went wrong while deleting the course.');
      }
    }
  };
  
  // Handles publish/unpublish course
  const handleTogglePublish = async (courseId) => {
    try {
      const response = await api.post(`/api/instructor/courses/${courseId}/toggle-publish/`);
      const updatedStatus = response.data.published;
  
      // Update the state to reflect the new status
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === courseId ? { ...course, published: updatedStatus } : course
        )
      );
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Could not update publish status.');
    }
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

            {/* Add button deleting */}
            <button
              onClick={() => handleDeleteCourse(course.id)}
              style={{ color: 'red', marginTop: '10px' }}
            >
              Delete course
            </button>

            {/* Add button to publish/unpublish course */}
            <button
              onClick={() => handleTogglePublish(course.id)}
              style={{ color: course.published ? 'green' : 'gray', marginTop: '10px', marginLeft: '10px' }}
            >
              {course.published ? 'Unpublish' : 'Publish'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseManagementPage;
