import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBook,
    FaPlay,
    FaSpinner,
    FaChartLine,
    FaTrophy,
    FaClock
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/DashboardLayout';
import { getEnrolledCourses } from '../../services/api/studentService';

function EnrolledCourses() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const response = await getEnrolledCourses();
            setEnrollments(response.data);
        } catch (error) {
            toast.error('Failed to load enrolled courses');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 75) return 'from-green-500 to-green-600';
        if (percentage >= 50) return 'from-blue-500 to-blue-600';
        if (percentage >= 25) return 'from-yellow-500 to-yellow-600';
        return 'from-red-500 to-red-600';
    };

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your courses...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    My Learning
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
                                Browse More Courses
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {enrollments.length > 0 ? (
                        <div className="space-y-6">
                            {enrollments.map((enrollment, index) => (
                                <motion.div
                                    key={enrollment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                        <div className="md:flex">
                                            {/* Course Thumbnail */}
                                            <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-purple-500 to-blue-500 relative">
                                                {enrollment.course?.thumbnail ? (
                                                    <img
                                                        src={enrollment.course.thumbnail}
                                                        alt={enrollment.course.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <FaBook className="text-6xl text-white opacity-50" />
                                                    </div>
                                                )}
                                                {/* Progress Badge */}
                                                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
                                                    <span className="text-sm font-bold text-purple-600">
                                                        {enrollment.progress?.completionPercentage || 0}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Course Info */}
                                            <div className="md:w-2/3 p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                                                                {enrollment.course?.category}
                                                            </span>
                                                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-semibold">
                                                                {enrollment.course?.level}
                                                            </span>
                                                        </div>
                                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                                            {enrollment.course?.title}
                                                        </h2>
                                                        <p className="text-gray-600 mb-4">
                                                            {enrollment.course?.shortDescription}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between text-sm mb-2">
                                                        <span className="text-gray-600 font-medium">Overall Progress</span>
                                                        <span className="font-bold text-purple-600">
                                                            {enrollment.progress?.completionPercentage || 0}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                        <div
                                                            className={`bg-gradient-to-r ${getProgressColor(enrollment.progress?.completionPercentage || 0)} h-3 rounded-full transition-all duration-500`}
                                                            style={{ width: `${enrollment.progress?.completionPercentage || 0}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="grid grid-cols-3 gap-4 mb-4">
                                                    <div className="bg-blue-50 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                                                            <FaBook />
                                                            <span className="text-xs font-semibold">Completed</span>
                                                        </div>
                                                        <p className="text-lg font-bold text-gray-800">
                                                            {enrollment.progress?.completedLessons || 0}/{enrollment.progress?.totalLessons || 0}
                                                        </p>
                                                        <p className="text-xs text-gray-600">Lessons</p>
                                                    </div>

                                                    <div className="bg-green-50 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 text-green-600 mb-1">
                                                            <FaTrophy />
                                                            <span className="text-xs font-semibold">Score</span>
                                                        </div>
                                                        <p className="text-lg font-bold text-gray-800">
                                                            {enrollment.progress?.averageScore || 0}%
                                                        </p>
                                                        <p className="text-xs text-gray-600">Average</p>
                                                    </div>

                                                    <div className="bg-purple-50 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                                                            <FaClock />
                                                            <span className="text-xs font-semibold">Enrolled</span>
                                                        </div>
                                                        <p className="text-lg font-bold text-gray-800">
                                                            {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            {new Date(enrollment.enrolledAt).getFullYear()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-3">
                                                    <Link
                                                        to={`/student/course/${enrollment.course?._id}/overview`}
                                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center justify-center gap-2"
                                                    >
                                                        <FaPlay />
                                                        {enrollment.progress?.completionPercentage === 0 ? 'Start Course' : 'Continue Learning'}
                                                    </Link>
                                                    <Link
                                                        to={`/student/courses/${enrollment.course?._id}`}
                                                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                                                    >
                                                        <FaChartLine />
                                                        View Details
                                                    </Link>
                                                </div>

                                                {/* Completion Status */}
                                                {enrollment.completedAt && (
                                                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                                                        <FaTrophy className="text-green-600 text-xl" />
                                                        <div>
                                                            <p className="text-sm font-semibold text-green-800">
                                                                Course Completed!
                                                            </p>
                                                            <p className="text-xs text-green-600">
                                                                Completed on {new Date(enrollment.completedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
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
                                No Enrolled Courses Yet
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Start your learning journey by enrolling in a course
                            </p>
                            <Link
                                to="/student/courses"
                                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105"
                            >
                                Browse Courses
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default EnrolledCourses;
