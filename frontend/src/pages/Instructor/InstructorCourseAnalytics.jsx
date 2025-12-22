import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaDollarSign, FaChartLine, FaWallet, FaShoppingBag } from 'react-icons/fa';
import { getCourseAnalytics } from '../../services/api/instructorService';
import { toast } from 'react-toastify';

function InstructorCourseAnalytics() {
    const { courseId } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [courseId]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await getCourseAnalytics(courseId);
            setAnalytics(response.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading Course Analytics...</p>
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

    if (!analytics) return null;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="analytics-page">
            <h1 className="page-title">Course Analytics</h1>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon revenue">
                        <FaDollarSign />
                    </div>
                    <div className="stat-content">
                        <h3>Your Revenue</h3>
                        <p className="stat-number">${analytics.totalRevenue.toLocaleString()}</p>
                        <p className="stat-detail">Net earnings (after fees)</p>
                    </div>
                </div>

                <div className="stat-card sales">
                    <div className="stat-icon">
                        <FaShoppingBag />
                    </div>
                    <div className="stat-content">
                        <h3>Total Sales</h3>
                        <p className="stat-number">{analytics.totalSales}</p>
                        <p className="stat-detail">Total purchases</p>
                    </div>
                </div>

                <div className="stat-card gross">
                    <div className="stat-icon">
                        <FaWallet />
                    </div>
                    <div className="stat-content">
                        <h3>Gross Revenue</h3>
                        <p className="stat-number">${analytics.grossRevenue.toLocaleString()}</p>
                        <p className="stat-detail">Total before platform fees</p>
                    </div>
                </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="section-card">
                <h2><FaChartLine /> Monthly Revenue Trend</h2>
                <div className="chart-container">
                    {analytics.monthlyTrend && analytics.monthlyTrend.length > 0 ? (
                        analytics.monthlyTrend.map((item, index) => (
                            <div key={index} className="chart-bar">
                                <div
                                    className="chart-fill"
                                    style={{
                                        height: `${(item.revenue / Math.max(...analytics.monthlyTrend.map(m => m.revenue))) * 100}%`
                                    }}
                                >
                                    <span className="chart-tooltip">${item.revenue}</span>
                                </div>
                                <span className="chart-label">{monthNames[item._id - 1]}</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">No revenue data available yet.</p>
                    )}
                </div>
            </div>

            <style jsx>{`
                .analytics-page {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .page-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 2rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
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

                .stat-icon.revenue { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
                .stat-icon.sales { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
                .stat-icon.gross { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }

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
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .section-card h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 2rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .chart-container {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-around;
                    height: 300px;
                    padding: 2rem 0;
                    background: linear-gradient(to top, #f9fafb 0%, transparent 100%);
                    border-radius: 12px;
                }

                .chart-bar {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    max-width: 60px;
                    height: 100%;
                    justify-content: flex-end;
                }

                .chart-fill {
                    width: 100%;
                    background: linear-gradient(to top, #10b981, #34d399);
                    border-radius: 8px 8px 0 0;
                    min-height: 4px;
                    position: relative;
                    transition: height 0.5s ease;
                    cursor: pointer;
                }

                .chart-tooltip {
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1f2937;
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    opacity: 0;
                    transition: opacity 0.2s;
                    white-space: nowrap;
                }

                .chart-fill:hover .chart-tooltip {
                    opacity: 1;
                }

                .chart-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #6b7280;
                }

                .no-data {
                    width: 100%;
                    text-align: center;
                    color: #6b7280;
                    align-self: center;
                }
            `}</style>
        </div>
    );
}

export default InstructorCourseAnalytics;
