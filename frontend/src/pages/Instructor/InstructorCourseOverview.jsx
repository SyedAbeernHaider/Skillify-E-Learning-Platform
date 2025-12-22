import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaBook, FaUsers, FaStar, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { getCourseOverview } from '../../services/api/instructorService';
import { toast } from 'react-toastify';

function InstructorCourseOverview() {
    const { courseId } = useParams();
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOverview();
    }, [courseId]);

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const response = await getCourseOverview(courseId);
            setOverview(response.data);
        } catch (error) {
            console.error('Failed to fetch course overview:', error);
            toast.error('Failed to load course overview');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="overview-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading Overview...</p>
                </div>
                <style jsx>{`
                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 60vh;
                        gap: 1rem;
                    }
                    .loading-spinner {
                        width: 50px;
                        height: 50px;
                        border: 4px solid #e5e7eb;
                        border-top: 4px solid #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    if (!overview) return null;

    return (
        <div className="overview-page">
            <h1 className="page-title">Course Overview</h1>

            {/* Course Header Card */}
            <div className="course-header-card">
                <img src={overview.thumbnail || 'https://via.placeholder.com/150'} alt={overview.title} className="course-thumbnail" />
                <div className="course-info">
                    <h2>{overview.title}</h2>
                    <div className="status-badge">
                        {overview.published ? (
                            <span className="published"><FaCheckCircle /> Published</span>
                        ) : (
                            <span className="pending"><FaExclamationCircle /> Pending Approval</span>
                        )}
                    </div>
                    <p className="price">${overview.price}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon students">
                        <FaUsers />
                    </div>
                    <div className="stat-content">
                        <h3>Total Students</h3>
                        <p className="stat-number">{overview.totalStudents}</p>
                    </div>
                </div>

                <div className="stat-card rating">
                    <div className="stat-icon">
                        <FaStar />
                    </div>
                    <div className="stat-content">
                        <h3>Average Rating</h3>
                        <p className="stat-number">{overview.avgRating} <span className="total-reviews">({overview.totalReviews} reviews)</span></p>
                    </div>
                </div>

                <div className="stat-card revenue">
                    {/* Revenue could be shown here, but we have a dedicated analytics page. 
                        Let's show something else or keep it simple. */}
                </div>
            </div>

            {/* Recent Enrollments */}
            <div className="section-card">
                <h3>Recent Enrollments</h3>
                <div className="enrollments-list">
                    {overview.recentEnrollments && overview.recentEnrollments.length > 0 ? (
                        overview.recentEnrollments.map((enrollment) => (
                            <div key={enrollment._id} className="enrollment-item">
                                <div className="student-info">
                                    <div className="student-avatar">
                                        {enrollment.student?.firstName?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4>{enrollment.student?.firstName} {enrollment.student?.lastName}</h4>
                                        <p>{enrollment.student?.email}</p>
                                    </div>
                                </div>
                                <span className="enrollment-date">
                                    {new Date(enrollment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">No students enrolled yet.</p>
                    )}
                </div>
            </div>

            <style jsx>{`
                .overview-page {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .page-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 2rem;
                }

                .course-header-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                }

                .course-thumbnail {
                    width: 180px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 12px;
                }

                .course-info h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 0.5rem 0;
                }

                .status-badge span {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .published {
                    background: #d1fae5;
                    color: #065f46;
                }

                .pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .price {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #667eea;
                    margin: 0.5rem 0 0 0;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: white;
                }

                .stat-icon.students { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                .stat-icon.rating { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }

                .stat-content h3 {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }

                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                }

                .total-reviews {
                    font-size: 0.875rem;
                    font-weight: 400;
                    color: #9ca3af;
                }

                .section-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .section-card h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 1.5rem 0;
                }

                .enrollments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .enrollment-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: #f9fafb;
                    border-radius: 12px;
                }

                .student-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .student-avatar {
                    width: 40px;
                    height: 40px;
                    background: #e5e7eb;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    color: #4b5563;
                }

                .student-info h4 {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                }

                .student-info p {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }

                .enrollment-date {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .no-data {
                    color: #6b7280;
                    text-align: center;
                    padding: 2rem;
                }
            `}</style>
        </div>
    );
}

export default InstructorCourseOverview;
