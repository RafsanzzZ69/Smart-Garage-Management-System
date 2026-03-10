import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="home-nav-content">
          <div className="logo">
            <h1>🏎️ Smart Garage</h1>
          </div>
          <div className="nav-links">
            <button onClick={() => navigate('/login')} className="nav-btn">Login</button>
            <button onClick={() => navigate('/register')} className="nav-btn primary">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to Smart Garage Management System</h2>
          <p>Manage your vehicle maintenance with ease. Book services, track repairs, and stay on top of your garage operations.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/register')} className="btn btn-primary">Get Started</button>
            <button onClick={() => navigate('/login')} className="btn btn-secondary">Sign In</button>
          </div>
        </div>
        <div className="hero-image">
          <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
            {/* Car illustration */}
            <path d="M600 100 Q800 100 900 200 L950 300 Q950 350 900 380 L400 380 Q350 350 350 300 L400 200 Q500 100 600 100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
            <circle cx="400" cy="380" r="60" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
            <circle cx="800" cy="380" r="60" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
            {/* Interior details */}
            <rect x="450" y="200" width="300" height="100" rx="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h3>Why Choose Us?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h4>Easy Booking</h4>
              <p>Book your service appointments easily online with real-time availability</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚗</div>
              <h4>Vehicle Tracking</h4>
              <p>Keep track of all your vehicles and their maintenance history</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4>Transparent Pricing</h4>
              <p>Know exactly what you're paying for with clear, itemized invoices</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h4>Expert Mechanics</h4>
              <p>Work with certified and experienced mechanics in your area</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h4>Fast Service</h4>
              <p>Get your vehicle serviced quickly without compromising on quality</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h4>Quality Guarantee</h4>
              <p>All services come with a satisfaction guarantee and warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="roles">
        <div className="roles-container">
          <h3>Different Access Levels for Different Needs</h3>
          <div className="roles-grid">
            <div className="role-card">
              <div className="role-icon">👤</div>
              <h4>Customer</h4>
              <ul>
                <li>Book services</li>
                <li>Track repairs</li>
                <li>View invoices</li>
                <li>Manage vehicles</li>
              </ul>
              <button onClick={() => navigate('/register')} className="btn-role">Join as Customer</button>
            </div>
            <div className="role-card">
              <div className="role-icon">🔧</div>
              <h4>Mechanic</h4>
              <ul>
                <li>Manage jobs</li>
                <li>Track earnings</li>
                <li>Update status</li>
                <li>View performance</li>
              </ul>
              <button onClick={() => navigate('/register')} className="btn-role">Join as Mechanic</button>
            </div>
            <div className="role-card">
              <div className="role-icon">👨‍💼</div>
              <h4>Admin</h4>
              <ul>
                <li>Manage users</li>
                <li>Track finances</li>
                <li>View analytics</li>
                <li>System settings</li>
              </ul>
              <button onClick={() => navigate('/register')} className="btn-role">Join as Admin</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h3>Ready to Manage Your Garage?</h3>
          <p>Join thousands of users who trust Smart Garage for their vehicle maintenance</p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/register')} className="btn btn-primary">Sign Up Now</button>
            <button onClick={() => navigate('/login')} className="btn btn-secondary">Already Have Account?</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Smart Garage</h4>
            <p>Your trusted partner in vehicle maintenance</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#roles">How It Works</a></li>
              <li><a href="#cta">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>Email: info@smartgarage.com</li>
              <li>Phone: 1-800-GARAGE-1</li>
              <li>Address: 123 Motor Ave, Auto City</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Smart Garage Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
