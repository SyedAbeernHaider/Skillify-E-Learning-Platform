import { useEffect, useState } from 'react';
import { FaBook, FaChalkboardTeacher, FaTrash, FaEye, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../config/api';

function AdminCourses() {
    const [view, setView] = useState('instructors'); // 'instructors', 'courses', 'courseDetails'
    const [instructors, setInstructors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [courseDetails, setCourseDetails] = useState(null);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/courses/instructors');
            setInstructors(response.data.data || []);
        } catch (error) {
            console.error('Error fetching instructors:', error);
            toast.error('Failed to load instructors');
        } finally {
            setLoading(false);
        }
    };

    const fetchInstructorCourses = async (instructorId, instructor) => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/courses/instructor/${instructorId}`);
            setCourses(response.data.data || []);
            setSelectedInstructor(instructor);
            setView('courses');
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseDetails = async (courseId, course) => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/courses/${courseId}/details`);
            setCourseDetails(response.data.data);
            setSelectedCourse(course);
            setView('courseDetails');
        } catch (error) {
            console.error('Error fetching course details:', error);
            toast.error('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (courseId, courseTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/admin/courses/${courseId}`);
            toast.success('Course deleted successfully');

            // Refresh the courses list
            if (selectedInstructor) {
                fetchInstructorCourses(selectedInstructor._id, selectedInstructor);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error(error.response?.data?.message || 'Failed to delete course');
        }
    };

    const goBack = () => {
        if (view === 'courseDetails') {
            setView('courses');
            setCourseDetails(null);
            setSelectedCourse(null);
        } else if (view === 'courses') {
            setView('instructors');
            setCourses([]);
            setSelectedInstructor(null);
        }
    };

    if (loading && view === 'instructors') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-6xl text-purple-600" />
            </div>
        );
    }

    return (
        <div className="admin-courses-page">
            {/* Header */}
            <div className="page-header">
                {view !== 'instructors' && (
                    <button onClick={goBack} className="back-button">
                        <FaArrowLeft /> Back
                    </button>
                )}
                <div>
                    <h1 className="page-title">
                        {view === 'instructors' && '📚 Course Management'}
                        {view === 'courses' && `${selectedInstructor?.firstName}'s Courses`}
                        {view === 'courseDetails' && selectedCourse?.title}
                    </h1>
                    <p className="page-subtitle">
                        {view === 'instructors' && 'Manage all courses by instructors'}
                        {view === 'courses' && `${courses.length} courses found`}
                        {view === 'courseDetails' && 'Course details and content'}
                    </p>
                </div>
            </div>

            {/* Instructors List */}
            {view === 'instructors' && (
                <div className="instructors-grid">
                    {instructors.map((instructor) => (
                        <div
                            key={instructor._id}
                            className="instructor-card"
                            onClick={() => fetchInstructorCourses(instructor._id, instructor)}
                        >
                            <div className="instructor-icon">
                                <FaChalkboardTeacher />
                            </div>
                            <div className="instructor-info">
                                <h3>{instructor.firstName} {instructor.lastName}</h3>
                                <p className="email">{instructor.email}</p>
                                <div className="course-count">
                                    <FaBook /> {instructor.courseCount} {instructor.courseCount === 1 ? 'Course' : 'Courses'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Courses List */}
            {view === 'courses' && (
                <div className="courses-grid">
                    {loading ? (
                        <div className="loading-state">
                            <FaSpinner className="animate-spin text-4xl text-purple-600" />
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="empty-state">
                            <FaBook className="empty-icon" />
                            <p>No courses found for this instructor</p>
                        </div>
                    ) : (
                        courses.map((course) => (
                            <div key={course._id} className="course-card">
                                <div className="course-thumbnail">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} />
                                    ) : (
                                        <div className="placeholder-thumbnail">
                                            <FaBook />
                                        </div>
                                    )}
                                </div>
                                <div className="course-content">
                                    <h3>{course.title}</h3>
                                    <p className="description">{course.description?.substring(0, 100)}...</p>
                                    <div className="course-meta">
                                        <span className="price">${course.price}</span>
                                        <span className="level">{course.level}</span>
                                        <span className="enrollments">{course.enrollmentCount || 0} students</span>
                                    </div>
                                    <div className="course-actions">
                                        <button
                                            onClick={() => fetchCourseDetails(course._id, course)}
                                            className="btn-view"
                                        >
                                            <FaEye /> View Details
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCourse(course._id, course.title)}
                                            className="btn-delete"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Course Details */}
            {view === 'courseDetails' && courseDetails && (
                <div className="course-details">
                    <div className="details-header">
                        <div className="header-content">
                            <h2>{courseDetails.title}</h2>
                            <p className="instructor-name">
                                By {courseDetails.instructor?.firstName} {courseDetails.instructor?.lastName}
                            </p>
                            <div className="course-stats">
                                <span>${courseDetails.price}</span>
                                <span>{courseDetails.level}</span>
                                <span>{courseDetails.enrollmentCount || 0} students enrolled</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDeleteCourse(courseDetails._id, courseDetails.title)}
                            className="btn-delete-large"
                        >
                            <FaTrash /> Delete Course
                        </button>
                    </div>

                    <div className="details-body">
                        <div className="description-section">
                            <h3>Description</h3>
                            <p>{courseDetails.description}</p>
                        </div>

                        <div className="sections-list">
                            <h3>Course Content ({courseDetails.sections?.length || 0} Sections)</h3>
                            {courseDetails.sections?.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="section-item">
                                    <div className="section-header">
                                        <h4>Section {sectionIndex + 1}: {section.title}</h4>
                                        <span className="lecture-count">{section.lectures?.length || 0} lectures</span>
                                    </div>
                                    <div className="lectures-list">
                                        {section.lectures?.map((lecture, lectureIndex) => (
                                            <div key={lectureIndex} className="lecture-item">
                                                <span className="lecture-number">{lectureIndex + 1}</span>
                                                <div className="lecture-info">
                                                    <p className="lecture-title">{lecture.title}</p>
                                                    <p className="lecture-type">{lecture.type}</p>
                                                </div>
                                                {lecture.duration && (
                                                    <span className="lecture-duration">{lecture.duration} min</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-courses-page {
                    padding: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .page-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    color: #6b7280;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .back-button:hover {
                    background: #f3f4f6;
                    border-color: #667eea;
                    color: #667eea;
                }

                .page-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                }

                .page-subtitle {
                    color: #6b7280;
                    font-size: 1.125rem;
                    margin: 0.5rem 0 0 0;
                }

                .instructors-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .instructor-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }

                .instructor-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
                }

                .instructor-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .instructor-info h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 0.25rem 0;
                }

                .email {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin: 0 0 0.75rem 0;
                }

                .course-count {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #667eea;
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .courses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 2rem;
                }

                .course-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }

                .course-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
                }

                .course-thumbnail {
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                }

                .course-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .placeholder-thumbnail {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 3rem;
                }

                .course-content {
                    padding: 1.5rem;
                }

                .course-content h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 0.5rem 0;
                }

                .description {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin: 0 0 1rem 0;
                    line-height: 1.6;
                }

                .course-meta {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }

                .course-meta span {
                    padding: 0.25rem 0.75rem;
                    background: #f3f4f6;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #6b7280;
                }

                .price {
                    background: #dcfce7 !important;
                    color: #16a34a !important;
                }

                .course-actions {
                    display: flex;
                    gap: 0.75rem;
                }

                .btn-view,
                .btn-delete {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-view {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-view:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                .btn-delete {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                }

                .btn-delete:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
                }

                .course-details {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                .details-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-bottom: 2rem;
                    border-bottom: 2px solid #e5e7eb;
                    margin-bottom: 2rem;
                }

                .details-header h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 0.5rem 0;
                }

                .instructor-name {
                    color: #6b7280;
                    margin: 0 0 1rem 0;
                }

                .course-stats {
                    display: flex;
                    gap: 1rem;
                }

                .course-stats span {
                    padding: 0.5rem 1rem;
                    background: #f3f4f6;
                    border-radius: 20px;
                    font-weight: 500;
                }

                .btn-delete-large {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-delete-large:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
                }

                .description-section {
                    margin-bottom: 2rem;
                }

                .description-section h3 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 1rem 0;
                }

                .description-section p {
                    color: #6b7280;
                    line-height: 1.8;
                }

                .sections-list h3 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 1.5rem 0;
                }

                .section-item {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .section-header h4 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0;
                }

                .lecture-count {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .lectures-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .lecture-item {
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .lecture-number {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.875rem;
                    flex-shrink: 0;
                }

                .lecture-info {
                    flex: 1;
                }

                .lecture-title {
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0 0 0.25rem 0;
                }

                .lecture-type {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin: 0;
                }

                .lecture-duration {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .empty-state,
                .loading-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem 2rem;
                }

                .empty-icon {
                    font-size: 4rem;
                    color: #d1d5db;
                    margin-bottom: 1rem;
                }

                @media (max-width: 768px) {
                    .instructors-grid,
                    .courses-grid {
                        grid-template-columns: 1fr;
                    }

                    .details-header {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .btn-delete-large {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default AdminCourses;
