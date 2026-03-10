import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './CustomerDashboard.css';

const API_BASE_URL = 'http://localhost:5000';

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [vehicleForm, setVehicleForm] = useState({ model: '', fuelType: '', mileage: '', year: '', licensePlate: '' });
  const [bookingForm, setBookingForm] = useState({ serviceType: '', preferredDate: '', vehicle: '' });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user) fetchCustomerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const vehiclesRes = await axios.get(`${API_BASE_URL}/api/vehicles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(vehiclesRes.data);

      const bookingsRes = await axios.get(`${API_BASE_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // filter by user as bookings include customer object sometimes
      const allBookings = bookingsRes.data || [];
      const myBookings = allBookings.filter(b => b.customer && (b.customer._id === user?._id || b.customer === user?._id));
      setBookings(myBookings);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomerData();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomerData();
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/vehicles`, vehicleForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicleForm({ model: '', fuelType: '', mileage: '', year: '', licensePlate: '' });
      fetchCustomerData();
      alert('Vehicle added successfully!');
    } catch (err) {
      alert('Error adding vehicle');
    }
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/bookings`, bookingForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingForm({ serviceType: '', preferredDate: '', vehicle: '' });
      fetchCustomerData();
      alert('Booking created successfully!');
    } catch (err) {
      alert('Error creating booking');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="customer-dashboard">
      {/* Header */}
      <header className="customer-header">
        <div className="customer-header-content">
          <h1>🏎️ Smart Garage</h1>
          <div className="customer-user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="customer-nav">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
          🏠 Home
        </button>
        <button className={activeTab === 'vehicles' ? 'active' : ''} onClick={() => setActiveTab('vehicles')}>
          🚗 My Vehicles
        </button>
        <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
          📅 My Bookings
        </button>
        <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>
          🔧 Services
        </button>
      </nav>

      {/* Main Content */}
      <div className="customer-content">
        {loading && <div className="loading">Loading...</div>}

        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="home-section">
            <div className="car-background">
              <div className="hero-content">
                <h2>Welcome to Smart Garage Management</h2>
                <p>Your complete vehicle service solution</p>
                <button onClick={() => setActiveTab('vehicles')} className="cta-btn">
                  Manage Your Vehicles
                </button>
              </div>
            </div>

            <div className="services-overview">
              <h3>Our Services</h3>
              <div className="services-grid">
                <div className="service-card">
                  <span className="service-icon">🔧</span>
                  <h4>General Maintenance</h4>
                  <p>Regular maintenance and check-ups</p>
                </div>
                <div className="service-card">
                  <span className="service-icon">⚙️</span>
                  <h4>Engine Service</h4>
                  <p>Complete engine diagnostics and service</p>
                </div>
                <div className="service-card">
                  <span className="service-icon">🔩</span>
                  <h4>Parts Replacement</h4>
                  <p>Quality parts replacement and installation</p>
                </div>
                <div className="service-card">
                  <span className="service-icon">🛠️</span>
                  <h4>Emergency Repair</h4>
                  <p>Quick emergency repair services</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="vehicles-section">
            <h2>🚗 My Vehicles</h2>

            <div className="vehicle-form-container">
              <h3>Add New Vehicle</h3>
              <form onSubmit={handleAddVehicle} className="vehicle-form">
                <input
                  type="text"
                  placeholder="Model (e.g., Toyota Corolla)"
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                  required
                />
                <select
                  value={vehicleForm.fuelType}
                  onChange={(e) => setVehicleForm({...vehicleForm, fuelType: e.target.value})}
                  required
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </select>
                <input
                  type="number"
                  placeholder="Mileage (km)"
                  value={vehicleForm.mileage}
                  onChange={(e) => setVehicleForm({...vehicleForm, mileage: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={vehicleForm.year}
                  onChange={(e) => setVehicleForm({...vehicleForm, year: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="License Plate"
                  value={vehicleForm.licensePlate}
                  onChange={(e) => setVehicleForm({...vehicleForm, licensePlate: e.target.value})}
                  required
                />
                <button type="submit">Add Vehicle</button>
              </form>
            </div>

            <div className="vehicles-list">
              <h3>Your Vehicles</h3>
              {vehicles.length > 0 ? (
                <div className="vehicles-grid">
                  {vehicles.map(vehicle => (
                    <div key={vehicle._id} className="vehicle-card">
                      <div className="vehicle-icon">🚗</div>
                      <h4>{vehicle.model}</h4>
                      <p><strong>Plate:</strong> {vehicle.licensePlate}</p>
                      <p><strong>Fuel:</strong> {vehicle.fuelType}</p>
                      <p><strong>Mileage:</strong> {vehicle.mileage} km</p>
                      <p><strong>Year:</strong> {vehicle.year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No vehicles added yet. Add your first vehicle above!</p>
              )}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>📅 My Bookings</h2>

            <div className="booking-form-container">
              <h3>Book a Service</h3>
              <form onSubmit={handleBookService} className="booking-form">
                <select
                  value={bookingForm.vehicle}
                  onChange={(e) => setBookingForm({...bookingForm, vehicle: e.target.value})}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.model} ({v.licensePlate})</option>
                  ))}
                </select>
                <select
                  value={bookingForm.serviceType}
                  onChange={(e) => setBookingForm({...bookingForm, serviceType: e.target.value})}
                  required
                >
                  <option value="">Select Service Type</option>
                  <option value="General Maintenance">General Maintenance</option>
                  <option value="Engine Service">Engine Service</option>
                  <option value="Parts Replacement">Parts Replacement</option>
                  <option value="Emergency Repair">Emergency Repair</option>
                </select>
                <input
                  type="date"
                  value={bookingForm.preferredDate}
                  onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})}
                  required
                />
                <button type="submit">Book Service</button>
              </form>
            </div>

            <div className="bookings-list">
              <h3>Your Bookings</h3>
              {bookings.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Service Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking._id}>
                        <td>{booking.serviceType}</td>
                        <td>{new Date(booking.preferredDate).toLocaleDateString()}</td>
                        <td><span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></td>
                        <td>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            style={{
                              background: '#ff6b6b',
                              color: 'white',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No bookings yet. Book your first service above!</p>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="services-section">
            <h2>🔧 Our Services</h2>
            <div className="services-overview" style={{ marginTop: '30px' }}>
              <div className="services-grid">
                {[
                  { icon: '🛠️', title: 'General Maintenance', desc: 'Oil change, filter replacement, fluids top-up and routine checks.' },
                  { icon: '🔌', title: 'Engine Repair', desc: 'Diagnose and fix engine problems, replacements and tuning.' },
                  { icon: '🚗', title: 'Parts Replacement', desc: 'Original equipment parts for brakes, tires, batteries and more.' },
                  { icon: '⚠️', title: 'Emergency Repair', desc: 'Fast service for breakdowns, towing and on-site fixes.' },
                ].map((svc, idx) => (
                  <div key={idx} className="service-card">
                    <span className="service-icon">{svc.icon}</span>
                    <h4>{svc.title}</h4>
                    <p>{svc.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Service history table */}
            <div className="bookings-list" style={{ marginTop: '40px' }}>
              <h3>Your Service Records</h3>
              {bookings.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td>{b.serviceType}</td>
                        <td>{new Date(b.preferredDate).toLocaleDateString()}</td>
                        <td><span className={`status ${b.status.toLowerCase()}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No past services found.</p>
              )}
            </div>
          </div>
        )}      </div>
    </div>
  );
};

export default CustomerDashboard;