import React, { useState, useEffect } from 'react';
import { 
  Tractor, 
  Calendar, 
  Clock, 
  PlusCircle, 
  Check, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Phone,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { equipmentService } from '../../services/equipmentService';
import { Badge } from '../../components/common/Badge';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'fleet'
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_equipment: 0,
    active_listings: 0,
    pending_requests: 0,
    completed_rentals: 0,
    total_earnings: 0,
  });
  const [requests, setRequests] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Equipment Form State
  const [newEquip, setNewEquip] = useState({
    name: '',
    category: 'tractors',
    brand: '',
    model: '',
    year: 2023,
    power: '55 HP',
    price_per_hour: 400,
    price_per_day: 2800,
    security_deposit: 1500,
    location: '',
    state: 'Punjab',
    operator_included: true,
    fuel_policy: 'Delivered Full (Return Full)',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
  });

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashData, fleetData] = await Promise.all([
        bookingService.getOwnerDashboard(),
        equipmentService.getMyFleet(),
      ]);
      if (dashData?.metrics) setMetrics(dashData.metrics);
      if (dashData?.recent_requests) setRequests(dashData.recent_requests);
      if (fleetData) setFleet(Array.isArray(fleetData) ? fleetData : fleetData.results || []);
    } catch (err) {
      console.error('Failed to load owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAcceptRequest = async (bookingId) => {
    try {
      await bookingService.acceptBooking(bookingId);
      setActionFeedback({ type: 'success', text: 'Booking accepted! The farmer has been notified.' });
      loadDashboard();
    } catch (err) {
      setActionFeedback({ type: 'error', text: err.response?.data?.error || 'Failed to accept booking.' });
    }
  };

  const handleRejectRequest = async (bookingId) => {
    const reason = prompt('Please provide a reason for declining (optional):', 'Equipment scheduled for routine maintenance.');
    if (reason === null) return;
    try {
      await bookingService.rejectBooking(bookingId, reason);
      setActionFeedback({ type: 'success', text: 'Booking request declined.' });
      loadDashboard();
    } catch (err) {
      setActionFeedback({ type: 'error', text: err.response?.data?.error || 'Failed to reject booking.' });
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Are you sure you want to remove this equipment listing?')) return;
    try {
      await equipmentService.deleteEquipment(id);
      setActionFeedback({ type: 'success', text: 'Equipment listing removed.' });
      loadDashboard();
    } catch (err) {
      setActionFeedback({ type: 'error', text: 'Failed to delete equipment.' });
    }
  };

  const handleAddEquipmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await equipmentService.createEquipment({
        ...newEquip,
        image_urls: [newEquip.image_url],
      });
      setShowAddModal(false);
      setActionFeedback({ type: 'success', text: 'New machinery successfully listed in marketplace!' });
      loadDashboard();
      setActiveTab('fleet');
    } catch (err) {
      setActionFeedback({ type: 'error', text: 'Failed to add equipment. Please verify all fields.' });
    }
  };

  return (
    <div className="min-h-screen bg-agri-bg pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold" className="text-xs">Equipment Owner Portal</Badge>
              <span className="text-xs text-agri-muted">Fleet Partner: {user?.first_name} {user?.last_name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-agri-text">
              Machinery Fleet Management
            </h1>
            <p className="text-xs sm:text-sm text-agri-muted mt-1">
              Approve incoming rental bookings, track your active fleet, and manage seasonal earnings.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-agri-forest text-white font-heading font-bold text-xs shadow-md hover:bg-[#123e2a] hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4 text-agri-gold" />
            <span>List New Machinery</span>
          </button>
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
              Fleet Size
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-text mt-2">
              {metrics.total_equipment}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">Listed machinery</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-warning uppercase tracking-wider block">
              Pending Requests
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-warning mt-2">
              {metrics.pending_requests}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">Requires your review</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-leaf uppercase tracking-wider block">
              Completed Rentals
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-forest mt-2">
              {metrics.completed_rentals}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">Successful returns</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm">
            <span className="text-xs font-semibold text-agri-forest uppercase tracking-wider block">
              Total Earnings
            </span>
            <div className="text-3xl font-extrabold font-heading text-agri-forest mt-2">
              ₹{Number(metrics.total_earnings).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-agri-muted mt-1 block">Net rental payouts</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-agri-border">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 text-sm font-bold font-heading transition-all ${
              activeTab === 'requests'
                ? 'text-agri-forest border-b-2 border-agri-forest'
                : 'text-agri-muted hover:text-agri-text'
            }`}
          >
            Incoming Booking Requests ({metrics.pending_requests})
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`pb-3 text-sm font-bold font-heading transition-all ${
              activeTab === 'fleet'
                ? 'text-agri-forest border-b-2 border-agri-forest'
                : 'text-agri-muted hover:text-agri-text'
            }`}
          >
            My Equipment Fleet ({fleet.length})
          </button>
        </div>

        {/* TAB 1: INCOMING REQUESTS */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-3xl border border-agri-border shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-agri-border">
              <h2 className="text-lg font-bold font-heading text-agri-text">
                Pending & Recent Booking Inquiries
              </h2>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-agri-muted">Loading requests...</div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl border border-agri-border bg-agri-bg/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-agri-forest/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={req.equipment?.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=200&q=80'}
                        alt={req.equipment?.name}
                        className="w-16 h-14 object-cover rounded-xl border border-agri-border shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-agri-text">
                            {req.equipment?.name}
                          </h4>
                          {req.booking_status === 'PENDING' ? (
                            <Badge variant="warning">Pending Your Approval</Badge>
                          ) : req.booking_status === 'ACCEPTED' ? (
                            <Badge variant="success">Accepted</Badge>
                          ) : (
                            <Badge>{req.booking_status}</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-agri-muted mt-1.5">
                          <span>
                            Farmer: <strong className="text-agri-text">{req.farmer?.full_name || req.farmer?.username}</strong> ({req.farmer?.phone || 'No phone'})
                          </span>
                          <span>•</span>
                          <span>Dates: {req.start_date} to {req.end_date} ({req.duration_units} {req.billing_mode === 'HOUR' ? 'hrs' : 'days'})</span>
                        </div>

                        {req.notes && (
                          <p className="text-xs text-agri-text/80 bg-white p-2 rounded-lg border border-agri-border/60 mt-2 italic">
                            Note from Farmer: "{req.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0">
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] text-agri-muted block">Rental Payout</span>
                        <span className="text-lg font-bold font-heading text-agri-forest">
                          ₹{Number(req.base_amount).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {req.booking_status === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="px-4 py-2 rounded-xl bg-agri-forest text-white text-xs font-bold hover:bg-[#123e2a] shadow-sm flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4 text-agri-gold" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="px-3 py-2 rounded-xl border border-agri-danger/40 text-agri-danger hover:bg-[#FDF0F0] text-xs font-bold"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-agri-muted">
                          {req.booking_status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-agri-muted">
                No incoming booking requests at the moment.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY FLEET */}
        {activeTab === 'fleet' && (
          <div className="bg-white rounded-3xl border border-agri-border shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-agri-border">
              <h2 className="text-lg font-bold font-heading text-agri-text">
                Listed Machinery ({fleet.length})
              </h2>
            </div>

            {fleet.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fleet.map((eq) => (
                  <div key={eq.id} className="bg-agri-bg rounded-2xl border border-agri-border overflow-hidden flex flex-col justify-between">
                    <div className="aspect-[16/10] relative">
                      <img
                        src={eq.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80'}
                        alt={eq.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {eq.available ? (
                          <Badge variant="success">Available</Badge>
                        ) : (
                          <Badge variant="danger">Reserved</Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-heading font-bold text-sm text-agri-text truncate">
                        {eq.name}
                      </h4>
                      <p className="text-xs text-agri-muted">{eq.location} • {eq.power}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-agri-border/60">
                        <div>
                          <span className="text-xs font-bold text-agri-forest">₹{eq.price_per_hour}/hr</span>
                          <span className="text-[11px] text-agri-muted ml-2">₹{eq.price_per_day}/day</span>
                        </div>
                        <button
                          onClick={() => handleDeleteEquipment(eq.id)}
                          className="p-1.5 text-agri-muted hover:text-agri-danger rounded-lg hover:bg-white"
                          title="Remove listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-agri-muted">
                You have not listed any machinery yet. Click "List New Machinery" to begin earning.
              </div>
            )}
          </div>
        )}

        {/* MODAL: LIST NEW MACHINERY */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-5 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-agri-border">
                <h3 className="font-heading font-bold text-lg text-agri-forest">
                  List New Machinery in Marketplace
                </h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5 text-agri-muted" />
                </button>
              </div>

              <form onSubmit={handleAddEquipmentSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                      Machinery Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newEquip.name}
                      onChange={(e) => setNewEquip({ ...newEquip, name: e.target.value })}
                      placeholder="e.g. Swaraj 744 FE 48 HP"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">
                      Category
                    </label>
                    <select
                      value={newEquip.category}
                      onChange={(e) => setNewEquip({ ...newEquip, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    >
                      <option value="tractors">Tractors</option>
                      <option value="harvesters">Combine Harvesters</option>
                      <option value="drones">Agricultural Drones</option>
                      <option value="tillage">Tillage & Cultivation</option>
                      <option value="sowing">Sowing & Planting</option>
                      <option value="sprayers">Crop Care & Sprayers</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">Brand</label>
                    <input
                      type="text"
                      required
                      value={newEquip.brand}
                      onChange={(e) => setNewEquip({ ...newEquip, brand: e.target.value })}
                      placeholder="e.g. Swaraj"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">Model</label>
                    <input
                      type="text"
                      required
                      value={newEquip.model}
                      onChange={(e) => setNewEquip({ ...newEquip, model: e.target.value })}
                      placeholder="744 FE"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">Power (HP)</label>
                    <input
                      type="text"
                      required
                      value={newEquip.power}
                      onChange={(e) => setNewEquip({ ...newEquip, power: e.target.value })}
                      placeholder="48 HP"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">Hourly Rate (₹)</label>
                    <input
                      type="number"
                      required
                      value={newEquip.price_per_hour}
                      onChange={(e) => setNewEquip({ ...newEquip, price_per_hour: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">Daily Rate (₹)</label>
                    <input
                      type="number"
                      required
                      value={newEquip.price_per_day}
                      onChange={(e) => setNewEquip({ ...newEquip, price_per_day: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      required
                      value={newEquip.security_deposit}
                      onChange={(e) => setNewEquip({ ...newEquip, security_deposit: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">Location / Village</label>
                    <input
                      type="text"
                      required
                      value={newEquip.location}
                      onChange={(e) => setNewEquip({ ...newEquip, location: e.target.value })}
                      placeholder="Samrala, Ludhiana"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">State</label>
                    <select
                      value={newEquip.state}
                      onChange={(e) => setNewEquip({ ...newEquip, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newEquip.image_url}
                    onChange={(e) => setNewEquip({ ...newEquip, image_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block mb-1">Description</label>
                  <textarea
                    rows="3"
                    required
                    value={newEquip.description}
                    onChange={(e) => setNewEquip({ ...newEquip, description: e.target.value })}
                    placeholder="Describe maintenance condition, attachments, and field suitability..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-agri-border bg-agri-bg"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-agri-border">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-bold text-agri-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-agri-forest text-white text-xs font-bold hover:bg-[#123e2a]"
                  >
                    Publish Machinery Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
