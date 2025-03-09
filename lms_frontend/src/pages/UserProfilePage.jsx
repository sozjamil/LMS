import React, { useEffect, useState } from "react";
import api from "../utils/api";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/profile/");
        setUser(response.data);
        setRole(response.data.role);
      } catch (error) {
        setError("Failed to fetch profile. Please try again later.");
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Update user role
  const handleRoleChange = async (newRole) => {
    try {
      const response = await api.patch("/api/profile/", { role: newRole });
      setRole(response.data.role);
      setError(""); // Clear any previous errors
      alert("Role updated successfully!");
    } catch (error) {
      setError("Failed to update role. Please try again.");
      console.error("Failed to update role:", error);
    }
  };

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
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {role}</p>

          {/* Role Update Buttons */}
          <button onClick={() => handleRoleChange("instructor")}>
            Become Instructor
          </button>
          <button onClick={() => handleRoleChange("student")}>
            Become Student
          </button>

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