import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBook,
    FaPlus,
    FaUsers,
    FaEye,
    FaEdit,
    FaSpinner,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaLock,
    FaCog
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getInstructorCourses } from '../../services/api/instructorService';
import InstructorSidebar from '../../components/InstructorSidebar';

function InstructorCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await getInstructorCourses();
            setCourses(response.data);
        } catch (error) {
            toast.error('Failed to load courses');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            approved: {
                icon: FaCheckCircle,
                color: 'bg-green-100 text-green-600',
                text: 'Published'
            },
            pending: {
                icon: FaClock,
                color: 'bg-yellow-100 text-yellow-600',
                text: 'Pending Approval'
            },
            rejected: {
                icon: FaTimesCircle,
                color: 'bg-red-100 text-red-600',
                text: 'Rejected'
            }
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`${badge.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit`}>
                <Icon />
                {badge.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <InstructorSidebar />
            <div className="flex-1 ml-64">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    My Courses
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Manage your courses and track performance
                                </p>
                            </div>
                            <Link
                                to="/instructor/courses/create"
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 flex items-center gap-2"
                            >
                                <FaPlus />
                                Create Course
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course, index) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                        {/* Course Thumbnail */}
                                        <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-500 relative">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <FaBook className="text-6xl text-white opacity-50" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4">
                                                {getStatusBadge(course.approvalStatus)}
                                            </div>
                                        </div>

                                        {/* Course Info */}
                                        <div className="p-6">
                                            <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {course.shortDescription}
                                            </p>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <FaUsers />
                                                    <span>{course.enrollmentCount || 0} students</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaEye />
                                                    <span>{course.views || 0} views</span>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                                                    {course.category}
                                                </span>
                                                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                                                    {course.level}
                                                </span>
                                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                                                    ${course.price}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                {course.approvalStatus === 'approved' ? (
                                                    <Link
                                                        to={`/instructor/courses/${course._id}/overview`}
                                                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-center font-semibold flex items-center justify-center gap-2"
                                                    >
                                                        <FaCog />
                                                        Manage Content
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={() => toast.warning('Course is pending admin approval. You cannot manage content yet.')}
                                                        className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed transition text-center font-semibold flex items-center justify-center gap-2"
                                                    >
                                                        <FaLock />
                                                        Manage Content
                                                    </button>
                                                )}
                                            </div>

                                            {/* Rejection Reason */}
                                            {course.approvalStatus === 'rejected' && course.rejectionReason && (
                                                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                                                    <p className="text-sm text-red-800">
                                                        <strong>Rejection Reason:</strong> {course.rejectionReason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-12 text-center"
                        >
                            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                No Courses Yet
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Create your first course and start teaching!
                            </p>
                            <Link
                                to="/instructor/courses/create"
                                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105"
                            >
                                <FaPlus className="inline mr-2" />
                                Create Your First Course
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InstructorCourses;
