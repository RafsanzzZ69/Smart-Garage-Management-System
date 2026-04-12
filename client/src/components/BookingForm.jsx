import React, { useState, useEffect } from 'react';
import axios from 'axios';

const steps = ['Vehicle', 'Package', 'Schedule', 'Confirm'];

const BookingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    vehicleId: '',
    vehicleName: '',
    selectedPackage: null,
    date: '',
    time: '',
    notes: ''
  });

  // Fetch packages when step 1 is reached
  useEffect(() => {
    if (currentStep === 1 && packages.length === 0) {
      setLoadingPackages(true);
      axios.get('/api/packages')
        .then(res => setPackages(res.data))
        .catch(() => setPackages([]))
        .finally(() => setLoadingPackages(false));
    }
  }, [currentStep]);

  const validate = () => {
    const newErrors = {};
    if (currentStep === 0 && !formData.vehicleName.trim()) {
      newErrors.vehicleName = 'Please enter your vehicle';
    }
    if (currentStep === 1 && !formData.selectedPackage) {
      newErrors.selectedPackage = 'Please select a service package';
    }
    if (currentStep === 2) {
      if (!formData.date) newErrors.date = 'Please select a date';
      if (!formData.time) newErrors.time = 'Please select a time';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post('/api/bookings', {
        vehicle: formData.vehicleId,
        package: formData.selectedPackage?._id,
        serviceDate: formData.date,
        timeSlot: formData.time,
        notes: formData.notes
      });
      setSubmitted(true);
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.successBox}>
        <div style={styles.successIcon}>✓</div>
        <h4 style={styles.successTitle}>Booking Confirmed!</h4>
        <p style={styles.successText}>
          Your <strong>{formData.selectedPackage?.name}</strong> service has been booked for{' '}
          <strong>{formData.date}</strong> at <strong>{formData.time}</strong>.
        </p>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          You will receive a confirmation notification shortly.
        </p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => {
            setSubmitted(false);
            setCurrentStep(0);
            setFormData({ vehicleId: '', vehicleName: '', selectedPackage: null, date: '', time: '', notes: '' });
          }}
        >
          Book Another Service
        </button>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h4 style={styles.title}>Book a Service</h4>
          <p style={styles.subtitle}>Step {currentStep + 1} of {steps.length}</p>
        </div>

        {/* Step Progress Bar */}
        <div style={styles.stepBar}>
          {steps.map((step, i) => (
            <div key={step} style={styles.stepItem}>
              <div style={{
                ...styles.stepCircle,
                background: i < currentStep ? '#198754' : i === currentStep ? '#0d6efd' : '#dee2e6',
                color: i <= currentStep ? '#fff' : '#6c757d'
              }}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span style={{
                ...styles.stepLabel,
                color: i === currentStep ? '#0d6efd' : i < currentStep ? '#198754' : '#adb5bd',
                fontWeight: i === currentStep ? '600' : '400'
              }}>{step}</span>
              {i < steps.length - 1 && (
                <div style={{
                  ...styles.stepLine,
                  background: i < currentStep ? '#198754' : '#dee2e6'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div style={styles.body}>

          {/* Step 0: Vehicle */}
          {currentStep === 0 && (
            <div>
              <h5 style={styles.stepTitle}>Select Your Vehicle</h5>
              <p style={styles.stepDesc}>Which vehicle are you bringing in for service?</p>
              <div className="mb-3">
                <label className="form-label fw-semibold">Vehicle</label>
                <input
                  className={`form-control ${errors.vehicleName ? 'is-invalid' : ''}`}
                  placeholder="e.g. Toyota Corolla 2020"
                  value={formData.vehicleName}
                  onChange={e => setFormData({ ...formData, vehicleName: e.target.value })}
                />
                {errors.vehicleName && <div className="invalid-feedback">{errors.vehicleName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Additional Notes <span style={{ color: '#adb5bd', fontWeight: '400' }}>(optional)</span>
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Any specific issues or concerns..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 1: Package Selection */}
          {currentStep === 1 && (
            <div>
              <h5 style={styles.stepTitle}>Choose a Service Package</h5>
              <p style={styles.stepDesc}>Select the package that best fits your vehicle's needs.</p>

              {errors.selectedPackage && (
                <div className="alert alert-danger py-2 mb-3">{errors.selectedPackage}</div>
              )}

              {loadingPackages ? (
                <div style={styles.loadingBox}>
                  <div className="spinner-border text-primary" role="status" />
                  <p style={{ marginTop: '12px', color: '#6c757d' }}>Loading packages...</p>
                </div>
              ) : packages.length === 0 ? (
                <div className="alert alert-warning">No service packages available at the moment.</div>
              ) : (
                <div style={styles.packageGrid}>
                  {packages.map((pkg) => {
                    const isSelected = formData.selectedPackage?._id === pkg._id;
                    return (
                      <div
                        key={pkg._id}
                        style={{
                          ...styles.packageCard,
                          border: isSelected ? '2px solid #0d6efd' : '1.5px solid #dee2e6',
                          background: isSelected ? '#f0f5ff' : '#fff',
                          transform: isSelected ? 'translateY(-2px)' : 'none',
                          boxShadow: isSelected
                            ? '0 4px 16px rgba(13,110,253,0.15)'
                            : '0 1px 4px rgba(0,0,0,0.06)'
                        }}
                        onClick={() => setFormData({ ...formData, selectedPackage: pkg })}
                      >
                        {isSelected && (
                          <div style={styles.selectedBadge}>✓ Selected</div>
                        )}
                        <div style={styles.pkgName}>{pkg.name}</div>
                        {pkg.description && (
                          <div style={styles.pkgDesc}>{pkg.description}</div>
                        )}
                        {pkg.services && pkg.services.length > 0 && (
                          <ul style={styles.serviceList}>
                            {pkg.services.map((s, i) => (
                              <li key={i} style={styles.serviceItem}>
                                <span style={styles.checkDot}>✓</span> {s}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div style={styles.pkgFooter}>
                          <span style={styles.pkgPrice}>${pkg.price?.toFixed(2)}</span>
                          {pkg.estimatedDuration && (
                            <span style={styles.pkgDuration}>⏱ ~{pkg.estimatedDuration} min</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div>
              <h5 style={styles.stepTitle}>Pick a Date & Time</h5>
              <p style={styles.stepDesc}>When would you like to bring your vehicle in?</p>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                  {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Time Slot</label>
                  <select
                    className={`form-select ${errors.time ? 'is-invalid' : ''}`}
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                  >
                    <option value="">Select a time</option>
                    {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.time && <div className="invalid-feedback">{errors.time}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && (
            <div>
              <h5 style={styles.stepTitle}>Confirm Your Booking</h5>
              <p style={styles.stepDesc}>Please review your details before confirming.</p>
              <div style={styles.summaryBox}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Vehicle</span>
                  <span style={styles.summaryValue}>{formData.vehicleName}</span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Package</span>
                  <span style={styles.summaryValue}>{formData.selectedPackage?.name}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Services</span>
                  <span style={styles.summaryValue}>
                    {formData.selectedPackage?.services?.join(', ') || '—'}
                  </span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Date</span>
                  <span style={styles.summaryValue}>{formData.date}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Time</span>
                  <span style={styles.summaryValue}>{formData.time}</span>
                </div>
                {formData.notes && (
                  <>
                    <div style={styles.summaryDivider} />
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>Notes</span>
                      <span style={styles.summaryValue}>{formData.notes}</span>
                    </div>
                  </>
                )}
                <div style={styles.summaryDivider} />
                <div style={{ ...styles.summaryRow, marginTop: '4px' }}>
                  <span style={{ ...styles.summaryLabel, fontWeight: '700', fontSize: '15px' }}>Total</span>
                  <span style={{ ...styles.summaryValue, fontWeight: '700', fontSize: '18px', color: '#0d6efd' }}>
                    ${formData.selectedPackage?.price?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={styles.footer}>
          {currentStep > 0 && (
            <button className="btn btn-outline-secondary" onClick={handleBack} disabled={submitting}>
              ← Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {currentStep < steps.length - 1 ? (
            <button className="btn btn-primary px-4" onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button
              className="btn btn-success px-4"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? <><span className="spinner-border spinner-border-sm me-2" />Booking...</>
                : 'Confirm Booking'
              }
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  wrapper: { maxWidth: '720px', margin: '0 auto', padding: '24px 16px' },
  card: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    overflow: 'hidden'
  },
  header: { padding: '24px 28px 16px', borderBottom: '1px solid #f1f3f5' },
  title: { margin: 0, fontWeight: '700', fontSize: '20px', color: '#212529' },
  subtitle: { margin: '4px 0 0', color: '#adb5bd', fontSize: '13px' },
  stepBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '18px 28px',
    borderBottom: '1px solid #f1f3f5'
  },
  stepItem: { display: 'flex', alignItems: 'center', flex: 1 },
  stepCircle: {
    width: '30px', height: '30px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '600', flexShrink: 0,
    transition: 'all 0.3s ease'
  },
  stepLabel: { fontSize: '12px', marginLeft: '6px', whiteSpace: 'nowrap' },
  stepLine: { flex: 1, height: '2px', margin: '0 8px', transition: 'background 0.3s ease' },
  body: { padding: '28px' },
  footer: {
    display: 'flex', alignItems: 'center',
    padding: '18px 28px',
    borderTop: '1px solid #f1f3f5',
    background: '#fafafa'
  },
  stepTitle: { fontWeight: '700', fontSize: '17px', marginBottom: '4px', color: '#212529' },
  stepDesc: { color: '#6c757d', fontSize: '14px', marginBottom: '20px' },
  loadingBox: { textAlign: 'center', padding: '48px 0' },
  packageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '14px'
  },
  packageCard: {
    borderRadius: '12px', padding: '16px',
    cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative'
  },
  selectedBadge: {
    position: 'absolute', top: '10px', right: '10px',
    background: '#0d6efd', color: '#fff',
    fontSize: '11px', fontWeight: '600',
    padding: '2px 8px', borderRadius: '20px'
  },
  pkgName: { fontWeight: '700', fontSize: '15px', color: '#212529', marginBottom: '6px' },
  pkgDesc: { fontSize: '13px', color: '#6c757d', marginBottom: '10px', lineHeight: '1.4' },
  serviceList: { listStyle: 'none', padding: 0, margin: '0 0 12px' },
  serviceItem: {
    fontSize: '13px', color: '#495057', marginBottom: '4px',
    display: 'flex', alignItems: 'center', gap: '6px'
  },
  checkDot: { color: '#198754', fontWeight: '700', fontSize: '12px' },
  pkgFooter: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: '8px', paddingTop: '10px', borderTop: '1px solid #e9ecef'
  },
  pkgPrice: { fontWeight: '700', fontSize: '17px', color: '#0d6efd' },
  pkgDuration: { fontSize: '12px', color: '#adb5bd' },
  summaryBox: { background: '#f8f9fa', borderRadius: '12px', padding: '20px 24px' },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', padding: '6px 0'
  },
  summaryLabel: { fontSize: '14px', color: '#6c757d', minWidth: '90px' },
  summaryValue: {
    fontSize: '14px', color: '#212529', fontWeight: '500',
    textAlign: 'right', maxWidth: '65%'
  },
  summaryDivider: { height: '1px', background: '#e9ecef', margin: '8px 0' },
  successBox: {
    textAlign: 'center', padding: '48px 32px',
    background: '#fff', borderRadius: '16px',
    border: '1px solid #e9ecef',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    maxWidth: '480px', margin: '0 auto'
  },
  successIcon: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: '#d1e7dd', color: '#198754',
    fontSize: '28px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px'
  },
  successTitle: { fontWeight: '700', color: '#212529', marginBottom: '8px' },
  successText: { color: '#495057', fontSize: '15px' }
};

export default BookingForm;
