import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCreditCard, FaLock, FaCheckCircle, FaPlay, FaStar } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const PaymentModal = ({ isOpen, onClose, course, onPaymentSuccess }) => {
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        billingAddress: ''
    });
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Confetti effect on success
    useEffect(() => {
        if (paymentSuccess) {
            const duration = 3000;
            const end = Date.now() + duration;

            const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

            (function frame() {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }, [paymentSuccess]);

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Format card number
        if (name === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (value.length > 19) return;
        }

        // Format expiry date
        if (name === 'expiryDate') {
            value = value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            if (value.length > 5) return;
        }

        // Format CVV
        if (name === 'cvv') {
            value = value.replace(/\D/g, '');
            if (value.length > 3) return;
        }

        setPaymentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate payment processing
        setTimeout(async () => {
            setProcessing(false);
            setPaymentSuccess(true);

            // Call success callback (this enrolls the user)
            await onPaymentSuccess();

            // Wait a bit for enrollment to complete, then redirect
            setTimeout(() => {
                navigate(`/student/courses/${course._id}/lectures`);
            }, 3000);
        }, 2000);
    };

    const handleStartLearning = () => {
        navigate(`/student/courses/${course._id}/lectures`);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {paymentSuccess ? (
                        // Enhanced Success Screen
                        <div className="p-8 text-center relative overflow-hidden">
                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 opacity-50"></div>

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
                                >
                                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                        <FaCheckCircle className="text-6xl text-white" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                                        🎉 Payment Successful!
                                    </h2>
                                    <p className="text-lg text-gray-700 mb-6">
                                        Welcome to <span className="font-bold text-purple-600">{course.title}</span>
                                    </p>
                                </motion.div>

                                {/* Course Info Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-green-100"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        {course.thumbnail && (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="text-left flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <FaStar className="text-yellow-400" />
                                                    {course.level}
                                                </span>
                                                <span>•</span>
                                                <span>{course.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="bg-purple-50 rounded-lg p-3">
                                            <p className="text-2xl font-bold text-purple-600">{course.sections?.length || 0}</p>
                                            <p className="text-xs text-gray-600">Sections</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <p className="text-2xl font-bold text-blue-600">{course.totalLectures || 0}</p>
                                            <p className="text-xs text-gray-600">Lectures</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-3">
                                            <p className="text-2xl font-bold text-green-600">∞</p>
                                            <p className="text-xs text-gray-600">Lifetime Access</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="space-y-3"
                                >
                                    <button
                                        onClick={handleStartLearning}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <FaPlay />
                                        Start Learning Now
                                    </button>

                                    <p className="text-sm text-gray-500">
                                        Redirecting to course in <span className="font-semibold text-purple-600">3 seconds</span>...
                                    </p>
                                </motion.div>

                                {/* Success Message */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
                                >
                                    <p className="text-sm text-green-800 font-medium">
                                        ✅ Enrollment confirmed • Receipt sent to your email
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white p-6 rounded-t-3xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Complete Your Purchase</h2>
                                        <p className="text-purple-100">🔒 Secure payment powered by Skillify</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                                    >
                                        <FaTimes size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Course Summary */}
                            <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-b">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="text-purple-600">📦</span> Order Summary
                                </h3>
                                <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">{course.title}</p>
                                        <p className="text-sm text-gray-600 mt-1">{course.category} • {course.level}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            ${course.price}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Form */}
                            <form onSubmit={handleSubmit} className="p-6 bg-white">
                                {/* Card Number */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        💳 Card Number
                                    </label>
                                    <div className="relative">
                                        <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={paymentData.cardNumber}
                                            onChange={handleChange}
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Card Name */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        👤 Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        name="cardName"
                                        value={paymentData.cardName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Expiry and CVV */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            📅 Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={paymentData.expiryDate}
                                            onChange={handleChange}
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            🔐 CVV
                                        </label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={paymentData.cvv}
                                            onChange={handleChange}
                                            placeholder="123"
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        🏠 Billing Address
                                    </label>
                                    <textarea
                                        name="billingAddress"
                                        value={paymentData.billingAddress}
                                        onChange={handleChange}
                                        placeholder="Enter your billing address"
                                        rows="3"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm resize-none"
                                        required
                                    />
                                </div>

                                {/* Security Notice */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <FaLock className="text-blue-600 mt-1 text-lg" />
                                        <div>
                                            <p className="text-sm font-bold text-blue-900 mb-1">
                                                🔒 Secure Payment
                                            </p>
                                            <p className="text-xs text-blue-700 leading-relaxed">
                                                Your payment information is encrypted and secure. This is a test payment gateway for demonstration purposes.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            <FaLock />
                                            Pay ${course.price} Securely
                                        </>
                                    )}
                                </button>

                                {/* Test Card Info */}
                                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl">
                                    <p className="text-xs font-bold text-yellow-900 mb-2 flex items-center gap-2">
                                        <span>⚠️</span> Test Mode - Use any card details
                                    </p>
                                    <p className="text-xs text-yellow-700 leading-relaxed">
                                        This is a demo payment gateway. You can enter any card details to test the enrollment process.
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
