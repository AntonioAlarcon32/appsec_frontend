import axios from 'axios';

// Create an Axios instance with default properties
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3500', // Replace with your API's base URL
  // You can add more default settings here
});

axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
});

axiosInstance.interceptors.response.use(
  response => {
    // Any status code within the range of 2xx will cause this function to trigger
    return response;
  },
  async error => {
    // Any status codes outside the range of 2xx will cause this function to trigger
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Replace '/refresh-token' with your actual endpoint
        const response = await axiosInstance.post('auth/refresh-token',{ withCredentials: true});
        const newToken = response.data.token;
        setAuthToken(newToken);
        // Return the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Return any other error
    return Promise.reject(error);
  }
  // Redirect the user to the login page

);



export function setAuthToken(token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}



export default axiosInstance;
