import { useEffect, useState } from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getPendingInstructors, approveInstructor, rejectInstructor } from '../../services/api/adminService';

function InstructorApprovals() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchPendingInstructors();
    }, []);

    const fetchPendingInstructors = async () => {
        try {
            setLoading(true);
            const response = await getPendingInstructors();
            console.log('📥 Pending instructors response:', response);
            setPending(response.data || []);
        } catch (error) {
            console.error('❌ Error fetching pending instructors:', error);
            toast.error('Failed to load pending instructors');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this instructor?')) {
            return;
        }

        try {
            setProcessingId(id);
            await approveInstructor(id);
            toast.success('Instructor approved successfully!');
            fetchPendingInstructors();
        } catch (error) {
            console.error('❌ Error approving instructor:', error);
            toast.error('Failed to approve instructor');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt('Please provide a reason for rejection:');
        if (!reason) {
            return;
        }

        try {
            setProcessingId(id);
            await rejectInstructor(id, reason);
            toast.success('Instructor application rejected');
            fetchPendingInstructors();
        } catch (error) {
            console.error('❌ Error rejecting instructor:', error);
            toast.error('Failed to reject instructor');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-6xl text-purple-600" />
            </div>
        );
    }

    return (
        <div className="instructor-approvals-page">
            <div className="page-header">
                <h1 className="page-title">👨‍🏫 Instructor Approvals</h1>
                <p className="page-subtitle">Review and approve instructor applications</p>
            </div>

            {pending.length === 0 ? (
                <div className="empty-state">
                    <FaCheckCircle className="empty-icon" />
                    <h3>No Pending Applications</h3>
                    <p>All instructor applications have been reviewed</p>
                </div>
            ) : (
                <div className="applications-grid">
                    {pending.map((instructor) => (
                        <div key={instructor._id} className="application-card">
                            {/* Header */}
                            <div className="card-header">
                                <div>
                                    <h3 className="instructor-name">
                                        {instructor.profile?.name || `${instructor.firstName} ${instructor.lastName}`}
                                    </h3>
                                    <p className="instructor-email">{instructor.email}</p>
                                    <p className="application-date">
                                        Applied: {new Date(instructor.instructorApplicationDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => handleApprove(instructor._id)}
                                        disabled={processingId === instructor._id}
                                        className="btn-approve"
                                    >
                                        {processingId === instructor._id ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : (
                                            <>
                                                <FaCheckCircle /> Approve
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleReject(instructor._id)}
                                        disabled={processingId === instructor._id}
                                        className="btn-reject"
                                    >
                                        {processingId === instructor._id ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : (
                                            <>
                                                <FaTimesCircle /> Reject
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Profile Details */}
                            {instructor.profile && (
                                <div className="profile-details">
                                    <h4 className="section-title">Profile Information</h4>

                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Location</span>
                                            <span className="detail-value">
                                                {instructor.profile.city}, {instructor.profile.country}
                                            </span>
                                        </div>

                                        <div className="detail-item">
                                            <span className="detail-label">Phone</span>
                                            <span className="detail-value">{instructor.profile.phoneNumber}</span>
                                        </div>

                                        <div className="detail-item full-width">
                                            <span className="detail-label">Education</span>
                                            <span className="detail-value">{instructor.profile.education}</span>
                                        </div>

                                        <div className="detail-item full-width">
                                            <span className="detail-label">Experience</span>
                                            <span className="detail-value">{instructor.profile.experience}</span>
                                        </div>

                                        <div className="detail-item full-width">
                                            <span className="detail-label">Expertise</span>
                                            <div className="expertise-tags">
                                                {instructor.profile.expertise?.map((skill, idx) => (
                                                    <span key={idx} className="expertise-tag">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {instructor.profile.certificateUrls?.length > 0 && instructor.profile.certificateUrls[0] && (
                                            <div className="detail-item full-width">
                                                <span className="detail-label">Certificates</span>
                                                <div className="certificate-links">
                                                    {instructor.profile.certificateUrls.map((url, idx) => (
                                                        url && (
                                                            <a
                                                                key={idx}
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="certificate-link"
                                                            >
                                                                📜 Certificate {idx + 1}
                                                            </a>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .instructor-approvals-page {
                    padding: 2rem;
                    max-width: 1400px;
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
                    background-clip: text;
                    margin: 0;
                }

                .page-subtitle {
                    color: #6b7280;
                    font-size: 1.125rem;
                    margin: 0.5rem 0 0 0;
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                .empty-icon {
                    font-size: 4rem;
                    color: #10b981;
                    margin-bottom: 1rem;
                }

                .empty-state h3 {
                    font-size: 1.5rem;
                    color: #1f2937;
                    margin: 0 0 0.5rem 0;
                }

                .empty-state p {
                    color: #6b7280;
                    margin: 0;
                }

                .applications-grid {
                    display: grid;
                    gap: 2rem;
                }

                .application-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .application-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
                }

                .card-header {
                    padding: 2rem;
                    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                    border-bottom: 2px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 2rem;
                }

                .instructor-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 0.5rem 0;
                }

                .instructor-email {
                    color: #6b7280;
                    margin: 0 0 0.25rem 0;
                }

                .application-date {
                    color: #9ca3af;
                    font-size: 0.875rem;
                    margin: 0;
                }

                .action-buttons {
                    display: flex;
                    gap: 1rem;
                }

                .btn-approve,
                .btn-reject {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                .btn-approve {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                }

                .btn-approve:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                }

                .btn-reject {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                }

                .btn-reject:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
                }

                .btn-approve:disabled,
                .btn-reject:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .profile-details {
                    padding: 2rem;
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #764ba2;
                    margin: 0 0 1.5rem 0;
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .detail-item.full-width {
                    grid-column: 1 / -1;
                }

                .detail-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .detail-value {
                    color: #1f2937;
                    font-size: 1rem;
                    line-height: 1.6;
                }

                .expertise-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .expertise-tag {
                    padding: 0.5rem 1rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .certificate-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }

                .certificate-link {
                    padding: 0.5rem 1rem;
                    background: #eff6ff;
                    color: #2563eb;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .certificate-link:hover {
                    background: #dbeafe;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .card-header {
                        flex-direction: column;
                    }

                    .action-buttons {
                        width: 100%;
                        flex-direction: column;
                    }

                    .btn-approve,
                    .btn-reject {
                        width: 100%;
                        justify-content: center;
                    }

                    .details-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default InstructorApprovals;
