import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Verify token validity when component mounts
    const verifyToken = async () => {
      try {
        await api.get(`/auth/reset-password/${token}`);
      } catch (err) {
        setTokenValid(false);
        toast.error('Password reset link is invalid or has expired');
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      
      // Call your API to reset the password
      await api.post(`/auth/reset-password/${token}`, { password });
      
      toast.success('Password has been reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Please try again.');
      console.error('Error resetting password:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body className="p-4 text-center">
                <h2 className="mb-4">Invalid Reset Link</h2>
                <p>The password reset link is invalid or has expired.</p>
                <Link to="/forgot-password" className="btn btn-primary mt-3">
                  Request a new reset link
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Reset Password</h2>
                <p className="text-muted">Enter your new password below</p>
              </div>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none">
                  Back to Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
