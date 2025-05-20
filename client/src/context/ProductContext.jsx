import { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [topReviews, setTopReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    organic: false,
    sort: '-createdAt'
  });

// Update the getProducts function in ProductContext.jsx

// Update the getProducts function in ProductContext.jsx
const getProducts = useCallback(async (pageNumber = 1, filterOptions = {}) => {
  try {
    setLoading(true);
    
    // Use filterOptions directly without depending on the current filters state
    const currentFilters = { ...filterOptions };
    
    // Build query string
    let queryString = `page=${pageNumber}`;
    if (currentFilters.keyword) queryString += `&keyword=${currentFilters.keyword}`;
    if (currentFilters.category) queryString += `&category=${currentFilters.category}`;
    if (currentFilters.minPrice) queryString += `&minPrice=${currentFilters.minPrice}`;
    if (currentFilters.maxPrice) queryString += `&maxPrice=${currentFilters.maxPrice}`;
    if (currentFilters.organic) queryString += `&organic=true`;
    if (currentFilters.sort) queryString += `&sort=${currentFilters.sort}`;
    

    
    const response = await api.get(`/products?${queryString}`);
    
    // Update filters state after the API call to avoid dependency issues
    setFilters(currentFilters);
    
    setProducts(response.data.products);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotalProducts(response.data.totalProducts);
    setLoading(false);
  } catch (error) {
    const errorMessage = error.code === 'ERR_NETWORK'
      ? 'Cannot connect to server. Please check your connection or try again later.'
      : error.response?.data?.message || 'An error occurred';
    setError(errorMessage);
    toast.error(errorMessage);
    console.error('API Error:', error);
    setLoading(false);
  }
}, []); // Empty dependency array to prevent function recreation



  // Get products by category

const getProductsByCategory = useCallback(async (category, pageNumber = 1) => {
  try {
    setLoading(true);
  
    let queryString = `page=${pageNumber}&category=${category}`;
    
    const response = await api.get(`/products?${queryString}`);
    
    setProducts(response.data.products);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotalProducts(response.data.totalProducts);
    setLoading(false);
  } catch (error) {
    const errorMessage = error.code === 'ERR_NETWORK'
      ? 'Cannot connect to server. Please check your connection or try again later.'
      : error.response?.data?.message || 'An error occurred';
    setError(errorMessage);
    toast.error(errorMessage);
    console.error('API Error:', error);
    setLoading(false);
  }
}, []); 


  // Get a single product by ID
  const getProductById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      const errorMessage = error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Please check your connection or try again later.'
        : error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('API Error:', error);
      setLoading(false);
      return null;
    }
  };

  // Get featured products
  const getFeaturedProducts = useCallback(async (limit = 4) => {
    try {
      setLoading(true);
      const response = await api.get(`/products/featured?limit=${limit}`);
      setFeaturedProducts(response.data);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Please check your connection or try again later.'
        : error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      console.error('API Error:', error);
      setLoading(false);
    }
  }, []); 

  // Get top rated products
  const getTopProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/top');
      setTopProducts(response.data);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Please check your connection or try again later.'
        : error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('API Error:', error);
      setLoading(false);
    }
  };

  // Get product categories
  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Please check your connection or try again later.'
        : error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      console.error('API Error:', error);
      setLoading(false);
    }
  }, []);

  // Create a product review
  const createProductReview = async (productId, review) => {
    try {
      setLoading(true);
      await api.post(`/products/${productId}/reviews`, review);
      toast.success('Review submitted successfully');
      setLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Please check your connection or try again later.'
        : error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('API Error:', error);
      setLoading(false);
      return false;
    }
  };

  // Admin: Create a product
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      
      const response = await api.post('/products', formData, {
        headers: {
                      'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Product created successfully');
      setLoading(false);
      return response.data;
    } catch (error) {
      const errorMessage = error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Please check your connection or try again later.'
        : error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('API Error:', error);
      setLoading(false);
      return null;
    }
  };

  // Admin: Update a product
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      
      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Product updated successfully');
      setLoading(false);
      return response.data;
    } catch (error) {
      const errorMessage = error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Please check your connection or try again later.'
        : error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('API Error:', error);
      setLoading(false);
      return null;
    }
  };

  // Admin: Delete a product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      setLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Please check your connection or try again later.'
        : error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('API Error:', error);
      setLoading(false);
      return false;
    }
  };

  const getTopReviews = useCallback(async (limit = 3) => {
  try {
    setLoading(true);
    const response = await api.get(`/products/reviews/top?limit=${limit}`);
    setTopReviews(response.data);
    setLoading(false);
    return response.data;
  } catch (error) {
    const errorMessage = error.code === 'ERR_NETWORK'
      ? 'Cannot connect to server. Please check your connection or try again later.'
      : error.response?.data?.message || 'An error occurred';
    setError(errorMessage);
    console.error('API Error:', error);
    setLoading(false);
    return [];
  }
}, []);

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return (price - (price * discount / 100)).toFixed(2);
  };

  // Clear product details (useful when navigating away from product page)
  const clearProductDetails = () => {
    setProduct(null);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      organic: false,
      sort: '-createdAt'
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        topProducts,
        categories,
        product,
        loading,
        error,
        page,
        pages,
        totalProducts,
        filters,
        getProducts,
        getProductById,
        getProductsByCategory,
        getFeaturedProducts,
        getTopProducts,
        getCategories,
        createProductReview,
        topReviews,
        getTopReviews,
        createProduct,
        updateProduct,
        deleteProduct,
        calculateDiscountedPrice,
        clearProductDetails,
        setFilters,
        resetFilters
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
