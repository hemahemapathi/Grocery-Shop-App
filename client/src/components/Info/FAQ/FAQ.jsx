import React from 'react';
import { Container, Accordion, Row, Col, Card } from 'react-bootstrap';
import '../InfoPages.css';

const FAQ = () => {
  return (
    <Container className="py-5 info-page">
      <Row className="justify-content-center mb-5">
        <Col md={10}>
          <h1 className="text-center mb-4">Frequently Asked Questions</h1>
          <p className="text-center lead mb-5">
            Find answers to the most common questions about our products, services, and policies.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm">
            <Card.Body>
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>How do I place an order?</Accordion.Header>
                  <Accordion.Body>
                    <p>Placing an order is easy! Simply follow these steps:</p>
                    <ol>
                      <li>Browse our products and add items to your cart</li>
                      <li>Click on the cart icon to review your items</li>
                      <li>Proceed to checkout</li>
                      <li>Fill in your shipping and payment information</li>
                      <li>Review your order and submit</li>
                    </ol>
                    <p>You'll receive an order confirmation email with all the details.</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>What are your delivery hours?</Accordion.Header>
                  <Accordion.Body>
                    <p>We deliver from 8:00 AM to 8:00 PM, seven days a week. You can select your preferred delivery time during checkout.</p>
                    <p>For same-day delivery, orders must be placed before 2:00 PM. Orders placed after 2:00 PM will be delivered the next day.</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>How can I track my order?</Accordion.Header>
                  <Accordion.Body>
                    <p>You can track your order by:</p>
                    <ul>
                      <li>Logging into your account and viewing your order history</li>
                      <li>Clicking the tracking link in your order confirmation email</li>
                      <li>Contacting our customer service team with your order number</li>
                    </ul>
                    <p>We provide real-time updates on your order status, from processing to delivery.</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>What is your return policy?</Accordion.Header>
                  <Accordion.Body>
                    <p>If you're not satisfied with your purchase, you can return it within 7 days for a full refund. Please note the following:</p>
                    <ul>
                      <li>Items must be unused and in their original packaging</li>
                      <li>Perishable items cannot be returned unless they were damaged or defective at the time of delivery</li>
                      <li>You can request a return through your account or by contacting customer service</li>
                    </ul>
                    <p>For more details, please see our <a href="/returns-refunds">Returns & Refunds</a> page.</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>Do you offer same-day delivery?</Accordion.Header>
                  <Accordion.Body>
                    <p>Yes, we offer same-day delivery for orders placed before 2:00 PM. This service is available in select areas and may have an additional fee.</p>
                    <p>During checkout, you'll see if same-day delivery is available for your location and can select it as an option.</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                  <Accordion.Header>What payment methods do you accept?</Accordion.Header>
                  <Accordion.Body>
                    <p>We accept the following payment methods:</p>
                    <ul>
                      <li>Credit/Debit Cards (Visa, Mastercard, American Express, Discover)</li>
                      <li>PayPal</li>
                      <li>Apple Pay</li>
                      <li>Google Pay</li>
                      <li>Cash on Delivery (select areas only)</li>
                    </ul>
                    <p>All payments are processed securely through our encrypted payment system.</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="6">
                  <Accordion.Header>How do I create an account?</Accordion.Header>
                  <Accordion.Body>
                    <p>Creating an account is simple:</p>
                    <ol>
                      <li>Click on the "Register" button in the top right corner of the page</li>
                      <li>Fill in your name, email address, and create a password</li>
                      <li>Verify your email address by clicking the link sent to your inbox</li>
                      <li>Complete your profile with your address and preferences</li>
                    </ol>
                    <p>Having an account allows you to track orders, save favorite products, and check out faster.</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="7">
                  <Accordion.Header>Are your products organic?</Accordion.Header>
                  <Accordion.Body>
                    <p>We offer both organic and conventional products. All organic products are clearly labeled with an "Organic" badge and meet certified organic standards.</p>
                    <p>You can filter products by "Organic" in our product listings to see only organic options.</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="8">
                  <Accordion.Header>What if I'm not home during delivery?</Accordion.Header>
                  <Accordion.Body>
                    <p>If you're not home during delivery:</p>
                    <ul>
                      <li>Our delivery person will call you to confirm an alternative arrangement</li>
                      <li>You can leave delivery instructions during checkout (e.g., "leave at door")</li>
                      <li>For perishable items, we recommend being home or having a safe, cool place for the delivery</li>
                    </ul>
                    <p>You can also reschedule your delivery by contacting customer service at least 2 hours before the scheduled delivery time.</p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={10} className="text-center">
          <h3>Still have questions?</h3>
          <p className="mb-4">Our customer service team is here to help.</p>
          <a href="/contact" className="btn btn-primary">Contact Us</a>
        </Col>
      </Row>
    </Container>
  );
};

export default FAQ;
