import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import '../InfoPages.css';

const ReturnsRefunds = () => {
  return (
    <Container className="py-5 info-page">
      <Row className="justify-content-center mb-5">
        <Col md={10}>
          <h1 className="text-center mb-4">Returns & Refunds</h1>
          <p className="text-center lead mb-5">
            We want you to be completely satisfied with your purchase. Learn about our return and refund policies.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm mb-5">
            <Card.Body>
              <h2 className="mb-4">Return Policy</h2>
              <p>We accept returns within 7 days of delivery for most items. Here's what you need to know:</p>
              
              <h4 className="mt-4">Eligible Items for Return</h4>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item>
                  <strong>Non-perishable items:</strong> Must be unopened and in original packaging
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Damaged or defective items:</strong> Can be returned regardless of item type
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Incorrect items:</strong> Items that were delivered by mistake
                </ListGroup.Item>
              </ListGroup>
              
              <h4>Items Not Eligible for Return</h4>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item>
                  <strong>Perishable items:</strong> Fresh produce, meat, dairy, and other perishables (unless damaged or spoiled at time of delivery)
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Opened items:</strong> Products that have been opened or used
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Clearance items:</strong> Items marked as final sale or clearance
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Gift cards:</strong> Cannot be returned or exchanged for cash
                </ListGroup.Item>
              </ListGroup>
              
              <h4>How to Return an Item</h4>
              <ol>
                <li>Log in to your account and go to your order history</li>
                <li>Select the order containing the item you wish to return</li>
                <li>Click on "Return Item" and follow the instructions</li>
                <li>Our delivery person will pick up the return during your next delivery, or you can arrange a separate pickup</li>
              </ol>
              <p>You can also contact our customer service team to arrange a return.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-5">
            <Card.Body>
              <h2 className="mb-4">Refund Policy</h2>
              <p>Once we receive and inspect your return, we'll process your refund. Here's what you need to know:</p>
              
              <h4 className="mt-4">Refund Processing</h4>
              <ul>
                <li>Refunds are typically processed within 3-5 business days after we receive your return</li>
                <li>You'll receive an email notification when your refund is processed</li>
                <li>Refunds are issued to the original payment method used for the purchase</li>
                <li>Depending on your payment provider, it may take an additional 2-10 business days for the refund to appear in your account</li>
              </ul>
              
              <h4>Refund Options</h4>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item>
                  <strong>Original payment method:</strong> Credit/debit card, PayPal, etc.
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Store credit:</strong> Can be used for future purchases
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Replacement:</strong> We can send a replacement for damaged or defective items
                </ListGroup.Item>
              </ListGroup>
              
              <h4>Partial Refunds</h4>
              <p>In some cases, we may issue a partial refund:</p>
              <ul>
                <li>If only part of an order is returned</li>
                <li>If an item is returned in a condition that reduces its value</li>
                <li>For promotional or discounted items</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-4">Special Situations</h2>
              
              <h4>Damaged or Incorrect Items</h4>
              <p>If you receive damaged, spoiled, or incorrect items:</p>
              <ol>
                <li>Contact us within 24 hours of delivery</li>
                <li>Provide photos of the damaged items if possible</li>
                <li>We'll arrange for a refund or replacement without requiring a return</li>
              </ol>
              
              <h4>Late or Missing Deliveries</h4>
              <p>If your delivery is significantly late or never arrives:</p>
              <ul>
                <li>Check your order status in your account</li>
                <li>Contact our customer service team if your delivery is more than 2 hours late</li>
                <li>We'll investigate and provide a refund or reschedule your delivery</li>
              </ul>
              
              <h4>Subscription Orders</h4>
              <p>For subscription or recurring orders:</p>
              <ul>
                <li>You can return items from subscription orders following our standard return policy</li>
                <li>If you frequently need to return items from your subscription, we recommend adjusting your preferences</li>
                <li>You can pause or cancel your subscription at any time through your account</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={10} className="text-center">
          <h3>Need help with a return or refund?</h3>
          <p className="mb-4">Our customer service team is here to assist you.</p>
          <a href="/contact" className="btn btn-primary">Contact Us</a>
        </Col>
      </Row>
    </Container>
  );
};

export default ReturnsRefunds;
