import api from '../config/api';

class RechargeHistoryService {
    
    async getAllRechargeHistoryByStudentId(studentId) {
        try {
            const response = await api.get(`/recharge/students/${studentId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getAllRechargeHistory() {
        try {
            const response = await api.get('/recharge');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async addRechargeHistory(rechargeData) {
        try {
            const response = await api.post('/recharge', rechargeData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getRechargeById(transactionId) {
        try {
            const response = await api.get(`/recharge/${transactionId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new RechargeHistoryService();
