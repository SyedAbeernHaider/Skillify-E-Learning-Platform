import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileUpload, FaCheckCircle, FaClock, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAssignment, submitAssignment } from '../../services/api/assignmentService';

function SubmitAssignment() {
    const { courseId, sectionIndex, lectureIndex } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAssignment();
    }, []);

    const fetchAssignment = async () => {
        try {
            const sectionId = 'temp-section-id';
            const response = await getAssignment(courseId, lectureIndex, sectionId);
            setAssignment(response.data.assignment);
            setSubmission(response.data.submission);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load assignment');
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!submissionText && !file) {
            toast.error('Please provide either text submission or upload a file');
            return;
        }

        setSubmitting(true);
        try {
            const sectionId = 'temp-section-id';
            const formData = {
                sectionId,
                submissionText,
                submissionFile: file ? URL.createObjectURL(file) : null,
                fileName: file?.name,
                fileType: file?.type
            };

            await submitAssignment(courseId, lectureIndex, formData);
            toast.success('Assignment submitted successfully!');
            fetchAssignment(); // Refresh to show submission
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading assignment...</p>
                </div>
            </div>
        );
    }

    // If already submitted, show submission details
    if (submission) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Success Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 text-center">
                            <FaCheckCircle className="text-6xl mx-auto mb-4" />
                            <h2 className="text-3xl font-bold mb-2">Assignment Submitted!</h2>
                            <p className="text-xl">Your assignment has been submitted successfully</p>
                        </div>

                        {/* Submission Details */}
                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-6">Submission Details</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Submitted At:</span>
                                    <span className="font-semibold">
                                        {new Date(submission.submittedAt).toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${submission.status === 'graded'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {submission.status === 'graded' ? 'Graded' : 'Pending Review'}
                                    </span>
                                </div>

                                {submission.grade !== undefined && (
                                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                                        <span className="text-gray-600">Grade:</span>
                                        <span className="text-2xl font-bold text-purple-600">
                                            {submission.grade} / {assignment.maxPoints}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Submitted Content */}
                            {submission.submissionText && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Your Submission:</h4>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                            {submission.submissionText}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {submission.submissionFile && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Uploaded File:</h4>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <FaFileAlt className="text-purple-600 text-2xl" />
                                        <div className="flex-1">
                                            <p className="font-medium">{submission.fileName}</p>
                                            <p className="text-sm text-gray-500">{submission.fileType}</p>
                                        </div>
                                        <a
                                            href={submission.submissionFile}
                                            download={submission.fileName}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Feedback */}
                            {submission.feedback && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Instructor Feedback:</h4>
                                    <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
                                        <p className="text-gray-700">{submission.feedback}</p>
                                    </div>
                                </div>
                            )}

                            {/* Back Button */}
                            <button
                                onClick={() => navigate(`/student/course-player/${courseId}`)}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold"
                            >
                                Back to Course
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Assignment Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8">
                        <h1 className="text-3xl font-bold mb-2">{assignment?.title}</h1>
                        <p className="text-orange-100">{assignment?.description}</p>
                    </div>

                    {/* Assignment Info */}
                    <div className="p-8">
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <div className="flex items-center gap-2 text-orange-600 mb-2">
                                    <FaClock />
                                    <span className="font-semibold">Due Date</span>
                                </div>
                                <p className="text-gray-900 font-bold">
                                    {assignment?.dueDate
                                        ? new Date(assignment.dueDate).toLocaleDateString()
                                        : 'No deadline'
                                    }
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2 text-purple-600 mb-2">
                                    <FaFileAlt />
                                    <span className="font-semibold">Max Points</span>
                                </div>
                                <p className="text-gray-900 font-bold">
                                    {assignment?.maxPoints || 100}
                                </p>
                            </div>
                        </div>

                        {/* Submission Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Text Submission */}
                            {(assignment?.submissionType === 'text' || assignment?.submissionType === 'both') && (
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Text Submission
                                    </label>
                                    <textarea
                                        value={submissionText}
                                        onChange={(e) => setSubmissionText(e.target.value)}
                                        placeholder="Enter your submission here..."
                                        rows={10}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                    />
                                </div>
                            )}

                            {/* File Upload */}
                            {(assignment?.submissionType === 'file' || assignment?.submissionType === 'both') && (
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        File Upload
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer"
                                        >
                                            <FaFileUpload className="text-5xl text-gray-400 mx-auto mb-4" />
                                            {file ? (
                                                <div>
                                                    <p className="text-purple-600 font-semibold">{file.name}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-gray-600">Click to upload or drag and drop</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Max file size: 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/student/course-player/${courseId}`)}
                                    className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || (!submissionText && !file)}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default SubmitAssignment;
