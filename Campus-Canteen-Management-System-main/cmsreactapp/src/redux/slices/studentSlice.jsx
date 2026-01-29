import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    students: [],
    currentStudent: null,
    balance: 0,
    loading: false,
    error: null,
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setStudents: (state, action) => {
            state.students = action.payload;
            state.loading = false;
            state.error = null;
        },
        setCurrentStudent: (state, action) => {
            state.currentStudent = action.payload;
            state.loading = false;
            state.error = null;
        },
        setBalance: (state, action) => {
            state.balance = action.payload;
            if (state.currentStudent) {
                state.currentStudent.balance = action.payload;
            }
        },
        updateBalance: (state, action) => {
            state.balance = action.payload;
            if (state.currentStudent) {
                state.currentStudent.balance = action.payload;
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setError,
    setStudents,
    setCurrentStudent,
    setBalance,
    updateBalance,
    clearError,
} = studentSlice.actions;

export default studentSlice.reducer;