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

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              onClick={() => navigate(`/course/${course.id}/`)}
              className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition duration-300 overflow-hidden"
            >
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-purple-700">{course.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
