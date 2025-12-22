import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBook,
    FaUsers,
    FaEye,
    FaTrophy,
    FaClipboardList,
    FaPlus,
    FaSpinner,
    FaArrowRight,
    FaCheckCircle,
    FaClock,
    FaDollarSign
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getInstructorDashboard } from '../../services/api/instructorService';
import InstructorSidebar from '../../components/InstructorSidebar';
import useInstructorApprovalCheck from '../../hooks/useInstructorApprovalCheck';

function InstructorDashboard() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check instructor approval status
    useInstructorApprovalCheck();

    useEffect(() => {
        // Only fetch dashboard data if instructor is approved
        if (user?.role === 'instructor' && user?.instructorStatus === 'approved') {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await getInstructorDashboard();
            setDashboardData(response.data);
        } catch (error) {
            // Don't show error toast for 403 (handled by approval check hook)
            if (error.response?.status !== 403) {
                toast.error('Failed to load dashboard data');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Show welcome message for first-time login
    useEffect(() => {
        if (user?.isFirstLogin && user?.instructorStatus === 'approved') {
            toast.success('🎉 Congratulations! Welcome to Skillify as an Instructor!', {
                autoClose: 5000,
            });
        }
    }, [user]);

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
            title: 'Total Revenue',
            value: `$${dashboardData?.totalRevenue?.toFixed(2) || '0.00'}`,
            icon: FaDollarSign,
            color: 'from-emerald-500 to-emerald-600',
            link: '/instructor/courses',
        },
        {
            title: 'Total Courses',
            value: dashboardData?.totalCourses || 0,
            icon: FaBook,
            color: 'from-blue-500 to-blue-600',
            link: '/instructor/courses',
        },
        {
            title: 'Total Students',
            value: dashboardData?.totalEnrollments || 0,
            icon: FaUsers,
            color: 'from-green-500 to-green-600',
            link: '/instructor/students',
        },
        {
            title: 'Course Views',
            value: dashboardData?.totalViews || 0,
            icon: FaEye,
            color: 'from-purple-500 to-purple-600',
            link: '/instructor/courses',
        },
        {
            title: 'Badges Awarded',
            value: dashboardData?.badgesAwarded || 0,
            icon: FaTrophy,
            color: 'from-yellow-500 to-yellow-600',
            link: '/instructor/students',
        },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Sidebar */}
            <InstructorSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Welcome, {user?.firstName}! 👨‍🏫
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Manage your courses and track student progress
                                </p>
                            </div>
                            <Link
                                to="/instructor/create-course"
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 flex items-center gap-2"
                            >
                                <FaPlus />
                                Create Course
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
                                        <FaUsers className="text-purple-600" />
                                        Recent Enrollments
                                    </h2>
                                    <Link
                                        to="/instructor/students"
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
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                            {enrollment.student?.firstName?.charAt(0)}
                                                            {enrollment.student?.lastName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">
                                                                {enrollment.student?.firstName} {enrollment.student?.lastName}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {enrollment.course?.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-semibold text-purple-600">
                                                            {enrollment.progress?.completionPercentage || 0}% Complete
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">No enrollments yet</p>
                                        <Link
                                            to="/instructor/courses/create"
                                            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                                        >
                                            Create Your First Course
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
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">Submissions</p>
                                            <p className="text-sm text-gray-600">To review</p>
                                        </div>
                                        <div className="text-2xl font-bold text-orange-600">
                                            {dashboardData?.pendingSubmissions || 0}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">Assignments</p>
                                            <p className="text-sm text-gray-600">Active</p>
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {dashboardData?.totalAssignments || 0}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">Quizzes</p>
                                            <p className="text-sm text-gray-600">Active</p>
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {dashboardData?.totalQuizzes || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Course Status */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaBook className="text-purple-600" />
                                    Course Status
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-2">
                                            <FaCheckCircle className="text-green-600" />
                                            <span className="font-semibold text-gray-800">Published</span>
                                        </div>
                                        <div className="text-lg font-bold text-green-600">
                                            {dashboardData?.totalCourses || 0}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-yellow-600" />
                                            <span className="font-semibold text-gray-800">Pending</span>
                                        </div>
                                        <div className="text-lg font-bold text-yellow-600">0</div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Link
                                        to="/instructor/courses/create"
                                        className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition"
                                    >
                                        <p className="font-semibold">Create New Course</p>
                                    </Link>
                                    <Link
                                        to="/instructor/courses"
                                        className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition"
                                    >
                                        <p className="font-semibold">Manage Courses</p>
                                    </Link>
                                    <Link
                                        to="/instructor/students"
                                        className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition"
                                    >
                                        <p className="font-semibold">View Students</p>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructorDashboard;
