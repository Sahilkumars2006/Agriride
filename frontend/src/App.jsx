import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/public/LandingPage';
import { MarketplacePage } from './pages/public/MarketplacePage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { EquipmentDetailsModal } from './components/marketplace/EquipmentDetailsModal';

export default function App() {
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const handleSelectEquipment = (equipment) => {
    setSelectedEquipment(equipment);
  };

  const handleCloseModal = () => {
    setSelectedEquipment(null);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#F5F7F0] text-[#172B22]">
          
          {/* Persistent Header */}
          <Navbar />

          {/* Dynamic App Routes */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={<LandingPage onSelectEquipment={handleSelectEquipment} />}
              />
              <Route
                path="/marketplace"
                element={<MarketplacePage onSelectEquipment={handleSelectEquipment} />}
              />
              <Route path="/about" element={<AboutPage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Role-Based Dashboards */}
              <Route
                path="/farmer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Details & Booking Modal */}
          {selectedEquipment && (
            <EquipmentDetailsModal
              equipment={selectedEquipment}
              onClose={handleCloseModal}
              onRequestBooking={(details) => {
                console.log('Booking request registered:', details);
              }}
            />
          )}

          {/* Persistent Footer */}
          <Footer />

        </div>
      </Router>
    </AuthProvider>
  );
}
