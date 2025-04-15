// creating a new course page
import React, { useState } from 'react';
import api from '../utils/api'; // Import the api instance
import { useNavigate } from 'react-router-dom';

const CreateCoursePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // Add state for price
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');
    // Debug: Check if the token exists
    console.log('Access Token:', accessToken); // <---
    
    if (!accessToken) {
      setError('You must be logged in to create a course');
      setLoading(false);
      return;
    }

    try {
      // Include the access token in the Authorization header
      const response = await api.post('/api/courses/create/', 
        {
          title,
          description,
          price, // Send the price field
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Include the token in the header
          },
        }
      );
      
      const courseId = response.data.id; // assuming the backend returns the course ID
      navigate(`/manage/course/${courseId}`);

      // Handle successful course creation
      console.log('Course created:', response.data);
    } catch (error) {
      setError('Failed to create course');
      console.error('Error creating course:', error.response ? error.response.data : error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Create New Course</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Course Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CreateCoursePage;
