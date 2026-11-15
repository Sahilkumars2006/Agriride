import api from './api';

export const equipmentService = {
  // Get all equipment with query filters
  async getEquipment(params = {}) {
    const response = await api.get('/equipment/', { params });
    return response.data;
  },

  // Get single equipment details
  async getEquipmentById(id) {
    const response = await api.get(`/equipment/${id}/`);
    return response.data;
  },

  // Get categories
  async getCategories() {
    const response = await api.get('/categories/');
    return response.data;
  },

  // Owner adds new machinery
  async createEquipment(equipmentData) {
    const response = await api.post('/equipment/create/', equipmentData);
    return response.data;
  },

  // Owner gets their own fleet
  async getMyFleet() {
    const response = await api.get('/equipment/my-fleet/');
    return response.data;
  },

  // Owner updates equipment
  async updateEquipment(id, data) {
    const response = await api.patch(`/equipment/${id}/update/`, data);
    return response.data;
  },

  // Owner deletes equipment
  async deleteEquipment(id) {
    const response = await api.delete(`/equipment/${id}/update/`);
    return response.data;
  }
};
