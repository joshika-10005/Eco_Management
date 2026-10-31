// Unified Data Service Adapter
// Switches smoothly between 'local' (LocalStorage) and 'api' (Spring Boot + MongoDB Atlas)

import { storageService } from './storageService';
import { apiService } from './apiService';

const DATA_MODE_KEY = 'ecodrop_data_source_mode';

class DataService {
  constructor() {
    this.mode = localStorage.getItem(DATA_MODE_KEY) || 'local';
  }

  getMode() {
    return this.mode;
  }

  setMode(newMode) {
    this.mode = newMode;
    localStorage.setItem(DATA_MODE_KEY, newMode);
    window.dispatchEvent(new CustomEvent('ecodrop:mode-changed', { detail: { mode: newMode } }));
  }

  isLocal() {
    return this.mode === 'local';
  }

  async checkBackendConnection() {
    return await apiService.checkHealth();
  }

  // Users & Auth
  getCurrentUser() {
    return storageService.getCurrentUser();
  }

  setCurrentUser(user) {
    storageService.setCurrentUser(user);
  }

  async login(email, password) {
    if (this.isLocal()) {
      return storageService.login(email, password);
    } else {
      const res = await apiService.login(email, password);
      if (res && res.user) {
        storageService.setCurrentUser(res.user);
      }
      return res;
    }
  }

  async register(userData) {
    if (this.isLocal()) {
      return storageService.register(userData);
    } else {
      const res = await apiService.register(userData);
      if (res && res.user) {
        storageService.setCurrentUser(res.user);
      }
      return res;
    }
  }

  // E-Waste Requests
  async getRequests(userId = null) {
    if (this.isLocal()) {
      return storageService.getRequests(userId);
    } else {
      return await apiService.getRequests(userId);
    }
  }

  async getRequestById(id) {
    if (this.isLocal()) {
      return storageService.getRequestById(id);
    } else {
      return await apiService.getRequestById(id);
    }
  }

  async createRequest(reqData) {
    if (this.isLocal()) {
      return storageService.createRequest(reqData);
    } else {
      return await apiService.createRequest(reqData);
    }
  }

  async updateRequestStatus(id, status, notes = '') {
    if (this.isLocal()) {
      return storageService.updateRequestStatus(id, status, notes);
    } else {
      return await apiService.updateRequestStatus(id, status, notes);
    }
  }

  async deleteRequest(id) {
    if (this.isLocal()) {
      return storageService.deleteRequest(id);
    } else {
      return await apiService.deleteRequest(id);
    }
  }

  // Pickups
  async getPickups() {
    if (this.isLocal()) {
      return storageService.getPickups();
    } else {
      return await apiService.getAllPickups();
    }
  }

  async getPickupByRequestId(requestId) {
    if (this.isLocal()) {
      return storageService.getPickupByRequestId(requestId);
    } else {
      return await apiService.getPickupByRequestId(requestId);
    }
  }

  async schedulePickup(requestId, scheduleData) {
    if (this.isLocal()) {
      return storageService.schedulePickup(requestId, scheduleData);
    } else {
      return await apiService.schedulePickup(requestId, scheduleData);
    }
  }

  async updatePickupStatus(pickupId, status) {
    if (this.isLocal()) {
      return storageService.updatePickupStatus(pickupId, status);
    } else {
      return await apiService.updatePickupStatus(pickupId, status);
    }
  }

  // Admin Dashboard Stats
  async getDashboardStats() {
    if (this.isLocal()) {
      return storageService.getDashboardStats();
    } else {
      return await apiService.getDashboardStats();
    }
  }

  // Seed / Reset
  resetDemoData() {
    return storageService.resetDemoData();
  }
}

export const dataService = new DataService();
