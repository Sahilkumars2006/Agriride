import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-agri-forest border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-agri-forest">Verifying AgriRide credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-agri-border shadow-card text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF0F0] text-[#B83232] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-agri-text">
            Access Restricted
          </h2>
          <p className="text-xs text-agri-muted leading-relaxed">
            Your current role (<strong className="text-agri-forest font-semibold">{role}</strong>) does not have authorization to view this resource.
          </p>
          <div className="pt-2">
            <NavigateToRoleDashboard role={role} />
          </div>
        </div>
      </div>
    );
  }

  return children;
};

const NavigateToRoleDashboard = ({ role }) => {
  let target = '/';
  if (role === 'FARMER') target = '/farmer/dashboard';
  else if (role === 'OWNER') target = '/owner/dashboard';
  else if (role === 'ADMIN') target = '/admin/dashboard';

  return (
    <a
      href={target}
      className="inline-block py-2.5 px-6 rounded-xl bg-agri-forest text-white text-xs font-bold hover:bg-[#123e2a] transition-all shadow-sm"
    >
      Go to My {role} Portal
    </a>
  );
};
