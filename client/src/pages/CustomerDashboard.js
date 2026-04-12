import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './CustomerDashboard.css';
 
const API_BASE_URL = 'http://localhost:8000';
 
const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [vehicleForm, setVehicleForm] = useState({ model: '', fuelType: '', mileage: '', year: '', licensePlate: '' });
  const [bookingForm, setBookingForm] = useState({ serviceType: '', preferredDate: '', vehicle: '', package: '', estimatedCost: 0, promoCode: '', promoId: '', discount: 0, finalCost: 0 });
  const [promoStatus, setPromoStatus] = useState(null);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ method: 'card', promoCode: '', promoId: '', discount: 0 });
  const [paymentPromoStatus, setPaymentPromoStatus] = useState(null);
  const [reviewForm, setReviewForm] = useState({ booking: '', mechanic: '', rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
 
  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };
 
  useEffect(() => {
    if (user) {
      fetchCustomerData();
      fetchPackages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
 
  useEffect(() => {
    if (activeTab === 'reviews') fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
 
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const vehiclesRes = await axios.get(`${API_BASE_URL}/api/vehicles`, headers);
      setVehicles(vehiclesRes.data);
      const bookingsRes = await axios.get(`${API_BASE_URL}/api/bookings`, headers);
      const allBookings = bookingsRes.data || [];
      const myBookings = allBookings.filter(b => b.customer && (b.customer._id === user?._id || b.customer === user?._id));
      setBookings(myBookings);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/packages`, headers);
      setPackages(res.data);
    } catch (err) { console.error('Error fetching packages:', err); }
  };
 
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reviews/customer/${user?._id}`, headers);
      setReviews(res.data);
    } catch (err) { console.error('Error fetching reviews:', err); }
  };
 
  const handlePackageSelect = (e) => {
    const pkgId = e.target.value;
    const selected = packages.find(p => p._id === pkgId);
    setBookingForm({ ...bookingForm, package: pkgId, estimatedCost: selected ? selected.price : 0, finalCost: selected ? selected.price : 0, promoCode: '', promoId: '', discount: 0 });
    setPromoStatus(null);
  };
 
  const handleValidatePromo = async () => {
    const cost = bookingForm.estimatedCost;
    if (!bookingForm.promoCode) return;
    if (!cost || cost <= 0) { setPromoStatus({ valid: false, message: 'Please select a package first' }); return; }
    setValidatingPromo(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/promotions/validate`, { code: bookingForm.promoCode, orderAmount: cost, serviceName: bookingForm.serviceType }, headers);
      setPromoStatus({ valid: true, message: `Promo applied! You save ৳${res.data.discountAmount}`, ...res.data });
      setBookingForm(prev => ({ ...prev, promoId: res.data.promoId, discount: res.data.discountAmount, finalCost: res.data.finalAmount }));
    } catch (err) {
      setPromoStatus({ valid: false, message: err.response?.data?.message || 'Invalid promo code' });
      setBookingForm(prev => ({ ...prev, promoId: '', discount: 0, finalCost: prev.estimatedCost }));
    } finally { setValidatingPromo(false); }
  };
 
  const handleValidatePaymentPromo = async (bookingCost) => {
    if (!paymentForm.promoCode) return;
    setValidatingPromo(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/promotions/validate`, { code: paymentForm.promoCode, orderAmount: bookingCost }, headers);
      setPaymentPromoStatus({ valid: true, message: `Promo applied! You save ৳${res.data.discountAmount}`, ...res.data });
      setPaymentForm(prev => ({ ...prev, promoId: res.data.promoId, discount: res.data.discountAmount }));
    } catch (err) {
      setPaymentPromoStatus({ valid: false, message: err.response?.data?.message || 'Invalid promo code' });
      setPaymentForm(prev => ({ ...prev, promoId: '', discount: 0 }));
    } finally { setValidatingPromo(false); }
  };
 
  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/vehicles/${id}`, headers);
      fetchCustomerData();
    } catch (err) { console.error('Error deleting vehicle:', err); }
  };
 
  const handleCancelBooking = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/bookings/${id}`, headers);
      fetchCustomerData();
    } catch (err) { console.error('Error cancelling booking:', err); }
  };
 
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/vehicles`, vehicleForm, headers);
      setVehicleForm({ model: '', fuelType: '', mileage: '', year: '', licensePlate: '' });
      fetchCustomerData();
      alert('Vehicle added successfully!');
    } catch (err) { alert('Error adding vehicle'); }
  };
 
  const handleBookService = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/bookings`, {
        vehicle: bookingForm.vehicle,
        serviceType: bookingForm.serviceType,
        preferredDate: bookingForm.preferredDate,
        package: bookingForm.package || undefined,
        estimatedCost: bookingForm.estimatedCost,
        finalCost: bookingForm.finalCost || bookingForm.estimatedCost,
        promoCode: bookingForm.promoCode || undefined,
        discount: bookingForm.discount || 0
      }, headers);
      if (bookingForm.promoId) {
        await axios.patch(`${API_BASE_URL}/api/promotions/${bookingForm.promoId}/use`, {}, headers);
      }
      setBookingForm({ serviceType: '', preferredDate: '', vehicle: '', package: '', estimatedCost: 0, promoCode: '', promoId: '', discount: 0, finalCost: 0 });
      setPromoStatus(null);
      fetchCustomerData();
      alert('Booking created successfully!');
    } catch (err) { alert('Error creating booking'); }
  };
 
  const handlePayment = async (booking) => {
    const cost = booking.finalCost || booking.estimatedCost || 0;
    const finalPayable = Math.max(0, cost - (paymentForm.discount || 0));
    try {
      await axios.post(`${API_BASE_URL}/api/payments`, {
        booking: booking._id, amount: finalPayable, method: paymentForm.method,
        promoCode: paymentForm.promoCode || undefined, discount: paymentForm.discount || 0, status: 'Paid'
      }, headers);
      if (paymentForm.promoId) {
        await axios.patch(`${API_BASE_URL}/api/promotions/${paymentForm.promoId}/use`, {}, headers);
      }
      setPayingBookingId(null);
      setPaymentForm({ method: 'card', promoCode: '', promoId: '', discount: 0 });
      setPaymentPromoStatus(null);
      fetchCustomerData();
      alert(`Payment of ৳${finalPayable} successful!`);
    } catch (err) { alert(err.response?.data?.message || 'Payment failed'); }
  };
 
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.booking || !reviewForm.mechanic) {
      alert('Please select a completed booking to review');
      return;
    }
    setReviewSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/reviews`, {
        customer: user._id,
        mechanic: reviewForm.mechanic,
        booking: reviewForm.booking,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }, headers);
      setReviewForm({ booking: '', mechanic: '', rating: 5, comment: '' });
      fetchReviews();
      alert('Review submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    } finally { setReviewSubmitting(false); }
  };
 
  // Get completed bookings that have a mechanic assigned
  const completedBookings = bookings.filter(b => b.status === 'Completed' && b.mechanic);
  const reviewedBookingIds = reviews.map(r => r.booking?._id || r.booking);
 
  const handleLogout = () => { logout(); navigate('/login'); };
 
  const StarRating = ({ value, onChange, hoverable }) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => hoverable && setHoverRating(star)}
          onMouseLeave={() => hoverable && setHoverRating(0)}
          style={{
            fontSize: '24px',
            cursor: onChange ? 'pointer' : 'default',
            color: star <= (hoverable ? (hoverRating || value) : value) ? '#ffc107' : '#dee2e6',
            transition: 'color 0.1s'
          }}
        >★</span>
      ))}
    </div>
  );
 
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
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>🏠 Home</button>
        <button className={activeTab === 'vehicles' ? 'active' : ''} onClick={() => setActiveTab('vehicles')}>🚗 My Vehicles</button>
        <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>📅 My Bookings</button>
        <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>🔧 Services</button>
        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>⭐ Reviews</button>
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
                <button onClick={() => setActiveTab('vehicles')} className="cta-btn">Manage Your Vehicles</button>
              </div>
            </div>
            <div className="services-overview">
              <h3>Our Services</h3>
              <div className="services-grid">
                <div className="service-card"><span className="service-icon">🔧</span><h4>General Maintenance</h4><p>Regular maintenance and check-ups</p></div>
                <div className="service-card"><span className="service-icon">⚙️</span><h4>Engine Service</h4><p>Complete engine diagnostics and service</p></div>
                <div className="service-card"><span className="service-icon">🔩</span><h4>Parts Replacement</h4><p>Quality parts replacement and installation</p></div>
                <div className="service-card"><span className="service-icon">🛠️</span><h4>Emergency Repair</h4><p>Quick emergency repair services</p></div>
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
                <input type="text" placeholder="Model (e.g., Toyota Corolla)" value={vehicleForm.model} onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})} required />
                <select value={vehicleForm.fuelType} onChange={(e) => setVehicleForm({...vehicleForm, fuelType: e.target.value})} required>
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </select>
                <input type="number" placeholder="Mileage (km)" value={vehicleForm.mileage} onChange={(e) => setVehicleForm({...vehicleForm, mileage: e.target.value})} required />
                <input type="number" placeholder="Year" value={vehicleForm.year} onChange={(e) => setVehicleForm({...vehicleForm, year: e.target.value})} required />
                <input type="text" placeholder="License Plate" value={vehicleForm.licensePlate} onChange={(e) => setVehicleForm({...vehicleForm, licensePlate: e.target.value})} required />
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
                      <button onClick={() => handleDeleteVehicle(vehicle._id)}>Remove</button>
                    </div>
                  ))}
                </div>
              ) : <p className="no-data">No vehicles added yet. Add your first vehicle above!</p>}
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
                <select value={bookingForm.vehicle} onChange={(e) => setBookingForm({...bookingForm, vehicle: e.target.value})} required>
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => <option key={v._id} value={v._id}>{v.model} ({v.licensePlate})</option>)}
                </select>
                <select value={bookingForm.serviceType} onChange={(e) => setBookingForm({...bookingForm, serviceType: e.target.value})} required>
                  <option value="">Select Service Type</option>
                  <option value="General Maintenance">🔧 General Maintenance — ৳2,000 to ৳10,000</option>
                  <option value="Parts Replacement">🔩 Parts Replacement — ৳3,000 to ৳50,000+</option>
                  <option value="Emergency Repair">⚠️ Emergency Repair — ৳5,000 to ৳80,000</option>
                  <option value="Engine Service">🔥 Engine Service — ৳10,000 to ৳5,00,000+</option>
                </select>
                <input type="date" value={bookingForm.preferredDate} onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})} required />
                <select value={bookingForm.package} onChange={handlePackageSelect}>
                  <option value="">Select Package (optional)</option>
                  {packages.map(pkg => <option key={pkg._id} value={pkg._id}>{pkg.name} — ৳{pkg.price}</option>)}
                </select>
                {bookingForm.estimatedCost > 0 && (
                  <div style={styles.costBox}>
                    <div style={styles.costRow}><span style={styles.costLabel}>Estimated Cost</span><span style={styles.costValue}>৳{bookingForm.estimatedCost}</span></div>
                    {bookingForm.discount > 0 && (<div style={styles.costRow}><span style={{ ...styles.costLabel, color: '#198754' }}>Discount</span><span style={{ ...styles.costValue, color: '#198754' }}>- ৳{bookingForm.discount}</span></div>)}
                    {bookingForm.discount > 0 && (<div style={{ ...styles.costRow, borderTop: '1px solid #dee2e6', paddingTop: '8px', marginTop: '4px' }}><span style={{ ...styles.costLabel, fontWeight: '700' }}>Total Payable</span><span style={{ ...styles.costValue, fontWeight: '700', color: '#0d6efd', fontSize: '16px' }}>৳{bookingForm.finalCost}</span></div>)}
                  </div>
                )}
                <div style={styles.promoRow}>
                  <input type="text" placeholder="Promo code (optional)" value={bookingForm.promoCode} onChange={(e) => { setBookingForm({ ...bookingForm, promoCode: e.target.value.toUpperCase(), promoId: '', discount: 0, finalCost: bookingForm.estimatedCost }); setPromoStatus(null); }} style={styles.promoInput} />
                  <button type="button" onClick={handleValidatePromo} disabled={validatingPromo || !bookingForm.promoCode} style={styles.promoBtn}>{validatingPromo ? 'Checking...' : 'Apply'}</button>
                </div>
                {promoStatus && (<p style={{ margin: '4px 0 0', fontSize: '13px', color: promoStatus.valid ? '#198754' : '#dc3545' }}>{promoStatus.valid ? '✓' : '✗'} {promoStatus.message}</p>)}
                <button type="submit">Book Service</button>
              </form>
            </div>
 
            <div className="bookings-list">
              <h3>Your Bookings</h3>
              {bookings.length > 0 ? (
                <table>
                  <thead>
                    <tr><th>Service Type</th><th>Date</th><th>Cost</th><th>Status</th><th>Payment</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <React.Fragment key={booking._id}>
                        <tr>
                          <td>{booking.serviceType}</td>
                          <td>{new Date(booking.preferredDate).toLocaleDateString()}</td>
                          <td>৳{booking.finalCost || booking.estimatedCost || 0}</td>
                          <td><span className={`status ${booking.status?.toLowerCase()}`}>{booking.status}</span></td>
                          <td>
                            {booking.paymentStatus === 'Paid' ? (
                              <span style={{ color: '#198754', fontWeight: '600', fontSize: '13px' }}>✓ Paid</span>
                            ) : (
                              <button onClick={() => { setPayingBookingId(booking._id); setPaymentForm({ method: 'card', promoCode: '', promoId: '', discount: 0 }); setPaymentPromoStatus(null); }} style={styles.payBtn}>Pay Now</button>
                            )}
                          </td>
                          <td>
                            {booking.status !== 'Completed' && (
                              <button onClick={() => handleCancelBooking(booking._id)} style={{ background: '#ff6b6b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                            )}
                          </td>
                        </tr>
                        {payingBookingId === booking._id && (
                          <tr>
                            <td colSpan="6" style={{ background: '#f8f9fa', padding: '20px' }}>
                              <div style={styles.paymentPanel}>
                                <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700' }}>💳 Complete Payment</h4>
                                <div style={styles.paymentGrid}>
                                  <div>
                                    <label style={styles.payLabel}>Payment Method</label>
                                    <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} style={styles.paySelect}>
                                      <option value="card">Credit / Debit Card</option>
                                      <option value="cash">Cash</option>
                                      <option value="mobile_banking">Mobile Banking</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label style={styles.payLabel}>Promo Code (optional)</label>
                                    <div style={styles.promoRow}>
                                      <input type="text" placeholder="Enter code" value={paymentForm.promoCode} onChange={(e) => { setPaymentForm({ ...paymentForm, promoCode: e.target.value.toUpperCase(), promoId: '', discount: 0 }); setPaymentPromoStatus(null); }} style={{ ...styles.promoInput, flex: 1 }} />
                                      <button type="button" onClick={() => handleValidatePaymentPromo(booking.finalCost || booking.estimatedCost || 0)} disabled={validatingPromo || !paymentForm.promoCode} style={styles.promoBtn}>{validatingPromo ? '...' : 'Apply'}</button>
                                    </div>
                                    {paymentPromoStatus && (<p style={{ margin: '4px 0 0', fontSize: '12px', color: paymentPromoStatus.valid ? '#198754' : '#dc3545' }}>{paymentPromoStatus.valid ? '✓' : '✗'} {paymentPromoStatus.message}</p>)}
                                  </div>
                                </div>
                                <div style={{ ...styles.costBox, marginTop: '16px' }}>
                                  <div style={styles.costRow}><span style={styles.costLabel}>Amount Due</span><span style={styles.costValue}>৳{booking.finalCost || booking.estimatedCost || 0}</span></div>
                                  {paymentForm.discount > 0 && (<div style={styles.costRow}><span style={{ ...styles.costLabel, color: '#198754' }}>Promo Discount</span><span style={{ ...styles.costValue, color: '#198754' }}>- ৳{paymentForm.discount}</span></div>)}
                                  <div style={{ ...styles.costRow, borderTop: '1px solid #dee2e6', paddingTop: '8px', marginTop: '4px' }}>
                                    <span style={{ ...styles.costLabel, fontWeight: '700' }}>Total Payable</span>
                                    <span style={{ ...styles.costValue, fontWeight: '700', color: '#0d6efd', fontSize: '16px' }}>৳{Math.max(0, (booking.finalCost || booking.estimatedCost || 0) - (paymentForm.discount || 0))}</span>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                  <button onClick={() => handlePayment(booking)} style={styles.confirmPayBtn}>Confirm Payment</button>
                                  <button onClick={() => { setPayingBookingId(null); setPaymentPromoStatus(null); }} style={styles.cancelPayBtn}>Cancel</button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : <p className="no-data">No bookings yet. Book your first service above!</p>}
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
                  { icon: '🔧', title: 'General Maintenance', desc: 'Oil change, filters, basic check-up and fluids top-up.', price: '৳2,000 – ৳10,000' },
                  { icon: '🔥', title: 'Engine Service', desc: 'Minor repair, full overhaul, or engine replacement.', price: '৳10,000 – ৳5,00,000+' },
                  { icon: '🔩', title: 'Parts Replacement', desc: 'Battery, brake pads, suspension, AC compressor and more.', price: '৳3,000 – ৳50,000+' },
                  { icon: '⚠️', title: 'Emergency Repair', desc: 'Fast response for sudden breakdowns and on-site fixes.', price: '৳5,000 – ৳80,000' },
                ].map((svc, idx) => (
                  <div key={idx} className="service-card">
                    <span className="service-icon">{svc.icon}</span>
                    <h4>{svc.title}</h4>
                    <p>{svc.desc}</p>
                    <p style={{ marginTop: '10px', fontWeight: '700', fontSize: '13px', color: '#667eea' }}>{svc.price}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bookings-list" style={{ marginTop: '40px' }}>
              <h3>Your Service Records</h3>
              {bookings.length > 0 ? (
                <table>
                  <thead><tr><th>Type</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td>{b.serviceType}</td>
                        <td>{new Date(b.preferredDate).toLocaleDateString()}</td>
                        <td><span className={`status ${b.status?.toLowerCase()}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="no-data">No past services found.</p>}
            </div>
          </div>
        )}
 
        {/* ── Reviews Tab ──────────────────────────────────────── */}
        {activeTab === 'reviews' && (
          <div className="bookings-section">
            <h2>⭐ Rate Your Mechanic</h2>
 
            {/* Submit Review Form */}
            <div className="booking-form-container">
              <h3>Leave a Review</h3>
 
              {completedBookings.length === 0 ? (
                <p style={{ color: '#6c757d', fontSize: '14px' }}>
                  You don't have any completed services to review yet. Reviews are available once a service is marked as completed.
                </p>
              ) : (
                <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 
                  {/* Select Booking */}
                  <div>
                    <label style={styles.payLabel}>Select Completed Service</label>
                    <select
                      value={reviewForm.booking}
                      onChange={(e) => {
                        const selected = completedBookings.find(b => b._id === e.target.value);
                        setReviewForm({
                          ...reviewForm,
                          booking: e.target.value,
                          mechanic: selected?.mechanic?._id || selected?.mechanic || ''
                        });
                      }}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }}
                      required
                    >
                      <option value="">Select a completed service</option>
                      {completedBookings
                        .filter(b => !reviewedBookingIds.includes(b._id))
                        .map(b => (
                          <option key={b._id} value={b._id}>
                            {b.serviceType} — {new Date(b.preferredDate).toLocaleDateString()} — Mechanic: {b.mechanic?.name || 'N/A'}
                          </option>
                        ))}
                    </select>
                    {completedBookings.filter(b => !reviewedBookingIds.includes(b._id)).length === 0 && (
                      <p style={{ color: '#198754', fontSize: '13px', marginTop: '6px' }}>✓ You have reviewed all your completed services!</p>
                    )}
                  </div>
 
                  {/* Star Rating */}
                  <div>
                    <label style={styles.payLabel}>Rating</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            fontSize: '32px', cursor: 'pointer',
                            color: star <= (hoverRating || reviewForm.rating) ? '#ffc107' : '#dee2e6',
                            transition: 'color 0.1s'
                          }}
                        >★</span>
                      ))}
                      <span style={{ fontSize: '14px', color: '#6c757d' }}>
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoverRating || reviewForm.rating]}
                      </span>
                    </div>
                  </div>
 
                  {/* Comment */}
                  <div>
                    <label style={styles.payLabel}>Comment <span style={{ fontWeight: '400', color: '#adb5bd' }}>(optional)</span></label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience with the mechanic..."
                      rows={4}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
 
                  <button
                    type="submit"
                    disabled={reviewSubmitting || !reviewForm.booking}
                    style={{ ...styles.confirmPayBtn, opacity: reviewSubmitting ? 0.7 : 1, cursor: reviewSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
 
            {/* Past Reviews */}
            <div className="bookings-list" style={{ marginTop: '30px' }}>
              <h3>Your Past Reviews</h3>
              {reviews.length > 0 ? (
                <table>
                  <thead>
                    <tr><th>Mechanic</th><th>Service</th><th>Rating</th><th>Comment</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {reviews.map(r => (
                      <tr key={r._id}>
                        <td><strong>{r.mechanic?.name || 'N/A'}</strong></td>
                        <td>{r.booking?.serviceType || '—'}</td>
                        <td>
                          <span style={{ color: '#ffc107', fontSize: '16px', letterSpacing: '2px' }}>
                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          </span>
                          <span style={{ fontSize: '12px', color: '#6c757d', marginLeft: '6px' }}>{r.rating}/5</span>
                        </td>
                        <td style={{ maxWidth: '200px', fontSize: '13px', color: '#495057' }}>{r.comment || '—'}</td>
                        <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="no-data">No reviews submitted yet.</p>}
            </div>
          </div>
        )}
 
      </div>
    </div>
  );
};
 
const styles = {
  costBox: { background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '14px 16px', marginTop: '4px' },
  costRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' },
  costLabel: { fontSize: '13px', color: '#6c757d' },
  costValue: { fontSize: '14px', fontWeight: '600', color: '#212529' },
  promoRow: { display: 'flex', gap: '8px', alignItems: 'center' },
  promoInput: { flex: 1, padding: '10px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', letterSpacing: '1px' },
  promoBtn: { padding: '10px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' },
  payBtn: { background: '#0d6efd', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  paymentPanel: { background: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid #dee2e6', maxWidth: '600px' },
  paymentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  payLabel: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#495057', marginBottom: '6px' },
  paySelect: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' },
  confirmPayBtn: { padding: '10px 24px', background: '#198754', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  cancelPayBtn: { padding: '10px 20px', background: '#fff', color: '#6c757d', border: '1px solid #dee2e6', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }
};
 
export default CustomerDashboard;