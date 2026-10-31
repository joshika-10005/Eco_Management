// Spring Boot REST API integration service connecting to MongoDB Atlas backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error);
    throw error;
  }
}

export const apiService = {
  // Health check to see if Spring Boot is running
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, { method: 'GET', signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth
  async login(email, password) {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(userData) {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async getUserProfile(userId) {
    return await request(`/auth/profile/${userId}`);
  },

  // E-Waste Requests
  async getRequests(userId = null) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return await request(`/ewaste-requests${query}`);
  },

  async getRequestById(id) {
    return await request(`/ewaste-requests/${id}`);
  },

  async createRequest(requestData) {
    return await request('/ewaste-requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  async updateRequestStatus(id, status, notes = '') {
    return await request(`/ewaste-requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  },

  async deleteRequest(id) {
    return await request(`/ewaste-requests/${id}`, {
      method: 'DELETE'
    });
  },

  // Pickups
  async schedulePickup(requestId, scheduleData) {
    return await request(`/pickups/schedule/${requestId}`, {
      method: 'POST',
      body: JSON.stringify(scheduleData)
    });
  },

  async getPickupByRequestId(requestId) {
    return await request(`/pickups/request/${requestId}`);
  },

  async getAllPickups() {
    return await request('/pickups');
  },

  async updatePickupStatus(pickupId, status) {
    return await request(`/pickups/${pickupId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Admin Dashboard
  async getDashboardStats() {
    return await request('/admin/dashboard-stats');
  }
};
