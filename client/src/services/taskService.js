import api from './api';

export const taskService = {
  // Get all tasks with optional search, filters, pagination, and sorting
  async getTasks(params = {}) {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get a single task by ID
  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update a task by ID
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete a task by ID
  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get aggregate dashboard statistics
  async getTaskStats() {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
  async getNotifications() { return (await api.get('/notifications')).data; },
  async markNotificationRead(id) { return (await api.put(`/notifications/${id}/read`)).data; },
};
