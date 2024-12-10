import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Adjust based on your API URL

export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
      refresh: refreshToken,
    });
    return response.data.access; // Return the new access token
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};
