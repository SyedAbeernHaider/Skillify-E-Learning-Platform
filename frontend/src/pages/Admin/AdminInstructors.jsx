import { useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaBook, FaUsers, FaDollarSign, FaSpinner, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../config/api';

function AdminInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalInstructors: 0,
        totalRevenue: 0,
        totalCourses: 0,
        totalEnrollments: 0
    });

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/instructors');
            const instructorsData = response.data.data || [];
            setInstructors(instructorsData);

            // Calculate overall stats
            const totalStats = instructorsData.reduce((acc, instructor) => ({
                totalInstructors: acc.totalInstructors + 1,
                totalRevenue: acc.totalRevenue + (instructor.totalRevenue || 0),
                totalCourses: acc.totalCourses + (instructor.courseCount || 0),
                totalEnrollments: acc.totalEnrollments + (instructor.totalEnrollments || 0)
            }), {
                totalInstructors: 0,
                totalRevenue: 0,
                totalCourses: 0,
                totalEnrollments: 0
            });

            setStats(totalStats);
        } catch (error) {
            console.error('Error fetching instructors:', error);
            toast.error('Failed to load instructors');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-6xl text-purple-600" />
            </div>
        );
    }

    return (
        <div className="admin-instructors-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">👨‍🏫 Instructor Management</h1>
                    <p className="page-subtitle">View all instructor statistics and performance</p>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="stats-grid">
                <div className="stat-card purple">
                    <div className="stat-icon">
                        <FaChalkboardTeacher />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Instructors</p>
                        <h3 className="stat-value">{stats.totalInstructors}</h3>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon">
                        <FaDollarSign />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Revenue</p>
                        <h3 className="stat-value">{formatCurrency(stats.totalRevenue)}</h3>
                    </div>
                </div>

                <div className="stat-card blue">
                    <div className="stat-icon">
                        <FaBook />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Courses</p>
                        <h3 className="stat-value">{stats.totalCourses}</h3>
                    </div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon">
                        <FaUsers />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Enrollments</p>
                        <h3 className="stat-value">{stats.totalEnrollments}</h3>
                    </div>
                </div>
            </div>

            {/* Instructors Table */}
            <div className="instructors-section">
                <h2 className="section-title">All Instructors ({instructors.length})</h2>

                {instructors.length === 0 ? (
                    <div className="empty-state">
                        <FaChalkboardTeacher className="empty-icon" />
                        <p>No instructors found</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="instructors-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Instructor</th>
                                    <th>Email</th>
                                    <th>Revenue</th>
                                    <th>Courses</th>
                                    <th>Students</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {instructors.map((instructor, index) => (
                                    <tr key={instructor._id}>
                                        <td className="rank-cell">
                                            <div className="rank-badge">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="instructor-cell">
                                                <div className="instructor-avatar">
                                                    {instructor.firstName.charAt(0)}{instructor.lastName.charAt(0)}
                                                </div>
                                                <div className="instructor-info">
                                                    <p className="instructor-name">
                                                        {instructor.firstName} {instructor.lastName}
                                                    </p>
                                                    {instructor.totalRevenue > 1000 && (
                                                        <span className="top-earner-badge">⭐ Top Earner</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="email-cell">{instructor.email}</td>
                                        <td>
                                            <div className="revenue-cell">
                                                <FaDollarSign className="revenue-icon" />
                                                <span className="revenue-amount">
                                                    {formatCurrency(instructor.totalRevenue)}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="stat-badge courses">
                                                <FaBook />
                                                <span>{instructor.courseCount || 0}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="stat-badge students">
                                                <FaUsers />
                                                <span>{instructor.totalEnrollments || 0}</span>
                                            </div>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(instructor.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style jsx>{`
                .admin-instructors-page {
                    padding: 2rem;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                .page-header {
                    margin-bottom: 2rem;
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

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    transition: transform 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                }

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: white;
                }

                .stat-card.purple .stat-icon {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .stat-card.green .stat-icon {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                }

                .stat-card.blue .stat-icon {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                }

                .stat-card.orange .stat-icon {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                }

                .stat-content {
                    flex: 1;
                }

                .stat-label {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin: 0 0 0.5rem 0;
                    font-weight: 500;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0;
                }

                .instructors-section {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                .section-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 1.5rem 0;
                }

                .table-container {
                    overflow-x: auto;
                }

                .instructors-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .instructors-table thead {
                    background: #f9fafb;
                }

                .instructors-table th {
                    padding: 1rem;
                    text-align: left;
                    font-weight: 600;
                    color: #6b7280;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 2px solid #e5e7eb;
                }

                .instructors-table tbody tr {
                    border-bottom: 1px solid #f3f4f6;
                    transition: background 0.2s ease;
                }

                .instructors-table tbody tr:hover {
                    background: #f9fafb;
                }

                .instructors-table td {
                    padding: 1rem;
                }

                .rank-cell {
                    width: 60px;
                }

                .rank-badge {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.875rem;
                }

                .instructor-cell {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .instructor-avatar {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .instructor-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .instructor-name {
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0;
                }

                .top-earner-badge {
                    font-size: 0.75rem;
                    color: #f59e0b;
                    font-weight: 600;
                }

                .email-cell {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .revenue-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .revenue-icon {
                    color: #10b981;
                }

                .revenue-amount {
                    font-weight: 700;
                    color: #10b981;
                    font-size: 1rem;
                }

                .stat-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .stat-badge.courses {
                    background: #eff6ff;
                    color: #2563eb;
                }

                .stat-badge.students {
                    background: #f0fdf4;
                    color: #16a34a;
                }

                .date-cell {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                }

                .empty-icon {
                    font-size: 4rem;
                    color: #d1d5db;
                    margin-bottom: 1rem;
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .table-container {
                        overflow-x: scroll;
                    }

                    .instructors-table {
                        min-width: 800px;
                    }
                }
            `}</style>
        </div>
    );
}

export default AdminInstructors;
