import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form data before submit:', formData); // Debug print
    

    if (!formData.role) {
      setError('Please select a role.');
      return;
    }

    try {
      // Construct the payload based on the selected role, to send the data from the frontend in that structure
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        
      };
      
      console.log("Payload before submit:", payload); // helpful for debugging
      
      const response = await api.post('/api/register/', payload);      
      toast.success('Registration successful!');
      console.log('Registration successful:', response.data); //test
      navigate('/login');
      
    } catch (error) {

      const errors = error.response?.data;
      
      if (errors?.username?.[0]?.includes("already exists")) {
        toast.error("Username is already taken.");
      } else if (errors?.email?.[0]?.includes("already registered")) {
        toast.error("Email is already registered.");
      } else if (errors?.error) {
        toast.error(errors.error);
      } else {
        toast.error("Something went wrong. Try again.");
      }

      console.error("Registration error:", errors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Create an Account</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="" disabled>Select a role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
