import api from '../../config/api';

// Instructor Assignment APIs
export const createAssignment = async (courseId, lectureId, assignmentData) => {
    const response = await api.post(`/assignment/instructor/courses/${courseId}/lectures/${lectureId}/assignment`, assignmentData);
    return response.data;
};

export const updateAssignment = async (courseId, lectureId, assignmentData) => {
    const response = await api.put(`/assignment/instructor/courses/${courseId}/lectures/${lectureId}/assignment`, assignmentData);
    return response.data;
};

export const getAssignmentSubmissions = async (courseId, lectureId) => {
    const response = await api.get(`/assignment/instructor/courses/${courseId}/lectures/${lectureId}/assignment/submissions`);
    return response.data;
};

export const gradeAssignment = async (submissionId, gradeData) => {
    const response = await api.put(`/assignment/instructor/assignment-submissions/${submissionId}/grade`, gradeData);
    return response.data;
};

// Student Assignment APIs
export const getAssignment = async (courseId, lectureId, sectionId) => {
    const response = await api.get(`/assignment/student/courses/${courseId}/lectures/${lectureId}/assignment?sectionId=${sectionId}`);
    return response.data;
};

export const submitAssignment = async (courseId, lectureId, submissionData) => {
    const response = await api.post(`/assignment/student/courses/${courseId}/lectures/${lectureId}/assignment/submit`, submissionData);
    return response.data;
};
