import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/header';
import Home from './components/layout/home';
import About from './components/layout/about';
import Services from './components/layout/services';
import Prices from './components/layout/prices';
import Register from './components/layout/register';
import Login from './components/layout/Login';
import Dashboard from './components/layout/dashboard';
import RegisterLS from './components/layout/registerLS';
import LaundryTable from './components/layout/LaundryTable';

function AppContent() {
  const location = useLocation();

  // Routes that should not display the header
  const hideHeaderRoutes = [
    '/dashboard',
    '/dashboard/users',
    '/dashboard/shops',
    '/register',
    '/login',
    '/registerLS',
    '/laundryTable',
    '/userTable',
    '/about',
    '/services',
    '/prices'
  ];

  // Check if current path should hide header
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      {!shouldHideHeader && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/users" element={<Dashboard showUsers />} />
        <Route path="/dashboard/users/:id" element={<Dashboard showUserDetails />} />
        <Route path="/dashboard/shops" element={<Dashboard showShops />} />
        <Route path="/dashboard/shops/:id" element={<Dashboard showShopDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerLS" element={<RegisterLS />} />
        <Route path="/laundryTable" element={<LaundryTable />} /> 
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;