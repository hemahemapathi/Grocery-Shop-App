import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Tab, Nav, Alert } from 'react-bootstrap';
import { FaUser, FaShoppingBag, FaHeart, FaAddressCard, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState(null);
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Initialize profile data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
      
      fetchOrders();
      fetchFavorites();
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Use the updateProfile function from the context
      const success = await updateProfile(profileData);
      
      if (success) {
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Don't show error toast as the user might not have any orders
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };
  
  const fetchFavorites = async () => {
    try {
      setLoadingFavorites(true);
      try {
        const { data } = await api.get('/auth/favorites');
        setFavorites(data);
      } catch (err) {
        // If endpoint returns 404, just set empty array
        console.log('Note: Favorites feature might not be fully implemented');
        setFavorites([]);
      }
    } finally {
      setLoadingFavorites(false);
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const updatePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await api.put('/auth/profile', {
        password: passwordData.newPassword
      });
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const addToFavorites = async (productId) => {
    try {
      await api.post(`/auth/favorites/${productId}`);
      toast.success('Added to favorites');
      fetchFavorites();
    } catch (err) {
      toast.error('Failed to add to favorites');
    }
  };
  
  const removeFromFavorites = async (productId) => {
    try {
      await api.delete(`/auth/favorites/${productId}`);
      setFavorites(favorites.filter(item => item._id !== productId));
      toast.success('Removed from favorites');
    } catch (err) {
      toast.error('Failed to remove from favorites');
    }
  };
  
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
  
  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          Please log in to view your profile.
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => navigate('/login')}
          className="mt-3"
        >
          Go to Login
        </Button>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 profile-container">
      <h1 className="profile-title mb-4">My Account</h1>
      
      <Tab.Container id="profile-tabs" defaultActiveKey="info">
        <Row>
          <Col md={3} className="mb-4">
            <Card className="profile-sidebar">
              <Card.Body className="p-0">
                <div className="user-info p-3 text-center">
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h4 className="mt-2 mb-0">{user.name}</h4>
                  <p className="text-muted">{user.email}</p>
                </div>
                
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="info" className="d-flex align-items-center">
                      <FaUser className="me-2" /> Personal Information
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders" className="d-flex align-items-center">
                      <FaShoppingBag className="me-2" /> Order History
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="favorites" className="d-flex align-items-center">
                      <FaHeart className="me-2" /> Favorites
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="address" className="d-flex align-items-center">
                      <FaAddressCard className="me-2" /> Address
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="password" className="d-flex align-items-center">
                      <FaKey className="me-2" /> Change Password
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <div className="p-3">
                  <Button 
                    variant="outline-danger" 
                    className="w-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={9}>
            <Card className="profile-content">
              <Card.Body>
                <Tab.Content>
                  {/* Personal Information Tab */}
                  <Tab.Pane eventKey="info">
                    <h3 className="mb-4">Personal Information</h3>
                    {error && <Message variant="danger">{error}</Message>}
                    
                    <Form onSubmit={handleProfileUpdate}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={profileData.name}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                        />
                      </Form.Group>
                      
                      <Button 
                        type="submit" 
                        variant="primary" 
                        className="mt-3"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Information'}
                      </Button>
                    </Form>
                  </Tab.Pane>
                  
                  {/* Address Tab */}
                  <Tab.Pane eventKey="address">
                    <h3 className="mb-4">Address Information</h3>
                    {error && <Message variant="danger">{error}</Message>}
                    
                    <Form onSubmit={handleProfileUpdate}>
                      <Form.Group className="mb-3">
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address.street"
                          value={profileData.address.street}
                          onChange={handleProfileChange}
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="address.city"
                              value={profileData.address.city}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>State/Province</Form.Label>
                            <Form.Control
                              type="text"
                              name="address.state"
                              value={profileData.address.state}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                              type="text"
                              name="address.zipCode"
                              value={profileData.address.zipCode}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                              type="text"
                              name="address.country"
                              value={profileData.address.country}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Button 
                        type="submit" 
                        variant="primary" 
                        className="mt-3"
                                                disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Address'}
                      </Button>
                    </Form>
                  </Tab.Pane>
                  
                  {/* Password Tab */}
                  <Tab.Pane eventKey="password">
                    <h3 className="mb-4">Change Password</h3>
                    {error && <Message variant="danger">{error}</Message>}
                    
                    <Form onSubmit={updatePassword}>
                      {/* Hidden username field for accessibility */}
                      <Form.Control
                            type="text"
                            autoComplete="username"
                            value={user.email}
                            style={{ display: 'none' }}
                            aria-hidden="true"
                            tabIndex="-1"
                            readOnly 
                      />
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          autoComplete="current-password"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          autoComplete="new-password"
                        />
                        <Form.Text className="text-muted">
                          Password must be at least 6 characters long.
                        </Form.Text>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          autoComplete="new-password"
                        />
                      </Form.Group>
                      
                      <Button 
                        type="submit" 
                        variant="primary" 
                        className="mt-3"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Change Password'}
                      </Button>
                    </Form>
                  </Tab.Pane>
                  
                  {/* Order History Tab */}
                  <Tab.Pane eventKey="orders">
                    <h3 className="mb-4">Order History</h3>
                    
                    {loadingOrders ? (
                      <Loader />
                    ) : orders.length === 0 ? (
                      <Alert variant="info">
                        You haven't placed any orders yet. <a href="/products">Start shopping</a>
                      </Alert>
                    ) : (
                      <div className="table-responsive">
                        <Table striped hover>
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Total</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order._id}>
                                <td>#{order._id.substring(order._id.length - 6)}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>${order.totalPrice?.toFixed(2)}</td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => navigate(`/order/${order._id}`)}
                                  >
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Tab.Pane>
                  
                  {/* Favorites Tab */}
                  <Tab.Pane eventKey="favorites">
                    <h3 className="mb-4">Favorites</h3>
                    
                    {loadingFavorites ? (
                      <Loader />
                    ) : favorites.length === 0 ? (
                      <Alert variant="info">
                        You don't have any favorite products yet. <a href="/products">Browse products</a>
                      </Alert>
                    ) : (
                      <Row>
                        {favorites.map((product) => (
                          <Col md={6} lg={4} key={product._id} className="mb-4">
                            <Card className="h-100 favorite-item">
                              <div className="favorite-img-container">
                                <Card.Img 
                                  variant="top" 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="favorite-img"
                                />
                              </div>
                              <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text className="price">
                                  ${product.price.toFixed(2)}
                                </Card.Text>
                                <div className="d-flex justify-content-between mt-3">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                  >
                                    View
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeFromFavorites(product._id)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Profile;
