import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: sessionStorage.getItem('token') || null,
    refreshToken: sessionStorage.getItem('refreshToken') || null,
    isAuthenticated: !!sessionStorage.getItem('token'),
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
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.error = null;

            // Save to session storage
            sessionStorage.setItem('token', action.payload.token);
            sessionStorage.setItem('refreshToken', action.payload.refreshToken);
            sessionStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;

            // Clear session storage
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('user');
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            sessionStorage.setItem('user', JSON.stringify(state.user));
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        loadUserFromStorage: (state) => {
            const token = sessionStorage.getItem('token');
            const user = sessionStorage.getItem('user');

            if (token && user) {
                state.token = token;
                state.refreshToken = sessionStorage.getItem('refreshToken');
                state.user = JSON.parse(user);
                state.isAuthenticated = true;
            }
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    updateUser,
    setError,
    clearError,
    loadUserFromStorage,
} = authSlice.actions;

export default authSlice.reducer;
