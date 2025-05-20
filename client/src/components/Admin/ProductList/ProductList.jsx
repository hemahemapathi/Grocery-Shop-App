import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Row, Col, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './ProductList.css';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Filtering and pagination
  const [filter, setFilter] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });
  const [sort, setSort] = useState('-createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage, sort]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/products/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query string for filtering
      let queryParams = `?page=${currentPage}&limit=${itemsPerPage}&sort=${sort}`;
      
      if (filter.search) {
        queryParams += `&keyword=${filter.search}`;
      }
      
      if (filter.category) {
        queryParams += `&category=${filter.category}`;
      }
      
      if (filter.minPrice) {
        queryParams += `&minPrice=${filter.minPrice}`;
      }
      
      if (filter.maxPrice) {
        queryParams += `&maxPrice=${filter.maxPrice}`;
      }
      
      if (filter.inStock) {
        queryParams += `&countInStock[gt]=0`;
      }
      
      const { data } = await api.get(`/products${queryParams}`);
      
      // Handle different response formats
      if (data && data.products) {
        setProducts(data.products);
        setTotalPages(data.pages || 1);
      } else {
        setProducts(Array.isArray(data) ? data : []);
        setTotalPages(1);
      }
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const resetFilters = () => {
    setFilter({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false
    });
    setCurrentPage(1);
    setSort('-createdAt');
    
    // Use setTimeout to ensure state updates before fetching
    setTimeout(() => {
      fetchProducts();
    }, 0);
  };

  const handleSort = (sortField) => {
    // Toggle between ascending and descending
    const newSort = sort === sortField ? `-${sortField}` : sortField;
    setSort(newSort);
  };

  const deleteProductHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const createProductHandler = () => {
    navigate('/admin/products/create');
  };

  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? 'primary' : 'outline-primary'}
          onClick={() => setCurrentPage(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }
    
    return (
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="outline-primary"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mx-1"
        >
          Previous
        </Button>
        
        {pages}
        
        <Button
          variant="outline-primary"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="mx-1"
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="product-list-container py-3 admin-container">
      <Row className="align-items-center mb-3">

        <Col>
          <h2 className="mb-0">Products</h2>
        </Col>
        <Col className="text-end">
          <Button 
            variant="primary" 
            className="add-product-btn btn-sm"
            onClick={createProductHandler}
          >
            <FaPlus className="me-2" /> Create Product
          </Button>
        </Col>
      </Row>
      
      {/* Search and Filter Bar */}
      <Card className="mb-4 filter-card">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  name="search"
                  value={filter.search}
                  onChange={handleFilterChange}
                />
                <Button variant="outline-secondary" onClick={applyFilters}>
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>
            
            <Col md={6} className="d-flex justify-content-end">
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="me-1" /> Filters
              </Button>
              
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                  <FaSortAmountDown className="me-1" /> Sort
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSort('name')}>
                    Name (A-Z)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('-name')}>
                    Name (Z-A)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('price')}>
                    Price (Low to High)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('-price')}>
                    Price (High to Low)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('-createdAt')}>
                    Newest First
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('createdAt')}>
                    Oldest First
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          
          {showFilters && (
            <Row className="mt-3">
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={filter.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category._id}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    name="minPrice"
                    value={filter.minPrice}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    name="maxPrice"
                    value={filter.maxPrice}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3 mt-4">
                  <Form.Check
                    type="checkbox"
                    label="In Stock Only"
                    name="inStock"
                    checked={filter.inStock}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={12} className="d-flex justify-content-end">
                <Button variant="secondary" onClick={resetFilters} className="me-2">
                  Reset
                </Button>
                <Button variant="primary" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
      
      {/* Products Table */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products.length === 0 ? (
        <Message>No products found</Message>
      ) : (
        <>
          <Card className="data-card">
        <Card.Body className="p-2">
          <div className="table-responsive">
            <Table hover className="product-table compact-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Features</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id.substring(product._id.length - 6)}</td>
                      <td>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="product-thumbnail" 
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>
                        {product.discount > 0 ? (
                          <>
                            <span className="text-decoration-line-through text-muted me-2">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-danger">
                              ${(product.price - (product.price * product.discount / 100)).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span>${product.price.toFixed(2)}</span>
                        )}
                      </td>
                      <td>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">{product.countInStock} in stock</Badge>
                        ) : (
                          <Badge bg="danger">Out of stock</Badge>
                        )}
                      </td>
                      <td>
                        {product.isOrganic && <Badge bg="success" className="me-1">Organic</Badge>}
                        {product.discount > 0 && <Badge bg="danger">{product.discount}% OFF</Badge>}
                      </td>
                      <td>
                        <Link 
                          to={`/admin/products/${product._id}/edit`} 
                          className="btn btn-sm btn-primary me-2"
                        >
                          <FaEdit />
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteProductHandler(product._id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              </div>
            </Card.Body>
          </Card>
          
          {/* Pagination */}
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default ProductList;