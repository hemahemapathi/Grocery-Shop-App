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
    
    // Show limited page numbers for better mobile display
    const maxPagesToShow = window.innerWidth < 768 ? 3 : 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant="outline-primary"
          size="sm"
          onClick={() => setCurrentPage(1)}
          className="mx-1 pagination-btn"
        >
          1
        </Button>
      );
      
      // Ellipsis if needed
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="mx-1">...</span>);
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? 'primary' : 'outline-primary'}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className="mx-1 pagination-btn"
        >
          {i}
        </Button>
      );
    }
    
    // Last page
    if (endPage < totalPages) {
      // Ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="mx-1">...</span>);
      }
      
      pages.push(
        <Button
          key={totalPages}
          variant="outline-primary"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          className="mx-1 pagination-btn"
        >
          {totalPages}
        </Button>
      );
    }
    
    return (
      <div className="d-flex justify-content-center mt-4 pagination-container">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mx-1 pagination-btn"
        >
          Prev
        </Button>
        
        <div className="d-none d-md-flex">
          {pages}
        </div>
        
        <div className="d-flex d-md-none">
          <span className="mx-2 pagination-info">
            {currentPage} / {totalPages}
          </span>
        </div>
        
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="mx-1 pagination-btn"
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="product-list-container py-3 admin-container super-compact-product-list">
      <Row className="align-items-center mb-3">
        <Col>
          <h2 className="mb-0 product-list-title">Products</h2>
        </Col>
        <Col className="text-end">
          <Button 
            variant="primary" 
            className="add-product-btn btn-sm"
            onClick={createProductHandler}
          >
            <FaPlus className="me-2" /> <span className="btn-text">Create Product</span>
          </Button>
        </Col>
      </Row>
      
      {/* Search and Filter Bar */}
      <Card className="mb-4 filter-card">
        <Card.Body className="p-3 p-md-4">
          <Row className="align-items-center">
            <Col md={6}>
              <InputGroup className="mb-2 mb-md-0">
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  name="search"
                  value={filter.search}
                  onChange={handleFilterChange}
                  size="sm"
                />
                <Button variant="outline-secondary" size="sm" onClick={applyFilters}>
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>
            
            <Col md={6} className="d-flex justify-content-end">
              <Button 
                variant="outline-secondary" 
                className="me-2 filter-btn"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="me-1" /> <span className="btn-text">Filters</span>
              </Button>
              
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort" size="sm" className="sort-btn">
                  <FaSortAmountDown className="me-1" /> <span className="btn-text">Sort</span>
                </Dropdown.Toggle>
                
                <Dropdown.Menu align="end" className="sort-dropdown-menu">
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
            <Row className="mt-3 filter-options">
              <Col md={3} sm={6} className="mb-2">
                <Form.Group className="mb-2">
                  <Form.Label className="filter-label">Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={filter.category}
                    onChange={handleFilterChange}
                    size="sm"
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
              
              <Col md={3} sm={6} className="mb-2">
                <Form.Group className="mb-2">
                  <Form.Label className="filter-label">Min Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    name="minPrice"
                    value={filter.minPrice}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3} sm={6} className="mb-2">
                <Form.Group className="mb-2">
                  <Form.Label className="filter-label">Max Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    name="maxPrice"
                    value={filter.maxPrice}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3} sm={6} className="mb-2">
                <Form.Group className="mb-2 mt-md-4 stock-check">
                  <Form.Check
                    type="checkbox"
                    label="In Stock Only"
                    name="inStock"
                    checked={filter.inStock}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={12} className="d-flex justify-content-end mt-2">
                <Button variant="secondary" size="sm" onClick={resetFilters} className="me-2">
                  Reset
                </Button>
                <Button variant="primary" size="sm" onClick={applyFilters}>
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
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="product-table compact-table mb-0">
                  <thead>
                    <tr>
                      <th className="id-col">ID</th>
                      <th className="img-col">Image</th>
                      <th>Name</th>
                      <th className="category-col">Category</th>
                      <th className="price-col">Price</th>
                      <th className="stock-col">Stock</th>
                      <th className="features-col">Features</th>
                      <th className="actions-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="id-col">{product._id.substring(product._id.length - 6)}</td>
                        <td className="img-col">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="product-thumbnail" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/images/products/default.jpg';
                            }}
                                                    />
                        </td>
                        <td>
                          <span className="product-name">{product.name}</span>
                        </td>
                        <td className="category-col">{product.category}</td>
                        <td className="price-col">${product.price.toFixed(2)}</td>
                        <td className="stock-col">
                          <Badge bg={product.countInStock > 0 ? 'success' : 'danger'}>
                            {product.countInStock}
                          </Badge>
                        </td>
                        <td className="features-col">
                          {product.featured && (
                            <Badge bg="info" className="me-1">Featured</Badge>
                          )}
                          {product.organic && (
                            <Badge bg="success" className="me-1">Organic</Badge>
                          )}
                        </td>
                        <td className="actions-col">
                          <div className="d-flex">
                            <Link 
                              to={`/admin/products/${product._id}/edit`} 
                              className="btn btn-sm btn-info me-2 action-btn"
                            >
                              <FaEdit />
                            </Link>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => deleteProductHandler(product._id)}
                              className="action-btn"
                            >
                              <FaTrash />
                            </Button>
                          </div>
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

