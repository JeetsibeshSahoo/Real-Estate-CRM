import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CrmLayout from './components/CrmLayout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import CrmProperties from './pages/CrmProperties';


const AppContent = () => {
  const location = useLocation();
  const isCrmRoute = location.pathname.startsWith('/crm');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {!isCrmRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/crm"
            element={
              <ProtectedRoute>
                <CrmLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/crm/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="properties" element={<CrmProperties />} />
          </Route>
        </Routes>
      </main>
      {!isCrmRoute && <Footer />}
    </div>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;