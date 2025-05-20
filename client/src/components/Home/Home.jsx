import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaLeaf, FaTruck, FaMoneyBillWave, FaMobileAlt, FaStar, FaShieldAlt, FaHeadset, FaUserFriends, FaArrowUp,FaRegStar  } from 'react-icons/fa';
import ProductContext from '../../context/ProductContext';
import { useCart } from '../../context/CartContext'; 
import './Home.css';

const Home = () => {
  const { 
    categories, 
    loading, 
    getFeaturedProducts, 
    getCategories,
    getProducts,
    calculateDiscountedPrice,
    featuredProducts,
    products,
    getTopReviews 
  } = useContext(ProductContext);
  const { addToCart } = useCart();
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(true);
  const [customerReviews, setCustomerReviews] = useState([]); 
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
   
  
  useEffect(() => {
    // Fetch categories
    getCategories();
    
    // Fetch featured products first
    const fetchProducts = async () => {
      setLoadingBestsellers(true);
      await getFeaturedProducts(4);
      
      // If no featured products, fetch regular products as fallback
      if (!featuredProducts || featuredProducts.length === 0) {
        await getProducts(1, { limit: 4, sort: '-rating' });
      }
      setLoadingBestsellers(false);
    };

      // Fetch top reviews
    const fetchReviews = async () => {
      setLoadingReviews(true);
      const reviews = await getTopReviews(3);
      setCustomerReviews(reviews);
      setLoadingReviews(false);
    };
    
    fetchProducts();
     fetchReviews();
  }, [getFeaturedProducts, getCategories, getProducts , getTopReviews]);
  
  // Update bestseller products whenever featuredProducts or products change
  useEffect(() => {
    if (featuredProducts && featuredProducts.length > 0) {
      setBestsellerProducts(featuredProducts);
    } else if (products && products.length > 0) {
      // Use the top-rated products as bestsellers
      const sortedProducts = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setBestsellerProducts(sortedProducts.slice(0, 4));
    } else {
      setBestsellerProducts([]);
    }
  }, [featuredProducts, products]);

  // Helper function to render star ratings
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="stars mb-3">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-warning" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-warning" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-warning" />
        ))}
      </div>
    );
  };

   // Add this new useEffect hook to handle scroll position
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

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 animate__animated animate__fadeInLeft">
              <h1 className="hero-title">Fresh Groceries Delivered to Your Doorstep </h1>
              
              <p className="hero-subtitle">
                Shop from our wide selection of fresh, organic produce and everyday essentials.
              </p>
              <div className="hero-buttons">
                <Link to="/products" className="btn btn-success btn-lg me-3">
                  Shop Now
                </Link>
                <Link to="/contact" className="btn btn-outline-success btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="col-lg-6 animate__animated animate__fadeInRight">
              <img
                src="/assets/images/home.jpeg"
                alt="Fresh groceries"
                className="img-fluid hero-image rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaLeaf />
                </div>
                <h3>Fresh & Organic</h3>
                <p>We source the freshest, organic produce directly from local farmers.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaTruck />
                </div>
                <h3>Free Delivery</h3>
                <p>Free delivery on orders over $50. Fast and reliable shipping.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaMoneyBillWave />
                </div>
                <h3>Best Prices</h3>
                <p>We offer competitive prices on our 100+ products range.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>Why Choose Us</h2>
            <p>We offer the best shopping experience</p>
          </div>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="why-choose-card text-center">
                <FaShieldAlt className ="why-choose-icon" />
                <h4>Secure Shopping</h4>
                <p>100% secure payment</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="why-choose-card text-center">
                <FaHeadset className="why-choose-icon" />
                <h4>24/7 Support</h4>
                <p>Dedicated support team</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="why-choose-card text-center">
                <FaUserFriends className="why-choose-icon" />
                <h4>Trusted Service</h4>
                <p>1M+ satisfied customers</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="why-choose-card text-center">
                <FaLeaf className="why-choose-icon" />
                <h4>Quality Products</h4>
                <p>100% quality guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5 bg-light">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>Shop by Category</h2>
            <p>Browse our wide selection of fresh products</p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* Show only the first 4 categories */}
              {categories.slice(0, 4).map((category) => (
                <div key={category._id} className="col-6 col-sm-6 col-md-3 mb-4">
                  <Link to={`/products?category=${category._id}`} className="category-card">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="category-img-container">
                        <img
                          src={`/assets/images/categories/${category._id.toLowerCase()}.avif`}
                          className="card-img-top"
                          alt={category._id}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/images/categories/default.jpg';
                          }}
                        />
                      </div>
                      <div className="card-body text-center">
                        <h5 className="card-title">{category._id}</h5>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-outline-success">
              View All Categories <FaArrowRight className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bestseller Products Section */}
      <section className="recent-products-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>BestSeller Products</h2>
            <p>Check out our latest additions</p>
          </div>

          {loadingBestsellers ? (
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {bestsellerProducts && bestsellerProducts.length > 0 ? (
                <div className="row">
                  {bestsellerProducts.map((product) => (
                    <div key={product._id} className="col-6 col-sm-6 col-md-3 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={product.image}
                            className="card-img-top"
                            alt={product.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/images/products/default.jpg';
                            }}
                          />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text">
                            ${calculateDiscountedPrice(product.price, product.discount)}
                            {product.discount > 0 && (
                              <small className="text-muted text-decoration-line-through ms-2">
                                ${product.price}
                              </small>
                            )}
                          </p>
                          <button
                            className="btn btn-success w-100"
                            onClick={() => addToCart(product._id, 1)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p>No bestseller products available at the moment.</p>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-outline-success">
              View All Products <FaArrowRight className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

              {/* Customer Reviews Section */}
      <section className="reviews-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>What Our Customers Say </h2>
            <p>Real feedback from real customers</p>
          </div>
          
          {loadingReviews ? (
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading reviews...</span>
              </div>
            </div>
          ) : customerReviews.length > 0 ? (
            <div className="row">
              {customerReviews.map((review, index) => (
                <div className="col-md-4 mb-4" key={review.reviewId || index}>
                  <div className="review-card text-center p-4 shadow-sm">
                    {renderStarRating(review.rating)}
                    <p className="review-text">"{review.comment}"</p>
                    <h5 className="reviewer-name">{review.reviewer}</h5>
                    <p className="product-name text-muted">
                      <small>
                        Review for <Link to={`/product/${review.productId}`}>{review.productName}</Link>
                      </small>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p>No customer reviews yet. Be the first to leave a review!</p>
              <Link to="/products" className="btn btn-outline-success mt-3">
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </section>
  
      {/* Mobile App Section */}
      <section className="mobile-app-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2>Download Our Mobile App</h2>
              <p className="mb-4">Shop on the go with our easy-to-use mobile app. Get exclusive app-only offers and track your orders in real-time.</p>
              <div className="d-flex gap-3">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/images/app store.png" alt="App Store" height="52" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/images/goo.png" alt="Play Store" height="50" />
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="/assets/images/mobile.avif" alt="Mobile App" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
  

      {/* Newsletter Section */}
      <section className="newsletter-section py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="newsletter-container text-center">
                <h3>Subscribe to Our Newsletter                   <img src="/assets/images/subscribe.png" alt="Subscribe" height="30" /></h3>
                <p className="mb-4">Get the latest updates, deals and exclusive offers directly to your inbox.</p>
                <form className="newsletter-form">
                  <div className="input-group mb-3">
                                        <input
                      type="email"
                      className="form-control"
                      placeholder="Your email address"
                      aria-label="Your email address"
                    />
                    <button className="btn btn-success" type="submit">Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
             {showScrollButton && (
        <div className="floating-action-container">
          <button 
            className="floating-action-button shadow"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <FaArrowUp />
          </button>
        </div>
      )}
    </div>
    
  );
};

export default Home;

