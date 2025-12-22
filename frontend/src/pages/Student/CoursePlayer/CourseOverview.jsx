import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaBook, FaClock, FaGraduationCap, FaCheckCircle, FaSpinner, FaStar, FaUsers, FaListAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCourseDetails } from '../../../services/api/studentService';
import CoursePlayerLayout from '../../../components/CoursePlayerLayout';

function CourseOverview() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await getCourseDetails(courseId);
            setCourse(response.data);
        } catch (error) {
            toast.error('Failed to load course details');
            console.error(error);
        } finally {
            setLoading(false);
        }
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
            <div className="course-overview">
                <h1 className="page-title">{course?.title}</h1>

                {/* Course Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <FaBook className="stat-icon" />
                        <div>
                            <p className="stat-label">Total Sections</p>
                            <p className="stat-value">{course?.sections?.length || 0}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaListAlt className="stat-icon" />
                        <div>
                            <p className="stat-label">Total Lessons</p>
                            <p className="stat-value">{course?.totalLessons || 0}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaClock className="stat-icon" />
                        <div>
                            <p className="stat-label">Duration</p>
                            <p className="stat-value">{course?.duration || 0} min</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaGraduationCap className="stat-icon" />
                        <div>
                            <p className="stat-label">Level</p>
                            <p className="stat-value">{course?.level}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaUsers className="stat-icon" />
                        <div>
                            <p className="stat-label">Students Enrolled</p>
                            <p className="stat-value">{course?.enrollmentCount || 0}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaStar className="stat-icon" />
                        <div>
                            <p className="stat-label">Rating</p>
                            <p className="stat-value">{course?.averageRating?.toFixed(1) || 0} ⭐</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="content-card">
                    <h2>About This Course</h2>
                    <p>{course?.description}</p>
                </div>

                {/* What You'll Learn */}
                {course?.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                    <div className="content-card">
                        <h2>What You'll Learn</h2>
                        <div className="learning-grid">
                            {course.whatYouWillLearn.map((item, index) => (
                                <div key={index} className="learning-item">
                                    <FaCheckCircle className="check-icon" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Requirements */}
                {course?.requirements && course.requirements.length > 0 && (
                    <div className="content-card">
                        <h2>Requirements</h2>
                        <ul className="requirements-list">
                            {course.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Course Content */}
                {course?.sections && course.sections.length > 0 && (
                    <div className="content-card">
                        <h2>Course Content</h2>
                        <div className="sections-list">
                            {course.sections.map((section, index) => (
                                <div key={section._id || index} className="section-item">
                                    <h3 className="section-title">
                                        Section {index + 1}: {section.title}
                                    </h3>
                                    <p className="section-description">{section.description}</p>
                                    <div className="section-meta">
                                        <span>{section.lessons?.length || 0} lessons</span>
                                        {section.quiz && <span>• 1 quiz</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Instructor */}
                <div className="content-card">
                    <h2>Instructor</h2>
                    <div className="instructor-info">
                        <div className="instructor-avatar">
                            {course?.instructor?.firstName?.[0]}{course?.instructor?.lastName?.[0]}
                        </div>
                        <div className="instructor-details">
                            <p className="instructor-name">
                                {course?.instructor?.firstName} {course?.instructor?.lastName}
                            </p>
                            <p className="instructor-email">{course?.instructor?.email}</p>
                            {course?.instructor?.bio && (
                                <p className="instructor-bio">{course.instructor.bio}</p>
                            )}
                            {course?.instructor?.expertise && course.instructor.expertise.length > 0 && (
                                <div className="instructor-expertise">
                                    <strong>Expertise:</strong> {course.instructor.expertise.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .course-overview {
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    .page-title {
                        font-size: 2.5rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 2rem;
                    }

                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 1.5rem;
                        margin-bottom: 2rem;
                    }

                    .stat-card {
                        background: white;
                        padding: 1.5rem;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        transition: transform 0.2s;
                    }

                    .stat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }

                    .stat-icon {
                        font-size: 2rem;
                        color: #667eea;
                    }

                    .stat-label {
                        font-size: 0.875rem;
                        color: #6b7280;
                        margin: 0;
                    }

                    .stat-value {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0;
                        text-transform: capitalize;
                    }

                    .content-card {
                        background: white;
                        padding: 2rem;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        margin-bottom: 2rem;
                    }

                    .content-card h2 {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 1rem 0;
                    }

                    .content-card p {
                        color: #6b7280;
                        line-height: 1.8;
                    }

                    .learning-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 1rem;
                    }

                    .learning-item {
                        display: flex;
                        align-items: flex-start;
                        gap: 0.75rem;
                    }

                    .check-icon {
                        color: #10b981;
                        margin-top: 0.25rem;
                        flex-shrink: 0;
                    }

                    .requirements-list {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }

                    .requirements-list li {
                        padding: 0.75rem 0;
                        border-bottom: 1px solid #e5e7eb;
                        color: #6b7280;
                    }

                    .requirements-list li:last-child {
                        border-bottom: none;
                    }

                    .sections-list {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .section-item {
                        padding: 1.5rem;
                        background: #f9fafb;
                        border-radius: 8px;
                        border-left: 4px solid #667eea;
                    }

                    .section-title {
                        font-size: 1.125rem;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0 0 0.5rem 0;
                    }

                    .section-description {
                        color: #6b7280;
                        margin: 0 0 0.75rem 0;
                        line-height: 1.6;
                    }

                    .section-meta {
                        font-size: 0.875rem;
                        color: #9ca3af;
                    }

                    .instructor-info {
                        display: flex;
                        align-items: flex-start;
                        gap: 1.5rem;
                    }

                    .instructor-avatar {
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1.75rem;
                        font-weight: 700;
                        flex-shrink: 0;
                    }

                    .instructor-details {
                        flex: 1;
                    }

                    .instructor-name {
                        font-size: 1.25rem;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0 0 0.25rem 0;
                    }

                    .instructor-email {
                        font-size: 0.875rem;
                        color: #6b7280;
                        margin: 0 0 0.75rem 0;
                    }

                    .instructor-bio {
                        color: #6b7280;
                        line-height: 1.6;
                        margin: 0.75rem 0;
                    }

                    .instructor-expertise {
                        margin-top: 0.75rem;
                        padding: 0.75rem;
                        background: #f3f4f6;
                        border-radius: 6px;
                        font-size: 0.875rem;
                        color: #4b5563;
                    }

                    .instructor-expertise strong {
                        color: #1f2937;
                    }
                `}</style>
            </div>
        </CoursePlayerLayout>
    );
}

export default CourseOverview;
