import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaSpinner, FaSearch, FaBook, FaChartLine, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getInstructorStudents } from '../../services/api/instructorService';
import InstructorSidebar from '../../components/InstructorSidebar';

function InstructorStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('all');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await getInstructorStudents();
            setStudents(response.data || []);
        } catch (error) {
            toast.error('Failed to load students');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique courses
    const courses = [...new Set(students.map(s => s.course?.title).filter(Boolean))];

    // Filter students
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCourse = filterCourse === 'all' || student.course?.title === filterCourse;

        return matchesSearch && matchesCourse;
    });

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <InstructorSidebar />
                <div className="flex-1 ml-64 flex items-center justify-center">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading students...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <InstructorSidebar />
            <div className="flex-1 ml-64 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            My Students 👨‍🎓
                        </h1>
                        <p className="text-gray-600">
                            {students.length} student{students.length !== 1 ? 's' : ''} enrolled in your courses
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaUserGraduate className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{students.length}</p>
                            <p className="text-sm opacity-90">Total Students</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaChartLine className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">
                                {students.filter(s => s.progress?.completionPercentage >= 50).length}
                            </p>
                            <p className="text-sm opacity-90">Active Learners</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaBook className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{courses.length}</p>
                            <p className="text-sm opacity-90">Courses</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaTrophy className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">
                                {students.filter(s => s.progress?.completionPercentage === 100).length}
                            </p>
                            <p className="text-sm opacity-90">Completed</p>
                        </motion.div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* Course Filter */}
                            <select
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="all">All Courses</option>
                                {courses.map((course, index) => (
                                    <option key={index} value={course}>{course}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Students List */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {filteredStudents.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Course
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Progress
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Enrolled Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredStudents.map((enrollment, index) => {
                                            const progress = enrollment.progress?.completionPercentage || 0;
                                            const isCompleted = progress === 100;

                                            return (
                                                <motion.tr
                                                    key={enrollment._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.02 }}
                                                    className="hover:bg-purple-50 transition"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                                                {enrollment.student?.firstName?.[0]?.toUpperCase() || 'S'}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800">
                                                                    {enrollment.student?.firstName} {enrollment.student?.lastName}
                                                                </p>
                                                                <p className="text-sm text-gray-500">{enrollment.student?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-gray-800 font-medium">{enrollment.course?.title}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="w-32">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xs text-gray-600">{progress}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${isCompleted
                                                                        ? 'bg-green-500'
                                                                        : 'bg-gradient-to-r from-purple-600 to-blue-600'
                                                                        }`}
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-gray-600 text-sm">
                                                            {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted
                                                            ? 'bg-green-100 text-green-800'
                                                            : progress > 0
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {isCompleted ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <FaUserGraduate className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {searchTerm || filterCourse !== 'all' ? 'No Students Found' : 'No Students Yet'}
                                </h3>
                                <p className="text-gray-600">
                                    {searchTerm || filterCourse !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'Students will appear here when they enroll in your courses'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructorStudents;
