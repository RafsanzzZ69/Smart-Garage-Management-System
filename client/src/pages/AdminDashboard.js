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
  const [serviceForm, setServiceForm] = useState({ customer: '', vehicle: '', serviceType: '', status: 'Pending', mechanic: '', estimatedCost: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [financialsRes, expensesRes, usersRes, serviceRes, inventoryRes, vehiclesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/financials`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/expenses`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/services`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/inventory`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/vehicles`, { headers: { Authorization: `Bearer ${token}` } }),
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

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/expenses`, expenseForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenseForm({ category: '', amount: '', description: '' });
      fetchDashboardData();
      alert('Expense added successfully!');
    } catch (err) {
      alert('Error adding expense');
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/inventory`, newInventory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewInventory({ name: '', quantity: '', supplier: '', purchasePrice: '' });
      fetchDashboardData();
      alert('Inventory item added.');
    } catch (err) {
      console.error('Error adding inventory:', err);
    }
  };

  const handleAddMechanic = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/users`, newMechanic, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMechanic({ name: '', email: '', password: 'mechanic123', role: 'Mechanic', specialization: '', salary: '', phone: '' });
      fetchDashboardData();
      alert('Mechanic added successfully');
    } catch (err) {
      console.error('Error adding mechanic:', err);
    }
  };

  const handleUpdateInventory = async (id, field, value) => {
    try {
      await axios.put(`${API_BASE_URL}/api/inventory/${id}`, { [field]: value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating inventory:', err);
    }
  };

  const handleUpdateService = async (id, updates) => {
    try {
      await axios.put(`${API_BASE_URL}/api/services/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/services`, serviceForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServiceForm({ customer: '', vehicle: '', serviceType: '', status: 'Pending', mechanic: '', estimatedCost: '' });
      fetchDashboardData();
      alert('Service created successfully');
    } catch (err) {
      console.error('Error creating service:', err);
    }
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
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          📊 Dashboard
        </button>
        <button className={activeTab === 'expenses' ? 'active' : ''} onClick={() => setActiveTab('expenses')}>
          💰 Expenses
        </button>
        <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>
          👷 Employees
        </button>
        <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>
          🔧 Services
        </button>
        <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>
          📦 Inventory
        </button>
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
                <p className="amount">₹{financials.totalIncome || 0}</p>
              </div>
              <div className="stat-card expense">
                <h3>Total Expenses</h3>
                <p className="amount">₹{financials.totalExpenses || 0}</p>
              </div>
              <div className="stat-card profit">
                <h3>Net Profit</h3>
                <p className="amount">₹{financials.profit || 0}</p>
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
                <select 
                  value={expenseForm.category} 
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Rent">Rent</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>

                <input 
                  type="number" 
                  placeholder="Amount"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  required
                />

                <input 
                  type="text" 
                  placeholder="Description"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                />

                <button type="submit">Add Expense</button>
              </form>
            </div>

            <h3>Recent Expenses</h3>
            <div className="expenses-list">
              {expenses.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(exp => (
                      <tr key={exp._id}>
                        <td>{exp.category}</td>
                        <td>₹{exp.amount}</td>
                        <td>{exp.description}</td>
                        <td>{new Date(exp.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No expenses found</p>
              )}
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
                <input
                  type="text"
                  placeholder="Name"
                  value={newMechanic.name}
                  onChange={(e) => setNewMechanic({ ...newMechanic, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newMechanic.email}
                  onChange={(e) => setNewMechanic({ ...newMechanic, email: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Specialization"
                  value={newMechanic.specialization}
                  onChange={(e) => setNewMechanic({ ...newMechanic, specialization: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Salary"
                  value={newMechanic.salary}
                  onChange={(e) => setNewMechanic({ ...newMechanic, salary: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newMechanic.phone}
                  onChange={(e) => setNewMechanic({ ...newMechanic, phone: e.target.value })}
                />
                <button type="submit">Add Mechanic</button>
              </form>
            </div>

            <div className="employees-list">
              {users.filter(u => u.role === 'Mechanic').length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Specialization</th>
                      <th>Salary</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'Mechanic').map(emp => (
                      <tr key={emp._id}>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td>{emp.specialization || '-'}</td>
                        <td>₹{emp.salary || 0}</td>
                        <td>{emp.phone || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No mechanics found</p>
              )}
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
                <select
                  value={serviceForm.customer}
                  onChange={(e) => setServiceForm({ ...serviceForm, customer: e.target.value })}
                  required
                >
                  <option value="">Select Customer</option>
                  {users.filter(u => u.role === 'Customer').map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={serviceForm.vehicle}
                  onChange={(e) => setServiceForm({ ...serviceForm, vehicle: e.target.value })}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.model} ({v.licensePlate})</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Service Type"
                  value={serviceForm.serviceType}
                  onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                  required
                />
                <select
                  value={serviceForm.status}
                  onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                >
                  <option>Pending</option>
                  <option>Assigned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <select
                  value={serviceForm.mechanic}
                  onChange={(e) => setServiceForm({ ...serviceForm, mechanic: e.target.value })}
                >
                  <option value="">Assign Mechanic</option>
                  {users.filter(u => u.role === 'Mechanic').map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Estimated Cost"
                  value={serviceForm.estimatedCost}
                  onChange={(e) => setServiceForm({ ...serviceForm, estimatedCost: e.target.value })}
                />
                <button type="submit">Create Service</button>
              </form>
            </div>

            {services.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Service Type</th>
                    <th>Status</th>
                    <th>Mechanic</th>
                    <th>Cost</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s._id}>
                      <td>{s.customer?.name || 'N/A'}</td>
                      <td>{s.vehicle?.model || 'N/A'}</td>
                      <td>{s.serviceType}</td>
                      <td>
                        <select
                          value={s.status}
                          onChange={(e) => handleUpdateService(s._id, { status: e.target.value })}
                        >
                          <option>Pending</option>
                          <option>Assigned</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={s.mechanic?._id || ''}
                          onChange={(e) => handleUpdateService(s._id, { mechanic: e.target.value })}
                        >
                          <option value="">Unassigned</option>
                          {users.filter(u => u.role === 'Mechanic').map(m => (
                            <option key={m._id} value={m._id}>{m.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>${s.estimatedCost || 0}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleUpdateService(s._id, { status: 'Completed' })}
                          className="btn-accept"
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                        >
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No service records available.</p>
            )}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="inventory-section">
            <h2>📦 Inventory Management</h2>

            <div className="inventory-form-container" style={{ marginBottom: '30px' }}>
              <h3>Add New Item</h3>
              <form onSubmit={handleAddInventory} className="vehicle-form">
                <input
                  type="text"
                  placeholder="Name"
                  value={newInventory.name}
                  onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newInventory.quantity}
                  onChange={(e) => setNewInventory({ ...newInventory, quantity: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={newInventory.supplier}
                  onChange={(e) => setNewInventory({ ...newInventory, supplier: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Purchase Price"
                  value={newInventory.purchasePrice}
                  onChange={(e) => setNewInventory({ ...newInventory, purchasePrice: e.target.value })}
                />
                <button type="submit">Add Item</button>
              </form>
            </div>

            {inventory.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Supplier</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateInventory(item._id, 'quantity', e.target.value)}
                          style={{ width: '60px' }}
                        />
                      </td>
                      <td>{item.supplier || '-'}</td>
                      <td>${item.purchasePrice || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No inventory items found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;