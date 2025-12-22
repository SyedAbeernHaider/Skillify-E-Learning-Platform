import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCertificate, FaCheckCircle, FaClock, FaLock, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/DashboardLayout';
import { getEnrolledCourses, requestCertificate } from '../../services/api/studentService';

function CertificateRequest() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [requesting, setRequesting] = useState({});

    useEffect(() => {
        fetchEligibleCourses();
    }, []);

    const fetchEligibleCourses = async () => {
        try {
            setLoading(true);
            const response = await getEnrolledCourses();

            // Filter courses that are completed (100% progress)
            const completedCourses = response.data.filter(
                enrollment => enrollment.progress?.completionPercentage >= 100
            );

            setCourses(completedCourses);
        } catch (error) {
            console.error('Failed to fetch courses', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestCertificate = async (courseId, courseTitle) => {
        try {
            setRequesting(prev => ({ ...prev, [courseId]: true }));

            const response = await requestCertificate(courseId);

            if (response.success) {
                toast.success('Certificate request submitted successfully!');
                // Refresh the list
                fetchEligibleCourses();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to request certificate';
            toast.error(errorMsg);
        } finally {
            setRequesting(prev => ({ ...prev, [courseId]: false }));
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <FaSpinner className="animate-spin text-4xl text-purple-600" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="certificate-request-page">
                <div className="page-header">
                    <h1 className="page-title">📜 Request Certificate</h1>
                    <p className="page-subtitle">
                        Request certificates for courses you've completed
                    </p>
                </div>

                {courses.length === 0 ? (
                    <div className="empty-state">
                        <FaLock className="empty-icon" />
                        <h3>No Eligible Courses</h3>
                        <p>Complete a course with 100% progress to request a certificate</p>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {courses.map((enrollment) => {
                            const course = enrollment.course;
                            const isLocked = course.isContentLocked;
                            const hasRequest = enrollment.certificateRequested; // You may need to add this field

                            return (
                                <div key={course._id} className="course-card">
                                    <div className="course-thumbnail">
                                        <img
                                            src={course.thumbnail || '/placeholder-course.jpg'}
                                            alt={course.title}
                                        />
                                        <div className="progress-badge">
                                            <FaCheckCircle /> 100%
                                        </div>
                                    </div>

                                    <div className="course-content">
                                        <h3 className="course-title">{course.title}</h3>
                                        <p className="course-instructor">
                                            by {course.instructor?.firstName} {course.instructor?.lastName}
                                        </p>

                                        <div className="status-section">
                                            {!isLocked ? (
                                                <div className="status-badge warning">
                                                    <FaClock />
                                                    <span>Course content is being updated by instructor</span>
                                                </div>
                                            ) : hasRequest ? (
                                                <div className="status-badge success">
                                                    <FaCheckCircle />
                                                    <span>Certificate request already submitted</span>
                                                </div>
                                            ) : (
                                                <button
                                                    className="request-btn"
                                                    onClick={() => handleRequestCertificate(course._id, course.title)}
                                                    disabled={requesting[course._id]}
                                                >
                                                    {requesting[course._id] ? (
                                                        <>
                                                            <FaSpinner className="animate-spin" />
                                                            Requesting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCertificate />
                                                            Request Certificate
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <style jsx>{`
                    .certificate-request-page {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 2rem;
                    }

                    .page-header {
                        margin-bottom: 2rem;
                    }

                    .page-title {
                        font-size: 2rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 0.5rem;
                    }

                    .page-subtitle {
                        color: #6b7280;
                        font-size: 1rem;
                    }

                    .empty-state {
                        text-align: center;
                        padding: 4rem 2rem;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .empty-icon {
                        font-size: 4rem;
                        color: #d1d5db;
                        margin-bottom: 1rem;
                    }

                    .empty-state h3 {
                        font-size: 1.5rem;
                        font-weight: 600;
                        color: #1f2937;
                        margin-bottom: 0.5rem;
                    }

                    .empty-state p {
                        color: #6b7280;
                    }

                    .courses-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                        gap: 2rem;
                    }

                    .course-card {
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }

                    .course-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                    }

                    .course-thumbnail {
                        position: relative;
                        width: 100%;
                        height: 200px;
                        overflow: hidden;
                    }

                    .course-thumbnail img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .progress-badge {
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        background: #10b981;
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 20px;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.875rem;
                    }

                    .course-content {
                        padding: 1.5rem;
                    }

                    .course-title {
                        font-size: 1.25rem;
                        font-weight: 600;
                        color: #1f2937;
                        margin-bottom: 0.5rem;
                        line-height: 1.4;
                    }

                    .course-instructor {
                        color: #6b7280;
                        font-size: 0.875rem;
                        margin-bottom: 1rem;
                    }

                    .status-section {
                        margin-top: 1rem;
                    }

                    .status-badge {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.75rem 1rem;
                        border-radius: 8px;
                        font-size: 0.875rem;
                        font-weight: 500;
                    }

                    .status-badge.warning {
                        background: #fef3c7;
                        color: #92400e;
                    }

                    .status-badge.success {
                        background: #d1fae5;
                        color: #065f46;
                    }

                    .request-btn {
                        width: 100%;
                        padding: 0.875rem 1.5rem;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        transition: transform 0.2s, box-shadow 0.2s;
                    }

                    .request-btn:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    }

                    .request-btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @media (max-width: 768px) {
                        .courses-grid {
                            grid-template-columns: 1fr;
                        }

                        .certificate-request-page {
                            padding: 1rem;
                        }
                    }
                `}</style>
            </div>
        </DashboardLayout>
    );
}

export default CertificateRequest;
