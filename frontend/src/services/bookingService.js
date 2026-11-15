import api from './api';

export const bookingService = {
  // Farmer submits a new booking request
  async createBooking(bookingData) {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },

  // Farmer retrieves their bookings
  async getFarmerBookings() {
    const response = await api.get('/bookings/farmer/');
    return response.data;
  },

  // Owner retrieves incoming booking requests
  async getOwnerBookings() {
    const response = await api.get('/bookings/owner/');
    return response.data;
  },

  // Owner accepts a booking
  async acceptBooking(bookingId) {
    const response = await api.post(`/bookings/${bookingId}/accept/`);
    return response.data;
  },

  // Owner rejects a booking
  async rejectBooking(bookingId, reason = '') {
    const response = await api.post(`/bookings/${bookingId}/reject/`, { reason });
    return response.data;
  },

  // Farmer cancels their booking
  async cancelBooking(bookingId) {
    const response = await api.post(`/bookings/${bookingId}/cancel/`);
    return response.data;
  },

  // Complete rental
  async completeBooking(bookingId) {
    const response = await api.post(`/bookings/${bookingId}/complete/`);
    return response.data;
  },

  // Farmer Dashboard Metrics
  async getFarmerDashboard() {
    const response = await api.get('/dashboard/farmer/');
    return response.data;
  },

  // Owner Dashboard Metrics
  async getOwnerDashboard() {
    const response = await api.get('/dashboard/owner/');
    return response.data;
  },

  // Admin Dashboard Metrics
  async getAdminDashboard() {
    const response = await api.get('/dashboard/admin/');
    return response.data;
  },

  // Admin all bookings
  async getAdminBookings(status = '') {
    const params = status ? { status } : {};
    const response = await api.get('/admin/bookings/', { params });
    return response.data;
  }
};
