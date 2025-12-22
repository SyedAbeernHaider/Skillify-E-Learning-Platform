import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaChalkboardTeacher,
    FaBook,
    FaDollarSign,
    FaUserCheck,
    FaBookOpen,
    FaCertificate,
    FaSpinner,
    FaCheck,
    FaTimes,
    FaEye
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
    getAdminDashboard,
    getPendingInstructors,
    approveInstructor,
    rejectInstructor,
    getPendingCourses,
    approveCourse,
    rejectCourse
} from '../../services/api/adminService';

function AdminDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [dashboardData, setDashboardData] = useState(null);
    const [pendingInstructors, setPendingInstructors] = useState([]);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [dashboardRes, instructorsRes, coursesRes] = await Promise.all([
                getAdminDashboard(),
                getPendingInstructors(),
                getPendingCourses()
            ]);

            setDashboardData(dashboardRes.data);
            setPendingInstructors(instructorsRes.data);
            setPendingCourses(coursesRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveInstructor = async (instructorId) => {
        try {
            setActionLoading(`approve-instructor-${instructorId}`);
            await approveInstructor(instructorId);
            toast.success('Instructor approved successfully!');
            fetchAllData();
        } catch (error) {
            toast.error('Failed to approve instructor');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectInstructor = async (instructorId) => {
        const reason = prompt('Enter rejection reason (optional):');
        try {
            setActionLoading(`reject-instructor-${instructorId}`);
            await rejectInstructor(instructorId, reason);
            toast.success('Instructor application rejected');
            fetchAllData();
        } catch (error) {
            toast.error('Failed to reject instructor');
        } finally {
            setActionLoading(null);
        }
    };

    const handleApproveCourse = async (courseId) => {
        try {
            setActionLoading(`approve-course-${courseId}`);
            await approveCourse(courseId);
            toast.success('Course approved successfully!');
            fetchAllData();
        } catch (error) {
            toast.error('Failed to approve course');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectCourse = async (courseId) => {
        const reason = prompt('Enter rejection reason (optional):');
        try {
            setActionLoading(`reject-course-${courseId}`);
            await rejectCourse(courseId, reason);
            toast.success('Course rejected');
            fetchAllData();
        } catch (error) {
            toast.error('Failed to reject course');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Total Students',
            value: dashboardData?.users?.totalStudents || 0,
            icon: FaUsers,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Total Instructors',
            value: dashboardData?.users?.totalInstructors || 0,
            icon: FaChalkboardTeacher,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Total Courses',
            value: dashboardData?.courses?.totalCourses || 0,
            icon: FaBook,
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Platform Revenue',
            value: `$${dashboardData?.revenue?.platformRevenue?.toFixed(2) || '0.00'}`,
            icon: FaDollarSign,
            color: 'from-yellow-500 to-yellow-600',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Admin Dashboard 👑
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage platform, approve requests, and monitor analytics
                            </p>
                        </div>
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
                            <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}>
                                <div className="flex items-center justify-between mb-4">
                                    <stat.icon className="text-4xl opacity-80" />
                                    <div className="text-right">
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium opacity-90">{stat.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pending Approvals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Pending Instructors */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaUserCheck className="text-purple-600" />
                                    Pending Instructors
                                </h2>
                                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                                    {pendingInstructors.length}
                                </span>
                            </div>

                            {pendingInstructors.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {pendingInstructors.map((instructor) => (
                                        <div
                                            key={instructor._id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">
                                                        {instructor.firstName} {instructor.lastName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{instructor.email}</p>
                                                    {instructor.expertise?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {instructor.expertise.map((skill, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {instructor.experience && (
                                                <p className="text-sm text-gray-600 mb-3">
                                                    <strong>Experience:</strong> {instructor.experience}
                                                </p>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApproveInstructor(instructor._id)}
                                                    disabled={actionLoading === `approve-instructor-${instructor._id}`}
                                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading === `approve-instructor-${instructor._id}` ? (
                                                        <FaSpinner className="animate-spin" />
                                                    ) : (
                                                        <FaCheck />
                                                    )}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectInstructor(instructor._id)}
                                                    disabled={actionLoading === `reject-instructor-${instructor._id}`}
                                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading === `reject-instructor-${instructor._id}` ? (
                                                        <FaSpinner className="animate-spin" />
                                                    ) : (
                                                        <FaTimes />
                                                    )}
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaUserCheck className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600">No pending instructor applications</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Pending Courses */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaBookOpen className="text-purple-600" />
                                    Pending Courses
                                </h2>
                                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                                    {pendingCourses.length}
                                </span>
                            </div>

                            {pendingCourses.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {pendingCourses.map((course) => (
                                        <div
                                            key={course._id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition"
                                        >
                                            <div className="mb-3">
                                                <h3 className="font-semibold text-gray-800 mb-1">
                                                    {course.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    by {course.instructor?.firstName} {course.instructor?.lastName}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                                                        {course.category}
                                                    </span>
                                                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                                                        ${course.price}
                                                    </span>
                                                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                                                        {course.level}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {course.shortDescription}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApproveCourse(course._id)}
                                                    disabled={actionLoading === `approve-course-${course._id}`}
                                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading === `approve-course-${course._id}` ? (
                                                        <FaSpinner className="animate-spin" />
                                                    ) : (
                                                        <FaCheck />
                                                    )}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectCourse(course._id)}
                                                    disabled={actionLoading === `reject-course-${course._id}`}
                                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading === `reject-course-${course._id}` ? (
                                                        <FaSpinner className="animate-spin" />
                                                    ) : (
                                                        <FaTimes />
                                                    )}
                                                    Reject
                                                </button>
                                                <Link
                                                    to={`/admin/courses/${course._id}`}
                                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
                                                >
                                                    <FaEye />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600">No pending course approvals</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link
                                to="/admin/revenue"
                                className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl hover:shadow-lg transition transform hover:scale-105"
                            >
                                <FaDollarSign className="text-3xl mb-2" />
                                <h3 className="font-semibold text-lg">Revenue Analytics</h3>
                                <p className="text-sm opacity-90">View platform earnings</p>
                            </Link>
                            <Link
                                to="/admin/users"
                                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition transform hover:scale-105"
                            >
                                <FaUsers className="text-3xl mb-2" />
                                <h3 className="font-semibold text-lg">User Management</h3>
                                <p className="text-sm opacity-90">Manage all users</p>
                            </Link>
                            <Link
                                to="/admin/certificates"
                                className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transition transform hover:scale-105"
                            >
                                <FaCertificate className="text-3xl mb-2" />
                                <h3 className="font-semibold text-lg">Certificates</h3>
                                <p className="text-sm opacity-90">Approve certificates</p>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default AdminDashboard;
