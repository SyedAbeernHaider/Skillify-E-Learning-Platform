import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    courses: [],
    currentCourse: null,
    enrolledCourses: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        count: 0,
    },
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        setCourses: (state, action) => {
            state.courses = action.payload.data;
            state.pagination = {
                currentPage: action.payload.currentPage,
                totalPages: action.payload.totalPages,
                count: action.payload.count,
            };
            state.loading = false;
        },
        setCurrentCourse: (state, action) => {
            state.currentCourse = action.payload;
            state.loading = false;
        },
        setEnrolledCourses: (state, action) => {
            state.enrolledCourses = action.payload;
            state.loading = false;
        },
        addCourse: (state, action) => {
            state.courses.unshift(action.payload);
        },
        updateCourse: (state, action) => {
            const index = state.courses.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.courses[index] = action.payload;
            }
            if (state.currentCourse?._id === action.payload._id) {
                state.currentCourse = action.payload;
            }
        },
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },
    },
});

export const {
    setLoading,
    setError,
    clearError,
    setCourses,
    setCurrentCourse,
    setEnrolledCourses,
    addCourse,
    updateCourse,
    clearCurrentCourse,
} = courseSlice.actions;

export default courseSlice.reducer;
