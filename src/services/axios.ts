import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
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

let refreshPromise: Promise<string> | null = null;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

// Request interceptor
instance.interceptors.request.use((config) => {
  const token = cookies.get(TOKEN_NAME);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = cookies.get('refreshToken');
      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        if (!refreshPromise) {
          originalRequest._retry = true;
          refreshPromise = axios.post(
            `${BASE_URL}/auth/refresh`,
            {},
            {
              withCredentials: true,
              timeout: 5000
            }
          ).then(({ data }) => {
            if (!data.accessToken) throw new Error("Invalid refresh response");
            
            cookies.set(TOKEN_NAME, data.accessToken, {
              expires: new Date(Date.now() + 15 * 60 * 1000),
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
            
            return data.accessToken;
          }).finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        
        // Update original request header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Retry original request
        return instance(originalRequest);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (refreshError:any) {
        // Process queued requests with error
        failedRequestsQueue.forEach(prom => prom.reject(refreshError));
        failedRequestsQueue = [];
        
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function logout() {
  cookies.remove(TOKEN_NAME);
  cookies.remove(USER_DETAILS);
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
}

export default instance;