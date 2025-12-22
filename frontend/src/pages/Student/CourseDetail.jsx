import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBook,
    FaUsers,
    FaStar,
    FaClock,
    FaGraduationCap,
    FaCheckCircle,
    FaSpinner,
    FaArrowLeft,
    FaPlay
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCourseDetails, enrollInCourse } from '../../services/api/studentService';

function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await getCourseDetails(id);
            setCourse(response.data);
            // Check if already enrolled (you'd get this from backend)
            setIsEnrolled(false); // Update based on actual enrollment status
        } catch (error) {
            toast.error('Failed to load course details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        try {
            setEnrolling(true);
            await enrollInCourse(id);
            toast.success('Successfully enrolled in course!');
            setIsEnrolled(true);
            // Redirect to course player or enrolled courses
            setTimeout(() => {
                navigate('/student/enrolled');
            }, 1500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to enroll in course';
            toast.error(errorMessage);
        } finally {
            setEnrolling(false);
        }
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
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
                    <button
                        onClick={() => navigate('/student/courses')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                        Browse Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/student/courses')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition mb-4"
                    >
                        <FaArrowLeft />
                        Back to Courses
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
                        >
                            {/* Course Banner */}
                            <div className="h-96 bg-gradient-to-br from-purple-500 to-blue-500 relative">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <FaBook className="text-9xl text-white opacity-50" />
                                    </div>
                                )}
                            </div>

                            {/* Course Info */}
                            <div className="p-8">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        {course.category}
                                    </span>
                                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        {course.level}
                                    </span>
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        {course.language}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                    {course.title}
                                </h1>

                                {/* Short Description */}
                                <p className="text-xl text-gray-600 mb-6">
                                    {course.shortDescription}
                                </p>

                                {/* Stats */}
                                <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FaUsers />
                                        <span>{course.enrollmentCount || 0} students enrolled</span>
                                    </div>
                                    {course.averageRating > 0 && (
                                        <div className="flex items-center gap-2">
                                            <FaStar className="text-yellow-500" />
                                            <span>{course.averageRating.toFixed(1)} ({course.reviewCount || 0} reviews)</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <FaClock />
                                        <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Instructor */}
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                        {course.instructor?.firstName?.charAt(0)}
                                        {course.instructor?.lastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Instructor</p>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {course.instructor?.firstName} {course.instructor?.lastName}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {course.description}
                                    </p>
                                </div>

                                {/* Learning Outcomes */}
                                {course.learningOutcomes?.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">What You'll Learn</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {course.learningOutcomes.map((outcome, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                                    <span className="text-gray-600">{outcome}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Requirements */}
                                {course.requirements?.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
                                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                                            {course.requirements.map((req, index) => (
                                                <li key={index}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Course Content */}
                                {course.content?.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Content</h2>
                                        <div className="space-y-4">
                                            {course.content.map((section, index) => (
                                                <div key={section._id} className="border border-gray-200 rounded-lg p-4">
                                                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                                        Section {index + 1}: {section.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                                                    <div className="space-y-2">
                                                        {section.lessons?.map((lesson, lessonIndex) => (
                                                            <div key={lesson._id} className="flex items-center gap-2 text-gray-600">
                                                                <FaPlay className="text-purple-600 text-xs" />
                                                                <span className="text-sm">
                                                                    Lesson {lessonIndex + 1}: {lesson.title}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6 sticky top-8"
                        >
                            {/* Price */}
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-purple-600 mb-2">
                                    {course.price === 0 ? 'Free' : `$${course.price}`}
                                </div>
                                {course.price > 0 && (
                                    <p className="text-sm text-gray-600">One-time payment</p>
                                )}
                            </div>

                            {/* Enroll Button */}
                            {isEnrolled ? (
                                <button
                                    onClick={() => navigate(`/student/course/${course._id}`)}
                                    className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 mb-4"
                                >
                                    <FaPlay />
                                    Go to Course
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                                >
                                    {enrolling ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Enrolling...
                                        </>
                                    ) : (
                                        <>
                                            <FaGraduationCap />
                                            Enroll Now
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Course Includes */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-semibold text-gray-800 mb-4">This course includes:</h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FaBook />
                                        <span>{course.content?.length || 0} sections</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaPlay />
                                        <span>
                                            {course.content?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0} lessons
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaClock />
                                        <span>Lifetime access</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle />
                                        <span>Certificate of completion</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetail;
