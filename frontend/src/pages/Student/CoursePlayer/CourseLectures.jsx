import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlay, FaChevronDown, FaChevronUp, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCourseDetails } from '../../../services/api/studentService';
import CoursePlayerLayout from '../../../components/CoursePlayerLayout';

function CourseLectures() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await getCourseDetails(courseId);
            setCourse(response.data);

            // Auto-select first lecture
            if (response.data.sections?.[0]?.lessons?.[0]) {
                setSelectedLecture({
                    sectionIndex: 0,
                    lessonIndex: 0,
                    lesson: response.data.sections[0].lessons[0]
                });
                setExpandedSections({ 0: true });
            }
        } catch (error) {
            toast.error('Failed to load lectures');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const selectLecture = (sectionIndex, lessonIndex, lesson) => {
        setSelectedLecture({ sectionIndex, lessonIndex, lesson });
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    if (loading) {
        return (
            <CoursePlayerLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <FaSpinner className="animate-spin text-6xl text-purple-600" />
                </div>
            </CoursePlayerLayout>
        );
    }

    return (
        <CoursePlayerLayout>
            <div className="course-lectures">
                <h1 className="page-title">📹 Course Lectures</h1>

                <div className="lectures-container">
                    {/* Video Player */}
                    <div className="video-section">
                        {selectedLecture ? (
                            <>
                                <div className="video-player">
                                    {selectedLecture.lesson.videoUrl ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(selectedLecture.lesson.videoUrl)}
                                            title={selectedLecture.lesson.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="no-video">
                                            <FaPlay className="no-video-icon" />
                                            <p>No video available for this lecture</p>
                                        </div>
                                    )}
                                </div>
                                <div className="video-info">
                                    <h2>{selectedLecture.lesson.title}</h2>
                                    {selectedLecture.lesson.description && (
                                        <p className="lecture-description">{selectedLecture.lesson.description}</p>
                                    )}
                                    {selectedLecture.lesson.duration && (
                                        <p className="lecture-duration">Duration: {selectedLecture.lesson.duration} minutes</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <FaPlay className="no-selection-icon" />
                                <p>Select a lecture to start learning</p>
                            </div>
                        )}
                    </div>

                    {/* Lectures Sidebar */}
                    <div className="lectures-sidebar">
                        <h3 className="sidebar-title">Course Content</h3>
                        <div className="sections-list">
                            {course?.sections?.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="section-item">
                                    <div
                                        className="section-header"
                                        onClick={() => toggleSection(sectionIndex)}
                                    >
                                        <span className="section-title">
                                            Section {sectionIndex + 1}: {section.title}
                                        </span>
                                        <div className="section-meta">
                                            <span className="lesson-count">{section.lessons?.length || 0} lectures</span>
                                            {expandedSections[sectionIndex] ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>

                                    {expandedSections[sectionIndex] && (
                                        <div className="lessons-list">
                                            {section.lessons?.map((lesson, lessonIndex) => (
                                                <div
                                                    key={lessonIndex}
                                                    className={`lesson-item ${selectedLecture?.sectionIndex === sectionIndex &&
                                                            selectedLecture?.lessonIndex === lessonIndex
                                                            ? 'active'
                                                            : ''
                                                        }`}
                                                    onClick={() => selectLecture(sectionIndex, lessonIndex, lesson)}
                                                >
                                                    <FaPlay className="play-icon" />
                                                    <div className="lesson-info">
                                                        <p className="lesson-title">{lesson.title}</p>
                                                        {lesson.duration && (
                                                            <p className="lesson-duration">{lesson.duration} min</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .course-lectures {
                        max-width: 1600px;
                        margin: 0 auto;
                    }

                    .page-title {
                        font-size: 2rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 2rem;
                    }

                    .lectures-container {
                        display: grid;
                        grid-template-columns: 1fr 400px;
                        gap: 2rem;
                    }

                    .video-section {
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .video-player {
                        position: relative;
                        padding-bottom: 56.25%; /* 16:9 aspect ratio */
                        height: 0;
                        overflow: hidden;
                        background: #000;
                    }

                    .video-player iframe {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }

                    .no-video, .no-selection {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        text-align: center;
                        color: #9ca3af;
                    }

                    .no-video-icon, .no-selection-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }

                    .video-info {
                        padding: 2rem;
                    }

                    .video-info h2 {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 1rem 0;
                    }

                    .lecture-description {
                        color: #6b7280;
                        line-height: 1.6;
                        margin: 0 0 1rem 0;
                    }

                    .lecture-duration {
                        color: #667eea;
                        font-weight: 600;
                        margin: 0;
                    }

                    .lectures-sidebar {
                        background: white;
                        border-radius: 12px;
                        padding: 1.5rem;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        max-height: 800px;
                        overflow-y: auto;
                    }

                    .sidebar-title {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 1.5rem 0;
                    }

                    .section-item {
                        margin-bottom: 1rem;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        overflow: hidden;
                    }

                    .section-header {
                        padding: 1rem;
                        background: #f9fafb;
                        cursor: pointer;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        transition: background 0.2s;
                    }

                    .section-header:hover {
                        background: #f3f4f6;
                    }

                    .section-title {
                        font-weight: 600;
                        color: #1f2937;
                    }

                    .section-meta {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        color: #6b7280;
                        font-size: 0.875rem;
                    }

                    .lessons-list {
                        background: white;
                    }

                    .lesson-item {
                        padding: 1rem;
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        cursor: pointer;
                        border-top: 1px solid #f3f4f6;
                        transition: all 0.2s;
                    }

                    .lesson-item:hover {
                        background: #f9fafb;
                    }

                    .lesson-item.active {
                        background: #ede9fe;
                        border-left: 4px solid #667eea;
                    }

                    .play-icon {
                        color: #667eea;
                        font-size: 1rem;
                    }

                    .lesson-info {
                        flex: 1;
                    }

                    .lesson-title {
                        font-weight: 500;
                        color: #1f2937;
                        margin: 0 0 0.25rem 0;
                        font-size: 0.875rem;
                    }

                    .lesson-duration {
                        color: #6b7280;
                        font-size: 0.75rem;
                        margin: 0;
                    }

                    @media (max-width: 1024px) {
                        .lectures-container {
                            grid-template-columns: 1fr;
                        }
                    }
                `}</style>
            </div>
        </CoursePlayerLayout>
    );
}

export default CourseLectures;
