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


useEffect(() => {
  
  if (typeof bootstrap !== 'undefined') {
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    dropdownElementList.forEach(dropdownToggleEl => {
      new bootstrap.Dropdown(dropdownToggleEl);
    });
  }
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

  // Auto-close navbar on link click for mobile
  useEffect(() => {
    // Get all nav links
    const navLinks = document.querySelectorAll('.navbar-nav a.nav-link, .navbar-nav .dropdown-item, .navbar-brand, .auth-buttons .btn');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    const closeNavbar = () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
        if (navbarToggler) {
          navbarToggler.classList.add('collapsed');
          navbarToggler.setAttribute('aria-expanded', 'false');
        }
      }
    };
    
    // Add click event to all nav links
    navLinks.forEach(link => {
      link.addEventListener('click', closeNavbar);
    });
    
    // Cleanup
    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', closeNavbar);
      });
    };
  }, []);

  // Function to close the navbar manually
  const closeNavbar = () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
      if (navbarToggler) {
        navbarToggler.classList.add('collapsed');
        navbarToggler.setAttribute('aria-expanded', 'false');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeNavbar(); // Close navbar is handled by the useEffect
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
      closeNavbar(); // Close navbar after search
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm('');
    setShowSuggestions(false);
    closeNavbar(); // Close navbar after clicking suggestion
  };

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
    closeNavbar(); // Close navbar after clicking category
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
    onClick={(e) => {
      // Prevent navigation
      e.preventDefault();
      // Toggle dropdown manually if Bootstrap JS is not available
      if (typeof bootstrap === 'undefined') {
        const dropdownMenu = e.currentTarget.nextElementSibling;
        if (dropdownMenu) {
          dropdownMenu.classList.toggle('show');
        }
      }
    }}
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
              onClick={() => closeNavbar()}
            >
              {category._id} ({category.count})
            </Link>
          </li>
        ))}
        <li><hr className="dropdown-divider" /></li>
      </>
    ) : (
      <>
        <li><Link className="dropdown-item" to="/products?category=Fruits" onClick={() => closeNavbar()}>Fruits</Link></li>
        <li><Link className="dropdown-item" to="/products?category=Vegetables" onClick={() => closeNavbar()}>Vegetables</Link></li>
        <li><Link className="dropdown-item" to="/products?category=Dairy" onClick={() => closeNavbar()}>Dairy</Link></li>
        <li><Link className="dropdown-item" to="/products?category=Bakery" onClick={() => closeNavbar()}>Bakery</Link></li>
        <li><hr className="dropdown-divider" /></li>
      </>
    )}
    <li><Link className="dropdown-item" to="/products" onClick={() => closeNavbar()}>All Products</Link></li>
  </ul>
</li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact') ? 'active' : ''}`} to="/contact">Contact</Link>
            </li>
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
              <Link to="/wishlist" className="nav-icon-link position-relative me-3" title="Wishlist" onClick={() => closeNavbar()}>
                <FaHeart />
              </Link>
            )}
            
            {/* Cart Icon */}
            <Link to="/cart" className="nav-icon-link position-relative me-3" title="Shopping Cart" onClick={() => closeNavbar()}>
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
                    <Link className="dropdown-item" to="/profile" onClick={() => closeNavbar()}>
                      <FaUser className="me-2" /> My Profile
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item" to="/admin" onClick={() => closeNavbar()}>
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
                <Link to="/login" className="btn btn-outline-success me-2" onClick={() => closeNavbar()}>Login</Link>
                <Link to="/register" className="btn btn-success d-none d-md-inline" onClick={() => closeNavbar()}>Register</Link>
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
                      closeNavbar();
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

