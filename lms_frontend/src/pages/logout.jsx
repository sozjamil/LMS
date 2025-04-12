import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Clears token and user state

    navigate('/login'); // Redirects after logout
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;