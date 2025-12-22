import { useEffect, useState } from 'react';
import { FaDollarSign, FaChartLine, FaArrowUp, FaArrowDown, FaMoneyBillWave, FaPercentage, FaUsers, FaBook } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getRevenueStats } from '../../services/api/adminService';
import axios from 'axios';

function AdminRevenue() {
    const [revenue, setRevenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchRevenue();
        fetchTransactions();
    }, []);

    const fetchRevenue = async () => {
        try {
            setLoading(true);
            const response = await getRevenueStats();
            console.log('Revenue response:', response.data);
            // Backend returns data.overall with the stats
            const revenueData = response.data?.overall || {};
            setRevenue({
                totalRevenue: revenueData.totalRevenue || 0,
                platformRevenue: revenueData.platformRevenue || 0,
                instructorRevenue: revenueData.instructorRevenue || 0,
                totalTransactions: revenueData.totalTransactions || 0,
                courseSales: revenueData.totalRevenue || 0, // Using total as course sales for now
                subscriptionRevenue: 0, // Not in current backend
                platformFee: revenueData.platformRevenue || 0,
                monthlyRevenue: response.data?.monthlyRevenue || []
            });
        } catch (error) {
            toast.error('Failed to load revenue data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:1000/api/admin/revenue', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Transactions response:', response.data);

            // Get actual revenue records for transactions
            const revenueRecords = await axios.get('http://localhost:1000/api/admin/revenue/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(() => ({ data: { data: [] } }));

            setTransactions(revenueRecords.data?.data || []);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            setTransactions([]);
        }
    };

    if (loading) {
        return (
            <div className="revenue-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading Revenue Data...</p>
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
                        border-top: 4px solid #10b981;
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

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="revenue-page">
            <h1 className="page-title">💰 Revenue Analytics</h1>

            {/* Overview Cards */}
            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">
                        <FaDollarSign />
                    </div>
                    <div className="stat-content">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">${(revenue.totalRevenue || 0).toLocaleString()}</p>
                        <p className="stat-detail">All-time earnings</p>
                    </div>
                </div>

                <div className="stat-card platform">
                    <div className="stat-icon">
                        <FaMoneyBillWave />
                    </div>
                    <div className="stat-content">
                        <h3>Platform Revenue</h3>
                        <p className="stat-number">${(revenue.platformRevenue || 0).toLocaleString()}</p>
                        <p className="stat-detail">Platform fees collected</p>
                    </div>
                </div>

                <div className="stat-card instructor">
                    <div className="stat-icon">
                        <FaUsers />
                    </div>
                    <div className="stat-content">
                        <h3>Instructor Revenue</h3>
                        <p className="stat-number">${(revenue.instructorRevenue || 0).toLocaleString()}</p>
                        <p className="stat-detail">Paid to instructors</p>
                    </div>
                </div>

                <div className="stat-card courses">
                    <div className="stat-icon">
                        <FaBook />
                    </div>
                    <div className="stat-content">
                        <h3>Course Sales</h3>
                        <p className="stat-number">${(revenue.courseSales || 0).toLocaleString()}</p>
                        <p className="stat-detail">From course enrollments</p>
                    </div>
                </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="section-card">
                <h2><FaChartLine /> Revenue Breakdown</h2>
                <div className="breakdown-grid">
                    <div className="breakdown-item">
                        <div className="breakdown-header">
                            <span className="breakdown-label">Course Sales</span>
                            <span className="breakdown-value">${(revenue.courseSales || 0).toLocaleString()}</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill course-sales"
                                style={{ width: `${revenue.totalRevenue ? (revenue.courseSales / revenue.totalRevenue * 100) : 0}%` }}
                            ></div>
                        </div>
                        <span className="breakdown-percentage">
                            {revenue.totalRevenue ? ((revenue.courseSales / revenue.totalRevenue * 100).toFixed(1)) : 0}%
                        </span>
                    </div>



                    <div className="breakdown-item">
                        <div className="breakdown-header">
                            <span className="breakdown-label">Platform Fee</span>
                            <span className="breakdown-value">${(revenue.platformFee || 0).toLocaleString()}</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill platform-fee"
                                style={{ width: `${revenue.totalRevenue ? (revenue.platformFee / revenue.totalRevenue * 100) : 0}%` }}
                            ></div>
                        </div>
                        <span className="breakdown-percentage">
                            {revenue.totalRevenue ? ((revenue.platformFee / revenue.totalRevenue * 100).toFixed(1)) : 0}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Monthly Revenue Trend */}
            {revenue.monthlyRevenue && revenue.monthlyRevenue.length > 0 && (
                <div className="section-card">
                    <h2><FaChartLine /> Monthly Revenue Trend</h2>
                    <div className="chart-container">
                        {revenue.monthlyRevenue.map((item, index) => (
                            <div key={index} className="chart-bar">
                                <div
                                    className="chart-fill"
                                    style={{
                                        height: `${(item.total / Math.max(...revenue.monthlyRevenue.map(m => m.total))) * 100}%`
                                    }}
                                >
                                    <span className="chart-value">${item.total.toLocaleString()}</span>
                                </div>
                                <span className="chart-label">{monthNames[item.month - 1]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            {transactions && transactions.length > 0 && (
                <div className="section-card">
                    <h2><FaDollarSign /> Recent Transactions</h2>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Course</th>
                                    <th>Student</th>
                                    <th>Amount</th>
                                    <th>Platform Fee</th>
                                    <th>Instructor</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 10).map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                        <td className="course-name">{transaction.course?.title || 'N/A'}</td>
                                        <td>{transaction.student?.firstName} {transaction.student?.lastName}</td>
                                        <td className="amount">${transaction.totalAmount}</td>
                                        <td className="platform-fee">${transaction.platformFee}</td>
                                        <td className="instructor-amount">${transaction.instructorAmount}</td>
                                        <td>
                                            <span className={`status-badge ${transaction.status}`}>
                                                {transaction.status || 'completed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            <div className="summary-grid">
                <div className="summary-card">
                    <FaPercentage className="summary-icon" />
                    <div>
                        <p className="summary-label">Platform Fee Rate</p>
                        <p className="summary-value">
                            {revenue.totalRevenue ? ((revenue.platformFee / revenue.totalRevenue * 100).toFixed(1)) : 0}%
                        </p>
                    </div>
                </div>
                <div className="summary-card">
                    <FaUsers className="summary-icon" />
                    <div>
                        <p className="summary-label">Total Transactions</p>
                        <p className="summary-value">{transactions.length}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <FaDollarSign className="summary-icon" />
                    <div>
                        <p className="summary-label">Average Transaction</p>
                        <p className="summary-value">
                            ${transactions.length ? (revenue.totalRevenue / transactions.length).toFixed(2) : 0}
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .revenue-page {
                    padding: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .page-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 2rem;
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

                .stat-card.total .stat-icon {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                }

                .stat-card.platform .stat-icon {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                }

                .stat-card.instructor .stat-icon {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                }

                .stat-card.courses .stat-icon {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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

                .breakdown-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .breakdown-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .breakdown-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .breakdown-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #4b5563;
                }

                .breakdown-value {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                }

                .progress-bar {
                    height: 32px;
                    background: #f3f4f6;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                }

                .progress-fill {
                    height: 100%;
                    transition: width 0.5s ease;
                    border-radius: 8px;
                }

                .progress-fill.course-sales {
                    background: linear-gradient(90deg, #10b981, #059669);
                }

                .progress-fill.subscription {
                    background: linear-gradient(90deg, #3b82f6, #2563eb);
                }

                .progress-fill.platform-fee {
                    background: linear-gradient(90deg, #8b5cf6, #7c3aed);
                }

                .breakdown-percentage {
                    font-size: 0.875rem;
                    color: #6b7280;
                    font-weight: 600;
                }

                .chart-container {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-around;
                    height: 300px;
                    gap: 1rem;
                    padding: 1rem;
                    background: linear-gradient(to top, #f9fafb 0%, transparent 100%);
                    border-radius: 12px;
                }

                .chart-bar {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .chart-fill {
                    width: 100%;
                    background: linear-gradient(to top, #10b981, #34d399);
                    border-radius: 8px 8px 0 0;
                    min-height: 30px;
                    transition: height 0.5s ease;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 0.5rem;
                    position: relative;
                }

                .chart-value {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: white;
                }

                .chart-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #6b7280;
                }

                .table-container {
                    overflow-x: auto;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .data-table thead {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

                .course-name {
                    font-weight: 600;
                    color: #1f2937;
                }

                .amount {
                    font-weight: 700;
                    color: #10b981;
                }

                .platform-fee {
                    font-weight: 600;
                    color: #3b82f6;
                }

                .instructor-amount {
                    font-weight: 600;
                    color: #8b5cf6;
                }

                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .status-badge.completed {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-badge.pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                }

                .summary-card {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .summary-icon {
                    font-size: 2rem;
                    color: #10b981;
                }

                .summary-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }

                .summary-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}

export default AdminRevenue;
