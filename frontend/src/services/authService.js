import api from './api';

export const authService = {
  // Login with email and password
  async login(email, password) {
    const response = await api.post('/auth/login/', { email, password });
    if (response.data?.tokens) {
      localStorage.setItem('agriride_tokens', JSON.stringify(response.data.tokens));
      localStorage.setItem('agriride_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register new Farmer or Equipment Owner
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    if (response.data?.tokens) {
      localStorage.setItem('agriride_tokens', JSON.stringify(response.data.tokens));
      localStorage.setItem('agriride_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Fetch current user profile
  async getProfile() {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  // Update profile
  async updateProfile(profileData) {
    const response = await api.patch('/auth/profile/', profileData);
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('agriride_tokens');
    localStorage.removeItem('agriride_user');
  },

  // Get locally stored user
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('agriride_user') || 'null');
    } catch {
      return null;
    }
  },

  // Get locally stored tokens
  getTokens() {
    try {
      return JSON.parse(localStorage.getItem('agriride_tokens') || 'null');
    } catch {
      return null;
    }
  }
};
