import { useState } from 'react';
import axios from 'axios';
import * as jwt_decode from 'jwt-decode'; 

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  // **Login function**
  const login = (username, password) => {
    axios.post('http://localhost:8000/api/token/', { username, password })
      .then((response) => {
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        setToken(access);
        const decoded = jwt_decode(access);
        setUser(decoded);
      })
      .catch((error) => console.log('Error logging in', error));
  };
  
  // **Logout function**
  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    // Optionally, redirect the user to the login page
    window.location.href = '/login';
  };

  return {
    user,
    token,
    login,
    logout,
  };
};

export default useAuth;
