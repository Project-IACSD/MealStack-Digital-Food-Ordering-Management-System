import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    studentId: localStorage.getItem('studentId') || null,
    email: localStorage.getItem('studentEmail') || null,
    isAuthenticated: !!localStorage.getItem('studentId'),
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.studentId = action.payload.studentId;
            state.email = action.payload.email;
            state.isAuthenticated = true;
            state.isAdmin = action.payload.isAdmin || false;
            state.error = null;

            localStorage.setItem('studentId', action.payload.studentId);
            localStorage.setItem('studentEmail', action.payload.email);
            localStorage.setItem('isAdmin', action.payload.isAdmin || 'false');
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.user = null;
            state.studentId = null;
            state.email = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.loading = false;
            state.error = null;

            localStorage.removeItem('studentId');
            localStorage.removeItem('studentEmail');
            localStorage.removeItem('isAdmin');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;
