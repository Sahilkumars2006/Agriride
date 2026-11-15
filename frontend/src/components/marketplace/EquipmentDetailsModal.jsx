import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Calendar, 
  Info, 
  Phone, 
  Check, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';

export const EquipmentDetailsModal = ({ equipment, onClose, onRequestBooking }) => {
  if (!equipment) return null;

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingMode, setBookingMode] = useState('day'); // 'hour' | 'day'
  const [units, setUnits] = useState(2); // 2 hours or 2 days
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  // Price calculation
  const unitRate = bookingMode === 'hour' ? equipment.pricePerHour || equipment.price_per_hour : equipment.pricePerDay || equipment.price_per_day;
  const basePrice = unitRate * units;
  const securityDeposit = equipment.securityDeposit || equipment.security_deposit || 1000;
  const platformFee = Math.round(basePrice * 0.05); // 5% platform fee
  const grandTotal = basePrice + securityDeposit + platformFee;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Calculate end date based on units if daily
      const start = new Date(startDate);
      const end = new Date(start);
      if (bookingMode === 'day') {
        end.setDate(start.getDate() + (units - 1));
      }
      const endDateStr = end.toISOString().split('T')[0];

      const res = await bookingService.createBooking({
        equipment_id: equipment.id,
        start_date: startDate,
        end_date: endDateStr,
        billing_mode: bookingMode === 'hour' ? 'HOUR' : 'DAY',
        duration_units: units,
        notes: `Online rental request from ${user?.first_name || user?.username}.`
      });

      setCreatedBooking(res);
      setBookingSubmitted(true);
      if (onRequestBooking) onRequestBooking(res);
    } catch (err) {
      const msg = err.response?.data?.equipment_id?.[0] || 
                  err.response?.data?.non_field_errors?.[0] || 
                  err.response?.data?.detail || 
                  'Failed to submit booking. Please verify dates.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-agri-border overflow-hidden my-8 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-agri-border bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Badge variant="primary" className="text-xs">
              {equipment.categoryName || equipment.category_name}
            </Badge>
            <span className="text-xs font-semibold uppercase text-agri-muted tracking-wider">
              {equipment.brand} • {equipment.model}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-agri-bg text-agri-muted hover:text-agri-text transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Main Title & Rating */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-agri-text">
                {equipment.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-agri-muted">
                <span className="flex items-center gap-1 text-agri-text font-medium">
                  <MapPin className="w-4 h-4 text-agri-gold" />
                  {equipment.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-agri-text">
                  <Star className="w-4 h-4 fill-agri-gold text-agri-gold" />
                  {equipment.rating} ({equipment.reviewsCount || equipment.reviews_count || 32} verified reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {equipment.available ? (
                <Badge variant="success" className="px-3 py-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Ready for Immediate Rental
                </Badge>
              ) : (
                <Badge variant="danger" className="px-3 py-1 text-xs">
                  Currently Reserved
                </Badge>
              )}
            </div>
          </div>

          {/* Gallery & Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Gallery (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-agri-bg border border-agri-border shadow-sm">
                <img
                  src={equipment.images?.[activeImageIndex] || equipment.images?.[0] || '/images/equipment/mahindra-novo-755.jpg'}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="pt-4">
                <h3 className="font-heading font-semibold text-sm text-agri-text uppercase tracking-wider mb-2">
                  Machine Overview & Field Suitability
                </h3>
                <p className="text-sm text-agri-muted leading-relaxed">
                  {equipment.description}
                </p>
              </div>

              {/* Specs */}
              {equipment.specs && (
                <div className="pt-2">
                  <h3 className="font-heading font-semibold text-sm text-agri-text uppercase tracking-wider mb-3">
                    Technical Specifications
                  </h3>
                  <div className="bg-agri-bg rounded-xl border border-agri-border overflow-hidden">
                    <div className="divide-y divide-agri-border text-xs">
                      {Object.entries(equipment.specs).map(([key, val]) => (
                        <div key={key} className="grid grid-cols-3 p-3 hover:bg-white/60 transition-colors">
                          <span className="font-semibold text-agri-text capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="col-span-2 text-agri-muted font-medium">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Owner Trust Card */}
              {equipment.owner && (
                <div className="p-4 rounded-2xl border border-agri-border bg-agri-lightgreen flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-agri-forest text-agri-gold font-bold flex items-center justify-center text-sm border-2 border-white shadow-sm">
                      🚜
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading font-bold text-sm text-agri-forest">
                          {equipment.owner?.name || equipment.owner?.full_name || equipment.owner?.username}
                        </h4>
                        <ShieldCheck className="w-4 h-4 text-agri-leaf" title="Verified Machinery Partner" />
                      </div>
                      <p className="text-xs text-agri-muted">
                        {equipment.location} • Verified Equipment Partner
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Booking Form (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border-2 border-agri-border p-6 shadow-md sticky top-6">
                
                <h3 className="font-heading font-bold text-lg text-agri-forest mb-1">
                  Instant Rental Booking
                </h3>
                <p className="text-xs text-agri-muted mb-4">
                  Server-side price calculated dynamically.
                </p>

                {serverError && (
                  <div className="mb-4 p-3 bg-[#FDF0F0] border border-[#F8C8C8] rounded-xl text-xs text-[#B83232] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-agri-danger shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                {bookingSubmitted ? (
                  <div className="bg-[#EBF7EE] border border-[#BDE8CB] rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95">
                    <div className="w-12 h-12 rounded-full bg-agri-success text-white flex items-center justify-center mx-auto shadow-md">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-heading font-bold text-base text-[#1E7E52]">
                      Booking Request Submitted!
                    </h4>
                    <p className="text-xs text-agri-text/80 leading-relaxed">
                      Your booking request for <strong className="text-agri-forest">{equipment.name}</strong> has been saved in the database with status <span className="font-bold text-agri-warning">PENDING</span>.
                    </p>
                    <div className="text-xs font-semibold text-agri-forest bg-white py-2 rounded-lg border border-[#BDE8CB]">
                      Total: ₹{grandTotal.toLocaleString('en-IN')}
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <Link
                        to="/farmer/dashboard"
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-agri-forest text-white text-xs font-bold hover:bg-[#123e2a] shadow-sm text-center"
                      >
                        Go to My Bookings Dashboard
                      </Link>
                      <button
                        onClick={() => setBookingSubmitted(false)}
                        className="text-xs text-agri-muted underline"
                      >
                        Make another calculation
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    
                    {/* Rate Mode Tabs */}
                    <div>
                      <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1.5">
                        Rental Mode
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-agri-bg rounded-xl border border-agri-border">
                        <button
                          type="button"
                          onClick={() => setBookingMode('day')}
                          className={`py-2 text-xs font-bold rounded-lg transition-all ${
                            bookingMode === 'day'
                              ? 'bg-agri-forest text-white shadow-sm'
                              : 'text-agri-muted hover:text-agri-text'
                          }`}
                        >
                          Daily (₹{equipment.pricePerDay || equipment.price_per_day}/day)
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingMode('hour')}
                          className={`py-2 text-xs font-bold rounded-lg transition-all ${
                            bookingMode === 'hour'
                              ? 'bg-agri-forest text-white shadow-sm'
                              : 'text-agri-muted hover:text-agri-text'
                          }`}
                        >
                          Hourly (₹{equipment.pricePerHour || equipment.price_per_hour}/hr)
                        </button>
                      </div>
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 font-medium"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1.5">
                        Duration ({bookingMode === 'hour' ? 'Hours' : 'Days'})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={bookingMode === 'hour' ? '24' : '30'}
                        value={units}
                        onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 text-center text-sm font-bold rounded-xl border border-agri-border bg-agri-bg/50 focus:bg-white"
                      />
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-agri-bg rounded-xl p-4 border border-agri-border space-y-2 text-xs">
                      <div className="flex justify-between text-agri-muted">
                        <span>Base Rental ({units} × ₹{unitRate}):</span>
                        <span className="font-semibold text-agri-text">₹{basePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-agri-muted">
                        <span>Refundable Deposit:</span>
                        <span className="font-semibold text-agri-text">₹{securityDeposit.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-agri-muted">
                        <span>Platform & Escrow (5%):</span>
                        <span className="font-semibold text-agri-text">₹{platformFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="pt-2 border-t border-agri-border flex justify-between items-baseline font-bold text-sm text-agri-forest">
                        <span>Grand Total:</span>
                        <span className="text-lg font-heading">
                          ₹{grandTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={!equipment.available || loading}
                      className={`w-full py-3 rounded-xl font-heading font-bold text-sm text-center shadow-md transition-all flex items-center justify-center gap-2 ${
                        equipment.available && !loading
                          ? 'bg-agri-forest text-white hover:bg-[#123e2a] hover:shadow-lg'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <span>Transmitting Request...</span>
                      ) : !isAuthenticated ? (
                        <span>Sign In to Request Booking</span>
                      ) : (
                        <>
                          <span>Request Rental Booking</span>
                          <ArrowRight className="w-4 h-4 text-agri-gold" />
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
