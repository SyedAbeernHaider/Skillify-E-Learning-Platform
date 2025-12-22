import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaSpinner, FaBook, FaClock, FaCheckCircle, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getEnrolledCourses, getStudentDashboard } from '../../services/api/studentService';

function StudentProgress() {
    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [enrollmentsRes, statsRes] = await Promise.all([
                getEnrolledCourses(),
                getStudentDashboard()
            ]);
            setEnrollments(enrollmentsRes.data || []);
            setStats(statsRes.data || {});
        } catch (error) {
            toast.error('Failed to load progress data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateOverallProgress = () => {
        if (enrollments.length === 0) return 0;
        const total = enrollments.reduce((sum, enrollment) => {
            return sum + (enrollment.progress?.completionPercentage || 0);
        }, 0);
        return Math.round(total / enrollments.length);
    };

    const getTimeSpent = () => {
        // Mock data - in real app, this would come from backend
        return enrollments.reduce((sum, enrollment) => {
            return sum + (enrollment.progress?.timeSpent || 0);
        }, 0);
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your progress...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const overallProgress = calculateOverallProgress();
    const timeSpent = getTimeSpent();

    return (
        <DashboardLayout role="student">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            Learning Progress 📊
                        </h1>
                        <p className="text-gray-600">
                            Track your learning journey and achievements
                        </p>
                    </div>

                    {/* Overall Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaChartLine className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{overallProgress}%</p>
                            <p className="text-sm opacity-90">Overall Progress</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaBook className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{enrollments.length}</p>
                            <p className="text-sm opacity-90">Enrolled Courses</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaCheckCircle className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">
                                {enrollments.filter(e => e.progress?.completionPercentage === 100).length}
                            </p>
                            <p className="text-sm opacity-90">Completed Courses</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaClock className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{formatTime(timeSpent)}</p>
                            <p className="text-sm opacity-90">Time Spent</p>
                        </motion.div>
                    </div>

                    {/* Progress Chart - Overall */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Progress</h2>
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 font-medium">Learning Journey</span>
                                <span className="text-purple-600 font-bold text-lg">{overallProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-6">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${overallProgress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                                >
                                    {overallProgress > 10 && (
                                        <span className="text-white text-xs font-bold">{overallProgress}%</span>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Course Progress Details */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Progress</h2>

                        {enrollments.length > 0 ? (
                            <div className="space-y-4">
                                {enrollments.map((enrollment, index) => {
                                    const progress = enrollment.progress?.completionPercentage || 0;
                                    const isCompleted = progress === 100;

                                    return (
                                        <motion.div
                                            key={enrollment._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            {enrollment.course?.title || 'Course Title'}
                                                        </h3>
                                                        {isCompleted && (
                                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                                <FaCheckCircle /> Completed
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        by {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                                                    </p>
                                                </div>
                                                <Link
                                                    to={`/student/courses/${enrollment.course?._id}`}
                                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                                                >
                                                    {isCompleted ? 'Review' : 'Continue'}
                                                </Link>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-600">Progress</span>
                                                    <span className="text-purple-600 font-bold">{progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full transition-all ${isCompleted
                                                                ? 'bg-gradient-to-r from-green-500 to-green-600'
                                                                : 'bg-gradient-to-r from-purple-600 to-blue-600'
                                                            }`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Completed Lessons</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {enrollment.progress?.completedLessons || 0} / {enrollment.course?.totalLessons || 0}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Quizzes</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {enrollment.progress?.completedQuizzes || 0} / {enrollment.course?.totalQuizzes || 0}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Assignments</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {enrollment.progress?.completedAssignments || 0} / {enrollment.course?.totalAssignments || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Courses Yet</h3>
                                <p className="text-gray-600 mb-6">Start learning to track your progress!</p>
                                <Link
                                    to="/student/courses"
                                    className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                                >
                                    Browse Courses
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default StudentProgress;
