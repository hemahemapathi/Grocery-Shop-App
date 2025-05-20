import axios from 'axios';

// API URL - adjust this to match your backend API endpoint
const API_URL = '/api/products';

// Get auth token from local storage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

// Get all products
const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL);
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

// Get product by ID
const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
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

// Get products by category
const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/category/${category}`);
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

// Search products
const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?q=${query}`);
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

// Create a new product (Admin only)
const createProduct = async (productData) => {
  try {
    const token = getToken();
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.post(API_URL, productData, config);
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

// Update a product (Admin only)
const updateProduct = async (productId, productData) => {
  try {
    const token = getToken();
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.put(`${API_URL}/${productId}`, productData, config);
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

// Delete a product (Admin only)
const deleteProduct = async (productId) => {
  try {
    const token = getToken();
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.delete(`${API_URL}/${productId}`, config);
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

const productService = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
};

export default productService;
