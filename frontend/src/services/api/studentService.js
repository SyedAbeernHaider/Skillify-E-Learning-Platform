import api from '../../config/api';

// Get all courses (public)
export const getAllCourses = async (params = {}) => {
    const response = await api.get('/student/courses', { params });
    return response.data;
};

// Get course details
export const getCourseDetails = async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}`);
    return response.data;
};

// Enroll in course
export const enrollInCourse = async (courseId) => {
    const response = await api.post(`/student/courses/${courseId}/enroll`);
    return response.data;
};

// Get enrolled courses
export const getEnrolledCourses = async () => {
    const response = await api.get('/student/enrollments');
    return response.data;
};

// Update course progress
export const updateProgress = async (enrollmentId, progressData) => {
    const response = await api.put(`/student/enrollments/${enrollmentId}/progress`, progressData);
    return response.data;
};

// Get student dashboard stats
export const getStudentDashboard = async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
};

// Submit assignment
export const submitAssignment = async (assignmentId, submissionData) => {
    const response = await api.post(`/student/assignments/${assignmentId}/submit`, submissionData);
    return response.data;
};

// Take quiz
export const takeQuiz = async (quizId, quizData) => {
    const response = await api.post(`/student/quizzes/${quizId}/attempt`, quizData);
    return response.data;
};

// Get badges
export const getBadges = async () => {
    const response = await api.get('/student/badges');
    return response.data;
};

// Get certificates
export const getCertificates = async () => {
    const response = await api.get('/student/certificates');
    return response.data;
};

// Request certificate
export const requestCertificate = async (courseId) => {
    const response = await api.post('/student/certificates/request', { courseId });
    return response.data;
};

// Embedded Quiz
export const getQuizBySection = async (courseId, sectionIndex) => {
    const response = await api.get(`/student/quizzes/course/${courseId}/section/${sectionIndex}`);
    return response.data;
};

export const submitEmbeddedQuiz = async (courseId, sectionIndex, quizData) => {
    const response = await api.post(`/student/courses/${courseId}/sections/${sectionIndex}/quiz/attempt`, quizData);
    return response.data;
};

export const getCertificateEligibility = async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/certificate-eligibility`);
    return response.data;
};
