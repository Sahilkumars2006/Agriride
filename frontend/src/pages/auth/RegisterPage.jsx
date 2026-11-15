import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Tractor, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Wheat 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('FARMER'); // 'FARMER' | 'OWNER'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const generatedUsername = username.trim() || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
      await register({
        role,
        first_name: firstName,
        last_name: lastName,
        username: generatedUsername,
        email,
        phone,
        password,
        confirm_password: confirmPassword,
      });

      setLoading(false);
      navigate('/marketplace', { replace: true });
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-agri-bg">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-card border border-agri-border overflow-hidden">
        
        {/* Header */}
        <div className="bg-agri-forest text-white p-8 text-center hero-pattern relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 text-agri-gold shadow-md">
            <Tractor className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Create an AgriRide Account
          </h1>
          <p className="text-xs text-agri-border/90 mt-1">
            Join the agricultural equipment sharing network today.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          
          {/* Role Selector */}
          <div>
            <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-2">
              Select Your Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('FARMER')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  role === 'FARMER'
                    ? 'border-agri-forest bg-agri-lightgreen text-agri-forest shadow-sm ring-1 ring-agri-forest/30'
                    : 'border-agri-border hover:bg-agri-bg text-agri-text'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <Wheat className="w-4 h-4 text-agri-leaf" />
                  <span>Farmer / Renter</span>
                </div>
                <p className="text-[11px] text-agri-muted leading-tight">
                  Rent high-spec machinery on-demand for harvesting & plowing.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole('OWNER')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  role === 'OWNER'
                    ? 'border-agri-forest bg-agri-lightgreen text-agri-forest shadow-sm ring-1 ring-agri-forest/30'
                    : 'border-agri-border hover:bg-agri-bg text-agri-text'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <Tractor className="w-4 h-4 text-agri-leaf" />
                  <span>Equipment Owner</span>
                </div>
                <p className="text-[11px] text-agri-muted leading-tight">
                  List your machinery & earn regular rental income.
                </p>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 bg-[#FDF0F0] border border-[#F8C8C8] rounded-xl text-xs text-[#B83232] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-agri-danger shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jaswinder"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Singh"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="jaswinder_farmer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jaswinder@example.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-agri-forest text-white font-heading font-bold text-xs shadow-md hover:bg-[#123e2a] hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete {role === 'FARMER' ? 'Farmer' : 'Owner'} Registration</span>
                  <ArrowRight className="w-4 h-4 text-agri-gold" />
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="pt-2 text-center text-xs text-agri-muted border-t border-agri-border">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-agri-forest underline hover:text-agri-leaf ml-1">
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
