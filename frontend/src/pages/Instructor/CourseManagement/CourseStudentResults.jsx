import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrophy, FaSpinner, FaMedal, FaCheckCircle, FaTimesCircle, FaAward } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../config/api';

function CourseStudentResults() {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [course, setCourse] = useState(null);
    const [selectedSection, setSelectedSection] = useState('all');
    const [awardingBadge, setAwardingBadge] = useState(null);

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch course details
            const courseResponse = await api.get(`/instructor/courses/${courseId}`);
            setCourse(courseResponse.data.data);

            // Fetch quiz results
            const resultsResponse = await api.get(`/instructor/quiz-results/${courseId}`);
            setResults(resultsResponse.data.data);
        } catch (error) {
            toast.error('Failed to load student results');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const awardBadge = async (resultId, studentId, studentName, percentage) => {
        try {
            setAwardingBadge(resultId);

            // Determine badge type based on percentage
            let badgeName, badgeDescription, badgeIcon;
            if (percentage === 100) {
                badgeName = 'Platinum';
                badgeDescription = 'Perfect Score! Outstanding performance';
                badgeIcon = '🏆';
            } else if (percentage >= 90) {
                badgeName = 'Gold';
                badgeDescription = 'Excellent performance on quiz';
                badgeIcon = '🥇';
            } else if (percentage >= 70) {
                badgeName = 'Silver';
                badgeDescription = 'Good performance on quiz';
                badgeIcon = '🥈';
            } else {
                toast.warning('Student must score at least 70% to earn a badge');
                setAwardingBadge(null);
                return;
            }

            const response = await api.post('/instructor/award-badge', {
                resultId,
                studentId,
                courseId,
                studentName,
                badgeName,
                badgeDescription,
                badgeIcon
            });

            toast.success(`${badgeName} badge awarded to ${studentName}!`);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Award badge error:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || 'Failed to award badge';
            toast.error(errorMessage);
        } finally {
            setAwardingBadge(null);
        }
    };

    const filteredResults = selectedSection === 'all'
        ? results
        : results.filter(r => r.sectionIndex === parseInt(selectedSection));

    const getScoreColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 70) return 'text-blue-600';
        if (percentage >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadge = (percentage) => {
        if (percentage >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
        if (percentage >= 70) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
        if (percentage >= 50) return { label: 'Average', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-6xl text-purple-600" />
            </div>
        );
    }

    return (
        <div className="student-results">
            <div className="page-header">
                <div>
                    <h1 className="page-title">📊 Student Quiz Results</h1>
                    <p className="page-subtitle">{course?.title}</p>
                </div>
                <div className="stats-summary">
                    <div className="stat-box">
                        <span className="stat-value">{results.length}</span>
                        <span className="stat-label">Total Submissions</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">
                            {results.filter(r => r.passed).length}
                        </span>
                        <span className="stat-label">Passed</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">
                            {results.filter(r => !r.passed).length}
                        </span>
                        <span className="stat-label">Failed</span>
                    </div>
                </div>
            </div>

            {/* Section Filter */}
            <div className="filter-section">
                <label>Filter by Section:</label>
                <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                >
                    <option value="all">All Sections</option>
                    {course?.sections?.map((section, index) => (
                        section.quiz && (
                            <option key={index} value={index}>
                                Section {index + 1}: {section.title}
                            </option>
                        )
                    ))}
                </select>
            </div>

            {/* Results Table */}
            {filteredResults.length === 0 ? (
                <div className="empty-state">
                    <FaTrophy className="empty-icon" />
                    <h3>No Results Yet</h3>
                    <p>Students haven't submitted any quiz results yet</p>
                </div>
            ) : (
                <div className="results-container">
                    <div className="results-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Section</th>
                                    <th>Quiz Title</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Status</th>
                                    <th>Performance</th>
                                    <th>Submitted</th>
                                    <th>Badge</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map((result) => {
                                    const scoreBadge = getScoreBadge(result.percentage);
                                    return (
                                        <tr key={result._id}>
                                            <td className="student-name">{result.studentName}</td>
                                            <td className="student-email">{result.studentEmail}</td>
                                            <td>Section {result.sectionIndex + 1}</td>
                                            <td>{result.quizTitle}</td>
                                            <td className="score">
                                                {result.correctAnswers}/{result.totalQuestions}
                                            </td>
                                            <td className={`percentage ${getScoreColor(result.percentage)}`}>
                                                {result.percentage}%
                                            </td>
                                            <td>
                                                {result.passed ? (
                                                    <span className="status-badge passed">
                                                        <FaCheckCircle /> Passed
                                                    </span>
                                                ) : (
                                                    <span className="status-badge failed">
                                                        <FaTimesCircle /> Failed
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`performance-badge ${scoreBadge.color}`}>
                                                    {scoreBadge.label}
                                                </span>
                                            </td>
                                            <td className="date">
                                                {new Date(result.submittedAt).toLocaleDateString()}
                                                <br />
                                                <span className="time">
                                                    {new Date(result.submittedAt).toLocaleTimeString()}
                                                </span>
                                            </td>
                                            <td>
                                                {result.badgeAwarded ? (
                                                    <span className="badge-awarded">
                                                        <FaMedal /> Awarded
                                                    </span>
                                                ) : result.percentage >= 70 ? (
                                                    <button
                                                        onClick={() => awardBadge(result._id, result.student, result.studentName, result.percentage)}
                                                        disabled={awardingBadge === result._id}
                                                        className="award-btn"
                                                    >
                                                        {awardingBadge === result._id ? (
                                                            <><FaSpinner className="animate-spin" /> Awarding...</>
                                                        ) : (
                                                            <><FaAward /> Award Badge</>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="no-badge">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <style jsx>{`
                .student-results {
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
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #667eea;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .filter-section {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .filter-section label {
                    font-weight: 600;
                    color: #374151;
                }

                .filter-section select {
                    padding: 0.5rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 6px;
                    font-size: 1rem;
                    cursor: pointer;
                }

                .filter-section select:focus {
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

                .results-container {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .results-table {
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                thead {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                th {
                    padding: 1rem;
                    text-align: left;
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                }

                td {
                    padding: 1rem;
                    border-bottom: 1px solid #e5e7eb;
                }

                tbody tr:hover {
                    background: #f9fafb;
                }

                .student-name {
                    font-weight: 600;
                    color: #1f2937;
                }

                .student-email {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .score {
                    font-weight: 700;
                    color: #374151;
                }

                .percentage {
                    font-weight: 700;
                    font-size: 1.125rem;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .status-badge.passed {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-badge.failed {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .performance-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .date {
                    color: #374151;
                    font-size: 0.875rem;
                }

                .time {
                    color: #9ca3af;
                    font-size: 0.75rem;
                }

                .badge-awarded {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #f59e0b;
                    font-weight: 600;
                }

                .award-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .award-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .award-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .no-badge {
                    color: #d1d5db;
                }

                @media (max-width: 1024px) {
                    .page-header {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .stats-summary {
                        width: 100%;
                        justify-content: space-between;
                    }
                }
            `}</style>
        </div>
    );
}

export default CourseStudentResults;
