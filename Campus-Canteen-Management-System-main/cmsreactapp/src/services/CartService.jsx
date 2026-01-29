import api from '../config/api';

class CartService {
    
    async getAllCarts() {
        try {
            const response = await api.get('/carts');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async insertCart(cart) {
        try {
            const response = await api.post(`/carts/cart/${cart.pid}`, cart);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async deleteCart(pid) {
        try {
            const response = await api.delete(`/carts/cart/${pid}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getById(id) {
        try {
            const response = await api.get(`/carts/cart/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async updateCart(prod) {
        try {
            const response = await api.put(`/carts/cart/${prod.pid}`, prod);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new CartService();