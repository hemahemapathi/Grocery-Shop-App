import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../UI/Loader';
import Message from '../../UI/Message';
import './AdminProfile.css';

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
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
        phone: user.phone || ''
      });
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
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
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
  
  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4 admin-profile-container">
      <h1 className="admin-profile-title mb-4">Admin Profile</h1>
      
      <Row>
        <Col lg={4} md={5} className="mb-4">
          <Card className="admin-profile-card">
            <Card.Body className="text-center">
              <div className="admin-avatar">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <h3 className="mt-3 mb-1">{user.name}</h3>
              <p className="text-muted">{user.email}</p>
              <p className="admin-role">Administrator</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8} md={7}>
          <Card className="admin-profile-card mb-4">
            <Card.Header>
              <h4 className="mb-0"><FaUser className="me-2" /> Personal Information</h4>
            </Card.Header>
            <Card.Body>
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
                  className="mt-2"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Information'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="admin-profile-card">
            <Card.Header>
              <h4 className="mb-0"><FaKey className="me-2" /> Change Password</h4>
            </Card.Header>
            <Card.Body>
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
                  className="mt-2"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Change Password'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminProfile;
