import api from './axios';

class MenuService {
    // --- Inventory Items (Master) ---

    async getAllItems() {
        try {
            const response = await api.get('/items');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getItemById(itemId) {
        try {
            const response = await api.get(`/items/${itemId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async addItem(item) {
        try {
            const response = await api.post('/items', item);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateItem(itemId, item) {
        try {
            const response = await api.put(`/items/${itemId}`, item);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteItem(itemId) {
        try {
            const response = await api.delete(`/items/${itemId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // --- Daily Menu Items ---

    async getAllItemsDaily() {
        try {
            const response = await api.get('/dailyitems');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * ADD Daily Item
     * Exact match for Backend: POST /dailyitems/{itemMasId}
     * Payload: ItemDailyDTO { initialQty, itemId, itemName }
     */
    async addDailyItem(dailyItem) {
        try {
            const itemMasId = dailyItem.id || dailyItem.itemId;
            if (!itemMasId) throw new Error("Item Master ID is missing");

            // Build DTO matching com.app.dto.ItemDailyDTO
            const dto = {
                initialQty: parseInt(dailyItem.initialQty) || 1,
                soldQty: 0,
                itemId: itemMasId, // This might be used by model mapper if available
                itemMasterId: itemMasId,
                itemName: dailyItem.itemName
            };

            console.log(`[POST] /dailyitems/${itemMasId}`, dto);
            const response = await api.post(`/dailyitems/${itemMasId}`, dto);
            return response.data;
        } catch (error) {
            console.error("Add Daily Item Failed:", error);
            throw error;
        }
    }

    async updateDailyItem(itemId, dailyItem) {
        try {
            const response = await api.put(`/dailyitems/${itemId}`, dailyItem);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteDailyItem(itemId) {
        try {
            const response = await api.delete(`/dailyitems/${itemId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new MenuService();
