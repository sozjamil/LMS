import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/LoginPage';
import useAuth from './hooks/useAuth';
import CreateCoursePage from './pages/CreateCoursePage';
import CourseManagementPage from './pages/CourseManagementPage';
import Register from './pages/Register';

function App() {
  const { user } = useAuth();
  console.log('User:', user); // Debugging user value

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage />}
        />        
        <Route path="/create-course" element={<CreateCoursePage />} />
        <Route path="/manage-courses" element={<CourseManagementPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div>Page not found</div>} />


      </Routes>

    </Router>
  );
}

export default App;
