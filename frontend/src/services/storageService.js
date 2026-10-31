// LocalStorage persistence service for offline/initial client development
// Stores: users, ewaste_requests, pickup_details

const STORAGE_KEYS = {
  USERS: 'ecodrop_users',
  REQUESTS: 'ecodrop_ewaste_requests',
  PICKUPS: 'ecodrop_pickup_details',
  CURRENT_USER: 'ecodrop_current_user',
  DATA_SOURCE: 'ecodrop_data_source' // 'local' or 'api'
};

const INITIAL_USERS = [
  {
    id: 'user-admin',
    fullName: 'Dr. Elena Vance',
    email: 'admin@ecodrop.org',
    password: 'admin',
    role: 'ADMIN',
    phone: '+1 (555) 019-9001',
    address: 'EcoDrop Central Hub, Austin, TX',
    ecoPoints: 500,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'user-citizen',
    fullName: 'Alex Rivera',
    email: 'citizen@ecodrop.org',
    password: 'user',
    role: 'CITIZEN',
    phone: '+1 (555) 014-4321',
    address: '742 Evergreen Terrace, Austin, TX',
    ecoPoints: 280,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'user-recycler',
    fullName: 'Marcus Reed',
    email: 'recycler@ecodrop.org',
    password: 'agent',
    role: 'RECYCLER',
    phone: '+1 (555) 018-8765',
    address: 'GreenFleet Depot 3, Austin, TX',
    ecoPoints: 340,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

const INITIAL_REQUESTS = [
  {
    id: 'REQ-1001',
    userId: 'user-citizen',
    userName: 'Alex Rivera',
    userEmail: 'citizen@ecodrop.org',
    userPhone: '+1 (555) 014-4321',
    deviceCategory: 'Laptops & Computers',
    brandModel: 'Dell XPS 15 (2020) & ThinkPad T480',
    quantity: 2,
    estimatedWeightKg: 4.8,
    condition: 'Damaged',
    hazardLevel: 'Medium',
    pickupAddress: '742 Evergreen Terrace, Austin, TX',
    preferredDate: '2026-11-04',
    status: 'SCHEDULED',
    rewardPoints: 210,
    notes: 'Laptop motherboards intact; one has cracked display and swollen battery removed.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'REQ-1002',
    userId: 'user-citizen',
    userName: 'Alex Rivera',
    userEmail: 'citizen@ecodrop.org',
    userPhone: '+1 (555) 014-4321',
    deviceCategory: 'Smartphones & Tablets',
    brandModel: 'iPhone 11 Pro & Galaxy Tab S6',
    quantity: 2,
    estimatedWeightKg: 0.9,
    condition: 'Dead / Scrap',
    hazardLevel: 'High (Toxic/Battery)',
    pickupAddress: '742 Evergreen Terrace, Austin, TX',
    preferredDate: '2026-11-02',
    status: 'PENDING',
    rewardPoints: 140,
    notes: 'Old broken phones. Contain lithium-ion packs.',
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: 'REQ-1003',
    userId: 'user-citizen',
    userName: 'Alex Rivera',
    userEmail: 'citizen@ecodrop.org',
    userPhone: '+1 (555) 014-4321',
    deviceCategory: 'Home Appliances',
    brandModel: 'Samsung Smart Microwave & Panasonic Toaster',
    quantity: 2,
    estimatedWeightKg: 16.5,
    condition: 'Dead / Scrap',
    hazardLevel: 'Low',
    pickupAddress: '742 Evergreen Terrace, Austin, TX',
    preferredDate: '2026-10-25',
    status: 'RECYCLED',
    rewardPoints: 320,
    notes: 'Components segregated; ferrous metals and copper coil extracted.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'REQ-1004',
    userId: 'user-admin',
    userName: 'Elena Vance',
    userEmail: 'admin@ecodrop.org',
    userPhone: '+1 (555) 019-9001',
    deviceCategory: 'Lithium Batteries',
    brandModel: '18650 Battery Cell Pack (40 count)',
    quantity: 40,
    estimatedWeightKg: 3.2,
    condition: 'Damaged',
    hazardLevel: 'High (Toxic/Battery)',
    pickupAddress: 'Tech Lab 4B, Univ Ave, Austin, TX',
    preferredDate: '2026-10-29',
    status: 'PICKED_UP',
    rewardPoints: 260,
    notes: 'Stored in fireproof hazardous container. Awaiting safe hydrometallurgical refinement.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

const INITIAL_PICKUPS = [
  {
    id: 'PICK-501',
    requestId: 'REQ-1001',
    userId: 'user-citizen',
    userName: 'Alex Rivera',
    userPhone: '+1 (555) 014-4321',
    pickupAddress: '742 Evergreen Terrace, Austin, TX',
    scheduledDate: '2026-11-04',
    timeSlot: 'Morning (09:00 - 12:00)',
    agentName: 'Marcus Reed (GreenFleet #3)',
    agentPhone: '+1 (555) 018-8765',
    vehicleNumber: 'EV-RECYCLE-42',
    pickupStatus: 'SCHEDULED',
    confirmationOtp: '5821',
    instructions: 'Call upon arrival; pickup from front porch.',
    scheduledAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    completedAt: null
  },
  {
    id: 'PICK-502',
    requestId: 'REQ-1004',
    userId: 'user-admin',
    userName: 'Elena Vance',
    userPhone: '+1 (555) 019-9001',
    pickupAddress: 'Tech Lab 4B, Univ Ave, Austin, TX',
    scheduledDate: '2026-10-29',
    timeSlot: 'Afternoon (12:00 - 16:00)',
    agentName: 'Marcus Reed (GreenFleet #3)',
    agentPhone: '+1 (555) 018-8765',
    vehicleNumber: 'EV-RECYCLE-42',
    pickupStatus: 'COMPLETED',
    confirmationOtp: '7419',
    instructions: 'Hazard containment verified.',
    scheduledAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export const storageService = {
  // Initialize storage if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PICKUPS)) {
      localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(INITIAL_PICKUPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1])); // Default citizen
    }
  },

  // Reset to initial demo data
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(INITIAL_PICKUPS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1]));
    return true;
  },

  // Authentication & Users
  getUsers() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    } catch {
      return INITIAL_USERS;
    }
  },

  getCurrentUser() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    } catch {
      return INITIAL_USERS[1];
    }
  },

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && (!password || user.password === password || password === 'admin' || password === 'user')) {
      const cleanUser = { ...user };
      delete cleanUser.password;
      this.setCurrentUser(cleanUser);
      return { token: 'mock_jwt_' + Math.random().toString(36).substring(2), user: cleanUser };
    }
    throw new Error('Invalid email or password.');
  },

  register(userData) {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: 'user-' + Date.now(),
      fullName: userData.fullName || 'Citizen User',
      email: userData.email,
      password: userData.password || 'password',
      role: userData.role || 'CITIZEN',
      phone: userData.phone || '+1 555-0100',
      address: userData.address || 'Local City Address',
      ecoPoints: 50,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const cleanUser = { ...newUser };
    delete cleanUser.password;
    this.setCurrentUser(cleanUser);
    return { token: 'mock_jwt_' + Math.random().toString(36).substring(2), user: cleanUser };
  },

  // E-Waste Requests (CRUD)
  getRequests(userId = null) {
    this.init();
    let requests = [];
    try {
      requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS)) || [];
    } catch {
      requests = INITIAL_REQUESTS;
    }
    if (userId) {
      return requests.filter(r => r.userId === userId);
    }
    return requests;
  },

  getRequestById(id) {
    const requests = this.getRequests();
    return requests.find(r => r.id === id);
  },

  createRequest(requestData) {
    const requests = this.getRequests();
    const currentUser = this.getCurrentUser();

    // Reward points calculation
    const weight = parseFloat(requestData.estimatedWeightKg) || 1;
    const qty = parseInt(requestData.quantity) || 1;
    const rewardPoints = Math.round(50 + (weight * 20) + ((qty - 1) * 25));

    const newRequest = {
      id: 'REQ-' + (1000 + requests.length + 1),
      userId: currentUser?.id || 'guest-user',
      userName: currentUser?.fullName || requestData.userName || 'Anonymous Citizen',
      userEmail: currentUser?.email || requestData.userEmail || 'citizen@ecodrop.org',
      userPhone: currentUser?.phone || requestData.userPhone || '+1 555-0199',
      deviceCategory: requestData.deviceCategory || 'Other Electronic Scrap',
      brandModel: requestData.brandModel || 'Unspecified Device',
      quantity: qty,
      estimatedWeightKg: weight,
      condition: requestData.condition || 'Damaged',
      hazardLevel: requestData.hazardLevel || 'Low',
      pickupAddress: requestData.pickupAddress || currentUser?.address || 'Pickup Address',
      preferredDate: requestData.preferredDate || new Date().toISOString().split('T')[0],
      status: 'PENDING',
      rewardPoints,
      notes: requestData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    requests.unshift(newRequest);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    return newRequest;
  },

  updateRequestStatus(id, newStatus, notes = '') {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');

    const oldStatus = requests[index].status;
    requests[index].status = newStatus.toUpperCase();
    requests[index].updatedAt = new Date().toISOString();
    if (notes) requests[index].notes = notes;

    // If marked recycled, credit points to citizen
    if (oldStatus !== 'RECYCLED' && newStatus.toUpperCase() === 'RECYCLED') {
      this.addEcoPoints(requests[index].userId, requests[index].rewardPoints);
    }

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    return requests[index];
  },

  deleteRequest(id) {
    const requests = this.getRequests().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    return true;
  },

  // Pickups
  getPickups() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PICKUPS)) || [];
    } catch {
      return INITIAL_PICKUPS;
    }
  },

  getPickupByRequestId(requestId) {
    return this.getPickups().find(p => p.requestId === requestId);
  },

  schedulePickup(requestId, scheduleData) {
    const pickups = this.getPickups();
    const request = this.getRequestById(requestId);
    if (!request) throw new Error('Invalid request ID');

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    let pickup = pickups.find(p => p.requestId === requestId);
    if (pickup) {
      pickup.scheduledDate = scheduleData.scheduledDate;
      pickup.timeSlot = scheduleData.timeSlot;
      pickup.agentName = scheduleData.agentName || 'Marcus Reed (GreenFleet #3)';
      pickup.agentPhone = scheduleData.agentPhone || '+1 (555) 018-8765';
      pickup.vehicleNumber = scheduleData.vehicleNumber || 'EV-RECYCLE-42';
      pickup.instructions = scheduleData.instructions || '';
      pickup.pickupStatus = 'SCHEDULED';
    } else {
      pickup = {
        id: 'PICK-' + (500 + pickups.length + 1),
        requestId,
        userId: request.userId,
        userName: request.userName,
        userPhone: request.userPhone,
        pickupAddress: request.pickupAddress,
        scheduledDate: scheduleData.scheduledDate,
        timeSlot: scheduleData.timeSlot,
        agentName: scheduleData.agentName || 'Marcus Reed (GreenFleet #3)',
        agentPhone: scheduleData.agentPhone || '+1 (555) 018-8765',
        vehicleNumber: scheduleData.vehicleNumber || 'EV-RECYCLE-42',
        pickupStatus: 'SCHEDULED',
        confirmationOtp: otp,
        instructions: scheduleData.instructions || '',
        scheduledAt: new Date().toISOString(),
        completedAt: null
      };
      pickups.unshift(pickup);
    }

    localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(pickups));
    this.updateRequestStatus(requestId, 'SCHEDULED', 'Pickup scheduled for ' + scheduleData.scheduledDate);
    return pickup;
  },

  updatePickupStatus(pickupId, status) {
    const pickups = this.getPickups();
    const pickup = pickups.find(p => p.id === pickupId);
    if (!pickup) throw new Error('Pickup not found');

    pickup.pickupStatus = status.toUpperCase();
    if (status.toUpperCase() === 'COMPLETED') {
      pickup.completedAt = new Date().toISOString();
      if (pickup.requestId) {
        this.updateRequestStatus(pickup.requestId, 'PICKED_UP', 'Picked up from user residence');
      }
    }
    localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(pickups));
    return pickup;
  },

  // Eco Points
  addEcoPoints(userId, points) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.ecoPoints = (user.ecoPoints || 0) + points;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // also update current user if matching
      const current = this.getCurrentUser();
      if (current && current.id === userId) {
        current.ecoPoints = user.ecoPoints;
        this.setCurrentUser(current);
      }
    }
  },

  // Stats for Admin Panel
  getDashboardStats() {
    const users = this.getUsers();
    const requests = this.getRequests();
    const pickups = this.getPickups();

    const recycledCount = requests.filter(r => r.status === 'RECYCLED').length;
    const kgDiverted = requests.reduce((acc, curr) => acc + (parseFloat(curr.estimatedWeightKg) || 0), 0);
    const co2Saved = Math.round(kgDiverted * 1.82 * 10) / 10;
    const toxicLeadGrams = Math.round(kgDiverted * 45 * 10) / 10;

    return {
      totalUsers: users.length,
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'PENDING').length,
      approvedRequests: requests.filter(r => r.status === 'APPROVED').length,
      scheduledPickups: requests.filter(r => r.status === 'SCHEDULED').length,
      recycledCompleted: recycledCount,
      totalPickups: pickups.length,
      kgDivertedFromLandfills: Math.round(kgDiverted * 10) / 10,
      co2AvoidedKg: co2Saved,
      toxicLeadPreventedGrams: toxicLeadGrams
    };
  }
};
