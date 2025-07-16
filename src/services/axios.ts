import { TOKEN_NAME } from "@/constants/app.constant";
import axios from "axios";
import cookies from "js-cookie";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Create Axios instance
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = cookies.get(TOKEN_NAME);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 400 errors specifically
      if (error.response.status === 400) {
        console.error("Bad Request:", error.response.data);
        // You can transform the error message here
        return Promise.reject({
          message: "Invalid request data",
          details: error.response.data,
          status: 400,
        });
      }
    }
    // For other errors, just reject with the original error
    return Promise.reject(error);
  }
);

export default instance;
