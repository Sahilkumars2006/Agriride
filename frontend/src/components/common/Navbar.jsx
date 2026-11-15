import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Tractor, 
  Menu, 
  X, 
  Search, 
  PlusCircle, 
  User as UserIcon, 
  LogOut,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

export const Navbar = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, role, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About Us', path: '/about' },
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-agri-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-agri-forest flex items-center justify-center text-white shadow-md group-hover:bg-[#1f6647] transition-all transform group-hover:scale-105">
              <Tractor className="w-6 h-6 text-agri-gold" />
            </div>
            <div>
              <span className="text-2xl font-bold font-heading text-agri-forest tracking-tight block leading-none">
                Agri<span className="text-agri-leaf">Ride</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-agri-muted block mt-0.5">
                Rent Smarter. Farm Better.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-agri-forest border-b-2 border-agri-forest pb-1'
                    : 'text-agri-text/80 hover:text-agri-forest'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-agri-border text-agri-text font-medium text-sm hover:border-agri-forest/40 hover:bg-agri-bg transition-all"
            >
              <Search className="w-4 h-4 text-agri-muted" />
              <span>Browse Gear</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-agri-border">
                
                {/* User Info Capsule with Link to Dashboard */}
                <Link
                  to={role === 'OWNER' ? '/owner/dashboard' : role === 'ADMIN' ? '/admin/dashboard' : '/farmer/dashboard'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-agri-lightgreen border border-agri-leaf/20 hover:border-agri-forest/40 transition-all"
                  title="Open My Dashboard"
                >
                  <div className="w-7 h-7 rounded-lg bg-agri-forest text-agri-gold flex items-center justify-center font-bold text-xs">
                    {user?.first_name ? user.first_name[0] : user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <span className="font-bold text-agri-forest block leading-none truncate max-w-[100px]">
                      {user?.first_name || user?.username}
                    </span>
                    <Badge variant="primary" className="text-[9px] px-1.5 py-0 mt-0.5">
                      {role}
                    </Badge>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-agri-muted hover:text-agri-danger hover:bg-agri-bg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-agri-lightgreen text-agri-forest font-semibold text-sm hover:bg-[#e4f2e8] border border-agri-leaf/30 transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-agri-leaf" />
                  <span>List Equipment</span>
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-agri-forest text-white font-semibold text-sm shadow-md hover:bg-[#123e2a] hover:shadow-lg transition-all"
                >
                  <UserIcon className="w-4 h-4 text-agri-gold" />
                  <span>Sign In</span>
                </Link>
              </>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg bg-agri-forest text-white text-xs font-semibold"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-agri-muted hover:text-agri-danger"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-agri-text hover:bg-agri-bg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-agri-border bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {isAuthenticated && (
            <div className="p-3 bg-agri-lightgreen rounded-xl flex items-center justify-between text-xs font-bold text-agri-forest">
              <span>Signed in as {user?.email}</span>
              <Badge variant="primary">{role}</Badge>
            </div>
          )}

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-base font-semibold ${
                  isActive(link.path)
                    ? 'bg-agri-lightgreen text-agri-forest'
                    : 'text-agri-text hover:bg-agri-bg'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-agri-border flex flex-col gap-2">
            <Link
              to="/marketplace"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-agri-border text-agri-text font-medium text-sm"
            >
              Explore All Equipment
            </Link>
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-agri-lightgreen text-agri-forest font-semibold text-sm"
                >
                  + List Your Machinery
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-agri-forest text-white font-semibold text-sm"
                >
                  Sign In to Account
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 rounded-lg bg-[#FDF0F0] text-agri-danger font-semibold text-sm"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
