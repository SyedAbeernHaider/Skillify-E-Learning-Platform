import api from '../../config/api';

// Instructor Quiz APIs
export const createQuiz = async (courseId, lectureId, quizData) => {
    const response = await api.post(`/quiz/instructor/courses/${courseId}/lectures/${lectureId}/quiz`, quizData);
    return response.data;
};

export const updateQuiz = async (courseId, lectureId, quizData) => {
    const response = await api.put(`/quiz/instructor/courses/${courseId}/lectures/${lectureId}/quiz`, quizData);
    return response.data;
};

export const getQuizResultsForLecture = async (courseId, lectureId) => {
    const response = await api.get(`/quiz/instructor/courses/${courseId}/lectures/${lectureId}/quiz/results`);
    return response.data;
};

// Student Quiz APIs
export const getQuiz = async (courseId, lectureId, sectionId) => {
    const response = await api.get(`/quiz/student/courses/${courseId}/lectures/${lectureId}/quiz?sectionId=${sectionId}`);
    return response.data;
};

export const submitQuiz = async (courseId, lectureId, submissionData) => {
    const response = await api.post(`/quiz/student/courses/${courseId}/lectures/${lectureId}/quiz/submit`, submissionData);
    return response.data;
};

export const getQuizResults = async (submissionId) => {
    const response = await api.get(`/quiz/student/quiz-submissions/${submissionId}`);
    return response.data;
};
