import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import the api instance
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth(); // from context
  const navigate = useNavigate();

  const [username, setUsername] = useState('');  // Changed from email to username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const from = location.state?.from || '/'; // default to home if none

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

      login(response.data.access);
      // Redirect to page before login either the homepage    
      navigate(from); 
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
