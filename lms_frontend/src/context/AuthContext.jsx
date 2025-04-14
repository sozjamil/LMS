import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  //Initialize the state with access token from localStorage
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(() => {
      // Try to get user info from localStorage (if available)
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    });

  useEffect(() => {
    //If there's a valid access token, we can fetch the user profile
    if (accessToken && !user) {
      // Optionally fetch user profile here using the token
      fetchUserProfile(accessToken);
    }
  }, [accessToken]); 
  
  const fetchUserProfile = async (token) => {
      try {
        const response = await fetch('http://localhost:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Save user data in localStorage
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUser(null);
      }
    };

  
  const login = async (token) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
  
    // Fetch user profile after login
    await fetchUserProfile(token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); 
    localStorage.removeItem('user');
    
    setAccessToken(null);    
    setUser(null);
    navigate('/login'); // optional redirect
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, isAuthenticated: !!accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export default function useAuth() {
  return useContext(AuthContext);
}
