import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tractor, 
  Calendar, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight,
  Search,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { Badge } from '../../components/common/Badge';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_bookings: 0,
    pending_bookings: 0,
    active_rentals: 0,
    completed_rentals: 0,
    total_spent: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [actionFeedback, setActionFeedback] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getFarmerDashboard();
      if (data?.metrics) setMetrics(data.metrics);
      if (data?.recent_bookings) setBookings(data.recent_bookings);
    } catch (err) {
      console.error('Failed to load farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await bookingService.cancelBooking(bookingId);
      setActionFeedback({ type: 'success', text: 'Booking cancelled successfully.' });
      fetchDashboardData();
    } catch (err) {
      setActionFeedback({ type: 'error', text: err.response?.data?.error || 'Failed to cancel booking.' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">⏳ Pending Owner Review</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">✅ Confirmed by Owner</Badge>;
      case 'ACTIVE':
        return <Badge variant="primary">🚜 Active Field Operation</Badge>;
      case 'COMPLETED':
        return <Badge variant="dark">🏁 Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">❌ Cancelled</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">⚠️ Declined</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-agri-bg pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="text-xs">Farmer Portal</Badge>
              <span className="text-xs text-agri-muted">Kisan ID: #{user?.id?.slice(0, 8)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-agri-text">
              Welcome, {user?.first_name || user?.username}!
            </h1>
            <p className="text-xs sm:text-sm text-agri-muted mt-1">
              Track your agricultural machinery rentals, active bookings, and field schedules.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-agri-forest text-white font-heading font-bold text-xs shadow-md hover:bg-[#123e2a] hover:shadow-lg transition-all"
          >
            <Search className="w-4 h-4 text-agri-gold" />
            <span>Rent More Equipment</span>
          </Link>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            actionFeedback.type === 'success' ? 'bg-[#EBF7EE] text-[#1E7E52] border border-[#BDE8CB]' : 'bg-[#FDF0F0] text-[#B83232] border border-[#F8C8C8]'
          }`}>
            <span>{actionFeedback.text}</span>
            <button onClick={() => setActionFeedback(null)} className="underline font-bold">Dismiss</button>
          </div>
        )}

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-muted uppercase tracking-wider block">
              Total Bookings
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-text mt-2">
              {metrics.total_bookings}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">Lifetime rental requests</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-leaf uppercase tracking-wider block">
              Active Rentals
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-forest mt-2">
              {metrics.active_rentals}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">Confirmed & ready in field</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-warning uppercase tracking-wider block">
              Pending Approval
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-warning mt-2">
              {metrics.pending_bookings}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">Awaiting owner response</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-muted uppercase tracking-wider block">
              Total Expenditure
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-forest mt-2">
              ₹{Number(metrics.total_spent).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">All confirmed rentals</span>
          </div>
        </div>

        {/* Bookings List Section */}
        <div className="bg-white rounded-3xl border border-agri-border shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-agri-border">
            <div>
              <h2 className="text-lg font-bold font-heading text-agri-text">
                My Machinery Bookings & Rentals
              </h2>
              <p className="text-xs text-agri-muted mt-0.5">
                Real-time status updates from equipment owners
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-semibold text-agri-muted">
              Loading your bookings...
            </div>
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-agri-border text-agri-muted uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-semibold">Equipment</th>
                    <th className="pb-3 font-semibold">Dates & Units</th>
                    <th className="pb-3 font-semibold">Owner</th>
                    <th className="pb-3 font-semibold">Total Cost</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-agri-border/60">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-agri-bg/50 transition-colors">
                      {/* Equipment info */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.equipment?.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=200&q=80'}
                            alt={b.equipment?.name}
                            className="w-12 h-10 object-cover rounded-lg border border-agri-border shrink-0"
                          />
                          <div>
                            <span className="font-bold text-agri-text block line-clamp-1">{b.equipment?.name}</span>
                            <span className="text-[11px] text-agri-muted block">{b.equipment?.location}</span>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-4 pr-4 text-agri-text">
                        <div className="font-medium">{b.start_date} to {b.end_date}</div>
                        <span className="text-[11px] text-agri-muted">{b.duration_units} {b.billing_mode === 'HOUR' ? 'Hours' : 'Days'}</span>
                      </td>

                      {/* Owner */}
                      <td className="py-4 pr-4">
                        <div className="font-medium text-agri-text">{b.owner?.full_name || b.owner?.username}</div>
                        <span className="text-[11px] text-agri-muted">{b.owner?.phone || 'Verified'}</span>
                      </td>

                      {/* Cost */}
                      <td className="py-4 pr-4 font-heading font-bold text-sm text-agri-forest">
                        ₹{Number(b.total_amount).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-4 pr-4">
                        {getStatusBadge(b.booking_status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        {b.booking_status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="px-3 py-1.5 rounded-lg border border-agri-danger/40 text-agri-danger hover:bg-[#FDF0F0] text-xs font-semibold transition-all"
                          >
                            Cancel Request
                          </button>
                        )}
                        {b.booking_status === 'ACCEPTED' && (
                          <span className="text-xs font-semibold text-agri-success">
                            Ready for Dispatch
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-agri-bg flex items-center justify-center text-agri-muted mx-auto">
                <Tractor className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-base text-agri-text">
                No Bookings Yet
              </h3>
              <p className="text-xs text-agri-muted max-w-sm mx-auto">
                You haven't requested any machinery yet. Browse our marketplace to find tractors, harvesters, and spray drones.
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri-forest text-white text-xs font-bold hover:bg-[#123e2a]"
              >
                <span>Browse Equipment</span>
                <ArrowRight className="w-4 h-4 text-agri-gold" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
