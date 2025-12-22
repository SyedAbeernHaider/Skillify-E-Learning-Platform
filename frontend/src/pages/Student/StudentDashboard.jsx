import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBook,
    FaTrophy,
    FaCertificate,
    FaChartLine,
    FaClipboardList,
    FaGraduationCap,
    FaSpinner,
    FaArrowRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getStudentDashboard } from '../../services/api/studentService';
import DashboardLayout from '../../components/DashboardLayout';

function StudentDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await getStudentDashboard();
            setDashboardData(response.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Enrolled Courses',
            value: dashboardData?.enrolledCourses || 0,
            icon: FaBook,
            color: 'from-blue-500 to-blue-600',
            link: '/student/enrolled',
        },
        {
            title: 'Badges Earned',
            value: dashboardData?.badges || 0,
            icon: FaTrophy,
            color: 'from-yellow-500 to-yellow-600',
            link: '/student/badges',
        },
        {
            title: 'Certificates',
            value: dashboardData?.certificates || 0,
            icon: FaCertificate,
            color: 'from-green-500 to-green-600',
            link: '/student/certificates',
        },
        {
            title: 'Completed Assignments',
            value: dashboardData?.completedAssignments || 0,
            icon: FaClipboardList,
            color: 'from-purple-500 to-purple-600',
            link: '/student/assignments',
        },
    ];

    return (
        <DashboardLayout role="student">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Welcome back, {user?.firstName}! 👋
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Continue your learning journey
                                </p>
                            </div>
                            <Link
                                to="/student/courses"
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 flex items-center gap-2"
                            >
                                <FaBook />
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={stat.link}>
                                    <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <stat.icon className="text-4xl opacity-80" />
                                            <div className="text-right">
                                                <p className="text-3xl font-bold">{stat.value}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium opacity-90">{stat.title}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Enrollments */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        <FaGraduationCap className="text-purple-600" />
                                        My Courses
                                    </h2>
                                    <Link
                                        to="/student/enrolled"
                                        className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
                                    >
                                        View All
                                        <FaArrowRight />
                                    </Link>
                                </div>

                                {dashboardData?.recentEnrollments?.length > 0 ? (
                                    <div className="space-y-4">
                                        {dashboardData.recentEnrollments.map((enrollment) => (
                                            <div
                                                key={enrollment._id}
                                                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800 mb-1">
                                                            {enrollment.course?.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            by {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                                                        </p>

                                                        {/* Progress Bar */}
                                                        <div className="mb-2">
                                                            <div className="flex items-center justify-between text-sm mb-1">
                                                                <span className="text-gray-600">Progress</span>
                                                                <span className="font-semibold text-purple-600">
                                                                    {enrollment.progress?.completionPercentage || 0}%
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                                                                    style={{ width: `${enrollment.progress?.completionPercentage || 0}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        to={`/student/course/${enrollment.course?._id}`}
                                                        className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                                                    >
                                                        Continue
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                                        <Link
                                            to="/student/courses"
                                            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                                        >
                                            Browse Courses
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-6"
                        >
                            {/* Pending Tasks */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaClipboardList className="text-purple-600" />
                                    Pending Tasks
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">Quizzes</p>
                                            <p className="text-sm text-gray-600">{dashboardData?.pendingQuizzes || 0} pending</p>
                                        </div>
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {dashboardData?.pendingQuizzes || 0}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">Assignments</p>
                                            <p className="text-sm text-gray-600">{dashboardData?.pendingAssignments || 0} pending</p>
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {dashboardData?.pendingAssignments || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Badges */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaTrophy className="text-yellow-600" />
                                    Recent Badges
                                </h3>
                                {dashboardData?.recentBadges?.length > 0 ? (
                                    <div className="space-y-3">
                                        {dashboardData.recentBadges.map((badge) => (
                                            <div
                                                key={badge._id}
                                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                                            >
                                                <div className="text-3xl">{badge.icon || '🏆'}</div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 text-sm">{badge.title}</p>
                                                    <p className="text-xs text-gray-600">{badge.course?.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <FaTrophy className="text-4xl text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">No badges yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Link
                                        to="/student/courses"
                                        className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition"
                                    >
                                        <p className="font-semibold">Browse Courses</p>
                                    </Link>
                                    <Link
                                        to="/student/enrolled"
                                        className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition"
                                    >
                                        <p className="font-semibold">My Courses</p>
                                    </Link>
                                    <Link
                                        to="/student/certificates"
                                        className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition"
                                    >
                                        <p className="font-semibold">Certificates</p>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default StudentDashboard;
