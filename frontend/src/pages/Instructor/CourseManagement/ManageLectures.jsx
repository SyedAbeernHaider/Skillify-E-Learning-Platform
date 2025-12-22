import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaVideo, FaEdit, FaTrash, FaSave, FaTimes, FaLock, FaUnlock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CourseManagementSidebar from '../../../components/CourseManagementSidebar';
import {
    getCourseDetails,
    createSection,
    updateSection,
    deleteSection,
    createLesson,
    updateLesson,
    deleteLesson,
    updateCourse // Import this
} from '../../../services/api/instructorService';

function ManageLectures() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState(null);
    const [editingLecture, setEditingLecture] = useState(null);
    const [editingLectureData, setEditingLectureData] = useState(null); // Local state for editing
    const [editingSectionData, setEditingSectionData] = useState(null); // Local state for section editing
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const response = await getCourseDetails(courseId);
            setCourse(response.data.course);
            setSections(response.data.course.sections || []);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load course');
            setLoading(false);
        }
    };

    const handleToggleFinish = async () => {
        try {
            const updatedData = {
                isContentLocked: !course.isContentLocked
            };
            const response = await updateCourse(courseId, updatedData);
            if (response.success) {
                setCourse({ ...course, isContentLocked: updatedData.isContentLocked });
                toast.success(updatedData.isContentLocked ? 'Lectures Finished & Locked' : 'Lectures Unlocked, Continue Editing');
            }
        } catch (error) {
            toast.error('Failed to update course status');
        }
    };

    const handleAddSection = async () => {
        if (course.isContentLocked) return;
        try {
            const newSectionData = {
                title: 'New Section',
                description: '',
                order: sections.length + 1
            };

            const response = await createSection(courseId, newSectionData);
            setSections([...sections, response.data]);
            toast.success('Section added');
        } catch (error) {
            toast.error('Failed to add section');
        }
    };

    const startEditingSection = (section) => {
        setEditingSection(section._id);
        setEditingSectionData({ ...section });
    };

    const saveSection = async () => {
        try {
            await updateSection(courseId, editingSectionData._id, editingSectionData);
            setSections(sections.map(s => s._id === editingSectionData._id ? editingSectionData : s));
            setEditingSection(null);
            setEditingSectionData(null);
            toast.success('Section updated');
        } catch (error) {
            toast.error('Failed to update section');
        }
    };

    const cancelEditingSection = () => {
        setEditingSection(null);
        setEditingSectionData(null);
    };

    const handleDeleteSection = async (sectionId) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            try {
                await deleteSection(courseId, sectionId);
                setSections(sections.filter(s => s._id !== sectionId));
                toast.success('Section deleted');
            } catch (error) {
                toast.error('Failed to delete section');
            }
        }
    };

    const handleAddLecture = async (sectionId) => {
        if (course.isContentLocked) return;
        try {
            const newLectureData = {
                title: 'New Lecture',
                description: '',
                videoUrl: '',
                duration: 0
            };

            const response = await createLesson(courseId, sectionId, newLectureData);

            setSections(sections.map(section => {
                if (section._id === sectionId) {
                    return {
                        ...section,
                        lessons: [...(section.lessons || []), response.data]
                    };
                }
                return section;
            }));

            toast.success('Lecture added');
        } catch (error) {
            toast.error('Failed to add lecture');
        }
    };

    const startEditingLecture = (sectionId, lecture) => {
        setEditingLecture(lecture._id);
        setEditingLectureData({ sectionId, ...lecture });
    };

    const saveLecture = async () => {
        try {
            const { sectionId, ...lectureData } = editingLectureData;
            await updateLesson(courseId, sectionId, lectureData._id, lectureData);

            setSections(sections.map(s => {
                if (s._id === sectionId) {
                    return {
                        ...s,
                        lessons: s.lessons.map(l => l._id === lectureData._id ? lectureData : l)
                    };
                }
                return s;
            }));

            setEditingLecture(null);
            setEditingLectureData(null);
            toast.success('Lecture updated');
        } catch (error) {
            toast.error('Failed to update lecture');
        }
    };

    const cancelEditingLecture = () => {
        setEditingLecture(null);
        setEditingLectureData(null);
    };

    const handleDeleteLecture = async (sectionId, lectureId) => {
        if (window.confirm('Are you sure you want to delete this lecture?')) {
            try {
                await deleteLesson(courseId, sectionId, lectureId);

                setSections(sections.map(s => {
                    if (s._id === sectionId) {
                        return {
                            ...s,
                            lessons: s.lessons.filter(l => l._id !== lectureId)
                        };
                    }
                    return s;
                }));

                toast.success('Lecture deleted');
            } catch (error) {
                toast.error('Failed to delete lecture');
            }
        }
    };

    // RENDER PART

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <CourseManagementSidebar />
                <div className="flex-1 ml-64 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading course...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <CourseManagementSidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
                                <p className="text-gray-600 mt-2">Manage lectures and course content</p>
                            </div>
                            <button
                                onClick={handleToggleFinish}
                                className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${course?.isContentLocked
                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                            >
                                {course?.isContentLocked ? (
                                    <>
                                        <FaUnlock /> Continue Editing
                                    </>
                                ) : (
                                    <>
                                        <FaLock /> Finish Lectures
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {sections.map((section, sIndex) => (
                            <motion.div
                                key={section._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                {/* Section Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            {editingSection === section._id ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={editingSectionData?.title || ''}
                                                        onChange={(e) => setEditingSectionData({ ...editingSectionData, title: e.target.value })}
                                                        placeholder="Section Title"
                                                        className="w-full px-4 py-2 rounded-lg text-gray-900"
                                                    />
                                                    <textarea
                                                        value={editingSectionData?.description || ''}
                                                        onChange={(e) => setEditingSectionData({ ...editingSectionData, description: e.target.value })}
                                                        placeholder="Section Description"
                                                        rows={2}
                                                        className="w-full px-4 py-2 rounded-lg text-gray-900"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={saveSection}
                                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                                                        >
                                                            <FaSave className="inline mr-2" />
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEditingSection}
                                                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                                                        >
                                                            <FaTimes className="inline mr-2" />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">
                                                        Section {sIndex + 1}: {section.title || 'Untitled Section'}
                                                    </h3>
                                                    <p className="text-indigo-100 text-sm mt-1">{section.description}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            {editingSection !== section._id && (
                                                <>
                                                    <button
                                                        onClick={() => startEditingSection(section)}
                                                        className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition text-white"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSection(section._id)}
                                                        className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition text-white"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Lectures */}
                                <div className="p-4">
                                    <div className="space-y-4">
                                        {section.lessons?.map((lecture, lIndex) => (
                                            <div
                                                key={lecture._id}
                                                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition"
                                            >
                                                {editingLecture === lecture._id ? (
                                                    <div className="space-y-3">
                                                        <input
                                                            type="text"
                                                            value={editingLectureData?.title || ''}
                                                            onChange={(e) => setEditingLectureData({ ...editingLectureData, title: e.target.value })}
                                                            placeholder="Lecture Title"
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />
                                                        <textarea
                                                            value={editingLectureData?.description || ''}
                                                            onChange={(e) => setEditingLectureData({ ...editingLectureData, description: e.target.value })}
                                                            placeholder="Lecture Description"
                                                            rows={2}
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />
                                                        <input
                                                            type="url"
                                                            value={editingLectureData?.videoUrl || ''}
                                                            onChange={(e) => setEditingLectureData({ ...editingLectureData, videoUrl: e.target.value })}
                                                            placeholder="Video URL (YouTube, Vimeo, etc.)"
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={editingLectureData?.duration || 0}
                                                            onChange={(e) => setEditingLectureData({ ...editingLectureData, duration: parseInt(e.target.value) })}
                                                            placeholder="Duration (minutes)"
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={saveLecture}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                                            >
                                                                <FaSave />
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={cancelEditingLecture}
                                                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                                                            >
                                                                <FaTimes />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FaVideo className="text-purple-600 text-xl" />
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">
                                                                    Lecture {lIndex + 1}: {lecture.title || 'Untitled Lecture'}
                                                                </h4>
                                                                <p className="text-sm text-gray-600">{lecture.description}</p>
                                                                {lecture.videoUrl && (
                                                                    <a
                                                                        href={lecture.videoUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-sm text-blue-600 hover:underline"
                                                                    >
                                                                        View Video
                                                                    </a>
                                                                )}
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    Duration: {lecture.duration} minutes
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => startEditingLecture(section._id, lecture)}
                                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLecture(section._id, lecture._id)}
                                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Lecture Button */}
                                    {!course?.isContentLocked && (
                                        <button
                                            onClick={() => handleAddLecture(section._id)}
                                            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition flex items-center justify-center gap-2"
                                        >
                                            <FaPlus />
                                            Add Lecture
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Add Section Button */}
                    {!course?.isContentLocked && (
                        <button
                            onClick={handleAddSection}
                            className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold flex items-center justify-center gap-2"
                        >
                            <FaPlus />
                            Add New Section
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageLectures;
