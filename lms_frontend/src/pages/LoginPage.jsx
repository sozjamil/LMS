// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import the api instance
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth(); // from context
  const navigate = useNavigate();
  const [username, setUsername] = useState('');  // Changed from email to username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      // Changed email to username, as the backend might expect "username"
      const response = await api.post('/api/token/', { username, password });
      
      // Store the tokens in localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      // Simulate login API call
      const Token = 'accessToken'; // Replace this with real API response

      // Save to context (this will trigger Navbar update!)
      login(Token);

      // Redirect to the homepage or course management page after successful login
      navigate('/');
    } catch (error) {
      // Detailed error logging
      console.error('Error logging in:', error.response?.data || error.message);
      setError('Invalid credentials');  // Handle errors like invalid credentials
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>  {/* Changed from email to username */}
          <input
            type="text"  // Changed to text to match expected username type
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
