import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
    FaBook,
    FaSpinner,
    FaStar,
    FaUsers,
    FaClock,
    FaGraduationCap,
    FaCheckCircle,
    FaPlay,
    FaChartLine,
    FaCertificate,
    FaTrophy,
    FaArrowLeft,
    FaShoppingCart
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCourseDetails, enrollInCourse } from '../services/api/studentService';
import PaymentModal from '../components/PaymentModal';

function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.warning('Please login to view course details');
            navigate('/login', { state: { from: `/course/${id}` } });
            return;
        }
        fetchCourseDetails();
    }, [id, isAuthenticated]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await getCourseDetails(id);
            setCourse(response.data);

            // Check if user is already enrolled
            const enrolled = response.data.isEnrolled || false;
            setIsEnrolled(enrolled);

            // If already enrolled, redirect to course lectures
            if (enrolled) {
                toast.info('You are already enrolled in this course!');
                navigate(`/student/courses/${id}/lectures`);
            }
        } catch (error) {
            toast.error('Failed to load course details');
            console.error(error);
            navigate('/courses');
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollClick = () => {
        // If course is free, enroll directly
        if (course.price === 0) {
            handleEnroll();
        } else {
            // Show payment modal for paid courses
            setShowPaymentModal(true);
        }
    };

    const handleEnroll = async () => {
        try {
            setEnrolling(true);
            await enrollInCourse(id);
            toast.success('Successfully enrolled in course!');
            setIsEnrolled(true);
            return true; // Return success status
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to enroll in course');
            return false; // Return failure status
        } finally {
            setEnrolling(false);
        }
    };

    const handlePaymentSuccess = async () => {
        setShowPaymentModal(false);
        // Enroll the user in the course
        const enrolled = await handleEnroll();
        // PaymentModal will handle the redirect to course lectures
        // No need to navigate here as it's handled in PaymentModal
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Back Button */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/courses')}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition"
                    >
                        <FaArrowLeft /> Back to Courses
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Content */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                                        {course.category}
                                    </span>
                                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                                        {course.level}
                                    </span>
                                    {course.status === 'published' && (
                                        <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                                            Published
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                    {course.title}
                                </h1>

                                <p className="text-xl text-blue-100 mb-6">
                                    {course.shortDescription}
                                </p>

                                {/* Instructor Info */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                        <FaGraduationCap className="text-2xl text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-200">Created by</p>
                                        <p className="font-semibold text-lg">
                                            {course.instructor?.firstName} {course.instructor?.lastName}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="text-xl" />
                                        <span>{course.enrollmentCount || 0} students enrolled</span>
                                    </div>
                                    {course.averageRating > 0 && (
                                        <div className="flex items-center gap-2">
                                            <FaStar className="text-yellow-300 text-xl" />
                                            <span>{course.averageRating.toFixed(1)} ({course.reviewCount || 0} reviews)</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <FaClock className="text-xl" />
                                        <span>{course.duration || 'Self-paced'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Content - Course Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-64 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                        <FaBook className="text-8xl text-white opacity-50" />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-purple-600 mb-2">
                                            {course.price === 0 ? 'Free' : `$${course.price}`}
                                        </div>
                                        {course.price > 0 && course.discountedPrice && (
                                            <div className="text-gray-500 line-through text-lg">
                                                ${course.discountedPrice}
                                            </div>
                                        )}
                                    </div>

                                    {isEnrolled ? (
                                        <Link
                                            to="/student/enrolled"
                                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-center hover:bg-green-700 transition flex items-center justify-center gap-2"
                                        >
                                            <FaCheckCircle /> Already Enrolled - Go to Course
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleEnrollClick}
                                            disabled={enrolling}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {enrolling ? (
                                                <><FaSpinner className="animate-spin" /> Enrolling...</>
                                            ) : (
                                                <><FaShoppingCart /> Enroll Now</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Course Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Stats & Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FaChartLine className="text-purple-600" />
                                Course Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Total Lectures */}
                                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                                    <FaBook className="text-2xl text-purple-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Lectures</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {course.totalLectures || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Level */}
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                    <FaChartLine className="text-2xl text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Level</p>
                                        <p className="text-xl font-bold text-gray-900 capitalize">
                                            {course.level || 'Beginner'}
                                        </p>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                                    <FaGraduationCap className="text-2xl text-green-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Category</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {course.category || 'General'}
                                        </p>
                                    </div>
                                </div>

                                {/* Certification */}
                                {course.certificationAvailable && (
                                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                                        <FaCertificate className="text-2xl text-yellow-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Certification</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                Available
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Status */}
                                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
                                    <FaClock className="text-2xl text-indigo-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className="text-xl font-bold text-gray-900 capitalize">
                                            {course.status || 'Pending'}
                                        </p>
                                    </div>
                                </div>

                                {/* Start Date (if pending) */}
                                {course.status === 'pending' && course.startDate && (
                                    <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                                        <FaClock className="text-2xl text-pink-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Starts On</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {new Date(course.startDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Language */}
                                {course.language && (
                                    <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg">
                                        <FaBook className="text-2xl text-teal-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Language</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {course.language}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* What You'll Learn */}
                        {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl shadow-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FaTrophy className="text-yellow-500" />
                                    What You'll Learn
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.whatYouWillLearn.map((objective, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">{objective}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Course Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Description</h2>
                            <div className="prose max-w-none text-gray-700">
                                {course.description || course.shortDescription}
                            </div>
                        </motion.div>

                        {/* Course Content */}
                        {course.sections && course.sections.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl shadow-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Content</h2>
                                <div className="space-y-4">
                                    {course.sections.map((section, index) => (
                                        <div key={section._id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-bold text-lg text-gray-800">
                                                    Section {index + 1}: {section.title}
                                                </h3>
                                                <span className="text-sm text-gray-600">
                                                    {section.lessons?.length || 0} lessons
                                                </span>
                                            </div>
                                            {section.lessons && section.lessons.length > 0 && (
                                                <ul className="space-y-2 mt-3">
                                                    {section.lessons.map((lesson) => (
                                                        <li key={lesson._id} className="flex items-center gap-2 text-gray-600">
                                                            <FaPlay className="text-purple-600 text-xs" />
                                                            <span>{lesson.title}</span>
                                                            {lesson.duration && (
                                                                <span className="text-sm text-gray-500">({lesson.duration})</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Requirements */}
                        {course.requirements && course.requirements.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl shadow-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Requirements</h2>
                                <ul className="space-y-2">
                                    {course.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Course Features */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">This course includes:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-700">
                                    <FaPlay className="text-purple-600" />
                                    <span>{course.totalLessons || 0} video lessons</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <FaBook className="text-purple-600" />
                                    <span>{course.sections?.length || 0} sections</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <FaClock className="text-purple-600" />
                                    <span>Lifetime access</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <FaCertificate className="text-purple-600" />
                                    <span>Certificate of completion</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <FaChartLine className="text-purple-600" />
                                    <span>Progress tracking</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Instructor Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Instructor</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <FaGraduationCap className="text-3xl text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">
                                        {course.instructor?.firstName} {course.instructor?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">{course.instructor?.email}</p>
                                </div>
                            </div>
                            {course.instructor?.bio && (
                                <p className="text-gray-700 text-sm">{course.instructor.bio}</p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                course={course}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    );
}

export default CourseDetailPage;
