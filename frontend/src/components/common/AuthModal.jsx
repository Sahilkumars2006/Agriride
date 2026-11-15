import React, { useState } from 'react';
import { 
  X, 
  User, 
  Tractor, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialRole = 'farmer' }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleDemoFill = (selectedRole) => {
    setRole(selectedRole);
    setMode('login');
    if (selectedRole === 'farmer') {
      setEmail('farmer.demo@agriride.org');
      setPassword('Farmer@1234');
    } else if (selectedRole === 'owner') {
      setEmail('owner.dhillon@agriride.org');
      setPassword('Owner@1234');
    } else if (selectedRole === 'admin') {
      setEmail('admin@agriride.org');
      setPassword('Admin@1234');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback({
      type: 'success',
      message: `Simulated authentication successful as ${role.toUpperCase()}! Full backend JWT endpoints are scheduled for Day 2.`
    });
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-agri-border overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-agri-forest text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            aria-label="Close auth dialog"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-agri-gold/20 flex items-center justify-center text-agri-gold">
              <Tractor className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-lg">AgriRide Portal</span>
          </div>
          
          <h3 className="text-xl font-bold font-heading">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
          </h3>
          <p className="text-xs text-agri-border/80 mt-1">
            Access transparent agricultural equipment rental & listings.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Demo Fill Buttons (For college review & testing) */}
          <div className="bg-agri-lightgreen p-3 rounded-2xl border border-agri-leaf/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-agri-forest">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-agri-leaf" />
                Quick Demo Role Credentials:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoFill('farmer')}
                className="py-1.5 px-2 rounded-lg bg-white border border-agri-leaf/30 text-[11px] font-semibold text-agri-forest hover:bg-agri-forest hover:text-white transition-all shadow-sm"
              >
                🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('owner')}
                className="py-1.5 px-2 rounded-lg bg-white border border-agri-leaf/30 text-[11px] font-semibold text-agri-forest hover:bg-agri-forest hover:text-white transition-all shadow-sm"
              >
                🚜 Owner
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="py-1.5 px-2 rounded-lg bg-white border border-agri-leaf/30 text-[11px] font-semibold text-agri-forest hover:bg-agri-forest hover:text-white transition-all shadow-sm"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Role selector for registration */}
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-2">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'farmer'
                      ? 'border-agri-forest bg-agri-lightgreen text-agri-forest shadow-sm'
                      : 'border-agri-border hover:bg-agri-bg text-agri-text'
                  }`}
                >
                  <div className="text-xs font-bold">Farmer / Renter</div>
                  <div className="text-[11px] text-agri-muted mt-0.5">Rent equipment near me</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'owner'
                      ? 'border-agri-forest bg-agri-lightgreen text-agri-forest shadow-sm'
                      : 'border-agri-border hover:bg-agri-bg text-agri-text'
                  }`}
                >
                  <div className="text-xs font-bold">Equipment Owner</div>
                  <div className="text-[11px] text-agri-muted mt-0.5">List machinery & earn</div>
                </button>
              </div>
            </div>
          )}

          {feedback && (
            <div className="p-3 bg-[#EBF7EE] border border-[#BDE8CB] rounded-xl text-xs text-[#1E7E52] flex items-center gap-2">
              <Check className="w-4 h-4 text-agri-success shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-agri-text block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jaswant Singh"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40"
                    />
                    <User className="w-4 h-4 text-agri-muted absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-agri-text block mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40"
                    />
                    <Phone className="w-4 h-4 text-agri-muted absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-agri-text block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40"
                />
                <Mail className="w-4 h-4 text-agri-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-agri-text block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40"
                />
                <Lock className="w-4 h-4 text-agri-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-agri-forest text-white font-heading font-semibold text-xs shadow-md hover:bg-[#123e2a] hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{mode === 'login' ? 'Sign In to AgriRide' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4 text-agri-gold" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-agri-muted">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-agri-forest underline hover:text-agri-leaf ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an AgriRide account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-agri-forest underline hover:text-agri-leaf ml-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
