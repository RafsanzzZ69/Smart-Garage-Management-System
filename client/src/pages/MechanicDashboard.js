import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './MechanicDashboard.css';

const API_BASE_URL = 'http://localhost:8000';

const MechanicDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState({ totalEarnings: 0, completedJobs: 0, pendingJobs: 0 });
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMechanicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMechanicData = async () => {
    try {
      setLoading(true);
      
      // Fetch jobs assigned to this mechanic
      const jobsRes = await axios.get(`${API_BASE_URL}/api/services?mechanic=${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobsRes.data || []);

      // Calculate earnings
      const completedJobs = (jobsRes.data || []).filter(j => j.status === 'Completed');
      const totalEarnings = completedJobs.length * 500; // $500 per completed job (example)

      setEarnings({
        totalEarnings: totalEarnings,
        completedJobs: completedJobs.length,
        pendingJobs: (jobsRes.data || []).filter(j => j.status !== 'Completed').length
      });
    } catch (error) {
      console.error('Error fetching mechanic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAcceptJob = async (jobId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/services/${jobId}`,
        { status: 'Assigned' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMechanicData();
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const handleOpenStatusModal = (job) => {
    setSelectedJob(job);
    setNewStatus(job.status);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/services/${selectedJob._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowStatusModal(false);
      fetchMechanicData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCompleteJob = async (jobId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/services/${jobId}`,
        { status: 'Completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMechanicData();
    } catch (error) {
      console.error('Error completing job:', error);
    }
  };

  return (
    <div className="mechanic-dashboard">
      {/* Header */}
      <header className="mechanic-header">
        <div className="mechanic-header-content">
          <h1>🔧 Mechanic Panel</h1>
          <div className="mechanic-user-info">
            <span>Welcome, <strong>{user?.name}</strong>!</span>
            <button onClick={handleLogout} className="mechanic-logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="mechanic-stats">
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">৳{earnings.totalEarnings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed Jobs</div>
          <div className="stat-value">{earnings.completedJobs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Jobs</div>
          <div className="stat-value">{earnings.pendingJobs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Jobs</div>
          <div className="stat-value">{jobs.length}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mechanic-nav">
        <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>
          📋 My Jobs
        </button>
        <button className={activeTab === 'earnings' ? 'active' : ''} onClick={() => setActiveTab('earnings')}>
          💰 Earnings
        </button>
        <button className={activeTab === 'performance' ? 'active' : ''} onClick={() => setActiveTab('performance')}>
          📊 Performance
        </button>
      </nav>

      {/* Content */}
      <div className="mechanic-content">
        {loading && <div className="loading">Loading...</div>}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <h2>📋 My Assigned Jobs</h2>
            {jobs.length > 0 ? (
              <div className="jobs-container">
                {jobs.map(job => (
                  <div key={job._id} className="job-card">
                    <div className="job-header">
                      <span className="job-id">Job #{job._id.slice(-6)}</span>
                      <span className={`job-status-badge status-${job.status.toLowerCase()}`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="job-service-type">
                      {job.serviceType || 'General Service'}
                    </div>

                    <div className="job-details">
                      <div className="job-detail-row">
                        <span className="job-detail-label">Vehicle:</span>
                        <span className="job-detail-value">{job.vehicle?.model || 'N/A'}</span>
                      </div>
                      <div className="job-detail-row">
                        <span className="job-detail-label">Owner:</span>
                        <span className="job-detail-value">{job.customer?.name || 'N/A'}</span>
                      </div>
                      <div className="job-detail-row">
                        <span className="job-detail-label">Date:</span>
                        <span className="job-detail-value">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="job-detail-row">
                        <span className="job-detail-label">Estimated Cost:</span>
                        <span className="job-detail-value">${job.estimatedCost || '500'}</span>
                      </div>
                    </div>

                    {job.description && (
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '13px' }}>
                        <strong>Description:</strong> {job.description}
                      </div>
                    )}

                    <div className="job-actions">
                      {job.status === 'Pending' && (
                        <button className="btn-accept" onClick={() => handleAcceptJob(job._id)}>
                          Accept Job
                        </button>
                      )}
                      {job.status !== 'Completed' && (
                        <>
                          <button className="btn-update" onClick={() => handleOpenStatusModal(job)}>
                            Update Status
                          </button>
                          <button className="btn-complete" onClick={() => handleCompleteJob(job._id)}>
                            Mark Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-message">
                <p>No jobs assigned yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="earnings-section">
            <h2>💰 Your Earnings</h2>
            <div className="earnings-grid">
              <div className="earnings-card">
                <div className="earnings-label">Total Earnings</div>
                <div className="earnings-value">৳{earnings.totalEarnings}</div>
              </div>
              <div className="earnings-card" style={{ background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)' }}>
                <div className="earnings-label">Completed Jobs</div>
                <div className="earnings-value">৳{earnings.completedJobs}</div>
              </div>
              <div className="earnings-card" style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #fa5252 100%)' }}>
                <div className="earnings-label">Pending Jobs</div>
                <div className="earnings-value">৳{earnings.pendingJobs}</div>
              </div>
              <div className="earnings-card" style={{ background: 'linear-gradient(135deg, #ffd43b 0%, #ffca3d 100%)', color: '#333' }}>
                <div className="earnings-label">Avg per Job</div>
                <div className="earnings-value">৳{earnings.completedJobs > 0 ? Math.round(earnings.totalEarnings / earnings.completedJobs) : 0}</div>
              </div>
            </div>

            {jobs.length > 0 && (
              <table className="earnings-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Service Type</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.filter(j => j.status === 'Completed').map(job => (
                    <tr key={job._id}>
                      <td>#{job._id.slice(-6)}</td>
                      <td>{job.serviceType}</td>
                      <td>{job.vehicle?.model || 'N/A'}</td>
                      <td><span style={{ color: '#51cf66', fontWeight: 'bold' }}>Completed</span></td>
                      <td>${job.estimatedCost || '500'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="performance-section">
            <h2>📊 Your Performance</h2>
            <div className="performance-metrics">
              <div className="metric">
                <div className="metric-label">Completion Rate</div>
                <div className="metric-value">
                  {jobs.length > 0 ? Math.round((earnings.completedJobs / jobs.length) * 100) : 0}
                  <span className="metric-unit">%</span>
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">Jobs Per Month</div>
                <div className="metric-value">
                  {jobs.length}
                  <span className="metric-unit">jobs</span>
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">Avg Rating</div>
                <div className="metric-value">
                  4.8
                  <span className="metric-unit">/5.0</span>
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">Avg Response Time</div>
                <div className="metric-value">
                  2
                  <span className="metric-unit">hours</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#f9fafb', padding: '30px', borderRadius: '10px', marginTop: '30px', textAlign: 'center', color: '#666' }}>
              <h3>Performance Goals This Month</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✅ Complete 10 jobs - <strong>{earnings.completedJobs}/10</strong></li>
                <li>✅ Maintain 4.5+ rating - <strong>4.8/5.0</strong></li>
                <li>✅ Earn $5,000 - <strong>${earnings.totalEarnings}/5000</strong></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="status-modal" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Update Job Status</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Job #{selectedJob?._id.slice(-6)}</p>
            
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button onClick={handleUpdateStatus} style={{ background: '#667eea' }}>
              Update Status
            </button>
            <button 
              onClick={() => setShowStatusModal(false)}
              style={{ background: '#999', marginTop: '10px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicDashboard;