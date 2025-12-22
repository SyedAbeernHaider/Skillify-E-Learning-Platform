import api from '../../config/api';

// Get admin dashboard stats
export const getAdminDashboard = async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
};

// Get pending instructor applications
export const getPendingInstructors = async () => {
    const response = await api.get('/admin/instructors/pending');
    return response.data;
};

// Approve instructor
export const approveInstructor = async (instructorId) => {
    const response = await api.put(`/admin/instructors/${instructorId}/approve`);
    return response.data;
};

// Reject instructor
export const rejectInstructor = async (instructorId, reason) => {
    const response = await api.put(`/admin/instructors/${instructorId}/reject`, { reason });
    return response.data;
};

// Get pending courses
export const getPendingCourses = async () => {
    const response = await api.get('/admin/courses/pending');
    return response.data;
};

// Approve course
export const approveCourse = async (courseId) => {
    const response = await api.put(`/admin/courses/${courseId}/approve`);
    return response.data;
};

// Reject course
export const rejectCourse = async (courseId, reason) => {
    const response = await api.put(`/admin/courses/${courseId}/reject`, { reason });
    return response.data;
};

// Get revenue statistics
export const getRevenueStats = async () => {
    const response = await api.get('/admin/revenue');
    return response.data;
};

// Get popular instructors
export const getPopularInstructors = async () => {
    const response = await api.get('/admin/instructors/popular');
    return response.data;
};

// Get all users
export const getAllUsers = async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
};

// Toggle user status
export const toggleUserStatus = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
};

// Approve certificate
export const approveCertificate = async (certificateId) => {
    const response = await api.put(`/admin/certificates/${certificateId}/approve`);
    return response.data;
};

// Get all courses
export const getAllCourses = async (params = {}) => {
    const response = await api.get('/admin/courses', { params });
    return response.data;
};

// Get all instructors
export const getAllInstructors = async () => {
    const response = await api.get('/admin/instructors', { params: { status: 'approved' } });
    return response.data;
};

// Get platform settings
export const getPlatformSettings = async () => {
    const response = await api.get('/admin/settings');
    return response.data;
};

// Update platform settings
export const updatePlatformSettings = async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
};
