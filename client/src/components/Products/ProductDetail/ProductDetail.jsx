import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Image, 
  ListGroup, 
  Card, 
  Button, 
  Form, 
  Container,
  Alert,
  Tabs,
  Tab
} from 'react-bootstrap';
import axios from 'axios';
import { formatCurrency } from '../../../utils/helpers';
import { useCart } from '../../../context/CartContext'; 
import AuthContext from '../../../context/AuthContext';
import api from '../../../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Use the actual auth context
  const isLoggedIn = !!user;
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data);
      if (data && data.category) {
        fetchRelatedProducts(data.category);
      }
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching product');
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const { data } = await api.get(`/api/products?category=${category}&limit=4`);
      // Check if data.products exists before filtering
      if (data && data.products) {
        // Filter out the current product
        const filtered = data.products.filter(p => p._id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      } else if (data && Array.isArray(data)) {
        // If data is directly an array of products
        const filtered = data.filter(p => p._id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      } else {
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
      setRelatedProducts([]);
    }
  };

  const addToCartHandler = () => {
    addToCart(id, quantity);
    console.log(`Add to cart: ${id}, quantity: ${quantity}`);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setReviewError('Please log in to submit a review');
      return;
    }
    
    try {
      setReviewError('');
      setReviewSuccess('');
      
      await api.post(
        `/products/${id}/reviews`,
        { rating, comment }
      );
      
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      fetchProduct(); // Refresh to show the new review
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="info">Product not found</Alert>
      </Container>
    );
  }

  // Calculate discounted price safely
  const discountedPrice = product.price && product.discount 
    ? (product.price - (product.price * product.discount / 100)).toFixed(2)
    : product.price ? product.price.toFixed(2) : '0.00';

  return (
    <Container className="py-5">
      <Link to="/products" className="btn btn-light mb-4">
        <i className="bi bi-arrow-left"></i> Back to Products
      </Link>
      
      <Row>
        <Col md={5} className="mb-4">
          <div className="position-relative">
            <Image 
              src={product.image} 
              alt={product.name} 
              fluid 
              className="product-detail-image shadow-sm rounded"
            />
            {product.discount > 0 && (
              <div className="position-absolute top-0 start-0 bg-danger text-white py-1 px-2 m-2 rounded">
                {product.discount}% OFF
              </div>
            )}
            {product.isOrganic && (
              <div className="position-absolute top-0 end-0 bg-success text-white py-1 px-2 m-2 rounded">
                Organic
              </div>
            )}
          </div>
        </Col>
        
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
              <div className="d-flex align-items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`bi ${i < Math.round(product.rating || 0) 
                      ? 'bi-star-fill text-warning' 
                      : 'bi-star text-secondary'}`}
                  ></i>
                ))}
                <span className="ms-2 text-muted">
                  {(product.rating || 0).toFixed(1)} ({product.numReviews || 0} reviews)
                </span>
              </div>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <Row>
                <Col>Category:</Col>
                <Col><strong>{product.category}</strong></Col>
              </Row>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <Row>
                <Col>Brand:</Col>
                <Col><strong>{product.brand}</strong></Col>
              </Row>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <Row>
                <Col>Unit:</Col>
                <Col><strong>{product.unit}</strong></Col>
              </Row>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h4 className="mb-3">Description</h4>
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      {product.discount > 0 ? (
                        <div>
                          <span className="text-decoration-line-through text-muted me-2">
                            ${product.price ? product.price.toFixed(2) : '0.00'}
                          </span>
                          <span className="fw-bold text-danger">
                            ${discountedPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="fw-bold">
                          ${product.price ? product.price.toFixed(2) : '0.00'}
                        </span>
                      )}
                      <div className="text-muted small">
                        per {product.unit}
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <span className="text-success">In Stock</span>
                      ) : (
                        <span className="text-danger">Out of Stock</span>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Quantity:</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                          {[...Array(Math.min(10, product.countInStock)).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                
                <ListGroup.Item>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="mt-2 w-100"
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                  >
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col>
          <Tabs defaultActiveKey="reviews" className="mb-3">
            <Tab eventKey="reviews" title="Reviews">
              <Row>
                <Col md={6}>
                  <h4 className="mb-3">Customer Reviews</h4>
                  {!product.reviews || product.reviews.length === 0 ? (
                    <Alert variant="info">No reviews yet</Alert>
                  ) : (
                    <ListGroup variant="flush">
                      {product.reviews.map((review) => (
                        <ListGroup.Item key={review._id}>
                          <div className="d-flex justify-content-between">
                            <strong>{review.name}</strong>
                            <span className="text-muted">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="my-2">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`bi ${i < review.rating 
                                  ? 'bi-star-fill text-warning' 
                                  : 'bi-star text-secondary'}`}
                              ></i>
                            ))}
                          </div>
                          <p>{review.comment}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Col>
                
                <Col md={6}>
                  <h4 className="mb-3">Write a Review</h4>
                  
                  {reviewSuccess && (
                    <Alert variant="success">{reviewSuccess}</Alert>
                  )}
                  
                  {reviewError && (
                    <Alert variant="danger">{reviewError}</Alert>
                  )}
                  
                  {!isLoggedIn ? (
                    <Alert variant="info">
                      Please{' '}
                      <Link to={`/login?redirect=/product/${id}`}>
                        sign in
                      </Link>{' '}
                      to write a review
                    </Alert>
                  ) : (
                    <Form onSubmit={submitReviewHandler}>
                      <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </Form.Control>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Write your review here..."
                          required
                        />
                      </Form.Group>
                      
                      <Button type="submit" variant="primary">
                        Submit Review
                      </Button>
                    </Form>
                  )}
                </Col>
              </Row>
            </Tab>
            
            <Tab eventKey="specifications" title="Specifications">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col md={3} className="fw-bold">Brand</Col>
                    <Col md={9}>{product.brand}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={3} className="fw-bold">Category</Col>
                    <Col md={9}>{product.category}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={3} className="fw-bold">Unit</Col>
                    <Col md={9}>{product.unit}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={3} className="fw-bold">Organic</Col>
                    <Col md={9}>{product.isOrganic ? 'Yes' : 'No'}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4">Related Products</h3>
          <Row>
            {relatedProducts.map((relatedProduct) => (
              <Col key={relatedProduct._id} sm={6} md={3} className="mb-3">
                <Card className="h-100 shadow-sm">
                                      <Link to={`/product/${relatedProduct._id}`}>
                    <Card.Img 
                      variant="top" 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name} 
                      className="related-product-img"
                    />
                  </Link>
                  <Card.Body>
                    <Link 
                      to={`/product/${relatedProduct._id}`} 
                      className="text-decoration-none"
                    >
                      <Card.Title as="h6">{relatedProduct.name}</Card.Title>
                    </Link>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      {relatedProduct.discount > 0 ? (
                        <div>
                          <span className="text-decoration-line-through text-muted me-1 small">
                            ${relatedProduct.price ? relatedProduct.price.toFixed(2) : '0.00'}
                          </span>
                          <span className="fw-bold text-danger">
                            ${relatedProduct.price && relatedProduct.discount ? 
                              (relatedProduct.price - (relatedProduct.price * relatedProduct.discount / 100)).toFixed(2) : 
                              relatedProduct.price ? relatedProduct.price.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      ) : (
                        <span className="fw-bold">
                          ${relatedProduct.price ? relatedProduct.price.toFixed(2) : '0.00'}
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="mt-2 w-100"
                      onClick={() => addToCart(relatedProduct._id, 1)}
                      disabled={relatedProduct.countInStock === 0}
                    >
                      {relatedProduct.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default ProductDetail;
