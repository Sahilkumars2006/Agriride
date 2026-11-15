import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Tractor, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleDemoFill = (roleType) => {
    setErrorMsg('');
    if (roleType === 'farmer') {
      setEmail('farmer.demo@agriride.org');
      setPassword('Farmer@1234');
    } else if (roleType === 'owner') {
      setEmail('owner.dhillon@agriride.org');
      setPassword('Owner@1234');
    } else if (roleType === 'admin') {
      setEmail('admin@agriride.org');
      setPassword('Admin@1234');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login(email, password);
      setLoading(false);

      // Redirect based on role if no explicit return path
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'FARMER') {
        navigate('/marketplace', { replace: true });
      } else if (user.role === 'OWNER') {
        navigate('/marketplace', { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/marketplace', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-agri-bg">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-card border border-agri-border overflow-hidden">
        
        {/* Header */}
        <div className="bg-agri-forest text-white p-8 text-center hero-pattern relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 text-agri-gold shadow-md">
            <Tractor className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Welcome Back to AgriRide
          </h1>
          <p className="text-xs text-agri-border/90 mt-1">
            Sign in to manage machinery rentals, fleet listings, and orders.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          
          {/* Quick Demo Credentials helper */}
          <div className="bg-agri-lightgreen p-4 rounded-2xl border border-agri-leaf/30 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-agri-forest">
              <Sparkles className="w-4 h-4 text-agri-leaf" />
              <span>Select Demo Account for Immediate Review:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('farmer')}
                className="py-2 px-2 text-center rounded-xl bg-white border border-agri-leaf/30 text-xs font-semibold text-agri-forest hover:bg-agri-forest hover:text-white transition-all shadow-sm"
              >
                🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('owner')}
                className="py-2 px-2 text-center rounded-xl bg-white border border-agri-leaf/30 text-xs font-semibold text-agri-forest hover:bg-agri-forest hover:text-white transition-all shadow-sm"
              >
                🚜 Owner
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="py-2 px-2 text-center rounded-xl bg-white border border-agri-leaf/30 text-xs font-semibold text-agri-forest hover:bg-agri-forest hover:text-white transition-all shadow-sm"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 bg-[#FDF0F0] border border-[#F8C8C8] rounded-xl text-xs text-[#B83232] flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-agri-danger shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agriride.org"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-agri-border bg-agri-bg/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
                />
                <Mail className="w-4 h-4 text-agri-muted absolute left-3 top-3" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-agri-border bg-agri-bg/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
                />
                <Lock className="w-4 h-4 text-agri-muted absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-agri-muted hover:text-agri-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-agri-forest text-white font-heading font-bold text-xs shadow-md hover:bg-[#123e2a] hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In with JWT</span>
                  <ArrowRight className="w-4 h-4 text-agri-gold" />
                </>
              )}
            </button>

          </form>

          {/* Footer Navigation */}
          <div className="pt-2 text-center text-xs text-agri-muted border-t border-agri-border">
            Don't have an AgriRide account?{' '}
            <Link to="/register" className="font-bold text-agri-forest underline hover:text-agri-leaf ml-1">
              Create an account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
