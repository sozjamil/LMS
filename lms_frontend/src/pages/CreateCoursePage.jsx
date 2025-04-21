import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateCoursePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('You must be logged in to create a course');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        '/api/courses/create/',
        { title, description, price, category },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const courseId = response.data.id;
      navigate(`/manage/course/${courseId}`);
    } catch (err) {
      setError('Failed to create course');
      console.error('Error creating course:', err.response?.data || err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories/');
        setCategoryOptions(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Create New Course</h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="e.g. Introduction to Python"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Course Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Write a short course description..."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Price (USD)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="e.g. 19.99"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">-- Select Category --</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Creating Course...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;
