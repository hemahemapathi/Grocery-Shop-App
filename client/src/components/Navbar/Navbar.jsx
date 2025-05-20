import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserCog, FaStore, FaSearch, FaHeart } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import ProductContext from '../../context/ProductContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { products, getProducts, categories, getCategories } = useContext(ProductContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  
  // Fetch categories when component mounts
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Fetch some products for search suggestions if needed
  useEffect(() => {
    if (products.length === 0) {
      getProducts(1, { limit: 20 }); // Fetch some products for suggestions
    }
  }, [getProducts, products.length]);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle search input change with suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 1) {
      // Filter products that match the search term
      const matchingProducts = products
        .filter(product => 
          product.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(matchingProducts);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light sticky-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaStore className="me-2 text-success" size={24} />
          <span className="fw-bold">Groovo</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/products') ? 'active' : ''}`} to="/products">Products</Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="categoriesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                {categories && categories.length > 0 ? (
                  <>
                    {categories.map((category) => (
                      <li key={category._id}>
                        <Link 
                          className="dropdown-item" 
                          to={`/products?category=${category._id}`}
                        >
                          {category._id} ({category.count})
                        </Link>
                      </li>
                    ))}
                    <li><hr className="dropdown-divider" /></li>
                  </>
                ) : (
                  <>
                    <li><Link className="dropdown-item" to="/products?category=Fruits">Fruits</Link></li>
                    <li><Link className="dropdown-item" to="/products?category=Vegetables">Vegetables</Link></li>
                    <li><Link className="dropdown-item" to="/products?category=Dairy">Dairy</Link></li>
                    <li><Link className="dropdown-item" to="/products?category=Bakery">Bakery</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                  </>
                )}
                <li><Link className="dropdown-item" to="/products">All Products</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact') ? 'active' : ''}`} to="/contact">Contact</Link>
            </li>
            {/* Removed Wishlist from here */}
          </ul>

          {/* Search Bar - Desktop */}
          <div className="d-none d-md-block search-container me-3" ref={searchRef}>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control search-input"
                  placeholder="Search products..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchTerm.trim().length > 1) {
                      setShowSuggestions(true);
                    }
                  }}
                />
                <button className="btn btn-outline-success" type="submit">
                  <FaSearch />
                </button>
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map(product => (
                    <div 
                      key={product._id} 
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(product._id)}
                    >
                      <img 
                        src={product.imageUrl || product.image} 
                        alt={product.name} 
                        className="suggestion-image" 
                      />
                      <div className="suggestion-details">
                        <div className="suggestion-name">{product.name}</div>
                        <div className="suggestion-price">
                          ${product.discount > 0 
                            ? ((product.price - (product.price * product.discount / 100)).toFixed(2)) 
                            : product.price.toFixed(2)
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="suggestion-view-all"
                    onClick={() => {
                      if (searchTerm.trim()) {
                        navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
                        setSearchTerm('');
                        setShowSuggestions(false);
                      }
                    }}
                  >
                    View all results
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Side - Wishlist, Cart & User */}
          <div className="d-flex align-items-center">
            {/* Wishlist Icon - Added here next to cart */}
            {user && (
              <Link to="/wishlist" className="nav-icon-link position-relative me-3" title="Wishlist">
                <FaHeart />
              </Link>
            )}
            
            {/* Cart Icon */}
            <Link to="/cart" className="nav-icon-link position-relative me-3" title="Shopping Cart">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-success dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser className="me-2" />
                  <span className="d-none d-md-inline">{user.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <FaUser className="me-2" /> My Profile
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item" to="/admin">
                        <FaUserCog className="me-2" /> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline-success me-2">Login</Link>
                <Link to="/register" className="btn btn-success d-none d-md-inline">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Bar - Mobile */}
      <div className="container mt-2 d-md-none">
        <div className="search-container" ref={searchRef}>
          <form className="search-form w-100" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search products..."
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchTerm.trim().length > 1) {
                    setShowSuggestions(true);
                  }
                }}
              />
              <button className="btn btn-outline-success" type="submit">
                <FaSearch />
              </button>
            </div>
            
            {/* Search Suggestions - Mobile */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(product => (
                  <div 
                    key={product._id} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(product._id)}
                  >
                    <img 
                      src={product.imageUrl || product.image} 
                      alt={product.name} 
                      className="suggestion-image" 
                    />
                    <div className="suggestion-details">
                      <div className="suggestion-name">{product.name}</div>
                      <div className="suggestion-price">
                        ${product.discount > 0 
                          ? ((product.price - (product.price * product.discount / 100)).toFixed(2)) 
                          : product.price.toFixed(2)
                        }
                      </div>
                    </div>
                  </div>
                ))}
                <div 
                  className="suggestion-view-all"
                  onClick={() => {
                    if (searchTerm.trim()) {
                      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
                      setSearchTerm('');
                      setShowSuggestions(false);
                    }
                  }}
                >
                  View all results
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
