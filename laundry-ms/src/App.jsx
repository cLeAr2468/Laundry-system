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

  // Add more routes here if needed
  const hideHeaderRoutes = ['/dashboard', '/register', '/login', '/registerLS', '/laundry-table'];

  return (
    <div className="min-h-screen">
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registerLS" element={<RegisterLS />} />
        <Route path="/laundry-table" element={<LaundryTable />} />
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
