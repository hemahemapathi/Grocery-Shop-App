import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaTruck, FaClock, FaMapMarkedAlt, FaBoxOpen } from 'react-icons/fa';
import '../InfoPages.css';

const ShippingDelivery = () => {
  return (
    <Container className="py-5 info-page">
      <Row className="justify-content-center mb-5">
        <Col md={10}>
          <h1 className="text-center mb-4">Shipping & Delivery</h1>
          <p className="text-center lead mb-5">
            Learn about our shipping options, delivery times, and policies to ensure you get your groceries when you need them.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 text-center info-card">
            <Card.Body>
              <div className="info-icon">
                <FaTruck />
              </div>
              <Card.Title>Delivery Options</Card.Title>
              <Card.Text>
                Choose from standard, express, or scheduled delivery to fit your needs.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 text-center info-card">
            <Card.Body>
              <div className="info-icon">
                <FaClock />
              </div>
              <Card.Title>Delivery Times</Card.Title>
              <Card.Text>
                Deliveries are made 7 days a week from 8:00 AM to 8:00 PM.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 text-center info-card">
            <Card.Body>
              <div className="info-icon">
                <FaMapMarkedAlt />
              </div>
              <Card.Title>Delivery Areas</Card.Title>
              <Card.Text>
                We currently deliver to select areas. Check your zip code for availability.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 text-center info-card">
            <Card.Body>
              <div className="info-icon">
                <FaBoxOpen />
              </div>
              <Card.Title>Packaging</Card.Title>
              <Card.Text>
                All items are carefully packed to ensure freshness and prevent damage.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm mb-5">
            <Card.Body>
              <h2 className="mb-4">Delivery Options</h2>
              
              <h4>Standard Delivery</h4>
              <p>Our standard delivery service is available for all orders. Orders placed before 10:00 PM will be delivered the next day during your selected time slot.</p>
              <ul>
                <li>Delivery Fee: $4.99 for orders under $50</li>
                <li>Free delivery for orders over $50</li>
                <li>Delivery Hours: 8:00 AM - 8:00 PM, 7 days a week</li>
              </ul>
              
              <hr className="my-4" />
              
              <h4>Express Delivery</h4>
              <p>Need your groceries quickly? Our express delivery service gets your order to you within 2 hours.</p>
              <ul>
                <li>Available for orders placed between 8:00 AM and 6:00 PM</li>
                <li>Express Delivery Fee: $9.99</li>
                <li>Maximum order size: 30 items</li>
              </ul>
              
              <hr className="my-4" />
              
              <h4>Scheduled Delivery</h4>
              <p>Plan ahead by scheduling your delivery up to 7 days in advance. Choose a specific date and time slot that works for you.</p>
              <ul>
                <li>Available time slots: 8:00 AM - 10:00 AM, 10:00 AM - 12:00 PM, 12:00 PM - 2:00 PM, 2:00 PM - 4:00 PM, 4:00 PM - 6:00 PM, 6:00 PM - 8:00 PM</li>
                <li>Standard delivery fees apply</li>
                <li>You can modify your order up to 12 hours before the scheduled delivery time</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-5">
            <Card.Body>
              <h2 className="mb-4">Delivery Areas</h2>
              <p>We currently deliver to the following areas:</p>
              <ul>
                <li>Manhattan</li>
                <li>Brooklyn</li>
                <li>Queens</li>
                <li>Bronx</li>
                <li>Staten Island</li>
                <li>Jersey City</li>
                <li>Hoboken</li>
              </ul>
              <p>We're constantly expanding our delivery areas. To check if we deliver to your location, enter your zip code during checkout or on our homepage.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-5">
            <Card.Body>
              <h2 className="mb-4">Delivery Policies</h2>
              
              <h4>Delivery Confirmation</h4>
              <p>You'll receive a confirmation email once your order is placed, and another notification when your order is out for delivery. Our delivery person will call or text you when they're approaching your location.</p>
              
              <h4>Not Home During Delivery?</h4>
              <p>If you're not home during delivery, our delivery person will:</p>
              <ol>
                <li>Call you to confirm an alternative arrangement</li>
                <li>Follow any delivery instructions you provided during checkout</li>
                <li>If no contact can be made, they may leave non-perishable items in a safe place or return the order to our facility</li>
              </ol>
              
              <h4>Rescheduling Deliveries</h4>
              <p>You can reschedule your delivery by contacting our customer service team at least 2 hours before the scheduled delivery time. A rescheduling fee may apply.</p>
              
              <h4>Damaged or Missing Items</h4>
              <p>If any items are damaged upon delivery or missing from your order, please contact our customer service team within 24 hours. We'll arrange for a replacement or refund.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-4">Packaging</h2>
              <p>We take pride in our packaging to ensure your groceries arrive in perfect condition:</p>
              <ul>
                <li><strong>Eco-Friendly Bags:</strong> We use recyclable paper bags for most items</li>
                <li><strong>Temperature Control:</strong> Frozen items are packed with dry ice or ice packs</li>
                <li><strong>Fragile Items:</strong> Eggs, bread, and other delicate items are packed separately</li>
                <li><strong>Produce Protection:</strong> Fruits and vegetables are carefully arranged to prevent bruising</li>
              </ul>
              <p>As part of our commitment to sustainability, we offer a bag recycling program. Our delivery person can collect your bags from previous orders during your next delivery.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={10} className="text-center">
          <h3>Have questions about shipping or delivery?</h3>
          <p className="mb-4">Our customer service team is here to help.</p>
          <a href="/contact" className="btn btn-primary">Contact Us</a>
        </Col>
      </Row>
    </Container>
  );
};

export default ShippingDelivery;

