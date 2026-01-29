import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    menuItems: [],
    dailyItems: [],
    loading: false,
    error: null,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMenuItems: (state, action) => {
            state.menuItems = action.payload;
            state.loading = false;
        },
        setDailyItems: (state, action) => {
            state.dailyItems = action.payload;
            state.loading = false;
        },
    },
});

export const {
    setLoading,
    setMenuItems,
    setDailyItems,
} = menuSlice.actions;

export default menuSlice.reducer;