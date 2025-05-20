import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  // Function to handle navigation and scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer">
      <div className="footer-top py-5">
        <div className="container">
          <div className="row">
            {/* Company Info */}
            <div className="col-lg-4 col-md-4 mb-4 mb-lg-0">
              <div className="footer-logo mb-3">
                <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                  <img src="/assets/images/grocery-cart.png" alt="Grocery Shop" className="img-fluid" style={{ maxHeight: '50px' }} />
                </Link>
              </div>
              <p className="footer-about">
                 Fresh food, fast delivery. <br />
                 Quality you can taste. <br />
                 Click. Order. Enjoy. <br />
                 From farm to front door. <br />
                 Groceries made easy.

              </p>
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            {/* Customer Service */}
            <div className="col-lg-4 col-md-4 mb-4 mb-lg-0">
              <h4 className="footer-heading"><img src="/assets/images/services.png" alt="Services" height="50" /></h4>
              <ul className="footer-links">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/contact'); }}>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/faq'); }}>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/shipping-delivery'); }}>
                    Shipping & Delivery
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/returns-refunds'); }}>
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/terms-conditions'); }}>
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/privacy-policy'); }}>
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-4 col-md-4">
              <h4 className="footer-heading"><img src="/assets/images/customer-support.png" alt="customer-support" height="50" /></h4>
              <ul className="footer-contact">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>123 Grocery Street, Fresh City, FC 12345</span>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <span>(123) 456-7890</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>info@groceryshop.com</span>
                </li>
              </ul>
              <h5 className="mt-4 mb-2">We Accept</h5>
              <div className="payment-methods">
                <FaCreditCard className="payment-icon" title="Credit Card" />
                <FaPaypal className="payment-icon" title="PayPal" />
                <FaApplePay className="payment-icon" title="Apple Pay" />
                <FaGooglePay className="payment-icon" title="Google Pay" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom py-3">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">
                &copy; {currentYear} Groovo. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="mb-0">
                Designed with <span className="text-danger">❤</span> for fresh food lovers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
