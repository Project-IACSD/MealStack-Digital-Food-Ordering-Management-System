import api from '../config/api';

class ItemMasterService {
    
    async getAllItems() {
        try {
            const response = await api.get('/items');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getItemById(itemId) {
        try {
            const response = await api.get(`/items/${itemId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getItemsByCategory(category) {
        try {
            const response = await api.get(`/items/category/${category}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async addItem(item) {
        try {
            const response = await api.post('/items', item);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async updateItem(itemId, item) {
        try {
            const response = await api.put(`/items/${itemId}`, item);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async deleteItem(itemId) {
        try {
            const response = await api.delete(`/items/${itemId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new ItemMasterService();
