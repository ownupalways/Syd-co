import axios from 'axios';

/**
 * Axios Instance for Sydney Shopping
 * * IMPORTANT: We no longer use localStorage for tokens. 
 * The browser automatically handles the HttpOnly 'token' cookie 
 * provided that 'withCredentials' is set to true.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: { "Content-Type": "application/json" },
  // ✅ Mandatory for HttpOnly cookies to work
  withCredentials: true,
});

/**
 * Response Interceptor
 * * Even though we don't handle the token manually, we still listen for 401s.
 * If the cookie expires or is invalid, the backend returns 401, 
 * and we redirect the user to login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any non-sensitive local user data if you have it
      // then redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
