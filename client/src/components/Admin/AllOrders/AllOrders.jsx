import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Form, Badge, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaCalendarAlt, FaEye, FaEdit, FaTrash, FaSync } from 'react-icons/fa';
import api from '../../../services/api';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './AllOrders.css';

const AllOrders = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(9);
  
  // Filters
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    minAmount: '',
    maxAmount: '',
    keyword: ''
  });

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, orders]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      
      const { data } = await api.get('/orders');
      
      // Handle different response formats
      const ordersData = Array.isArray(data) ? data : (data?.orders || []);
      
      // Sort orders by date (newest first)
      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...orders];
    
    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(order => new Date(order.createdAt) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(order => new Date(order.createdAt) <= toDate);
    }
    
    // Filter by status
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    
    // Filter by amount range
    if (filters.minAmount) {
      const minAmount = parseFloat(filters.minAmount);
      result = result.filter(order => parseFloat(order.totalPrice) >= minAmount);
    }
    
    if (filters.maxAmount) {
      const maxAmount = parseFloat(filters.maxAmount);
      result = result.filter(order => parseFloat(order.totalPrice) <= maxAmount);
    }
    
    // Filter by keyword (order ID or customer name)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(order => 
        order._id.toLowerCase().includes(keyword) || 
        (order.user?.name && order.user.name.toLowerCase().includes(keyword))
      );
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      minAmount: '',
      maxAmount: '',
      keyword: ''
    });
  };

  const exportToCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Date,Customer,Total,Status\n";
    
    filteredOrders.forEach(order => {
      const row = [
        order._id,
        new Date(order.createdAt).toLocaleDateString(),
        order.user?.name || 'N/A',
        `${order.totalPrice.toFixed(2)}`,
        order.status
      ].join(",");
      csvContent += row + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `all_orders_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'Processing':
        return <Badge bg="info">Processing</Badge>;
      case 'Shipped':
        return <Badge bg="primary">Shipped</Badge>;
      case 'Delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'Cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="all-orders-container super-compact-orders">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/admin/revenue" className="btn btn-light btn-sm mb-2">
            <FaArrowLeft className="me-1" /> <span className="back-text">Back to Revenue</span>
          </Link>
          <h2 className="mb-0 page-title">All Orders</h2>
        </div>
        <div>
          <Button variant="outline-primary" size="sm" className="me-2 refresh-btn" onClick={fetchAllOrders}>
            <FaSync className="me-1" /> <span className="refresh-text">Refresh</span>
          </Button>
          <Button 
            variant="success" 
            size="sm" 
            className="export-btn" 
            onClick={exportToCSV}
            disabled={filteredOrders.length === 0}
          >
            <FaDownload className="me-1" /> <span className="export-text">Export</span>
          </Button>
        </div>
      </div>
      
      {error && <Message variant="danger">{error}</Message>}
      
      {/* Filters */}
      <Card className="mb-3 filter-card">
        <Card.Body className="p-3">
          <h6 className="mb-3 filter-title"><FaCalendarAlt className="me-1" /> Filter Orders</h6>
          <Row className="g-2">
            <Col md={3} sm={6} xs={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">From Date:</Form.Label>
                <Form.Control
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  size="sm"
                  className="date-input"
                />
              </Form.Group>
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">To Date:</Form.Label>
                <Form.Control
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  size="sm"
                  className="date-input"
                />
              </Form.Group>
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">Status:</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  size="sm"
                  className="status-select"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">Search:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Order ID or Customer"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  size="sm"
                  className="search-input"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="g-2">
            <Col md={3} sm={6} xs={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">Min Amount ($):</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Min"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  size="sm"
                  className="amount-input"
                />
              </Form.Group>
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small-label">Max Amount ($):</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Max"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  size="sm"
                  className="amount-input"
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end justify-content-end">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={resetFilters}
                className="me-2 reset-btn"
              >
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Orders Table */}
      <Card className="orders-table-card">
        <Card.Header className="py-2 px-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 table-title">
              Orders List 
              
            </h5>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-3">
              <Message>No orders found matching your filters</Message>
            </div>
          ) : (
            <>
             <div className="table-responsive">
  <Table hover className="compact-table mb-0">
    <thead>
      <tr>
        <th>Order ID</th>
        <th className="date-col">Date</th>
        <th className="customer-col">Customer</th>
        <th>Total</th>
        <th>Status</th>
        <th className="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentOrders.map((order) => (
        <tr key={order._id}>
          <td>#{order._id.substring(order._id.length - 6)}</td>
          <td className="date-col">{new Date(order.createdAt).toLocaleDateString()}</td>
          <td className="customer-col">{order.user?.name || 'N/A'}</td>
          <td>${order.totalPrice.toFixed(2)}</td>
          <td>{getStatusBadge(order.status)}</td>
          <td className="text-center">
            <div className="d-flex justify-content-center gap-1">
              <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-outline-primary view-btn">
                <FaEye />
              </Link>
              <Link to={`/admin/orders/${order._id}/edit`} className="btn btn-sm btn-outline-info edit-btn">
                <FaEdit />
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>

              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container p-2">
                  <Pagination size="sm">
                    <Pagination.First 
                      onClick={() => paginate(1)} 
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => paginate(currentPage - 1)} 
                      disabled={currentPage === 1}
                    />
                    
                    {/* Show limited page numbers with ellipsis */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      
                      // Show first page, last page, and pages around current page
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <Pagination.Item
                            key={pageNumber}
                            active={pageNumber === currentPage}
                            onClick={() => paginate(pageNumber)}
                          >
                            {pageNumber}
                          </Pagination.Item>
                        );
                      }
                      
                      // Show ellipsis
                      if (
                        (pageNumber === 2 && currentPage > 3) ||
                        (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return <Pagination.Ellipsis key={pageNumber} />;
                      }
                      
                      return null;
                    })}
                    
                    <Pagination.Next 
                      onClick={() => paginate(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => paginate(totalPages)} 
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                  
                  <div className="pagination-info">
                    Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                  </div>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AllOrders;

