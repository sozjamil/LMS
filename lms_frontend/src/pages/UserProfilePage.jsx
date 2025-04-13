import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ProfilePictureUpload from './ProfilePictureUpload';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/profile/");
        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch profile. Please try again later.");
        console.error("Failed to fetch profile:", error);
      }
    };

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

  return (
    <div>
      <h1>User Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <div> 
          <ProfilePictureUpload />
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>

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