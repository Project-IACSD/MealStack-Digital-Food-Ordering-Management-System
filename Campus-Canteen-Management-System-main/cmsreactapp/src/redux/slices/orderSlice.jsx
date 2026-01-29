import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    currentOrder: null,
    pendingOrders: [],
    completedOrders: [],
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setOrders: (state, action) => {
            state.orders = action.payload;
            state.loading = false;
        },
        setPendingOrders: (state, action) => {
            state.pendingOrders = action.payload;
            state.loading = false;
        },
        setCompletedOrders: (state, action) => {
            state.completedOrders = action.payload;
            state.loading = false;
        },
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    setLoading,
    setOrders,
    setPendingOrders,
    setCompletedOrders,
    addOrder,
} = orderSlice.actions;

export default orderSlice.reducer;