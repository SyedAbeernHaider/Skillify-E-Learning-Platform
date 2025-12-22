// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1000/api';

// User Roles
export const USER_ROLES = {
    STUDENT: 'student',
    INSTRUCTOR: 'instructor',
    ADMIN: 'admin',
};

// Course Levels
export const COURSE_LEVELS = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
};

// Approval Status
export const APPROVAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

// Notification Types
export const NOTIFICATION_TYPES = {
    INSTRUCTOR_APPROVED: 'instructor_application_approved',
    INSTRUCTOR_REJECTED: 'instructor_application_rejected',
    COURSE_APPROVED: 'course_approved',
    COURSE_REJECTED: 'course_rejected',
    NEW_ENROLLMENT: 'new_enrollment',
    ASSIGNMENT_SUBMITTED: 'assignment_submitted',
    ASSIGNMENT_GRADED: 'assignment_graded',
    QUIZ_COMPLETED: 'quiz_completed',
    BADGE_AWARDED: 'badge_awarded',
    CERTIFICATE_APPROVED: 'certificate_approved',
    CERTIFICATE_REJECTED: 'certificate_rejected',
    NEW_MESSAGE: 'new_message',
    GENERAL: 'general',
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FREE: 'free',
};

// Assignment/Quiz Status
export const SUBMISSION_STATUS = {
    SUBMITTED: 'submitted',
    GRADED: 'graded',
    LATE: 'late',
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    COURSES: '/courses',
    COURSE_DETAIL: '/courses/:id',

    // Student Routes
    STUDENT_DASHBOARD: '/student/dashboard',
    STUDENT_COURSES: '/student/courses',
    STUDENT_ENROLLED: '/student/enrolled',
    STUDENT_COURSE_PLAYER: '/student/course/:id',
    STUDENT_QUIZZES: '/student/quizzes',
    STUDENT_ASSIGNMENTS: '/student/assignments',
    STUDENT_BADGES: '/student/badges',
    STUDENT_CERTIFICATES: '/student/certificates',
    STUDENT_PROFILE: '/student/profile',
    STUDENT_NOTIFICATIONS: '/student/notifications',

    // Instructor Routes
    INSTRUCTOR_DASHBOARD: '/instructor/dashboard',
    INSTRUCTOR_COURSES: '/instructor/courses',
    INSTRUCTOR_CREATE_COURSE: '/instructor/courses/create',
    INSTRUCTOR_EDIT_COURSE: '/instructor/courses/:id/edit',
    INSTRUCTOR_ASSIGNMENTS: '/instructor/assignments',
    INSTRUCTOR_QUIZZES: '/instructor/quizzes',
    INSTRUCTOR_STUDENTS: '/instructor/students',
    INSTRUCTOR_CHAT: '/instructor/chat',
    INSTRUCTOR_PROFILE: '/instructor/profile',
    INSTRUCTOR_NOTIFICATIONS: '/instructor/notifications',

    // Admin Routes
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_INSTRUCTORS: '/admin/instructors',
    ADMIN_COURSES: '/admin/courses',
    ADMIN_USERS: '/admin/users',
    ADMIN_REVENUE: '/admin/revenue',
    ADMIN_CERTIFICATES: '/admin/certificates',
    ADMIN_ANALYTICS: '/admin/analytics',
};

// Platform Fee
export const PLATFORM_FEE_PERCENTAGE = 10;
