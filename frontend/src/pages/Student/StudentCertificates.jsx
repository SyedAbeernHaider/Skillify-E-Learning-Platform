import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaSpinner, FaDownload, FaEye, FaCheckCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/DashboardLayout';
import { getCertificates, requestCertificate } from '../../services/api/studentService';

function StudentCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const response = await getCertificates();
            setCertificates(response.data || []);
        } catch (error) {
            toast.error('Failed to load certificates');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestCertificate = async (courseId) => {
        try {
            setRequesting(courseId);
            await requestCertificate(courseId);
            toast.success('Certificate requested successfully!');
            fetchCertificates();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request certificate');
        } finally {
            setRequesting(null);
        }
    };

    const handleDownload = (certificate) => {
        if (certificate.certificateUrl) window.open(certificate.certificateUrl, '_blank');
        else toast.info('Certificate not available for download');
    };

    const handleView = (certificate) => {
        if (certificate.certificateUrl) window.open(certificate.certificateUrl, '_blank');
        else toast.info('Certificate preview not available');
    };

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your certificates...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const approvedCertificates = certificates.filter(cert => cert.approvalStatus === 'approved');
    const pendingCertificates = certificates.filter(cert =>
        cert.approvalStatus === 'pending' ||
        cert.approvalStatus === 'pending_instructor' ||
        cert.approvalStatus === 'pending_admin'
    );

    return (
        <DashboardLayout role="student">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            My Certificates 📜
                        </h1>
                        <p className="text-gray-600">
                            You have {approvedCertificates.length} approved certificate{approvedCertificates.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaCheckCircle className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{approvedCertificates.length}</p>
                            <p className="text-sm opacity-90">Approved Certificates</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaClock className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{pendingCertificates.length}</p>
                            <p className="text-sm opacity-90">Pending Approval</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <FaCertificate className="text-4xl mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{certificates.length}</p>
                            <p className="text-sm opacity-90">Total Certificates</p>
                        </motion.div>
                    </div>

                    {/* Approved Certificates */}
                    {approvedCertificates.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Approved Certificates</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {approvedCertificates.map((certificate, index) => (
                                    <motion.div
                                        key={certificate._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                                    >
                                        {/* Certificate Preview */}
                                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white text-center">
                                            <FaCertificate className="text-6xl mx-auto mb-4 opacity-80" />
                                            <h3 className="text-xl font-bold mb-2">Certificate of Completion</h3>
                                            <p className="text-sm opacity-90">{certificate.course?.title || 'Course Title'}</p>
                                        </div>

                                        {/* Certificate Details */}
                                        <div className="p-6">
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 mb-1">Issued Date</p>
                                                <p className="font-semibold text-gray-800">
                                                    {new Date(certificate.issuedDate || certificate.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {certificate.certificateNumber && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-600 mb-1">Certificate ID</p>
                                                    <p className="font-mono text-sm text-gray-800">{certificate.certificateNumber}</p>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleView(certificate)}
                                                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                                                >
                                                    <FaEye /> View
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(certificate)}
                                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                                                >
                                                    <FaDownload /> Download
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pending Certificates */}
                    {pendingCertificates.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Approval</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pendingCertificates.map((certificate, index) => (
                                    <motion.div
                                        key={certificate._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <FaClock className="text-3xl text-yellow-500" />
                                                <div>
                                                    <h3 className="font-bold text-gray-800">{certificate.course?.title || 'Course Title'}</h3>
                                                    <p className="text-sm text-gray-600">Awaiting admin approval</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Requested on {new Date(certificate.createdAt).toLocaleDateString()}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {certificates.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                            <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Certificates Yet</h3>
                            <p className="text-gray-600 mb-6">
                                Complete courses to earn certificates!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default StudentCertificates;
