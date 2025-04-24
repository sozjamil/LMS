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
import MyCoursesPage from'./pages/MyCoursesPage.jsx'
import { Toaster } from 'react-hot-toast';
import StudentCourseView from './pages/StudentCourseView';
import Layout from './components/Layout'; // import Layout component

import RoleProtectedRoute from './components/RoleProtectedRoute'; // Import the RoleProtectedRoute component

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster />
      <div>
        <Navbar /> 

        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/course/:id" element={<CoursePage />} />
            <Route path="/login" element={<LoginPage />} />        

            <Route element={<ProtectedRoute />}> 
              <Route path="/profile" element={<UserProfilePage /> }/>
              <Route path="/my-courses" element={<MyCoursesPage />} />
              <Route path="/courses/:id/learn" element={<StudentCourseView />} />  
              <Route path="/logout" element={<Logout />} />

              <Route element={<RoleProtectedRoute allowedRoles={['instructor']} />}>
                <Route path="/create-course" element={<CreateCoursePage />} />
                <Route path="/manage-courses" element={<CourseManagementPage />} />
                <Route path="/manage/course/:id" element={<CourseEditPage />} />
              </Route>
            </Route> 

            <Route path="/register" element={<Register />} />
            
            {/* 404 fallback */}
            <Route path="*" element={<div>Page not found</div>} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
