import axios from 'axios';

// API URL - adjust this to match your backend API endpoint
const API_URL = '/api/users';

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    const message = 
      (error.response && 
        error.response.data && 
        error.response.data.message) || 
      error.message || 
      error.toString();
    
    throw new Error(message);
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    const message = 
      (error.response && 
        error.response.data && 
        error.response.data.message) || 
      error.message || 
      error.toString();
    
    throw new Error(message);
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user from localStorage
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Update user profile
const updateProfile = async (userData) => {
  try {
    const user = getCurrentUser();
    
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
    
    const response = await axios.put(`${API_URL}/profile`, userData, config);
    
    if (response.data) {
      // Update the stored user data with new information
      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...response.data
      }));
    }
    
    return response.data;
  } catch (error) {
    const message = 
      (error.response && 
        error.response.data && 
        error.response.data.message) || 
      error.message || 
      error.toString();
    
    throw new Error(message);
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile
};

export default authService;
