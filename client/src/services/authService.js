import api from './api';

export const authService = {
  // Register a new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('taskflow_token', response.data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Log in user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('taskflow_token', response.data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Fetch current user details
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('taskflow_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Log out user
  logout() {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  },

  // Get locally cached user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('taskflow_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Check if token exists
  isAuthenticated() {
    return !!localStorage.getItem('taskflow_token');
  },
};
