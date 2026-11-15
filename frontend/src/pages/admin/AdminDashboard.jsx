import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Tractor, 
  Calendar, 
  IndianRupee, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'users'
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_farmers: 0,
    total_owners: 0,
    total_equipment: 0,
    total_bookings: 0,
    pending_bookings: 0,
    completed_bookings: 0,
    gross_platform_value: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [dashData, bookingsData, usersData] = await Promise.all([
        bookingService.getAdminDashboard(),
        bookingService.getAdminBookings(statusFilter),
        api.get('/admin/users/'),
      ]);
      if (dashData?.metrics) setMetrics(dashData.metrics);
      if (bookingsData) setBookings(Array.isArray(bookingsData) ? bookingsData : bookingsData.results || []);
      if (usersData?.data) setUsers(Array.isArray(usersData.data) ? usersData.data : usersData.data.results || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-agri-bg pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="text-xs">Administration Portal</Badge>
              <span className="text-xs text-agri-muted">Platform Oversight & Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-agri-text">
              AgriRide Control Center
            </h1>
            <p className="text-xs sm:text-sm text-agri-muted mt-1">
              Monitor agricultural machinery utilization, rental compliance, and marketplace volume.
            </p>
          </div>
        </div>

        {/* 4 Platform Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-muted uppercase tracking-wider block">
              Registered Accounts
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-text mt-2">
              {metrics.total_users}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">
              {metrics.total_farmers} Farmers • {metrics.total_owners} Fleet Owners
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-leaf uppercase tracking-wider block">
              Listed Machinery
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-forest mt-2">
              {metrics.total_equipment}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">Active across India</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-warning uppercase tracking-wider block">
              Total Rentals
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-warning mt-2">
              {metrics.total_bookings}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">
              {metrics.pending_bookings} Pending • {metrics.completed_bookings} Completed
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-forest uppercase tracking-wider block">
              Gross Rental Value
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-forest mt-2">
              ₹{Number(metrics.gross_platform_value).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">Total transacted volume</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 border-b border-agri-border">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-sm font-bold font-heading transition-all ${
              activeTab === 'bookings'
                ? 'text-agri-forest border-b-2 border-agri-forest'
                : 'text-agri-muted hover:text-agri-text'
            }`}
          >
            All Platform Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-bold font-heading transition-all ${
              activeTab === 'users'
                ? 'text-agri-forest border-b-2 border-agri-forest'
                : 'text-agri-muted hover:text-agri-text'
            }`}
          >
            User Directory ({users.length})
          </button>
        </div>

        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-agri-border shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-agri-border">
              <h2 className="text-lg font-bold font-heading text-agri-text">
                Platform Rentals Lifecycle
              </h2>

              <div className="flex items-center gap-2">
                <span className="text-xs text-agri-muted font-semibold">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold rounded-lg border border-agri-border bg-agri-bg px-2.5 py-1.5"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-agri-muted">Loading bookings...</div>
            ) : bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-agri-border text-agri-muted uppercase tracking-wider text-[11px]">
                      <th className="pb-3 font-semibold">Rental ID</th>
                      <th className="pb-3 font-semibold">Equipment</th>
                      <th className="pb-3 font-semibold">Farmer</th>
                      <th className="pb-3 font-semibold">Owner</th>
                      <th className="pb-3 font-semibold">Dates</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-agri-border/60">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-agri-bg/50">
                        <td className="py-3 font-mono text-[11px] text-agri-muted">
                          #{b.id?.slice(0, 8)}
                        </td>
                        <td className="py-3 font-semibold text-agri-text">
                          {b.equipment?.name}
                        </td>
                        <td className="py-3 text-agri-muted">
                          {b.farmer?.full_name || b.farmer?.username}
                        </td>
                        <td className="py-3 text-agri-muted">
                          {b.owner?.full_name || b.owner?.username}
                        </td>
                        <td className="py-3 text-agri-muted">
                          {b.start_date} to {b.end_date}
                        </td>
                        <td className="py-3 font-bold text-agri-forest">
                          ₹{Number(b.total_amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3">
                          <Badge variant="primary" className="text-[10px]">{b.booking_status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-agri-muted">No bookings match filter.</div>
            )}
          </div>
        )}

        {/* TAB 2: USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-agri-border shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold font-heading text-agri-text pb-4 border-b border-agri-border">
              Registered Farmers & Machinery Partners
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-agri-border text-agri-muted uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Phone</th>
                    <th className="pb-3 font-semibold">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-agri-border/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-agri-bg/50">
                      <td className="py-3 font-bold text-agri-text">
                        {u.first_name ? `${u.first_name} ${u.last_name || ''}` : u.username}
                      </td>
                      <td className="py-3 text-agri-muted">{u.email}</td>
                      <td className="py-3">
                        <Badge variant={u.role === 'ADMIN' ? 'dark' : u.role === 'OWNER' ? 'gold' : 'primary'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-agri-muted">{u.phone || 'N/A'}</td>
                      <td className="py-3 text-agri-muted">{new Date(u.date_joined).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
