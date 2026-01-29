import api from '../config/api';

class OrderService {

    async getAllOrders() {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getOrdersByStudentId(studentId) {
        try {
            const response = await api.get(`/orders/students/${studentId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getOrderById(orderId) {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getPendingOrders() {
        try {
            const response = await api.get('/orders/pending');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getCompletedOrders() {
        try {
            const response = await api.get('/orders/completed');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async insertOrder(orderPayload) {
        try {
            // Backend expects: POST /orders/{studentId}/orders
            const { studentId, ...data } = orderPayload;
            const response = await api.post(`/orders/${studentId}/orders`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }


    async updateOrderStatus(orderId, status) {
        try {
            const response = await api.put(`/orders/${orderId}/status?status=${status}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async deleteOrder(orderId) {
        try {
            const response = await api.delete(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new OrderService();
