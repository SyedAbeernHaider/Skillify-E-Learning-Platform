import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaBook, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createCourse } from '../../services/api/instructorService';
import InstructorSidebar from '../../components/InstructorSidebar';

function CreateCourse() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        category: '',
        level: 'beginner',
        price: 0,
        thumbnail: '',
        language: 'English',
        requirements: '',
        learningOutcomes: '',
        // New fields from Final.txt
        totalLectures: 0,
        certificationAvailable: false,
        status: 'pending',
        startDate: '',
    });
    const [errors, setErrors] = useState({});

    const categories = [
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

    const levels = ['beginner', 'intermediate', 'advanced'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Course title is required';
        }

        if (!formData.shortDescription.trim()) {
            newErrors.shortDescription = 'Short description is required';
        } else if (formData.shortDescription.length > 200) {
            newErrors.shortDescription = 'Short description must be less than 200 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Course description is required';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (formData.price < 0) {
            newErrors.price = 'Price cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            // Convert comma-separated strings to arrays
            const courseData = {
                ...formData,
                requirements: formData.requirements
                    ? formData.requirements.split(',').map(r => r.trim()).filter(r => r)
                    : [],
                learningOutcomes: formData.learningOutcomes
                    ? formData.learningOutcomes.split(',').map(l => l.trim()).filter(l => l)
                    : [],
            };

            await createCourse(courseData);
            toast.success('Course created successfully! Awaiting admin approval.');
            navigate('/instructor/courses');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create course';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <InstructorSidebar />
            <div className="flex-1 ml-64">
                {/* Header */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/instructor/courses')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <FaArrowLeft className="text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                                        <FaBook />
                                        Create New Course
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Fill in the details to create your course
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-8"
                    >
                        <form onSubmit={handleSubmit}>
                            {/* Instructor Name (Read-only) */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Instructor Name
                                </label>
                                <input
                                    type="text"
                                    value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Your name as the course instructor
                                </p>
                            </div>

                            {/* Course Title */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Complete Web Development Bootcamp"
                                    className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                )}
                            </div>

                            {/* Short Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Short Description * (Max 200 characters)
                                </label>
                                <textarea
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleChange}
                                    placeholder="Brief description of your course"
                                    rows="2"
                                    maxLength="200"
                                    className={`w-full border ${errors.shortDescription ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {errors.shortDescription ? (
                                        <p className="text-red-500 text-sm">{errors.shortDescription}</p>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            {formData.shortDescription.length}/200 characters
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Full Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Course Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Detailed description of what students will learn"
                                    rows="6"
                                    className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Category and Level */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Level *
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                    >
                                        {levels.map(level => (
                                            <option key={level} value={level}>
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Price and Language */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price (USD) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                    )}
                                    <p className="text-sm text-gray-500 mt-1">Set to 0 for free course</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <input
                                        type="text"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        placeholder="English"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                    />
                                </div>
                            </div>

                            {/* Thumbnail URL */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Thumbnail URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    You can add a thumbnail later
                                </p>
                            </div>

                            {/* Requirements */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Requirements (Optional)
                                </label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    placeholder="Enter requirements separated by commas (e.g., Basic HTML, CSS knowledge, Computer with internet)"
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Separate each requirement with a comma
                                </p>
                            </div>

                            {/* Learning Outcomes */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Learning Outcomes (Optional)
                                </label>
                                <textarea
                                    name="learningOutcomes"
                                    value={formData.learningOutcomes}
                                    onChange={handleChange}
                                    placeholder="Enter learning outcomes separated by commas (e.g., Build websites, Create web apps, Master JavaScript)"
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Separate each outcome with a comma
                                </p>
                            </div>

                            {/* Total Lectures */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Total Number of Lectures
                                </label>
                                <input
                                    type="number"
                                    name="totalLectures"
                                    value={formData.totalLectures}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g., 25"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                />
                            </div>

                            {/* Certification Available */}
                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="certificationAvailable"
                                        checked={formData.certificationAvailable}
                                        onChange={(e) => setFormData({ ...formData, certificationAvailable: e.target.checked })}
                                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">
                                        Certification Available
                                    </span>
                                </label>
                                <p className="text-sm text-gray-500 mt-1 ml-8">
                                    Students will receive a certificate upon course completion
                                </p>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Course Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="started">Started</option>
                                </select>
                            </div>

                            {/* Start Date (conditional) */}
                            {formData.status === 'pending' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        When will this course start?
                                    </p>
                                </div>
                            )}

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Your course will be submitted for admin approval.
                                    Once approved, you can add sections, lessons, quizzes, and assignments.
                                </p>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/instructor/dashboard')}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Creating Course...
                                        </>
                                    ) : (
                                        <>
                                            <FaBook />
                                            Create Course
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default CreateCourse;
