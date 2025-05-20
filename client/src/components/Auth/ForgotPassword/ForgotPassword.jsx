import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      
      // Call your API to send a password reset email
      await api.post('/auth/forgot-password', { email });
      
      setEmailSent(true);
      toast.success('Password reset instructions sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email. Please try again.');
      console.error('Error sending reset email:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Forgot Password</h2>
                <p className="text-muted">
                  {emailSent 
                    ? 'Check your email for password reset instructions' 
                    : 'Enter your email address to receive a password reset link'}
                </p>
              </div>
              
              {!emailSent ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="text-center">
                  <p>
                    Didn't receive the email? Check your spam folder or
                    <Button 
                      variant="link" 
                      className="p-0 ms-1" 
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      try again
                    </Button>
                  </p>
                </div>
              )}
              
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

export default ForgotPassword;
