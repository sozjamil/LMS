import React from 'react';
import useAuth from '../hooks/useAuth'; // Adjust the path
import { Link } from 'react-router-dom';

const Navbar = () => {

  const { isAuthenticated, logout } = useAuth(); // Uses context
  
  return (
    <nav >
      <div >
        <Link to="/" >My App</Link>
      </div>
      <ul >
        <li><Link to="/" >Home</Link></li>
        {isAuthenticated && (
          <>
            <li><Link to="/profile">Profile</Link>
            </li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        )}
        {!isAuthenticated && (
          <li>
            <Link to="/login" >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
export default Navbar;