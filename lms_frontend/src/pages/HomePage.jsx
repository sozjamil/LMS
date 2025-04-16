import React, { useEffect, useState } from 'react';
import api from '../utils/api'; // Import the API instance
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Get the navigate function
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

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

  // filtering courses based on search query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`); // Navigate to the course detail page
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">Welcome to the LMS</h1>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-md w-full max-w-md"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Featured Courses</h2>
      <div class="bg-blue-500 text-white p-4">
      Hello, this should be blue with white text!
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-300"
            >
              <button
                onClick={() => handleCourseClick(course.id)}
                className="w-full"
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt="Course Cover"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                </div>
              </button>
            </div>
          ))
        ) : (
          <p>No courses found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
