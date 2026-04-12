import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Customer' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = ['Customer', 'Mechanic', 'Admin'];

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.brandArea}>
          <div style={styles.logoCircle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" opacity="0.9"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={styles.brandName}>SmartGarage</h1>
          <p style={styles.brandTagline}>Management System</p>
        </div>

        <div style={styles.featureList}>
          {[
            { icon: '🔧', text: 'Track all vehicle services' },
            { icon: '📊', text: 'Real-time analytics dashboard' },
            { icon: '🔔', text: 'Automated service reminders' },
            { icon: '💳', text: 'Seamless payment processing' },
          ].map((f, i) => (
            <div key={i} style={styles.featureItem}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <span style={styles.featureText}>{f.text}</span>
            </div>
          ))}
        </div>

        <p style={styles.leftFooter}>© 2026 SmartGarage. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>

          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create an account</h2>
            <p style={styles.formSubtitle}>Join SmartGarage to manage your vehicle services</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>

            {/* Full Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                  style={styles.input}
                  onFocus={e => e.target.parentNode.style.borderColor = '#0d6efd'}
                  onBlur={e => e.target.parentNode.style.borderColor = '#dee2e6'}
                />
              </div>
            </div>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  style={styles.input}
                  onFocus={e => e.target.parentNode.style.borderColor = '#0d6efd'}
                  onBlur={e => e.target.parentNode.style.borderColor = '#dee2e6'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  style={{ ...styles.input, paddingRight: '44px' }}
                  onFocus={e => e.target.parentNode.style.borderColor = '#0d6efd'}
                  onBlur={e => e.target.parentNode.style.borderColor = '#dee2e6'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Register as</label>
              <div style={styles.roleGrid}>
                {roles.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    style={{
                      ...styles.roleBtn,
                      background: form.role === role ? '#0d6efd' : '#f8f9fa',
                      color: form.role === role ? '#fff' : '#495057',
                      border: form.role === role ? '2px solid #0d6efd' : '2px solid #dee2e6',
                      fontWeight: form.role === role ? '600' : '400'
                    }}
                  >
                    <span style={{ fontSize: '18px', marginBottom: '4px' }}>
                      {role === 'Customer' ? '🚗' : role === 'Mechanic' ? '🔧' : '👤'}
                    </span>
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={styles.spinner} /> Creating account...
                </span>
              ) : 'Create Account'}
            </button>

          </form>

          <p style={styles.loginLink}>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={styles.loginAnchor}
            >
              Sign in
            </span>
          </p>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #adb5bd; }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f8f9fa'
  },
  leftPanel: {
    width: '420px',
    flexShrink: 0,
    background: 'linear-gradient(145deg, #0d6efd 0%, #0043a8 100%)',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden'
  },
  brandArea: {
    marginBottom: '56px'
  },
  logoCircle: {
    width: '56px',
    height: '56px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  brandName: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 4px',
    color: '#fff'
  },
  brandTagline: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.65)',
    margin: 0
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    flex: 1
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  featureIcon: {
    fontSize: '22px',
    width: '44px',
    height: '44px',
    background: 'rgba(255,255,255,0.12)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  featureText: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500'
  },
  leftFooter: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '48px'
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px'
  },
  formCard: {
    width: '100%',
    maxWidth: '460px',
    background: '#fff',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)'
  },
  formHeader: {
    marginBottom: '32px'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    margin: '0 0 6px'
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#6c757d',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#495057'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid #dee2e6',
    borderRadius: '10px',
    padding: '0 14px',
    background: '#fff',
    transition: 'border-color 0.2s ease',
    position: 'relative'
  },
  inputIcon: {
    color: '#adb5bd',
    flexShrink: 0,
    marginRight: '10px'
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#212529',
    padding: '12px 0',
    background: 'transparent'
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    right: '14px'
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px'
  },
  roleBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 8px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    gap: '2px'
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    background: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    marginTop: '4px',
    transition: 'background 0.2s ease'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite'
  },
  loginLink: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6c757d',
    marginTop: '24px',
    marginBottom: 0
  },
  loginAnchor: {
    color: '#0d6efd',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default Register;