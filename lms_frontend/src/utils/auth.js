import axios from 'axios';
import API_BASE_URL from "../config";

const BASE_URL = API_BASE_URL;

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
