import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find(
                (item) => item.itemId === action.payload.itemId
            );

            if (existingItem) {
                existingItem.quantity += action.payload.quantity || 1;
                existingItem.netPrice = existingItem.quantity * existingItem.itemPrice;
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: action.payload.quantity || 1,
                    netPrice: (action.payload.quantity || 1) * action.payload.itemPrice,
                });
            }

            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalAmount = state.items.reduce((sum, item) => sum + item.netPrice, 0);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.itemId !== action.payload
            );

            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalAmount = state.items.reduce((sum, item) => sum + item.netPrice, 0);
        },
        updateCartItemQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const item = state.items.find((item) => item.itemId === itemId);

            if (item) {
                item.quantity = quantity;
                item.netPrice = quantity * item.itemPrice;
            }

            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalAmount = state.items.reduce((sum, item) => sum + item.netPrice, 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.totalItems = 0;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
