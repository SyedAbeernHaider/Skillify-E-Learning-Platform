import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaCheckCircle, FaSpinner, FaHistory, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../config/api';
import CourseManagementSidebar from '../../../components/CourseManagementSidebar';

function CourseCertificates() {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, [courseId]);

    const fetchRequests = async () => {
        try {
            const response = await api.get(`/instructor/courses/${courseId}/certificates`);
            setRequests(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching certificate requests:', error);
            toast.error('Failed to load requests');
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        if (!window.confirm('Approve this request and send to Admin?')) return;

        try {
            await api.put(`/instructor/certificates/${requestId}/approve`);
            toast.success('Certificate request approved and sent to Admin');
            // Refresh list
            fetchRequests();
        } catch (error) {
            toast.error('Failed to approve request');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <CourseManagementSidebar />
                <div className="flex-1 ml-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <CourseManagementSidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">🎓 Certificate Requests</h1>
                        <p className="text-gray-600 mt-2">Manage student claims for course certificates</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Student</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Completion Date</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No certificate requests found.
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
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                        ${req.approvalStatus === 'pending_instructor' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                        ${req.approvalStatus === 'pending_admin' ? 'bg-blue-100 text-blue-700' : ''}
                                                        ${req.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' : ''}
                                                        ${req.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                                                    `}>
                                                        {req.approvalStatus.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {req.approvalStatus === 'pending_instructor' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleApprove(req._id)}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
                                                            >
                                                                <FaCheck /> Approve
                                                            </button>
                                                        </div>
                                                    )}
                                                    {req.approvalStatus === 'pending_admin' && (
                                                        <span className="text-sm text-gray-500 italic">Waiting for Admin</span>
                                                    )}
                                                    {req.approvalStatus === 'approved' && (
                                                        <a href={req.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                                            View Certificate
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseCertificates;
