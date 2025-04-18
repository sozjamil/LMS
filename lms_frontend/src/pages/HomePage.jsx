import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to Your Learning Hub</h1>
        <p className="text-lg sm:text-xl">Discover new skills, gain certificates, and level up your career</p>
      </div>

      {/* Search */}
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xl px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* Featured Courses */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Featured Courses</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-100 shadow-md rounded-xl hover:shadow-xl transition duration-300"
              onClick={() => handleCourseClick(course.id)}
            >
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt="Course"
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                {/* Optionally add price, instructor, or rating here */}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No courses found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
