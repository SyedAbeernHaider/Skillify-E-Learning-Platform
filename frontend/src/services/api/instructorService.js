import api from '../../config/api';

// Get instructor dashboard
export const getInstructorDashboard = async () => {
    const response = await api.get('/instructor/dashboard');
    return response.data;
};

// Get instructor courses
export const getInstructorCourses = async () => {
    const response = await api.get('/instructor/courses');
    return response.data;
};

// Create course
export const createCourse = async (courseData) => {
    const response = await api.post('/instructor/courses', courseData);
    return response.data;
};

// Update course
export const updateCourse = async (courseId, courseData) => {
    const response = await api.put(`/instructor/courses/${courseId}`, courseData);
    return response.data;
};

// Add section to course
export const addSection = async (courseId, sectionData) => {
    const response = await api.post(`/instructor/courses/${courseId}/sections`, sectionData);
    return response.data;
};

// Add lesson to section
export const addLesson = async (courseId, sectionId, lessonData) => {
    const response = await api.post(`/instructor/courses/${courseId}/sections/${sectionId}/lessons`, lessonData);
    return response.data;
};

// Get course enrollments
export const getCourseEnrollments = async (courseId) => {
    const response = await api.get(`/instructor/courses/${courseId}/enrollments`);
    return response.data;
};

// Award badge to student
export const awardBadge = async (badgeData) => {
    const response = await api.post('/instructor/badges', badgeData);
    return response.data;
};

// Get all students enrolled in instructor's courses
export const getInstructorStudents = async () => {
    const response = await api.get('/instructor/students');
    return response.data;
};



// Get course overview
export const getCourseOverview = async (courseId) => {
    const response = await api.get(`/instructor/courses/${courseId}/overview`);
    return response.data;
};

// Get course analytics
export const getCourseAnalytics = async (courseId) => {
    const response = await api.get(`/instructor/courses/${courseId}/analytics`);
    return response.data;
};

// Get course details
export const getCourseDetails = async (courseId) => {
    const response = await api.get(`/content/courses/${courseId}`);
    return response.data;
};

// Section Management
export const createSection = async (courseId, sectionData) => {
    const response = await api.post(`/content/courses/${courseId}/sections`, sectionData);
    return response.data;
};

export const updateSection = async (courseId, sectionId, sectionData) => {
    const response = await api.put(`/content/courses/${courseId}/sections/${sectionId}`, sectionData);
    return response.data;
};

export const deleteSection = async (courseId, sectionId) => {
    const response = await api.delete(`/content/courses/${courseId}/sections/${sectionId}`);
    return response.data;
};

// Lesson Management
export const createLesson = async (courseId, sectionId, lessonData) => {
    const response = await api.post(`/content/courses/${courseId}/sections/${sectionId}/lessons`, lessonData);
    return response.data;
};

export const updateLesson = async (courseId, sectionId, lessonId, lessonData) => {
    const response = await api.put(`/content/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, lessonData);
    return response.data;
};

export const deleteLesson = async (courseId, sectionId, lessonId) => {
    const response = await api.delete(`/content/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
    return response.data;
};
