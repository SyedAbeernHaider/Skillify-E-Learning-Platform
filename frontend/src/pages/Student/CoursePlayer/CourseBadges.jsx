import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrophy, FaSpinner, FaMedal, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CoursePlayerLayout from '../../../components/CoursePlayerLayout';
import api from '../../../config/api';

function CourseBadges() {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        fetchBadges();
    }, [courseId]);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            // Fetch badges for this course awarded to the current student
            const response = await api.get(`/student/badges/${courseId}`);
            const badgesData = response.data.data || [];
            console.log('Fetched badges:', badgesData); // Debug log
            setBadges(badgesData);
        } catch (error) {
            console.error('Error fetching badges:', error);
            toast.error('Failed to load badges');
        } finally {
            setLoading(false);
        }
    };

    const getBadgeColor = (badgeName) => {
        switch (badgeName) {
            case 'Platinum':
                return 'from-purple-500 to-pink-500';
            case 'Gold':
                return 'from-yellow-400 to-orange-500';
            case 'Silver':
                return 'from-gray-300 to-gray-500';
            default:
                return 'from-blue-400 to-indigo-500';
        }
    };

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

    return (
        <CoursePlayerLayout>
            <div className="course-badges">
                <h1 className="page-title">🏆 Course Badges</h1>
                <p className="page-subtitle">Achievements earned in this course</p>

                {loading ? (
                    <div className="loading">
                        <FaSpinner className="animate-spin text-6xl text-purple-600" />
                    </div>
                ) : badges.length === 0 ? (
                    <div className="no-badges">
                        <FaTrophy className="no-badge-icon" />
                        <h3>No Badges Yet</h3>
                        <p>Complete quizzes and score high to earn badges from your instructor!</p>
                    </div>
                ) : (
                    <div className="badges-grid">
                        {badges.map((badge) => (
                            <div key={badge._id} className="badge-card">
                                <div className={`badge-icon bg-gradient-to-br ${getBadgeColor(badge.name || 'Badge')}`}>
                                    <span className="badge-emoji">{getBadgeIcon(badge.name || 'Badge')}</span>
                                </div>
                                <div className={`badge-name-styled ${(badge.name || 'badge').toLowerCase()}`}>
                                    {(badge.name || 'BADGE').toUpperCase()}
                                </div>
                                <p className="badge-description">{badge.description || 'Achievement earned'}</p>
                                {badge.quizTitle && (
                                    <p className="badge-quiz">Quiz: {badge.quizTitle}</p>
                                )}
                                {badge.sectionIndex !== undefined && (
                                    <p className="badge-section">Section {badge.sectionIndex + 1}</p>
                                )}
                                <p className="badge-date">
                                    Earned: {new Date(badge.awardedAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <style jsx>{`
                    .course-badges {
                        max-width: 1200px;
                        margin: 0 auto;
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
                        margin-bottom: 2rem;
                    }

                    .loading {
                        display: flex;
                        justify-content: center;
                        padding: 4rem;
                    }

                    .no-badges {
                        background: white;
                        padding: 4rem 2rem;
                        border-radius: 12px;
                        text-align: center;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .no-badge-icon {
                        font-size: 4rem;
                        color: #d1d5db;
                        margin-bottom: 1rem;
                    }

                    .no-badges h3 {
                        font-size: 1.5rem;
                        color: #1f2937;
                        margin: 0 0 0.5rem 0;
                    }

                    .no-badges p {
                        color: #6b7280;
                    }

                    .badges-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 2rem;
                    }

                    .badge-card {
                        background: white;
                        padding: 2rem;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        transition: transform 0.3s, box-shadow 0.3s;
                    }

                    .badge-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                    }

                    .badge-icon {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1.5rem;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    }

                    .badge-emoji {
                        font-size: 3rem;
                    }

                    .badge-name-styled {
                        font-size: 1.5rem;
                        font-weight: 900;
                        letter-spacing: 2px;
                        margin: 0 0 1rem 0;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                        text-align: center;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        position: relative;
                        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }

                    .badge-name-styled.platinum {
                        background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        animation: shimmer 3s infinite;
                    }

                    .badge-name-styled.gold {
                        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        animation: shimmer 3s infinite;
                    }

                    .badge-name-styled.silver {
                        background: linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        animation: shimmer 3s infinite;
                    }

                    @keyframes shimmer {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.8;
                        }
                    }

                    .badge-card h3 {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 0.5rem 0;
                    }

                    .badge-description {
                        color: #6b7280;
                        margin: 0 0 0.5rem 0;
                    }

                    .badge-quiz,
                    .badge-section {
                        color: #9ca3af;
                        font-size: 0.875rem;
                        margin: 0 0 0.25rem 0;
                    }

                    .badge-date {
                        color: #667eea;
                        font-size: 0.875rem;
                        font-weight: 600;
                        margin: 0.5rem 0 0 0;
                    }
                `}</style>
            </div>
        </CoursePlayerLayout>
    );
}

export default CourseBadges;
