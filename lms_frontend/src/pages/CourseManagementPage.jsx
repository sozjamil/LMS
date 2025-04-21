import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/instructor/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEditCourse = (id) => navigate(`/manage/course/${id}`);

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/api/instructor/courses/${id}/delete/`);
        setCourses(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Something went wrong while deleting the course.');
      }
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await api.post(`/api/instructor/courses/${id}/toggle-publish/`);
      const updated = res.data.published;
      setCourses(prev =>
        prev.map(c => (c.id === id ? { ...c, published: updated } : c))
      );
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Could not update publish status.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        Loading your courses...
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You haven't created any courses yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">Your Courses</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col"
          >
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt="Course thumbnail"
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                No Thumbnail
              </div>
            )}

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{course.description}</p>

              <div className="mt-auto pt-4 space-y-2">
                <button
                  onClick={() => handleEditCourse(course.id)}
                  className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Edit Course
                </button>

                <div className="flex justify-between items-center space-x-2">
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleTogglePublish(course.id)}
                    className={`w-full py-2 rounded-md transition text-white ${
                      course.published ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {course.published ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagementPage;
