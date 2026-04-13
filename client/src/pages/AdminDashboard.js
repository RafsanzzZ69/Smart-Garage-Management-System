import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE_URL = 'http://localhost:5000';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [financials, setFinancials] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [expenseForm, setExpenseForm] = useState({ category: '', amount: '', description: '' });
  const [newMechanic, setNewMechanic] = useState({ name: '', email: '', password: 'mechanic123', role: 'Mechanic', specialization: '', salary: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [newInventory, setNewInventory] = useState({ name: '', quantity: '', supplier: '', purchasePrice: '' });
  const [serviceForm, setServiceForm] = useState({ customer: '', vehicle: '', serviceType: '', status: 'Booked', mechanic: '', estimatedCost: '' });

  // ── New Feature States ───────────────────────────────────────
  // Attendance
  const [attendance, setAttendance] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({ employee: '', date: '', status: 'present', checkIn: '', checkOut: '', notes: '' });
  const [attendanceMonth, setAttendanceMonth] = useState(new Date().getMonth() + 1);
  const [attendanceYear, setAttendanceYear] = useState(new Date().getFullYear());

  // Packages
  const [packages, setPackages] = useState([]);
  const [packageForm, setPackageForm] = useState({ name: '', description: '', services: '', price: '', estimatedDuration: '' });
  const [editingPackage, setEditingPackage] = useState(null);

  // Promotions
  const [promotions, setPromotions] = useState([]);
  const [promoForm, setPromoForm] = useState({ title: '', code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUsageCount: '', startDate: '', endDate: '' });

  // Service History
  const [serviceHistory, setServiceHistory] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch new feature data when tab changes
  useEffect(() => {
    if (activeTab === 'attendance') fetchAttendance();
    if (activeTab === 'packages') fetchPackages();
    if (activeTab === 'promotions') fetchPromotions();
    if (activeTab === 'servicehistory') fetchServiceHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [financialsRes, expensesRes, usersRes, serviceRes, inventoryRes, vehiclesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/financials`, headers),
        axios.get(`${API_BASE_URL}/api/expenses`, headers),
        axios.get(`${API_BASE_URL}/api/users`, headers),
        axios.get(`${API_BASE_URL}/api/services`, headers),
        axios.get(`${API_BASE_URL}/api/inventory`, headers),
        axios.get(`${API_BASE_URL}/api/vehicles`, headers),
      ]);
      setFinancials(financialsRes.data);
      setExpenses(expensesRes.data);
      setUsers(usersRes.data);
      setServices(serviceRes.data);
      setInventory(inventoryRes.data);
      setVehicles(vehiclesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── New Feature Fetch Functions ──────────────────────────────
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/attendance?month=${attendanceMonth}&year=${attendanceYear}`, headers);
      setAttendance(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/packages?all=true`, headers);
      setPackages(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPromotions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/promotions`, headers);
      setPromotions(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchServiceHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/service-history`, headers);
      setServiceHistory(res.data);
    } catch (err) { console.error(err); }
  };

  // ── Existing Handlers ────────────────────────────────────────
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/expenses`, expenseForm, headers);
      setExpenseForm({ category: '', amount: '', description: '' });
      fetchDashboardData();
      alert('Expense added successfully!');
    } catch (err) { alert('Error adding expense'); }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/inventory`, newInventory, headers);
      setNewInventory({ name: '', quantity: '', supplier: '', purchasePrice: '' });
      fetchDashboardData();
      alert('Inventory item added.');
    } catch (err) { console.error('Error adding inventory:', err); }
  };

  const handleAddMechanic = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/users`, newMechanic, headers);
      setNewMechanic({ name: '', email: '', password: 'mechanic123', role: 'Mechanic', specialization: '', salary: '', phone: '' });
      fetchDashboardData();
      alert('Mechanic added successfully');
    } catch (err) { console.error('Error adding mechanic:', err); }
  };

  const handleUpdateInventory = async (id, field, value) => {
    try {
      await axios.put(`${API_BASE_URL}/api/inventory/${id}`, { [field]: value }, headers);
      fetchDashboardData();
    } catch (err) { console.error('Error updating inventory:', err); }
  };

  const handleUpdateService = async (id, updates) => {
    try {
      await axios.put(`${API_BASE_URL}/api/services/${id}`, updates, headers);
      fetchDashboardData();
    } catch (err) { console.error('Error updating service:', err); }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        customer: serviceForm.customer,
        vehicle: serviceForm.vehicle,
        type: serviceForm.serviceType,
        status: serviceForm.status,
        mechanic: serviceForm.mechanic,
        cost: Number(serviceForm.estimatedCost) || 0,
        date: new Date(),
      };
      await axios.post(`${API_BASE_URL}/api/services`, payload, headers);
      setServiceForm({ customer: '', vehicle: '', serviceType: '', status: 'Booked', mechanic: '', estimatedCost: '' });
      fetchDashboardData();
      alert('Service created successfully');
    } catch (err) { console.error('Error creating service:', err); alert(err.response?.data?.error || 'Error creating service'); }
  };

  // ── New Feature Handlers ─────────────────────────────────────
  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/attendance`, attendanceForm, headers);
      setAttendanceForm({ employee: '', date: '', status: 'present', checkIn: '', checkOut: '', notes: '' });
      fetchAttendance();
      alert('Attendance marked successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error marking attendance');
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...packageForm,
        services: packageForm.services.split(',').map(s => s.trim()).filter(Boolean),
        price: Number(packageForm.price),
        estimatedDuration: Number(packageForm.estimatedDuration)
      };
      if (editingPackage) {
        await axios.put(`${API_BASE_URL}/api/packages/${editingPackage}`, payload, headers);
        setEditingPackage(null);
        alert('Package updated!');
      } else {
        await axios.post(`${API_BASE_URL}/api/packages`, payload, headers);
        alert('Package added!');
      }
      setPackageForm({ name: '', description: '', services: '', price: '', estimatedDuration: '' });
      fetchPackages();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving package');
    }
  };

  const handleTogglePackage = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/packages/${id}/toggle`, {}, headers);
      fetchPackages();
    } catch (err) { console.error(err); }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/packages/${id}`, headers);
      fetchPackages();
    } catch (err) { console.error(err); }
  };

  const handleAddPromo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/promotions`, promoForm, headers);
      setPromoForm({ title: '', code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUsageCount: '', startDate: '', endDate: '' });
      fetchPromotions();
      alert('Promotion created!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating promotion');
    }
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/promotions/${id}`, headers);
      fetchPromotions();
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>🏎️ Smart Garage Management</h1>
          <div className="admin-user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
        <button className={activeTab === 'expenses' ? 'active' : ''} onClick={() => setActiveTab('expenses')}>💰 Expenses</button>
        <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>👷 Employees</button>
        <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>🔧 Services</button>
        <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
        <button className={activeTab === 'attendance' ? 'active' : ''} onClick={() => setActiveTab('attendance')}>🗓️ Attendance</button>
        <button className={activeTab === 'packages' ? 'active' : ''} onClick={() => setActiveTab('packages')}>📋 Packages</button>
        <button className={activeTab === 'promotions' ? 'active' : ''} onClick={() => setActiveTab('promotions')}>🏷️ Promotions</button>
        <button className={activeTab === 'servicehistory' ? 'active' : ''} onClick={() => setActiveTab('servicehistory')}>📁 Service History</button>
      </nav>

      {/* Main Content */}
      <div className="admin-content">
        {loading && <div className="loading">Loading...</div>}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-section">
            <h2>📈 Financial Overview</h2>
            <div className="stats-grid">
              <div className="stat-card income">
                <h3>Total Income</h3>
                <p className="amount">৳{financials.totalIncome || 0}</p>
              </div>
              <div className="stat-card expense">
                <h3>Total Expenses</h3>
                <p className="amount">৳{financials.totalExpenses || 0}</p>
              </div>
              <div className="stat-card profit">
                <h3>Net Profit</h3>
                <p className="amount">৳{financials.profit || 0}</p>
              </div>
              <div className="stat-card jobs">
                <h3>Active Jobs</h3>
                <p className="amount">{financials.activeJobs || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="expenses-section">
            <h2>💰 Expense Management</h2>
            <div className="expense-form-container">
              <h3>Add New Expense</h3>
              <form onSubmit={handleAddExpense} className="expense-form">
                <select value={expenseForm.category} onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})} required>
                  <option value="">Select Category</option>
                  <option value="Rent">Rent</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
                <input type="number" placeholder="Amount" value={expenseForm.amount} onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})} required />
                <input type="text" placeholder="Description" value={expenseForm.description} onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})} />
                <button type="submit">Add Expense</button>
              </form>
            </div>
            <h3>Recent Expenses</h3>
            <div className="expenses-list">
              {expenses.length > 0 ? (
                <table>
                  <thead><tr><th>Category</th><th>Amount</th><th>Description</th><th>Date</th></tr></thead>
                  <tbody>
                    {expenses.map(exp => (
                      <tr key={exp._id}>
                        <td>{exp.category}</td>
                        <td>৳{exp.amount}</td>
                        <td>{exp.description}</td>
                        <td>{new Date(exp.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No expenses found</p>}
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="employees-section">
            <h2>👷 Employee Management</h2>
            <div className="inventory-form-container" style={{ marginBottom: '30px' }}>
              <h3>Add Mechanic</h3>
              <form onSubmit={handleAddMechanic} className="service-form">
                <input type="text" placeholder="Name" value={newMechanic.name} onChange={(e) => setNewMechanic({ ...newMechanic, name: e.target.value })} required />
                <input type="email" placeholder="Email" value={newMechanic.email} onChange={(e) => setNewMechanic({ ...newMechanic, email: e.target.value })} required />
                <input type="text" placeholder="Specialization" value={newMechanic.specialization} onChange={(e) => setNewMechanic({ ...newMechanic, specialization: e.target.value })} />
                <input type="number" placeholder="Salary" value={newMechanic.salary} onChange={(e) => setNewMechanic({ ...newMechanic, salary: e.target.value })} />
                <input type="text" placeholder="Phone" value={newMechanic.phone} onChange={(e) => setNewMechanic({ ...newMechanic, phone: e.target.value })} />
                <button type="submit">Add Mechanic</button>
              </form>
            </div>
            <div className="employees-list">
              {users.filter(u => u.role === 'Mechanic').length > 0 ? (
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Specialization</th><th>Salary</th><th>Phone</th></tr></thead>
                  <tbody>
                    {users.filter(u => u.role === 'Mechanic').map(emp => (
                      <tr key={emp._id}>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td>{emp.specialization || '-'}</td>
                        <td>৳{emp.salary || 0}</td>
                        <td>{emp.phone || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No mechanics found</p>}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="services-section">
            <h2>🔧 Service Management</h2>
            <div className="inventory-form-container" style={{ marginBottom: '30px' }}>
              <h3>Create New Service</h3>
              <form onSubmit={handleCreateService} className="service-form">
                <select value={serviceForm.customer} onChange={(e) => setServiceForm({ ...serviceForm, customer: e.target.value })} required>
                  <option value="">Select Customer</option>
                  {users.filter(u => u.role === 'Customer').map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <select value={serviceForm.vehicle} onChange={(e) => setServiceForm({ ...serviceForm, vehicle: e.target.value })} required>
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.model} ({v.licensePlate})</option>
                  ))}
                </select>
                <input type="text" placeholder="Service Type" value={serviceForm.serviceType} onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })} required />
                <select value={serviceForm.status} onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}>
                  <option>Booked</option><option>Assigned</option><option>In Progress</option><option>Completed</option><option>Delivered</option>
                </select>
                <select value={serviceForm.mechanic} onChange={(e) => setServiceForm({ ...serviceForm, mechanic: e.target.value })}>
                  <option value="">Assign Mechanic</option>
                  {users.filter(u => u.role === 'Mechanic').map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
                <input type="number" placeholder="Estimated Cost" value={serviceForm.estimatedCost} onChange={(e) => setServiceForm({ ...serviceForm, estimatedCost: e.target.value })} />
                <button type="submit">Create Service</button>
              </form>
            </div>
            {services.length > 0 ? (
              <table>
                <thead>
                  <tr><th>Customer</th><th>Vehicle</th><th>Service Type</th><th>Status</th><th>Mechanic</th><th>Cost</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s._id}>
                      <td>{s.customer?.name || 'N/A'}</td>
                      <td>{s.vehicle?.model || 'N/A'}</td>
                      <td>{s.serviceType}</td>
                      <td>
                        <select value={s.status} onChange={(e) => handleUpdateService(s._id, { status: e.target.value })}>
                          <option>Pending</option><option>Assigned</option><option>In Progress</option><option>Completed</option>
                        </select>
                      </td>
                      <td>
                        <select value={s.mechanic?._id || ''} onChange={(e) => handleUpdateService(s._id, { mechanic: e.target.value })}>
                          <option value="">Unassigned</option>
                          {users.filter(u => u.role === 'Mechanic').map(m => (
                            <option key={m._id} value={m._id}>{m.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>৳{s.cost || 0}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleUpdateService(s._id, { status: 'Completed' })} className="btn-accept" style={{ padding: '5px 10px', fontSize: '12px' }}>Complete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No service records available.</p>}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="inventory-section">
            <h2>📦 Inventory Management</h2>
            <div className="inventory-form-container" style={{ marginBottom: '30px' }}>
              <h3>Add New Item</h3>
              <form onSubmit={handleAddInventory} className="vehicle-form">
                <input type="text" placeholder="Name" value={newInventory.name} onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })} required />
                <input type="number" placeholder="Quantity" value={newInventory.quantity} onChange={(e) => setNewInventory({ ...newInventory, quantity: e.target.value })} required />
                <input type="text" placeholder="Supplier" value={newInventory.supplier} onChange={(e) => setNewInventory({ ...newInventory, supplier: e.target.value })} />
                <input type="number" placeholder="Purchase Price" value={newInventory.purchasePrice} onChange={(e) => setNewInventory({ ...newInventory, purchasePrice: e.target.value })} />
                <button type="submit">Add Item</button>
              </form>
            </div>
            {inventory.length > 0 ? (
              <table>
                <thead><tr><th>Name</th><th>Quantity</th><th>Supplier</th><th>Price</th></tr></thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        <input type="number" value={item.quantity} onChange={(e) => handleUpdateInventory(item._id, 'quantity', e.target.value)} style={{ width: '60px' }} />
                      </td>
                      <td>{item.supplier || '-'}</td>
                      <td>৳{item.purchasePrice || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No inventory items found.</p>}
          </div>
        )}

        {/* ── Attendance Tab ───────────────────────────────────── */}
        {activeTab === 'attendance' && (
          <div className="expenses-section">
            <h2>🗓️ Staff Attendance</h2>

            <div className="inventory-form-container" style={{ marginBottom: '30px' }}>
              <h3>Mark Attendance</h3>
              <form onSubmit={handleMarkAttendance} className="service-form">
                <select value={attendanceForm.employee} onChange={(e) => setAttendanceForm({ ...attendanceForm, employee: e.target.value })} required>
                  <option value="">Select Employee</option>
                  {users.filter(u => u.role === 'Mechanic').map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
                <input type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} required />
                <select value={attendanceForm.status} onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="half-day">Half Day</option>
                  <option value="leave">Leave</option>
                </select>
                <input type="time" placeholder="Check In" value={attendanceForm.checkIn} onChange={(e) => setAttendanceForm({ ...attendanceForm, checkIn: e.target.value })} />
                <input type="time" placeholder="Check Out" value={attendanceForm.checkOut} onChange={(e) => setAttendanceForm({ ...attendanceForm, checkOut: e.target.value })} />
                <input type="text" placeholder="Notes (optional)" value={attendanceForm.notes} onChange={(e) => setAttendanceForm({ ...attendanceForm, notes: e.target.value })} />
                <button type="submit">Mark Attendance</button>
              </form>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Attendance Records</h3>
              <select value={attendanceMonth} onChange={(e) => setAttendanceMonth(e.target.value)}>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
              <input type="number" value={attendanceYear} onChange={(e) => setAttendanceYear(e.target.value)} style={{ width: '80px' }} />
              <button onClick={fetchAttendance}>Filter</button>
            </div>

            {attendance.length > 0 ? (
              <table>
                <thead>
                  <tr><th>Employee</th><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  {attendance.map(a => (
                    <tr key={a._id}>
                      <td>{a.employee?.name || '-'}</td>
                      <td>{new Date(a.date).toLocaleDateString()}</td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                          background: a.status === 'present' ? '#d1e7dd' : a.status === 'absent' ? '#f8d7da' : '#fff3cd',
                          color: a.status === 'present' ? '#0f5132' : a.status === 'absent' ? '#842029' : '#664d03'
                        }}>
                          {a.status}
                        </span>
                      </td>
                      <td>{a.checkIn || '-'}</td>
                      <td>{a.checkOut || '-'}</td>
                      <td>{a.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No attendance records found for this period.</p>}
          </div>
        )}

        {/* ── Packages Tab ─────────────────────────────────────── */}
        {activeTab === 'packages' && (
          <div className="expenses-section">
            <h2>📋 Service Packages</h2>

            <div className="inventory-form-container" style={{ marginBottom: '30px' }}>
              <h3>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
              <form onSubmit={handleAddPackage} className="service-form">
                <input type="text" placeholder="Package Name" value={packageForm.name} onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })} required />
                <input type="text" placeholder="Description" value={packageForm.description} onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })} />
                <input type="text" placeholder="Services (comma separated, e.g. Oil Change, Tire Check)" value={packageForm.services} onChange={(e) => setPackageForm({ ...packageForm, services: e.target.value })} />
                <input type="number" placeholder="Price (৳)" value={packageForm.price} onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })} required />
                <input type="number" placeholder="Estimated Duration (minutes)" value={packageForm.estimatedDuration} onChange={(e) => setPackageForm({ ...packageForm, estimatedDuration: e.target.value })} />
                <button type="submit">{editingPackage ? 'Update Package' : 'Add Package'}</button>
                {editingPackage && (
                  <button type="button" onClick={() => { setEditingPackage(null); setPackageForm({ name: '', description: '', services: '', price: '', estimatedDuration: '' }); }}>
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {packages.length > 0 ? (
              <table>
                <thead>
                  <tr><th>Name</th><th>Services</th><th>Price</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {packages.map(pkg => (
                    <tr key={pkg._id}>
                      <td><strong>{pkg.name}</strong><br /><small style={{ color: '#6c757d' }}>{pkg.description}</small></td>
                      <td>{pkg.services?.join(', ') || '-'}</td>
                      <td>৳{pkg.price}</td>
                      <td>{pkg.estimatedDuration ? `${pkg.estimatedDuration} min` : '-'}</td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                          background: pkg.isActive ? '#d1e7dd' : '#f8d7da',
                          color: pkg.isActive ? '#0f5132' : '#842029'
                        }}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-accept" style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => { setEditingPackage(pkg._id); setPackageForm({ name: pkg.name, description: pkg.description || '', services: pkg.services?.join(', ') || '', price: pkg.price, estimatedDuration: pkg.estimatedDuration || '' }); }}>
                          Edit
                        </button>
                        <button style={{ padding: '4px 10px', fontSize: '12px', background: pkg.isActive ? '#ffc107' : '#198754', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => handleTogglePackage(pkg._id)}>
                          {pkg.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button style={{ padding: '4px 10px', fontSize: '12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => handleDeletePackage(pkg._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No packages found. Add your first package above.</p>}
          </div>
        )}

        {/* ── Promotions Tab ───────────────────────────────────── */}
        {activeTab === 'promotions' && (
          <div className="expenses-section">
            <h2>🏷️ Promotions & Discounts</h2>

            <div className="inventory-form-container" style={{ marginBottom: '30px' }}>
              <h3>Create New Promotion</h3>
              <form onSubmit={handleAddPromo} className="service-form">
                <input type="text" placeholder="Promotion Title" value={promoForm.title} onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })} required />
                <input type="text" placeholder="Promo Code (e.g. SAVE20)" value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} required />
                <select value={promoForm.discountType} onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (৳)</option>
                </select>
                <input type="number" placeholder={promoForm.discountType === 'percentage' ? 'Discount % (e.g. 20)' : 'Discount Amount (৳)'} value={promoForm.discountValue} onChange={(e) => setPromoForm({ ...promoForm, discountValue: e.target.value })} required />
                <input type="number" placeholder="Minimum Order Amount (৳)" value={promoForm.minOrderAmount} onChange={(e) => setPromoForm({ ...promoForm, minOrderAmount: e.target.value })} />
                <input type="number" placeholder="Max Usage Count (leave blank for unlimited)" value={promoForm.maxUsageCount} onChange={(e) => setPromoForm({ ...promoForm, maxUsageCount: e.target.value })} />
                <input type="date" placeholder="Start Date" value={promoForm.startDate} onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })} required />
                <input type="date" placeholder="End Date" value={promoForm.endDate} onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })} required />
                <button type="submit">Create Promotion</button>
              </form>
            </div>

            {promotions.length > 0 ? (
              <table>
                <thead>
                  <tr><th>Title</th><th>Code</th><th>Discount</th><th>Min Order</th><th>Usage</th><th>Valid Until</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {promotions.map(promo => {
                    const expired = new Date(promo.endDate) < new Date();
                    return (
                      <tr key={promo._id}>
                        <td>{promo.title}</td>
                        <td><strong style={{ letterSpacing: '1px' }}>{promo.code}</strong></td>
                        <td>{promo.discountType === 'percentage' ? `${promo.discountValue}%` : `৳${promo.discountValue}`}</td>
                        <td>৳{promo.minOrderAmount || 0}</td>
                        <td>{promo.usedCount}/{promo.maxUsageCount || '∞'}</td>
                        <td>
                          <span style={{ color: expired ? '#dc3545' : '#198754', fontSize: '13px' }}>
                            {new Date(promo.endDate).toLocaleDateString()} {expired ? '(Expired)' : ''}
                          </span>
                        </td>
                        <td>
                          <button style={{ padding: '4px 10px', fontSize: '12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => handleDeletePromo(promo._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : <p>No promotions found. Create your first promotion above.</p>}
          </div>
        )}

        {/* ── Service History Tab ──────────────────────────────── */}
        {activeTab === 'servicehistory' && (
          <div className="expenses-section">
            <h2>📁 Vehicle Service History</h2>

            {serviceHistory.length > 0 ? (
              <table>
                <thead>
                  <tr><th>Vehicle</th><th>Customer</th><th>Services</th><th>Mechanic</th><th>Date</th><th>Cost</th><th>Next Service</th></tr>
                </thead>
                <tbody>
                  {serviceHistory.map(h => (
                    <tr key={h._id}>
                      <td>{h.vehicle ? `${h.vehicle.make || ''} ${h.vehicle.model || ''}`.trim() || '-' : '-'}</td>
                      <td>{h.customer?.name || '-'}</td>
                      <td>{h.servicesPerformed?.join(', ') || '-'}</td>
                      <td>{h.mechanic?.name || '-'}</td>
                      <td>{new Date(h.serviceDate).toLocaleDateString()}</td>
                      <td>৳{h.totalCost || 0}</td>
                      <td>{h.nextServiceDue ? new Date(h.nextServiceDue).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No service history records found.</p>}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;