import axios from 'axios';

// Create an Axios instance with default properties
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3500', // Replace with your API's base URL
  // You can add more default settings here
  // headers: { 'X-Custom-Header': 'foobar' }
});

export default axiosInstance;
