import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import axios from "axios";
import cookies from "js-cookie";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "";

// Create Axios instance
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

// Add a request interceptor to dynamically set the Authorization header
instance.interceptors.request.use(
  (config) => {
    const token = cookies.get(TOKEN_NAME); // Get the token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
    } else {
      console.warn("No token found in cookies");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration or unauthorized errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // toast.info("Your session has expired. Please log in again.");
      // Handle unauthorized errors (e.g., token expired)
      console.error("Unauthorized: Token may be expired or invalid");
      // Optionally, redirect to login or refresh the token
      // Remove the expired token from cookies
      cookies.remove(TOKEN_NAME);
      cookies.remove(USER_DETAILS);
    }
    return Promise.reject(error);
  }
);

export default instance;
