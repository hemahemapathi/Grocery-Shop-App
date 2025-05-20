import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../InfoPages.css';

const PrivacyPolicy = () => {
  return (
    <Container className="py-5 info-page">
      <Row className="justify-content-center mb-5">
        <Col md={10}>
          <h1 className="text-center mb-4">Privacy Policy</h1>
          <p className="text-center lead mb-5">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">1. Introduction</h2>
              <p>Fresh Grocer ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy.</p>
              <p>This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit our website, use our mobile application, or use our services, and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">2. Information We Collect</h2>
              <p>We collect several types of information from and about users of our Services, including:</p>
              
              <h4>2.1 Personal Information</h4>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, postal address, phone number</li>
                <li><strong>Account Information:</strong> Username, password, account preferences</li>
                <li><strong>Payment Information:</strong> Credit card details, billing address (note: full payment details are processed by our secure payment processors and are not stored on our servers)</li>
                <li><strong>Delivery Information:</strong> Delivery address, delivery instructions, preferred delivery times</li>
              </ul>
              
              <h4>2.2 Non-Personal Information</h4>
              <ul>
                <li><strong>Usage Data:</strong> Information about how you use our website, app, and services</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device information</li>
                <li><strong>Location Data:</strong> General location information based on IP address or more precise location if you allow location services</li>
                <li><strong>Shopping Preferences:</strong> Shopping lists, favorite items, purchase history</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">3. How We Collect Information</h2>
              <p>We collect information in the following ways:</p>
              <ul>
                <li><strong>Direct Collection:</strong> Information you provide when you register, place an order, fill out forms, or communicate with us</li>
                <li><strong>Automated Collection:</strong> Using cookies, web beacons, and other tracking technologies</li>
                <li><strong>Third Parties:</strong> We may receive information about you from third parties, such as business partners, service providers, and analytics providers</li>
              </ul>
              
              <h4>3.1 Cookies and Tracking Technologies</h4>
              <p>We use cookies and similar tracking technologies to track activity on our Services and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
              <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">4. How We Use Your Information</h2>
              <p>We use the information we collect about you for various purposes, including to:</p>
              <ul>
                <li>Provide, maintain, and improve our Services</li>
                <li>Process and fulfill your orders, including delivery and payment processing</li>
                <li>Create and manage your account</li>
                <li>Send you order confirmations, updates, and support messages</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Personalize your experience and provide content and product recommendations</li>
                <li>Analyze usage patterns and improve our website, app, and services</li>
                <li>Detect, prevent, and address technical issues, fraud, and illegal activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">5. Disclosure of Your Information</h2>
              <p>We may disclose personal information that we collect or you provide:</p>
              <ul>
                <li><strong>Service Providers:</strong> To contractors, service providers, and other third parties we use to support our business (such as delivery services, payment processors, and analytics providers)</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business</li>
                <li><strong>Legal Requirements:</strong> To comply with any court order, law, or legal process, including to respond to any government or regulatory request</li>
                <li><strong>Enforcement:</strong> To enforce or apply our terms of use and other agreements</li>
                <li><strong>Protection:</strong> To protect the rights, property, or safety of Fresh Grocer, our customers, or others</li>
              </ul>
              <p>We do not sell, rent, or lease your personal information to third parties.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">6. Data Security</h2>
              <p>We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers behind firewalls.</p>
              <p>Any payment transactions will be encrypted using SSL technology. We use industry-standard encryption to protect your data in transit and at rest.</p>
              <p>Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Services. Any transmission of personal information is at your own risk.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">7. Your Rights and Choices</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul>
                <li><strong>Access:</strong> You can request access to your personal information we hold</li>
                <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> You can request that we delete your personal information</li>
                <li><strong>Restriction:</strong> You can request that we restrict the processing of your information</li>
                <li><strong>Data Portability:</strong> You can request a copy of your information in a structured, commonly used, and machine-readable format</li>
                <li><strong>Objection:</strong> You can object to our processing of your personal information</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>
              
              <h4>7.1 Marketing Communications</h4>
              <p>You can opt out of receiving marketing emails from us by clicking the "unsubscribe" link in any marketing email we send. Even if you opt out of marketing communications, we will still send you transactional messages, such as order confirmations and delivery updates.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">8. Children's Privacy</h2>
              <p>Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you believe your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we take steps to remove that information from our servers.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">9. Changes to Our Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective. We encourage you to review this Privacy Policy periodically for any changes.</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-3">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us at:</p>
              <p>Email: privacy@freshgrocer.com</p>
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

export default PrivacyPolicy;
