import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ProfilePictureUpload from './ProfilePictureUpload';
import { useNavigate } from "react-router-dom";
import useAuth from '../context/AuthContext';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [instructorStats, setInstructorStats] = useState(null);

  // Fetch user profile data from the API
  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/profile/");
      setUser(response.data);
      setName(response.data.username);  // Set the name
      setBio(response.data.bio || "");  // Set the bio if available
      // Call refreshUser to update the user context
      await refreshUser();
    } catch (error) {
      setError("Failed to fetch profile. Please try again later.");
      console.error("Failed to fetch profile:", error);
    }
  };

  // Fetch instructor stats if the user is an instructor
  const fetchInstructorStats = async () => {
    try {
      const response = await api.get("/api/instructor-stats/");
      setInstructorStats(response.data);
    } catch (error) {
      console.error("Failed to fetch instructor stats:", error);
    }
  };

  // Fetch when component loads
  useEffect(() => {
    fetchProfile();
    // Check if the user is an instructor and fetch stats
    if (user && user.role === "instructor") {
      fetchInstructorStats();
    }
  }, []);

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      // Prepare the updated data
      const updatedData = {
        username: name, // Update the username
        bio: bio, // Update the bio
      };

      // Include the profile picture if it's updated
      if (user.profile_picture) {
        updatedData.profile_picture = user.profile_picture;
      }

      // Send a PATCH request to update profile
      await api.patch("/api/profile/", updatedData);
      setError(""); // Clear any previous errors
      alert("Profile updated successfully!");
      fetchProfile(); // Refresh profile data
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Failed to update profile:", error);
    }
  };

  // Handle password update
  const handlePasswordChange = async () => {
    try {
      await api.patch("/api/profile/", { password });
      setError(""); // Clear any previous errors
      alert("Password updated successfully!");
      setPassword("");
    } catch (error) {
      setError("Failed to update password. Please try again.");
      console.error("Failed to update password:", error);
    }
  };

  // Route to course creation page (instructor only)
  const handleCreateCourse = () => {
    navigate("/create-course");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-8 lg:p-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-8 text-center">
          Your Profile
        </h1>
  
        {error && (
          <div className="mb-6 text-red-600 text-center bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}
  
        {user ? (
          <div className="lg:flex lg:space-x-12 space-y-10 lg:space-y-0">
            {/* Left: Profile Picture & Info */}
            <div className="flex flex-col items-center gap-6 lg:w-1/3">
              <ProfilePictureUpload onUploadSuccess={fetchProfile} />
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-500 shadow-md"
                />
              ) : (
                <p className="text-gray-500">No profile picture</p>
              )}
              <div className="text-center space-y-1">
                <p className="text-lg font-medium text-slate-700">{user.email}</p>
                {user.role && (
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                    {user.role.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
  
            {/* Right: Editable Fields */}
            <div className="lg:w-2/3 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  placeholder="Tell us about yourself..."
                />
              </div>
  
              {/* Save Profile Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
                >
                  Save Profile
                </button>
              </div>
  
              {/* Instructor-only Button */}
              {user?.role === "instructor" && (
                <div className="text-right">
                  <button
                    onClick={handleCreateCourse}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
                  >
                    + Create New Course
                  </button>
                </div>
              )}
  
              {/* Change Password */}
              <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
                <h2 className="text-lg font-semibold text-slate-700 mb-4">Change Password</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                  <button
                    onClick={handlePasswordChange}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md shadow-md transition"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 animate-pulse">Loading profile...</div>
        )}
      </div>
      {user?.role === 'instructor' && instructorStats && (
        <div className="bg-slate-50 p-6 rounded-xl shadow-inner space-y-2">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Instructor Analytics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow text-center">
              <p className="text-lg font-bold text-indigo-600">{instructorStats.total_courses}</p>
              <p className="text-gray-600">Courses Created</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow text-center">
              <p className="text-lg font-bold text-emerald-600">{instructorStats.total_enrollments}</p>
              <p className="text-gray-600">Total Enrollments</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default UserProfilePage;
