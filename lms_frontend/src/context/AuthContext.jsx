import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (accessToken) {
      // Optionally fetch user profile here using the token
      setUser({ name: 'User' }); // Placeholder user
    } else {
      setUser(null);
    }
  }, [accessToken]);

  // const login = (token) => {
  //   localStorage.setItem('accessToken', token);
    
  //   setAccessToken(token);
  // };
  const login = async (token) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
  
    // Fetch user profile after login
    const response = await fetch('http://localhost:8000/api/profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = await response.json();
    setUser(userData); // userData contains `role`, `username`, etc.
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); 
    setAccessToken(null);
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
