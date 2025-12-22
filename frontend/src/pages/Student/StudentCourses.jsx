import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBook,
    FaSearch,
    FaFilter,
    FaStar,
    FaUsers,
    FaClock,
    FaSpinner,
    FaGraduationCap,
    FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllCourses } from '../../services/api/studentService';
import api from '../../config/api';

function StudentCourses() {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    const categories = [
        'All Categories',
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Design',
        'Business',
        'Marketing',
        'Photography',
        'Music',
        'Other'
    ];

    const levels = ['All Levels', 'beginner', 'intermediate', 'advanced'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch all courses
            const coursesResponse = await getAllCourses();

            // Fetch user's enrollments
            const enrollmentsResponse = await api.get('/student/enrollments');
            const enrolledCourseIds = enrollmentsResponse.data.data.map(e => e.course._id || e.course);

            setEnrollments(enrolledCourseIds);

            // Filter out enrolled courses
            const availableCourses = coursesResponse.data.filter(
                course => !enrolledCourseIds.includes(course._id)
            );

            setCourses(availableCourses);
        } catch (error) {
            toast.error('Failed to load courses');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' ||
            course.category === selectedCategory;
        const matchesLevel = !selectedLevel || selectedLevel === 'All Levels' ||
            course.level === selectedLevel;

        return matchesSearch && matchesCategory && matchesLevel;
    });

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading courses...</p>
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
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Browse Available Courses
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Discover new courses to enhance your skills • Already enrolled courses are hidden
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <FaFilter className="text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Level Filter */}
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            >
                                {levels.map(level => (
                                    <option key={level} value={level}>
                                        {level === 'All Levels' ? level : level.charAt(0).toUpperCase() + level.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 text-sm text-gray-600">
                            Showing {filteredCourses.length} of {courses.length} courses
                        </div>
                    </motion.div>

                    {/* Courses Grid */}
                    {filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course, index) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link to={`/student/courses/${course._id}`}>
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105">
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
                                                {course.price === 0 && (
                                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                        FREE
                                                    </div>
                                                )}
                                            </div>

                                            {/* Course Info */}
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                                                        {course.category}
                                                    </span>
                                                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-semibold">
                                                        {course.level}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                                                    {course.title}
                                                </h3>

                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {course.shortDescription}
                                                </p>

                                                {/* Instructor */}
                                                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                                    <FaGraduationCap />
                                                    <span>
                                                        {course.instructor?.firstName} {course.instructor?.lastName}
                                                    </span>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <FaUsers />
                                                        <span>{course.enrollmentCount || 0} students</span>
                                                    </div>
                                                    {course.averageRating > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <FaStar className="text-yellow-500" />
                                                            <span>{course.averageRating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Price & Enroll */}
                                                <div className="flex items-center justify-between">
                                                    <div className="text-2xl font-bold text-purple-600">
                                                        {course.price === 0 ? 'Free' : `$${course.price}`}
                                                    </div>
                                                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
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
                                No Courses Found
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Try adjusting your filters or search term
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    setSelectedLevel('');
                                }}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default StudentCourses;
