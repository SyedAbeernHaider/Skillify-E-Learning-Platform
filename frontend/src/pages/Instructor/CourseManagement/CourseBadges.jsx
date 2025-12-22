import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaMedal, FaSpinner, FaTrophy, FaAward, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../config/api';

function CourseBadges() {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [badges, setBadges] = useState([]);
    const [course, setCourse] = useState(null);
    const [selectedSection, setSelectedSection] = useState('all');
    const [selectedBadgeType, setSelectedBadgeType] = useState('all');

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch course details
            const courseResponse = await api.get(`/instructor/courses/${courseId}`);
            setCourse(courseResponse.data.data);

            // Fetch badges for this course
            const badgesResponse = await api.get(`/instructor/badges/${courseId}`);
            setBadges(badgesResponse.data.data || []);
        } catch (error) {
            toast.error('Failed to load badges');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBadges = badges.filter(badge => {
        const sectionMatch = selectedSection === 'all' || badge.sectionIndex === parseInt(selectedSection);
        const typeMatch = selectedBadgeType === 'all' || badge.name === selectedBadgeType;
        return sectionMatch && typeMatch;
    });

    const getBadgeIcon = (badgeName) => {
        switch (badgeName) {
            case 'Platinum':
                return '🏆';
            case 'Gold':
                return '🥇';
            case 'Silver':
                return '🥈';
            default:
                return '🎖️';
        }
    };

    const getBadgeColor = (badgeName) => {
        switch (badgeName) {
            case 'Platinum':
                return 'bg-gradient-to-r from-purple-500 to-pink-500';
            case 'Gold':
                return 'bg-gradient-to-r from-yellow-400 to-orange-500';
            case 'Silver':
                return 'bg-gradient-to-r from-gray-300 to-gray-500';
            default:
                return 'bg-gradient-to-r from-blue-500 to-indigo-500';
        }
    };

    const badgeStats = {
        total: badges.length,
        platinum: badges.filter(b => b.name === 'Platinum').length,
        gold: badges.filter(b => b.name === 'Gold').length,
        silver: badges.filter(b => b.name === 'Silver').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-6xl text-purple-600" />
            </div>
        );
    }

    return (
        <div className="course-badges">
            <div className="page-header">
                <div>
                    <h1 className="page-title">🏅 Course Badges</h1>
                    <p className="page-subtitle">{course?.title}</p>
                </div>
                <div className="stats-summary">
                    <div className="stat-box">
                        <span className="stat-value">{badgeStats.total}</span>
                        <span className="stat-label">Total Badges</span>
                    </div>
                    <div className="stat-box platinum">
                        <span className="stat-value">{badgeStats.platinum}</span>
                        <span className="stat-label">🏆 Platinum</span>
                    </div>
                    <div className="stat-box gold">
                        <span className="stat-value">{badgeStats.gold}</span>
                        <span className="stat-label">🥇 Gold</span>
                    </div>
                    <div className="stat-box silver">
                        <span className="stat-value">{badgeStats.silver}</span>
                        <span className="stat-label">🥈 Silver</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filter-group">
                    <label>Filter by Section:</label>
                    <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                    >
                        <option value="all">All Sections</option>
                        {course?.sections?.map((section, index) => (
                            <option key={index} value={index}>
                                Section {index + 1}: {section.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Filter by Badge Type:</label>
                    <select
                        value={selectedBadgeType}
                        onChange={(e) => setSelectedBadgeType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="Platinum">🏆 Platinum</option>
                        <option value="Gold">🥇 Gold</option>
                        <option value="Silver">🥈 Silver</option>
                    </select>
                </div>
            </div>

            {/* Badges Grid */}
            {filteredBadges.length === 0 ? (
                <div className="empty-state">
                    <FaMedal className="empty-icon" />
                    <h3>No Badges Awarded Yet</h3>
                    <p>Badges will appear here when you award them to students from the Students page</p>
                </div>
            ) : (
                <div className="badges-grid">
                    {filteredBadges.map((badge) => (
                        <div key={badge._id} className="badge-card">
                            <div className={`badge-header ${getBadgeColor(badge.name)}`}>
                                <div className="badge-icon">{getBadgeIcon(badge.name)}</div>
                                <h3 className="badge-name">{badge.name}</h3>
                            </div>
                            <div className="badge-body">
                                <div className="badge-info">
                                    <div className="info-row">
                                        <span className="label">Student:</span>
                                        <span className="value">{badge.studentName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Section:</span>
                                        <span className="value">
                                            {badge.sectionIndex !== undefined
                                                ? `Section ${badge.sectionIndex + 1}`
                                                : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Quiz:</span>
                                        <span className="value">{badge.quizTitle || 'Quiz'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Description:</span>
                                        <span className="value description">{badge.description}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Awarded:</span>
                                        <span className="value date">
                                            {new Date(badge.awardedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .course-badges {
                    max-width: 1600px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }

                .page-title {
                    font-size: 2rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0 0 0.5rem 0;
                }

                .page-subtitle {
                    color: #6b7280;
                    margin: 0;
                    font-size: 1.125rem;
                }

                .stats-summary {
                    display: flex;
                    gap: 1rem;
                }

                .stat-box {
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 100px;
                }

                .stat-box.platinum {
                    background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                    color: white;
                }

                .stat-box.gold {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: white;
                }

                .stat-box.silver {
                    background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
                    color: white;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                }

                .stat-label {
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }

                .filters-section {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                    display: flex;
                    gap: 2rem;
                    flex-wrap: wrap;
                }

                .filter-group {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .filter-group label {
                    font-weight: 600;
                    color: #374151;
                }

                .filter-group select {
                    padding: 0.5rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 6px;
                    font-size: 1rem;
                    cursor: pointer;
                    min-width: 200px;
                }

                .filter-group select:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .empty-state {
                    background: white;
                    padding: 4rem 2rem;
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .empty-icon {
                    font-size: 4rem;
                    color: #d1d5db;
                    margin-bottom: 1rem;
                }

                .empty-state h3 {
                    font-size: 1.5rem;
                    color: #1f2937;
                    margin: 0 0 0.5rem 0;
                }

                .empty-state p {
                    color: #6b7280;
                }

                .badges-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }

                .badge-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .badge-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                }

                .badge-header {
                    padding: 2rem;
                    text-align: center;
                    color: white;
                }

                .badge-icon {
                    font-size: 4rem;
                    margin-bottom: 0.5rem;
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .badge-name {
                    font-size: 1.75rem;
                    font-weight: 900;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    animation: shimmer 3s infinite;
                }

                @keyframes shimmer {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.85;
                    }
                }

                .badge-body {
                    padding: 1.5rem;
                }

                .badge-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #e5e7eb;
                }

                .info-row:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }

                .label {
                    font-weight: 600;
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .value {
                    font-weight: 500;
                    color: #1f2937;
                    text-align: right;
                }

                .value.description {
                    max-width: 200px;
                    font-size: 0.875rem;
                }

                .value.date {
                    font-size: 0.875rem;
                    color: #667eea;
                }

                @media (max-width: 1024px) {
                    .page-header {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .stats-summary {
                        width: 100%;
                        overflow-x: auto;
                    }

                    .badges-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default CourseBadges;
