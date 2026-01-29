import api from '../config/api';

/**
 * Admin Service
 * Handles all admin-related API calls
 */

class AdminService {
  /**
   * Get admin dashboard data
   * @returns {Promise} Dashboard data
   */
  async getDashboard() {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get all students
   * @returns {Promise} List of all students
   */
  async getAllStudents() {
    try {
      const response = await api.get('/admin/students');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get total student count
   * @returns {Promise} Total number of students
   */
  async getTotalStudents() {
    try {
      const response = await api.get('/admin/totalstudents');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new AdminService();
