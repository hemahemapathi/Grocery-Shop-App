import { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { FaSort, FaArrowUp } from 'react-icons/fa';
import { toast } from 'react-toastify';

import ProductContext from '../../../context/ProductContext';
import CartContext from '../../../context/CartContext';
import AuthContext from '../../../context/AuthContext';
import ProductGrid from './ProductGrid';
import ProductFilter from './ProductFilter';
import './ProductList.css';

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const {
    products, loading, error, getProducts,
    page, pages, totalProducts,
    resetFilters, calculateDiscountedPrice,
    categories, getCategories
  } = useContext(ProductContext);
  const { addToCart, cartItems, updateCartItemQty } = useContext(CartContext);
  const { userInfo, isAuthenticated } = useContext(AuthContext);

  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loadingFav, setLoadingFav] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    keyword: '', category: '', minPrice: '', maxPrice: '',
    organic: false, sort: '-createdAt'
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const isFirst = useRef(true);

  const getCartItem = id => cartItems.find(i => i.product === id);
  const isInFavorites = id => favorites.some(f => f.product === id);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => { 
    getCategories(); 
  if (isAuthenticated && userInfo) fetchFav(); // Check if userInfo exists
}, [isAuthenticated, userInfo]); // Add userInfo to dependency array

const fetchFav = async () => {
  if (!userInfo || !userInfo.token) return; // Add safety check
  
  try {
    setLoadingFav(true);
    // Use the correct API URL from environment variables
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/favorites`, {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    if (res.ok) setFavorites(await res.json());
  } catch (error) {
    console.error('Error fetching favorites:', error);
  } finally { 
    setLoadingFav(false);
  }
};


  
  const toggleFav = id => {
  if (isInFavorites(id)) {
    remFav(id);
  } else {
    addFav(id);
  }
};
  
  const addFav = async id => {
  if (!isAuthenticated) {
    toast.info('Login first');
    navigate('/login');
    return;
  }
  
  if (!userInfo || !userInfo.token) return; // Add safety check
  
  try {
    // Use the correct API URL from environment variables
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/favorites/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      },
    
    });
    if (res.ok) setFavorites([...favorites, { product: id }]);
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};



const remFav = async id => {
  if (!userInfo || !userInfo.token) return; // Add safety check
  
  try {
    // Use the correct API URL from environment variables
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    if (res.ok) setFavorites(favorites.filter(f => f.product !== id));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const cat = params.category || q.get('category') || '';
    const l = {
      keyword: q.get('keyword') || '',
      category: cat,
      minPrice: q.get('minPrice') || '',
      maxPrice: q.get('maxPrice') || '',
      organic: q.get('organic') === 'true',
      sort: q.get('sort') || '-createdAt'
    };
    setLocalFilters(l);
    setIsFilterApplied(l.keyword || cat || l.minPrice || l.maxPrice || l.organic || l.sort !== '-createdAt');
    const p = +q.get('page') || 1;
    if (isFirst.current) {
      isFirst.current = false;
    } else {
      getProducts(p, l);
    }
  }, [location.search, params.category]);

  useEffect(() => {
    if (isFirst.current) {
      const q = new URLSearchParams(location.search);
      getProducts(+q.get('page') || 1, {
        category: params.category || q.get('category') || ''
      });
    }
  }, []);

  const handleFilterChange = e => {
    const { name, value, type, checked } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const applyFilters = () => {
    const q = new URLSearchParams();
    if (localFilters.keyword) q.set('keyword', localFilters.keyword);
    if (localFilters.category) q.set('category', localFilters.category);
    if (localFilters.minPrice) q.set('minPrice', localFilters.minPrice);
    if (localFilters.maxPrice) q.set('maxPrice', localFilters.maxPrice);
    if (localFilters.organic) q.set('organic', 'true');
    if (localFilters.sort) q.set('sort', localFilters.sort);
    navigate(`/products?${q.toString()}`);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    resetFilters();
    setLocalFilters({
      keyword: '', category: '', minPrice: '', maxPrice: '',
      organic: false, sort: '-createdAt'
    });
    navigate('/products');
    setShowFilters(false);
  };

  const handlePageChange = p => {
    const q = new URLSearchParams(location.search);
    q.set('page', p);
    navigate(`/products?${q.toString()}`);
  };

   const handleAddToCart = (p, qty = 1) => {
  // Use the quantity passed from the ProductGrid component
  addToCart(p, qty);
  toast.success(`${qty} ${p.name} added to cart`);
};
  
  const handleUpdateQty = (p, qty) => {
    if (qty === 0) {
      // Remove from cart
      updateCartItemQty(p._id, 0);
    } else {
      // Update quantity
      updateCartItemQty(p._id, qty);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 300px or more
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSortChange = e => {
    setLocalFilters({...localFilters, sort: e.target.value});
    const q = new URLSearchParams(location.search);
    q.set('sort', e.target.value);
    navigate(`/products?${q.toString()}`);
  };

  const filteredProducts = useMemo(() => products, [products]);

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" variant="success" />
      <p className="mt-3 text-muted">Loading products…</p>
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <div className="alert alert-danger">
        <h4>Error loading products</h4>
        <p>{error}</p>
      </div>
    </Container>
  );

   

  return (
    <Container fluid className="py-4 product-list-container">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="product-list-title">
            {localFilters.category ? `${localFilters.category} Products` : 'All Products'}
            {isFilterApplied && <Badge bg="success" pill className="ms-2">Filtered</Badge>}
          </h1>
          <div className="d-flex align-items-center">
            <div className="sort-dropdown me-3">
              <Form.Select 
                size="sm" 
                value={localFilters.sort} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Highest Rated</option>
              </Form.Select>
            </div>
            <Button 
              variant="light" 
              size="sm"
              className="filter-icon-btn" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fa-solid fa-filter" style={{ color: "#419e10" }}></i>
            </Button>
          </div>
        </div>

        <div className="product-count-info mb-3">
          <p className="mb-0">
            Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> products
            {isFilterApplied && (
              <Button variant="link" className="p-0 ms-2" onClick={handleResetFilters}>
                Clear Filters
              </Button>
            )}
          </p>
        </div>

        <div className="position-relative">
          <Row>
            {/* Products Grid */}
            <Col xs={12} className={showFilters ? 'col-with-sidebar' : ''}>
              {products.length === 0 ? (
                <div className="alert alert-info">
                  <h4>No products found</h4>
                  <Button variant="outline-primary" onClick={handleResetFilters}>View All</Button>
                </div>
              ) : (
                <>
                  <ProductGrid 
                    products={filteredProducts}
                    calculateDiscountedPrice={calculateDiscountedPrice}
                    handleAddToCart={handleAddToCart}
                    handleUpdateQty={handleUpdateQty}
                    toggleFav={toggleFav}
                    isInFavorites={isInFavorites}
                    getCartItem={getCartItem}
                  />

                  {/* Pagination */}
                  {pages > 1 && (
                    <nav aria-label="pagination" className="mt-4">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                                                          onClick={() => handlePageChange(page - 1)} 
                            disabled={page === 1}
                          >
                            Prev
                          </button>
                        </li>
                        {[...Array(pages).keys()].map(x =>
                          Math.abs(x + 1 - page) <= 1 || x === 0 || x === pages - 1 ? (
                            <li key={x} className={`page-item ${page === x + 1 ? 'active' : ''}`}>
                              <button className="page-link" onClick={() => handlePageChange(x + 1)}>
                                {x + 1}
                              </button>
                            </li>
                          ) : Math.abs(x + 1 - page) === 2 ? (
                            <li key={x} className="page-item disabled">
                              <span className="page-link">…</span>
                            </li>
                          ) : null
                        )}
                        <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(page + 1)} 
                            disabled={page === pages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </Col>
          </Row>

          {/* Filter Component */}
          <ProductFilter 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            localFilters={localFilters}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            handleResetFilters={handleResetFilters}
            isFilterApplied={isFilterApplied}
            categories={categories}
          />
        </div>
      </Container>

         {/* Floating Action Button */}
      {showScrollButton && (
        <div className="floating-action-container">
          <Button 
            variant="success" 
            className="floating-action-button shadow" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <FaArrowUp />
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ProductList;

