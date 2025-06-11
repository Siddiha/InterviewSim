import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptors for things like adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Example: Add a token from local storage or a state management solution
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptors for things like error handling or refreshing tokens
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Example: Handle 401 Unauthorized errors (e.g., redirect to login)
    // if (error.response && error.response.status === 401) {
    //   // Redirect to login or refresh token
    // }
    return Promise.reject(error);
  }
);

export default api;

// You can define specific API functions here
// export const getInterviews = () => api.get('/interviews');
// export const createInterview = (data: any) => api.post('/interviews', data);
