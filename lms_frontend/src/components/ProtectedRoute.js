// // import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem("accessToken"); // Check if the user is authenticated

//   if (!isAuthenticated) {
//     // Redirect to the login page if not authenticated
//     return < Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;