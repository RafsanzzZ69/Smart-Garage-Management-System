import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import MechanicDashboard from './pages/MechanicDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/customer" element={<ProtectedRoute role="Customer"><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/mechanic" element={<ProtectedRoute role="Mechanic"><MechanicDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<RedirectBasedOnRole />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const RedirectBasedOnRole = () => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'Admin') return <Navigate to="/admin" />;
  if (user.role === 'Mechanic') return <Navigate to="/mechanic" />;
  return <Navigate to="/customer" />;
};

export default App;