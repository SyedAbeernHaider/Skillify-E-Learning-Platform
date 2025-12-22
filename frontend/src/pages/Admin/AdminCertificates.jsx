import { useState, useEffect } from 'react';
import { FaUser, FaCheckCircle, FaSpinner, FaHistory, FaCheck, FaTimes, FaCertificate } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../config/api';

function AdminCertificates() {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/admin/certificates/pending');
            setRequests(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching certificate requests:', error);
            toast.error('Failed to load requests');
            setLoading(false);
        }
    };

    const handleGenerate = async (requestId) => {
        setProcessingId(requestId);
        try {
            await api.post(`/admin/certificates/${requestId}/generate`);
            toast.success('Certificate generated and sent to student!');

            // Remove from list
            setRequests(requests.filter(r => r._id !== requestId));
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate certificate');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">🎓 Certificate Issuance</h1>
                <p className="text-gray-600 mt-2">Generate and issue certificates for approved students</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Student</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Course</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Instructor</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Approved Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No pending certificate requests.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                    {req.student.profileImage ? (
                                                        <img src={req.student.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <FaUser />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{req.student.firstName} {req.student.lastName}</p>
                                                    <p className="text-sm text-gray-500">{req.student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {req.course.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {req.instructor.firstName} {req.instructor.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {req.approvalDate ? new Date(req.approvalDate).toLocaleDateString() : 'Pending'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleGenerate(req._id)}
                                                disabled={processingId === req._id}
                                                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition
                                                    ${processingId === req._id
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm'
                                                    }`}
                                            >
                                                {processingId === req._id ? (
                                                    <FaSpinner className="animate-spin" />
                                                ) : (
                                                    <FaCertificate />
                                                )}
                                                {processingId === req._id ? 'Generating...' : 'Issue Certificate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminCertificates;
