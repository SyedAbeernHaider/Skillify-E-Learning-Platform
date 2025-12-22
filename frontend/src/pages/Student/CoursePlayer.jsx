import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaPlay,
    FaCheck,
    FaLock,
    FaBook,
    FaQuestionCircle,
    FaFileAlt,
    FaComments,
    FaClock,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCourseDetails } from '../../services/api/studentService';
import StudentSidebar from '../../components/StudentSidebar';

function CoursePlayer() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [currentSection, setCurrentSection] = useState(0);
    const [currentLecture, setCurrentLecture] = useState(0);
    const [completedLectures, setCompletedLectures] = useState(new Set());
    const [expandedSections, setExpandedSections] = useState(new Set([0]));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const response = await getCourseDetails(courseId);
            setCourse(response.data.course);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load course');
            setLoading(false);
        }
    };

    const toggleSection = (index) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedSections(newExpanded);
    };

    const handleLectureClick = (sectionIndex, lectureIndex) => {
        setCurrentSection(sectionIndex);
        setCurrentLecture(lectureIndex);
    };

    const handleMarkComplete = () => {
        const key = `${currentSection}-${currentLecture}`;
        const newCompleted = new Set(completedLectures);
        newCompleted.add(key);
        setCompletedLectures(newCompleted);
        toast.success('Lecture marked as complete!');
    };

    const getCurrentLectureData = () => {
        if (!course?.sections?.[currentSection]?.lessons?.[currentLecture]) {
            return null;
        }
        return course.sections[currentSection].lessons[currentLecture];
    };

    const currentLectureData = getCurrentLectureData();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading course...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <StudentSidebar />

            {/* Course Navigation Sidebar */}
            <div className="fixed left-64 top-0 h-screen w-80 bg-white shadow-lg overflow-y-auto z-30">
                <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <h2 className="text-xl font-bold">{course?.title}</h2>
                    <p className="text-sm text-purple-100 mt-2">
                        {course?.sections?.length || 0} Sections • {
                            course?.sections?.reduce((total, section) =>
                                total + (section.lessons?.length || 0), 0
                            ) || 0
                        } Lectures
                    </p>
                </div>

                {/* Sections and Lectures */}
                <div className="p-4">
                    {course?.sections?.map((section, sIndex) => (
                        <div key={sIndex} className="mb-4">
                            <button
                                onClick={() => toggleSection(sIndex)}
                                className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                            >
                                <div className="flex items-center gap-3">
                                    <FaBook className="text-purple-600" />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800">
                                            {section.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {section.lessons?.length || 0} lectures
                                        </p>
                                    </div>
                                </div>
                                {expandedSections.has(sIndex) ? (
                                    <FaChevronUp className="text-gray-600" />
                                ) : (
                                    <FaChevronDown className="text-gray-600" />
                                )}
                            </button>

                            {expandedSections.has(sIndex) && (
                                <div className="mt-2 space-y-2">
                                    {section.lessons?.map((lecture, lIndex) => {
                                        const isActive = currentSection === sIndex && currentLecture === lIndex;
                                        const isCompleted = completedLectures.has(`${sIndex}-${lIndex}`);

                                        return (
                                            <button
                                                key={lIndex}
                                                onClick={() => handleLectureClick(sIndex, lIndex)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${isActive
                                                        ? 'bg-purple-100 border-l-4 border-purple-600'
                                                        : 'bg-white hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className={`flex-shrink-0 ${isCompleted ? 'text-green-600' :
                                                        isActive ? 'text-purple-600' : 'text-gray-400'
                                                    }`}>
                                                    {isCompleted ? <FaCheck /> : <FaPlay />}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className={`text-sm font-medium ${isActive ? 'text-purple-900' : 'text-gray-700'
                                                        }`}>
                                                        {lecture.title}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        {lecture.duration && (
                                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                <FaClock /> {lecture.duration} min
                                                            </span>
                                                        )}
                                                        {lecture.quiz && (
                                                            <FaQuestionCircle className="text-xs text-blue-500" title="Has Quiz" />
                                                        )}
                                                        {lecture.assignment && (
                                                            <FaFileAlt className="text-xs text-orange-500" title="Has Assignment" />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Community Chat Button */}
                <div className="p-4 border-t">
                    <Link
                        to="/community"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                    >
                        <FaComments />
                        <span>Community Chat</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-[656px] flex-1 p-8">
                {currentLectureData ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-5xl mx-auto"
                    >
                        {/* Video Player */}
                        {currentLectureData.videoUrl && (
                            <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
                                <video
                                    key={currentLectureData.videoUrl}
                                    controls
                                    className="w-full aspect-video"
                                    src={currentLectureData.videoUrl}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}

                        {/* Lecture Info */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {currentLectureData.title}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {currentLectureData.description}
                            </p>

                            {/* Mark Complete Button */}
                            <button
                                onClick={handleMarkComplete}
                                disabled={completedLectures.has(`${currentSection}-${currentLecture}`)}
                                className={`px-6 py-3 rounded-lg font-semibold transition ${completedLectures.has(`${currentSection}-${currentLecture}`)
                                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                            >
                                {completedLectures.has(`${currentSection}-${currentLecture}`) ? (
                                    <>
                                        <FaCheck className="inline mr-2" />
                                        Completed
                                    </>
                                ) : (
                                    'Mark as Complete'
                                )}
                            </button>
                        </div>

                        {/* Quiz Section */}
                        {currentLectureData.quiz && (
                            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-900 mb-2">
                                            📝 Quiz Available
                                        </h3>
                                        <p className="text-blue-700">
                                            {currentLectureData.quiz.title || 'Test your knowledge'}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/student/quiz/${courseId}/${currentSection}/${currentLecture}`}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                                    >
                                        Take Quiz
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Assignment Section */}
                        {currentLectureData.assignment && (
                            <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-orange-900 mb-2">
                                            📄 Assignment Available
                                        </h3>
                                        <p className="text-orange-700">
                                            {currentLectureData.assignment.title || 'Complete the assignment'}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/student/assignment/${courseId}/${currentSection}/${currentLecture}`}
                                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
                                    >
                                        Submit Assignment
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-600">
                            Select a lecture to start learning
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoursePlayer;
