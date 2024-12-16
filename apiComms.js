// apiComms.js
import axios from 'axios';

// Set the base URL for axios requests
axios.defaults.baseURL = 'http://192.168.235.125:5000'; // Replace with your backend URL

export default axios;