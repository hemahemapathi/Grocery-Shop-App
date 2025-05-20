import { useEffect, useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Breadcrumb,
  Spinner
} from 'react-bootstrap';
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from 'react-icons/fa';
import ProductContext from '../../../context/ProductContext';
import CartContext from '../../../context/CartContext';
import './CategoryProducts.css';

const CategoryProducts = () => {
  const { category } = useParams();
  const {
    products,
    loading,
    error,
    getProductsByCategory,
    pages,
    calculateDiscountedPrice
  } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (category) getProductsByCategory(category, currentPage);
    window.scrollTo(0, 0);
  }, [category, currentPage]);

  const handleAddToCart = p => addToCart(p, 1);

  const renderRating = rating => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`f${i}`} />);
    if (half) stars.push(<FaStarHalfAlt key="half" />);
    for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`e${i}`} />);
    return stars;
  };

  const changePage = n => setCurrentPage(n);

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" variant="success" />
    </Container>
  );
  if (error) return (
    <Container className="py-5">
      <div className="alert alert-danger">{error}</div>
    </Container>
  );

  return (
    <Container className="py-5">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to="/products">Products</Breadcrumb.Item>
        <Breadcrumb.Item active>{category}</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4">{category} Products</h1>

      {products.length === 0
        ? <div className="alert alert-info">No products found.</div>
        : <>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {products.map(p => (
                <Col key={p._id}>
                  <Card className="h-100 product-card position-relative">
                    {p.discount > 0 && (
                      <div className="discount-badge">-{p.discount}%</div>
                    )}
                    <Link to={`/product/${p._id}`}>
                      <Card.Img
                        variant="top"
                        src={p.imageUrl || p.image}
                        alt={p.name}
                        className="product-image"
                      />
                    </Link>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title as="h5" className="product-title">
                        <Link
                          to={`/product/${p._id}`}
                          className="stretched-link text-decoration-none text-dark"
                        >
                          {p.name}
                        </Link>
                      </Card.Title>

                      <div className="mb-2 d-flex align-items-center">
                        {renderRating(p.rating)}
                        <small className="ms-1 text-muted">
                          ({p.numReviews})
                        </small>
                      </div>

                      <small className="text-muted mb-3">{p.brand}</small>

                      <div className="mt-auto">
                        <div className="d-flex align-items-center mb-2">
                          {p.discount > 0 ? (
                            <>
                              <span className="text-danger fw-bold me-2">
                                ${calculateDiscountedPrice(p.price, p.discount)}
                              </span>
                              <span className="text-muted text-decoration-line-through">
                                ${p.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="fw-bold">
                              ${p.price.toFixed(2)}
                            </span>
                          )}
                          <small className="ms-auto text-muted">
                            {p.unit}
                          </small>
                        </div>

                        <div className="d-flex">
                          <Button
                            variant="outline-success"
                            className="w-100 me-2"
                            onClick={() => handleAddToCart(p)}
                            disabled={p.countInStock === 0}
                          >
                            <FaShoppingCart className="me-1" />
                            {p.countInStock === 0 ? 'Out of Stock' : 'Add'}
                          </Button>
                          <Button variant="outline-danger" className="wishlist-btn">
                            <FaHeart />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {pages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                    <button
                      className="page-link"
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(pages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i+1 && 'active'}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => changePage(i+1)}
                      >
                        {i+1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === pages && 'disabled'}`}>
                    <button
                      className="page-link"
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === pages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
      }
    </Container>
  );
};

export default CategoryProducts;