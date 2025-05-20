import React, { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import './Contact.css';

// Initialize EmailJS with your public key
emailjs.init("n9HYR9xUGpzvgxTvY"); // Replace with your actual public key

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    
    if (formElement.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setLoading(true);
    
    try {
      // Send email using EmailJS
      const result = await emailjs.sendForm(
     'service_a17xmpb', // Replace with your EmailJS service ID
     'template_oyvvpvz', // Replace with your EmailJS template ID
        form.current
      );
      
      console.log('Email sent successfully:', result.text);
      toast.success('Message sent successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setValidated(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="contact-container py-5">
      <h1 className="text-center mb-5">Contact Us</h1>
      
      {/* Rest of your component remains the same */}
      <Row className="mb-5">
        <Col lg={6}>
          <div className="contact-form-container">
            <h2 className="mb-4">Send Us a Message</h2>
            <Form ref={form} noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="contactName">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide your name.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="contactEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email address.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="contactSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter message subject"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a subject.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="contactMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a message.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Form>
          </div>
        </Col>

      

        
        {/* Map and other sections remain the same */}
      </Row>
    </Container>
  );
};

export default Contact;
