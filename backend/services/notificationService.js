const Notification = require('../models/Notification');

class NotificationService {
    // Create a new notification
    static async createNotification({ recipient, sender, type, title, message, link, metadata }) {
        try {
            const notification = await Notification.create({
                recipient,
                sender,
                type,
                title,
                message,
                link,
                metadata,
            });

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }


    // Instructor application approved
    static async notifyInstructorApproved(instructorId) {
        return await this.createNotification({
            recipient: instructorId,
            type: 'instructor_application_approved',
            title: 'Congratulations! Welcome to Skillify',
            message: 'Your instructor application has been approved. You can now start creating courses!',
            link: '/instructor/dashboard',
        });
    }

    // Instructor application rejected
    static async notifyInstructorRejected(instructorId, reason) {
        return await this.createNotification({
            recipient: instructorId,
            type: 'instructor_application_rejected',
            title: 'Instructor Application Status',
            message: `Your instructor application has been declined. ${reason || ''}`,
            link: '/dashboard',
            metadata: { reason },
        });
    }

    // Course approved
    static async notifyCourseApproved(instructorId, courseId, courseTitle) {
        return await this.createNotification({
            recipient: instructorId,
            type: 'course_approved',
            title: 'Course Approved',
            message: `Your course "${courseTitle}" has been approved and is now live!`,
            link: `/instructor/courses/${courseId}`,
            metadata: { courseId, courseTitle },
        });
    }

    // Course rejected
    static async notifyCourseRejected(instructorId, courseId, courseTitle, reason) {
        return await this.createNotification({
            recipient: instructorId,
            type: 'course_rejected',
            title: 'Course Declined',
            message: `Your course "${courseTitle}" has been declined. ${reason || ''}`,
            link: `/instructor/courses/${courseId}`,
            metadata: { courseId, courseTitle, reason },
        });
    }

    // New enrollment
    static async notifyNewEnrollment(instructorId, studentName, courseTitle) {
        return await this.createNotification({
            recipient: instructorId,
            type: 'new_enrollment',
            title: 'New Student Enrollment',
            message: `${studentName} has enrolled in your course "${courseTitle}"`,
            link: '/instructor/dashboard',
            metadata: { studentName, courseTitle },
        });
    }

    // Assignment submitted
    static async notifyAssignmentSubmitted(instructorId, studentName, assignmentTitle) {
        return await this.createNotification({
            recipient: instructorId,
            type: 'assignment_submitted',
            title: 'New Assignment Submission',
            message: `${studentName} has submitted "${assignmentTitle}"`,
            link: '/instructor/assignments',
            metadata: { studentName, assignmentTitle },
        });
    }

    // Assignment graded
    static async notifyAssignmentGraded(studentId, assignmentTitle, grade) {
        return await this.createNotification({
            recipient: studentId,
            type: 'assignment_graded',
            title: 'Assignment Graded',
            message: `Your assignment "${assignmentTitle}" has been graded. Score: ${grade}`,
            link: '/student/assignments',
            metadata: { assignmentTitle, grade },
        });
    }

    // Badge awarded
    static async notifyBadgeAwarded(studentId, badgeTitle, courseTitle) {
        return await this.createNotification({
            recipient: studentId,
            type: 'badge_awarded',
            title: 'Badge Earned!',
            message: `Congratulations! You've earned the "${badgeTitle}" badge in ${courseTitle}`,
            link: '/student/badges',
            metadata: { badgeTitle, courseTitle },
        });
    }

    // Certificate approved
    static async notifyCertificateApproved(studentId, courseTitle) {
        return await this.createNotification({
            recipient: studentId,
            type: 'certificate_approved',
            title: 'Certificate Approved',
            message: `Your certificate for "${courseTitle}" has been approved!`,
            link: '/student/certificates',
            metadata: { courseTitle },
        });
    }

    // Get user notifications
    static async getUserNotifications(userId, limit = 20) {
        try {
            const notifications = await Notification.find({ recipient: userId })
                .sort({ createdAt: -1 })
                .limit(limit) 
                .populate('sender', 'firstName lastName profileImage'); 

            return notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    // Generic Instructor Notification
    static async notifyInstructor(instructorId, title, message) {
        return await this.createNotification({
            recipient: instructorId,
            type: 'system_notification', // Generic type
            title: title,
            message: message,
            link: '/instructor/dashboard'
        });
    }

    // Mark notification as read
    static async markAsRead(notificationId) {
        try {
            const notification = await Notification.findByIdAndUpdate(
                notificationId,
                { isRead: true, readAt: new Date() },
                { new: true }
            );

            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    // Mark all notifications as read
    static async markAllAsRead(userId) {
        try {
            await Notification.updateMany(
                { recipient: userId, isRead: false },
                { isRead: true, readAt: new Date() }
            );

            return { success: true };
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    // Get unread count
    static async getUnreadCount(userId) {
        try {
            const count = await Notification.countDocuments({
                recipient: userId,
                isRead: false,
            });

            return count;
        } catch (error) {
            console.error('Error getting unread count:', error);
            throw error;
        }
    }
} 

module.exports = NotificationService;
 