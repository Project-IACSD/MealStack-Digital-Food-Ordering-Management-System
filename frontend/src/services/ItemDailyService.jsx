import api from '../config/api';

class ItemDailyService {

    async getAllItemsDaily() {
        try {
            const response = await api.get('/dailyitems');
            // Ensure ID is populated correctly
            const data = response.data;
            if (Array.isArray(data)) {
                return data.map(item => ({
                    ...item,
                    id: item.dailyId || item.id, // Fix for shared ID issue
                    itemMasterId: item.itemMasterId || item.itemId, // Ensure itemMasterId is preserved
                    itemId: item.itemId || item.itemMasterId // Ensure itemId is preserved
                }));
            }
            return data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getDailyItemById(itemId) {
        try {
            const response = await api.get(`/dailyitems/${itemId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async addDailyItem(dailyItem) {
        try {
            const itemData = {
                initialQty: dailyItem.initialQty || 0,
                soldQty: dailyItem.soldQty || 0
            };
            // Note: API likely expects POST /dailyitems/{id} or POST /dailyitems with body
            // Assuming this matches backend:
            const response = await api.post(`/dailyitems/${dailyItem.id}`, itemData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async updateDailyItem(itemId, dailyItem) {
        try {
            const response = await api.put(`/dailyitems/${itemId}`, dailyItem);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async deleteDailyItem(itemId) {
        try {
            const response = await api.delete(`/dailyitems/${itemId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getAvailableItems() {
        try {
            const response = await api.get('/dailyitems/available');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new ItemDailyService();
