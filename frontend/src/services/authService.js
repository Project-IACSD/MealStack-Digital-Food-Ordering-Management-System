import api from '../config/api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

class AuthService {
  /**
   * Student Registration
   * @param {object} studentData - Student registration data
   * @returns {Promise} API response
   */
  async registerStudent(studentData) {
    try {
      const response = await api.post('/student/register', {
        name: studentData.name,
        email: studentData.email,
        password: studentData.password,
        mobileNo: studentData.mobileNo,
        courseName: studentData.courseName || 'DAC'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Student Login
   * @param {string} userName - Email
   * @param {string} password - Password
   * @returns {Promise} API response with token
   */
  async studentLogin(userName, password) {
    try {
      const response = await api.post('/student/login', {
        userName,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Admin Login
   * @param {string} userName - Email
   * @param {string} password - Password
   * @returns {Promise} API response with token
   */
  async adminLogin(userName, password) {
    try {
      const response = await api.post('/admin/login', {
        userName,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new AuthService();
