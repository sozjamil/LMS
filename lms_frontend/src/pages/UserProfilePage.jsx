// User profile page for instructor/student to view and update their profile information
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ProfilePictureUpload from './ProfilePictureUpload';
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Get the navigate function
  
  // fetch user profile data from the API
  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/profile/");
      setUser(response.data);
    } catch (error) {
      setError("Failed to fetch profile. Please try again later.");
      console.error("Failed to fetch profile:", error);
    }
  };
  //Fetch when component loads
  useEffect(() => {
    fetchProfile();
  }, []);

  // Update password
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

  // route to course creation page
  const handleCreateCourse = () => {
    navigate("/create-course"); // route to your course creation page
  };    
  

  return (
    <div>
      <h1>User Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <div> 
          <ProfilePictureUpload onUploadSuccess={fetchProfile}/>
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <p>No profile picture uploaded.</p>
          )}
          
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>

          {/* Instructor-only button */}
          { user?.role === 'instructor' && (
            <button
              onClick={handleCreateCourse}
              style={{ backgroundColor: "#007bff", color: "white", marginTop: "1rem" }}
            >
              Create New Course
            </button>
          )}

          {/* Password Update Form */}
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Update Password</button>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfilePage;