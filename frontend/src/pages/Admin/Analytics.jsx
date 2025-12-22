import { useEffect, useState } from 'react';
import { FaUsers, FaBook, FaGraduationCap, FaDollarSign, FaCertificate, FaChartLine, FaTrophy, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:1000/api/admin/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(response.data.data);
        } catch (error) {
            toast.error('Failed to load analytics');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading Analytics...</p>
                </div>

                <style jsx>{`
                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 80vh;
                        gap: 1.5rem;
                    }

                    .loading-spinner {
                        width: 60px;
                        height: 60px;
                        border: 4px solid #e5e7eb;
                        border-top: 4px solid #667eea;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }

                    .loading-text {
                        font-size: 1.125rem;
                        color: #6b7280;
                        font-weight: 500;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="analytics-page">
                <p>No analytics data available</p>
            </div>
        );
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="analytics-page">
            <h1 className="page-title">📊 Platform Analytics</h1>

            {/* Overview Cards */}
            <div className="stats-grid">
                <div className="stat-card users">
                    <div className="stat-icon">
                        <FaUsers />
                    </div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <p className="stat-number">{analytics.users.total.toLocaleString()}</p>
                        <p className="stat-detail">
                            {analytics.users.students} Students • {analytics.users.instructors} Instructors
                        </p>
                    </div>
                </div>

                <div className="stat-card courses">
                    <div className="stat-icon">
                        <FaBook />
                    </div>
                    <div className="stat-content">
                        <h3>Total Courses</h3>
                        <p className="stat-number">{analytics.courses.total.toLocaleString()}</p>
                        <p className="stat-detail">
                            {analytics.courses.approved} Approved • {analytics.courses.pending} Pending
                        </p>
                    </div>
                </div>

                <div className="stat-card enrollments">
                    <div className="stat-icon">
                        <FaGraduationCap />
                    </div>
                    <div className="stat-content">
                        <h3>Total Enrollments</h3>
                        <p className="stat-number">{analytics.enrollments.total.toLocaleString()}</p>
                        <p className="stat-detail">
                            {analytics.enrollments.completionRate}% Completion Rate
                        </p>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-icon">
                        <FaDollarSign />
                    </div>
                    <div className="stat-content">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">${analytics.revenue.total.toLocaleString()}</p>
                        <p className="stat-detail">
                            Platform: ${analytics.revenue.platform.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="section-card">
                <h2><FaChartLine /> Recent Activity (Last 30 Days)</h2>
                <div className="activity-grid">
                    <div className="activity-item">
                        <span className="activity-label">New Users</span>
                        <span className="activity-value">{analytics.recentActivity.newUsers}</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-label">New Courses</span>
                        <span className="activity-value">{analytics.recentActivity.newCourses}</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-label">New Enrollments</span>
                        <span className="activity-value">{analytics.recentActivity.newEnrollments}</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                {/* Courses by Category */}
                <div className="chart-card">
                    <h2>Courses by Category</h2>
                    <div className="chart-content">
                        {analytics.courses.byCategory.map((cat, index) => (
                            <div key={index} className="bar-item">
                                <div className="bar-label">{cat._id || 'Uncategorized'}</div>
                                <div className="bar-container">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${(cat.count / analytics.courses.total) * 100}%`,
                                            backgroundColor: `hsl(${index * 40}, 70%, 60%)`
                                        }}
                                    ></div>
                                    <span className="bar-value">{cat.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Courses by Level */}
                <div className="chart-card">
                    <h2>Courses by Level</h2>
                    <div className="chart-content">
                        {analytics.courses.byLevel.map((level, index) => (
                            <div key={index} className="bar-item">
                                <div className="bar-label">{level._id}</div>
                                <div className="bar-container">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${(level.count / analytics.courses.total) * 100}%`,
                                            backgroundColor: `hsl(${200 + index * 40}, 70%, 60%)`
                                        }}
                                    ></div>
                                    <span className="bar-value">{level.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Growth Trends */}
            <div className="section-card">
                <h2><FaChartLine /> User Growth (Last 6 Months)</h2>
                <div className="growth-chart">
                    {analytics.users.growth.map((item, index) => (
                        <div key={index} className="growth-bar">
                            <div
                                className="growth-fill"
                                style={{
                                    height: `${(item.count / Math.max(...analytics.users.growth.map(g => g.count))) * 100}%`
                                }}
                            ></div>
                            <span className="growth-label">{monthNames[item._id.month - 1]}</span>
                            <span className="growth-value">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Courses */}
            <div className="section-card">
                <h2><FaTrophy /> Top 10 Popular Courses</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Course Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Enrollments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.courses.popular.map((course, index) => (
                                <tr key={course._id}>
                                    <td>{index + 1}</td>
                                    <td className="course-title">{course.title}</td>
                                    <td><span className="badge">{course.category}</span></td>
                                    <td className="price">${course.price}</td>
                                    <td>
                                        <span className="rating">
                                            <FaStar /> {course.rating?.toFixed(1) || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="enrollments">{course.enrollmentCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Instructors */}
            <div className="section-card">
                <h2><FaStar /> Top 10 Instructors</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Courses</th>
                                <th>Total Enrollments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.topInstructors.map((instructor, index) => (
                                <tr key={instructor._id}>
                                    <td>{index + 1}</td>
                                    <td className="instructor-name">
                                        {instructor.firstName} {instructor.lastName}
                                    </td>
                                    <td>{instructor.email}</td>
                                    <td>{instructor.courseCount}</td>
                                    <td className="enrollments">{instructor.enrollmentCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Certificate Stats */}
            <div className="section-card">
                <h2><FaCertificate /> Certificate Statistics</h2>
                <div className="certificate-stats">
                    <div className="cert-stat">
                        <span className="cert-label">Total Certificates</span>
                        <span className="cert-value">{analytics.certificates.total}</span>
                    </div>
                    <div className="cert-stat">
                        <span className="cert-label">Approved</span>
                        <span className="cert-value approved">{analytics.certificates.approved}</span>
                    </div>
                    <div className="cert-stat">
                        <span className="cert-label">Pending</span>
                        <span className="cert-value pending">{analytics.certificates.pending}</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .analytics-page {
                    padding: 2rem;
                    max-width: 1400px;
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

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    gap: 1rem;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f4f6;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    display: flex;
                    gap: 1rem;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.75rem;
                    color: white;
                }

                .stat-card.users .stat-icon {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .stat-card.courses .stat-icon {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }

                .stat-card.enrollments .stat-icon {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }

                .stat-card.revenue .stat-icon {
                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                }

                .stat-content {
                    flex: 1;
                }

                .stat-content h3 {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0 0 0.5rem 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 0.25rem 0;
                }

                .stat-detail {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin: 0;
                }

                .section-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                }

                .section-card h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 1.5rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .activity-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }

                .activity-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                    border-radius: 12px;
                }

                .activity-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                }

                .activity-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #667eea;
                }

                .charts-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .chart-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .chart-card h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 1.5rem 0;
                }

                .chart-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .bar-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .bar-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #4b5563;
                    text-transform: capitalize;
                }

                .bar-container {
                    position: relative;
                    background: #f3f4f6;
                    border-radius: 8px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                }

                .bar-fill {
                    height: 100%;
                    border-radius: 8px;
                    transition: width 0.5s ease;
                    min-width: 40px;
                }

                .bar-value {
                    position: absolute;
                    right: 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #1f2937;
                }

                .growth-chart {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-around;
                    height: 250px;
                    gap: 1rem;
                    padding: 1rem;
                    background: linear-gradient(to top, #f9fafb 0%, transparent 100%);
                    border-radius: 12px;
                }

                .growth-bar {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .growth-fill {
                    width: 100%;
                    background: linear-gradient(to top, #667eea, #764ba2);
                    border-radius: 8px 8px 0 0;
                    min-height: 20px;
                    transition: height 0.5s ease;
                }

                .growth-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #6b7280;
                }

                .growth-value {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #1f2937;
                }

                .table-container {
                    overflow-x: auto;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .data-table thead {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .data-table th {
                    padding: 1rem;
                    text-align: left;
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .data-table tbody tr {
                    border-bottom: 1px solid #e5e7eb;
                    transition: background 0.2s;
                }

                .data-table tbody tr:hover {
                    background: #f9fafb;
                }

                .data-table td {
                    padding: 1rem;
                    font-size: 0.875rem;
                    color: #4b5563;
                }

                .course-title, .instructor-name {
                    font-weight: 600;
                    color: #1f2937;
                }

                .badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    background: #e0e7ff;
                    color: #4f46e5;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .price {
                    font-weight: 600;
                    color: #059669;
                }

                .rating {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #f59e0b;
                    font-weight: 600;
                }

                .enrollments {
                    font-weight: 700;
                    color: #667eea;
                }

                .certificate-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }

                .cert-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                    border-radius: 12px;
                }

                .cert-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                }

                .cert-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2937;
                }

                .cert-value.approved {
                    color: #059669;
                }

                .cert-value.pending {
                    color: #f59e0b;
                }
            `}</style>
        </div>
    );
}

export default Analytics;
