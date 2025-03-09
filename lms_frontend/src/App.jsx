import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/LoginPage';
import useAuth from './hooks/useAuth';
import CreateCoursePage from './pages/CreateCoursePage';
import CourseManagementPage from './pages/CourseManagementPage';
import Register from './pages/Register';
import CourseEditPage from './pages/CourseEditPage';
import UserProfilePage from './pages/UserProfilePage';
// import ProtectedRoute from "./components/ProtectedRoute"; 
import Navbar from "./components/Navbar"; // Import the Navbar component

function App() {
  const { user } = useAuth();
  console.log('User:', user); // Debugging user value

  return (
    <Router>
      <Navbar /> {/* Add the Navbar */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />        
        <Route path="/create-course" element={<CreateCoursePage />} />
        <Route path="/manage-courses" element={<CourseManagementPage />} />
        <Route path="/manage/course/:id" element={<CourseEditPage />} />
        
        <Route path="/profile" element={<UserProfilePage /> }/>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div>Page not found</div>} />


      </Routes>

    </Router>
  );
}

export default App;
