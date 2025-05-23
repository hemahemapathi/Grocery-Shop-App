import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const processProductData = (product) => {
  if (!product) return product;
  
  const baseUrl = import.meta.env.VITE_API_URL;
  
  // Add full image URL to product
  if (product.image && !product.image.startsWith('http')) {
    product.imageUrl = `${baseUrl}${product.image}`;
  } else {
    product.imageUrl = product.image;
  }
  
  return product;
};

export const getProductById = async (id) => {
  const response = await axios.get(`/api/products/${id}`);
  return processProductData(response.data);
};

// Add this function to your existing api.js file

// Get products by category
export const getProductsByCategory = (category, page = 1) => {
  return api.get(`/products?category=${category}&page=${page}`);
};

// Get all categories
export const getCategories = () => {
  return api.get('/products/categories');
};


// Cart API functions
export const getCart = async () => {
  const response = await api.get('/api/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/api/cart', { productId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/api/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/api/cart/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/api/cart');
  return response.data;
};

// Order API functions
export const createOrder = async (orderData) => {
  const response = await api.post('/api/orders', orderData);
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/api/orders/${orderId}`);
  return response.data;
};

export const payOrder = async (orderId, paymentResult) => {
  const response = await api.put(`/api/orders/${orderId}/pay`, paymentResult);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/api/orders/myorders');
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.put(`/api/orders/${orderId}/cancel`);
  return response.data;
};


// Add these methods to your api.js file

// Get user profile
export const getUserProfile = () => {
  return api.get('/auth/profile');
};

// Update user profile
export const updateUserProfile = (userData) => {
  return api.put('/auth/profile', userData);
};

// Get user orders
export const getUserOrders = () => {
  return api.get('/orders/myorders');
};

// Get user favorites
export const getUserFavorites = () => {
  return api.get('/auth/favorites');
};

// Add product to favorites
export const addToFavorites = (productId) => {
  return api.post(`/auth/favorites/${productId}`);
};

// Remove product from favorites
export const removeFromFavorites = (productId) => {
  return api.delete(`/auth/favorites/${productId}`);
};

// Add these methods to api.js to support dashboard functionality

// Admin: Get all users (for dashboard)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Admin: Get dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// Add cache-busting to API requests
const addCacheBuster = (url) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_=${Date.now()}`;
};

// Override the get method to add cache-busting
const originalGet = api.get;
api.get = function(url, config) {
  return originalGet(addCacheBuster(url), config);
};

// Get top product reviews
export const getTopReviews = (limit = 3) => {
  return api.get(`/products/reviews/top?limit=${limit}`);
};






// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    // Don't override Content-Type if it's multipart/form-data
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
