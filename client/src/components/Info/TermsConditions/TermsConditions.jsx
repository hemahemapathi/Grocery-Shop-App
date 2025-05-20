import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../InfoPages.css';

const TermsConditions = () => {
  return (
    <Container className="py-5 info-page">
      <Row className="justify-content-center mb-5">
        <Col md={10}>
          <h1 className="text-center mb-4">Terms & Conditions</h1>
          <p className="text-center lead mb-5">
            Please read these terms and conditions carefully before using our website and services.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">1. Introduction</h2>
              <p>Welcome to Fresh Grocer ("we," "our," or "us"). By accessing or using our website, mobile application, and services, you agree to be bound by these Terms and Conditions ("Terms").</p>
              <p>These Terms constitute a legally binding agreement between you and Fresh Grocer. If you do not agree with any part of these Terms, you must not use our services.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">2. Definitions</h2>
              <ul>
                <li><strong>"Account"</strong> means a unique account created for you to access our Service or parts of our Service.</li>
                <li><strong>"Website"</strong> refers to Fresh Grocer, accessible from www.freshgrocer.com</li>
                <li><strong>"Service"</strong> refers to the Website, mobile application, and the grocery delivery service provided by Fresh Grocer.</li>
                <li><strong>"Terms and Conditions"</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between you and Fresh Grocer regarding the use of the Service.</li>
                <li><strong>"You"</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">3. Account Registration</h2>
              <p>To use certain features of the Service, you must register for an account. When you register, you agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Be responsible for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p>We reserve the right to suspend or terminate your account if any information provided during registration or thereafter proves to be inaccurate, false, or outdated.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">4. Ordering and Delivery</h2>
              <p><strong>4.1 Placing Orders</strong></p>
              <p>When placing an order through our Service, you agree to provide accurate and complete information about the items you wish to purchase and your delivery address.</p>
              
              <p><strong>4.2 Order Acceptance</strong></p>
              <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in product or pricing information, or problems identified by our fraud and verification team.</p>
              
              <p><strong>4.3 Pricing and Payment</strong></p>
              <p>All prices are shown in USD and are inclusive of applicable taxes. We reserve the right to change prices at any time. Payment must be made at the time of placing your order.</p>
              
              <p><strong>4.4 Delivery</strong></p>
              <p>We will make every effort to deliver your order at the selected time slot. However, delivery times are estimates and not guaranteed. We are not responsible for delays caused by factors beyond our control.</p>
              
              <p><strong>4.5 Delivery Areas</strong></p>
              <p>Our delivery service is available only in specific areas. You can check if we deliver to your location during the checkout process.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">5. Product Information</h2>
              <p>We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on our Service. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors.</p>
              <p>The weights and sizes of products are approximate. We reserve the right to discontinue any product at any time. All descriptions of products are subject to change at any time without notice, at our sole discretion.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">6. Returns and Refunds</h2>
              <p>Please refer to our <a href="/returns-refunds">Returns and Refunds Policy</a> for information about returning products and receiving refunds.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">7. Intellectual Property</h2>
              <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Fresh Grocer and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
              <p>Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Fresh Grocer.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">8. Prohibited Uses</h2>
              <p>You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
              <ul>
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To impersonate or attempt to impersonate Fresh Grocer, a Fresh Grocer employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which may harm Fresh Grocer or users of the Service</li>
                <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">9. Limitation of Liability</h2>
              <p>To the maximum extent permitted by applicable law, in no event shall Fresh Grocer be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including without limitation, damages for loss of profits, goodwill, use, data, or other intangible losses, arising out of or relating to the use of, or inability to use, the Service.</p>
              <p>To the maximum extent permitted by applicable law, Fresh Grocer assumes no liability or responsibility for any:</p>
              <ul>
                <li>Errors, mistakes, or inaccuracies of content</li>
                <li>Personal injury or property damage, of any nature whatsoever, resulting from your access to or use of our Service</li>
                <li>Unauthorized access to or use of our secure servers and/or any personal information stored therein</li>
                <li>Interruption or cessation of transmission to or from the Service</li>
                <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service by any third party</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">10. Indemnification</h2>
              <p>You agree to defend, indemnify, and hold harmless Fresh Grocer, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">11. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any legal action or proceeding relating to your access to, or use of, the Service or these Terms shall be instituted in a state or federal court in New York, New York.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">12. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-3">13. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p>Email: legal@freshgrocer.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Grocery Street, Fresh City, FC 12345</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={10} className="text-center">
          <p className="text-muted">Last Updated: June 1, 2023</p>
        </Col>
      </Row>
    </Container>
  );
};

export default TermsConditions;
 
