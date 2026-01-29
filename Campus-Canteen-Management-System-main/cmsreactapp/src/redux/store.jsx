import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import orderReducer from './slices/orderSlice';
import cartReducer from './slices/cartSlice';
import menuReducer from './slices/menuSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        order: orderReducer,
        cart: cartReducer,
        menu: menuReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
