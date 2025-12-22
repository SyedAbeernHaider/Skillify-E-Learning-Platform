import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCertificate, FaSpinner, FaDownload, FaCheckCircle, FaLock, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CoursePlayerLayout from '../../../components/CoursePlayerLayout';
import { getCertificateEligibility, requestCertificate as requestCertApi } from '../../../services/api/studentService';

function CourseCertificate() {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [eligibility, setEligibility] = useState(null);
    const [requestLoading, setRequestLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getCertificateEligibility(courseId);
            if (response.success) {
                setEligibility(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch certificate eligibility', error);
            toast.error('Failed to load certificate info');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestCertificate = async () => {
        try {
            setRequestLoading(true);
            const response = await requestCertApi(courseId);
            if (response.success) {
                toast.success('Certificate request submitted!');
                fetchData(); // Refresh data
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request certificate');
        } finally {
            setRequestLoading(false);
        }
    };

    const downloadCertificate = () => {
        if (eligibility?.certificate?.certificateUrl) {
            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = `${eligibility.certificate.certificateUrl}?t=${Date.now()}`;
            link.download = `certificate-${eligibility.certificate.certificateNumber || 'download'}.png`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            toast.info('Certificate not available for download yet.');
        }
    };

    if (loading) {
        return (
            <CoursePlayerLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <FaSpinner className="animate-spin text-4xl text-purple-600" />
                </div>
            </CoursePlayerLayout>
        );
    }

    const { progressPercentage, totalQuizzes, completedQuizzes, isContentLocked, certificate, isEligible, lastQuizPassed } = eligibility || {};

    return (
        <CoursePlayerLayout>
            <div className="course-certificate">
                <h1 className="page-title">🎓 Course Certificate</h1>

                {/* Progress Section */}
                <div className="progress-card">
                    <h2>Course Completion Progress</h2>
                    <div className="quiz-stats">
                        <p>Completed Quizzes: <strong>{completedQuizzes || 0} / {totalQuizzes || 0}</strong></p>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progressPercentage || 0}%` }}>
                            <span className="progress-text">{Math.round(progressPercentage || 0)}%</span>
                        </div>
                    </div>
                    <p className="progress-info">
                        {progressPercentage >= 100
                            ? '✅ Congratulations! You have completed all quizzes.'
                            : `📚 Complete ${(totalQuizzes || 0) - (completedQuizzes || 0)} more quiz${((totalQuizzes || 0) - (completedQuizzes || 0)) !== 1 ? 'zes' : ''} to earn your certificate.`}
                    </p>
                </div>

                {/* Certificate Section */}
                {certificate ? (
                    <div className="certificate-card">
                        {certificate.approvalStatus === 'approved' ? (
                            <>
                                <div className="certificate-preview">
                                    {certificate.certificateUrl ? (
                                        <img
                                            src={`${certificate.certificateUrl}?t=${Date.now()}`}
                                            alt="Certificate"
                                            className="certificate-image"
                                            style={{
                                                width: '100%',
                                                maxWidth: '800px',
                                                height: 'auto',
                                                border: '2px solid #667eea',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    ) : (
                                        <div className="certificate-border">
                                            <div className="certificate-content">
                                                <FaCertificate className="certificate-icon" />
                                                <h2>Certificate of Completion</h2>
                                                <p className="certificate-text">This is to certify that</p>
                                                <h3 className="student-name">{certificate.student?.firstName || 'Student'} {certificate.student?.lastName || ''}</h3>
                                                <p className="certificate-text">has successfully completed</p>
                                                <h4 className="course-name">{certificate.course?.title || 'Course Title'}</h4>
                                                <div className="certificate-footer">
                                                    <div>
                                                        <p className="label">Date</p>
                                                        <p className="value">{new Date(certificate.issueDate || certificate.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    {certificate.certificateNumber && (
                                                        <div>
                                                            <p className="label">Certificate ID</p>
                                                            <p className="value">{certificate.certificateNumber}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button className="download-btn" onClick={downloadCertificate}>
                                    <FaDownload /> Download / View Certificate
                                </button>
                            </>
                        ) : (
                            <div className="pending-state">
                                <FaClock className="text-6xl text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Request Pending</h3>
                                <div className="bg-yellow-50 p-4 rounded-lg inline-block border border-yellow-200">
                                    <p className="text-yellow-700 font-semibold">
                                        Status: {certificate.approvalStatus.replace('_', ' ').toUpperCase()}
                                    </p>
                                </div>
                                <p className="text-gray-600 mt-4 max-w-md mx-auto">
                                    Your certificate request has been submitted.
                                    {certificate.approvalStatus === 'pending_instructor'
                                        ? ' The instructor needs to approve it first.'
                                        : ' The administrator is reviewing your request.'}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    isEligible ? (
                        <div className="request-card">
                            <FaCertificate className="request-icon" />
                            <h3>Ready to Get Your Certificate!</h3>
                            <p>You've completed all course requirements. Request your certificate now.</p>
                            <button
                                className="request-btn"
                                onClick={handleRequestCertificate}
                                disabled={requestLoading}
                            >
                                {requestLoading ? (
                                    <><FaSpinner className="animate-spin" /> Requesting...</>
                                ) : (
                                    <><FaCertificate /> Request Certificate</>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="locked-card">
                            <FaLock className="locked-icon" />
                            <h3>Certificate Locked</h3>
                            <p>Complete the course to unlock your certificate</p>
                            <div className="requirements">
                                <div className="requirement">
                                    <FaCheckCircle className={completedQuizzes >= totalQuizzes ? 'text-green-500' : 'text-gray-400'} />
                                    <span>Complete all quizzes ({completedQuizzes}/{totalQuizzes})</span>
                                </div>
                                <div className="requirement">
                                    <FaCheckCircle className={lastQuizPassed ? 'text-green-500' : 'text-gray-400'} />
                                    <span>Pass the last quiz</span>
                                </div>
                                <div className="requirement">
                                    <FaCheckCircle className={isContentLocked ? 'text-green-500' : 'text-gray-400'} />
                                    <span>Instructor finishes course</span>
                                </div>
                            </div>
                        </div>
                    )
                )}

                <style jsx>{`
                    .course-certificate {
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 2rem;
                    }

                    .page-title {
                        font-size: 2.5rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 2rem;
                        text-align: center;
                    }

                    .progress-card, .certificate-card, .request-card, .locked-card {
                        background: white;
                        border-radius: 16px;
                        padding: 2rem;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        margin-bottom: 2rem;
                    }

                    .progress-card h2 {
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin-bottom: 1rem;
                        color: #1f2937;
                    }

                    .quiz-stats {
                        margin-bottom: 1rem;
                        padding: 0.75rem;
                        background: #f3f4f6;
                        border-radius: 8px;
                    }

                    .quiz-stats p {
                        margin: 0;
                        color: #4b5563;
                    }

                    .progress-bar-container {
                        width: 100%;
                        height: 40px;
                        background: #e5e7eb;
                        border-radius: 20px;
                        overflow: hidden;
                        margin-bottom: 1rem;
                    }

                    .progress-bar {
                        height: 100%;
                        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: width 0.5s ease;
                    }

                    .progress-text {
                        color: white;
                        font-weight: 600;
                        font-size: 1rem;
                    }

                    .progress-info {
                        text-align: center;
                        color: #6b7280;
                        font-size: 1rem;
                    }

                    .request-card, .locked-card {
                        text-align: center;
                    }

                    .request-icon, .locked-icon {
                        font-size: 4rem;
                        color: #667eea;
                        margin-bottom: 1rem;
                    }

                    .locked-icon {
                        color: #9ca3af;
                    }

                    .request-card h3, .locked-card h3 {
                        font-size: 1.75rem;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                        color: #1f2937;
                    }

                    .request-card p, .locked-card p {
                        color: #6b7280;
                        margin-bottom: 1.5rem;
                    }

                    .request-btn {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 1rem 2rem;
                        border-radius: 12px;
                        font-size: 1.125rem;
                        font-weight: 600;
                        border: none;
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        transition: transform 0.2s, box-shadow 0.2s;
                    }

                    .request-btn:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
                    }

                    .request-btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    .requirements {
                        margin-top: 1.5rem;
                        text-align: left;
                        max-width: 400px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .requirement {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.75rem;
                        margin-bottom: 0.5rem;
                        background: #f9fafb;
                        border-radius: 8px;
                    }

                    .requirement svg {
                        font-size: 1.25rem;
                    }

                    .download-btn {
                        width: 100%;
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        padding: 1rem;
                        border-radius: 12px;
                        font-size: 1.125rem;
                        font-weight: 600;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        margin-top: 1.5rem;
                        transition: transform 0.2s;
                    }

                    .download-btn:hover {
                        transform: translateY(-2px);
                    }

                    .pending-state {
                        text-align: center;
                        padding: 2rem;
                    }

                    .certificate-preview {
                        margin-bottom: 1.5rem;
                    }

                    .certificate-border {
                        border: 8px solid #667eea;
                        border-radius: 12px;
                        padding: 2rem;
                        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                    }

                    .certificate-content {
                        text-align: center;
                    }

                    .certificate-icon {
                        font-size: 4rem;
                        color: #667eea;
                        margin-bottom: 1rem;
                    }

                    .certificate-content h2 {
                        font-size: 2rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin-bottom: 1rem;
                    }

                    .certificate-text {
                        color: #6b7280;
                        margin: 0.5rem 0;
                    }

                    .student-name {
                        font-size: 1.75rem;
                        font-weight: 700;
                        color: #667eea;
                        margin: 1rem 0;
                    }

                    .course-name {
                        font-size: 1.5rem;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 1rem 0;
                    }

                    .certificate-footer {
                        display: flex;
                        justify-content: space-around;
                        margin-top: 2rem;
                        padding-top: 1.5rem;
                        border-top: 2px solid #d1d5db;
                    }

                    .certificate-footer .label {
                        font-size: 0.875rem;
                        color: #9ca3af;
                        margin-bottom: 0.25rem;
                    }

                    .certificate-footer .value {
                        font-size: 1rem;
                        font-weight: 600;
                        color: #1f2937;
                    }

                    @media (max-width: 768px) {
                        .course-certificate {
                            padding: 1rem;
                        }

                        .page-title {
                            font-size: 2rem;
                        }
                    }
                `}</style>
            </div>
        </CoursePlayerLayout>
    );
}

export default CourseCertificate;
