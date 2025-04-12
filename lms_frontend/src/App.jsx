import React from 'react';
import { Routes, Route, Navigate  } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute"; 
import useAuth from './hooks/useAuth'; 
import Navbar from "./components/Navbar"; // Import the Navbar component

import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/LoginPage';
import CreateCoursePage from './pages/CreateCoursePage';
import CourseManagementPage from './pages/CourseManagementPage';
import Register from './pages/Register';
import CourseEditPage from './pages/CourseEditPage';
import UserProfilePage from './pages/UserProfilePage';
import Logout from './pages/logout';

// Step 13: Course Reviews

function App() {
  const { user } = useAuth();
  console.log('User:', user); // Debugging user value

  return (
      <div>
        <Navbar /> 

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:id" element={<CoursePage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />        

          <Route element={<ProtectedRoute />}> 
            <Route path="/profile" element={<UserProfilePage /> }/>
            <Route path="/create-course" element={<CreateCoursePage />} />
            <Route path="/manage-courses" element={<CourseManagementPage />} />
            <Route path="/manage/course/:id" element={<CourseEditPage />} />
            <Route path="/logout" element={<Logout />} />
          </Route> 

          <Route path="/register" element={<Register />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<div>Page not found</div>} />



        </Routes>
      </div>
  );
}

export default App;
