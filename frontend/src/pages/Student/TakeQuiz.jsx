import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getQuizBySection, submitEmbeddedQuiz } from '../../services/api/studentService';

function TakeQuiz() {
    const { courseId, sectionIndex, lectureIndex } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [results, setResults] = useState(null);
    const [isLastQuiz, setIsLastQuiz] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && !results) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && quiz && !results) {
            handleSubmit();
        }
    }, [timeLeft, results]);

    const fetchQuiz = async () => {
        try {
            const response = await getQuizBySection(courseId, sectionIndex);
            setQuiz(response.data);
            setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
            setAnswers(new Array(response.data.questions.length).fill(null));
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load quiz');
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        // Check if all questions are answered
        if (answers.includes(null)) {
            toast.warning('Please answer all questions before submitting');
            return;
        }

        setSubmitting(true);
        try {
            const response = await submitEmbeddedQuiz(courseId, sectionIndex, {
                answers
            });

            setResults(response);
            setIsLastQuiz(response.isLastQuiz || false); // Store whether this is the last quiz
            toast.success('Quiz submitted successfully!');

            // Check for certificate? Backend handles it.
        } catch (error) {
            toast.error('Failed to submit quiz');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (results) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Results Header */}
                        <div className={`p-8 text-center ${results.passed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-red-500 to-pink-500'
                            } text-white`}>
                            <div className="text-6xl mb-4">
                                {results.passed ? '🎉' : '😔'}
                            </div>
                            <h2 className="text-3xl font-bold mb-2">
                                {results.passed ? 'Congratulations!' : 'Keep Trying!'}
                            </h2>
                            <p className="text-xl">
                                {results.passed ? 'You passed the quiz!' : 'You didn\'t pass this time'}
                            </p>
                        </div>

                        {/* Score Card */}
                        <div className="p-8">
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-6 bg-purple-50 rounded-lg">
                                    <div className="text-3xl font-bold text-purple-600">
                                        {results.percentage}%
                                    </div>
                                    <div className="text-gray-600 mt-2">Score</div>
                                </div>
                                <div className="text-center p-6 bg-green-50 rounded-lg">
                                    <div className="text-3xl font-bold text-green-600">
                                        {results.correctAnswers}
                                    </div>
                                    <div className="text-gray-600 mt-2">Correct</div>
                                </div>
                                <div className="text-center p-6 bg-red-50 rounded-lg">
                                    <div className="text-3xl font-bold text-red-600">
                                        {results.totalQuestions - results.correctAnswers}
                                    </div>
                                    <div className="text-gray-600 mt-2">Wrong</div>
                                </div>
                            </div>

                            {/* Question Breakdown */}
                            <h3 className="text-2xl font-bold mb-4">Question Breakdown</h3>
                            <div className="space-y-4">
                                {results.answers.map((answer, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg border-l-4 ${answer.isCorrect
                                            ? 'bg-green-50 border-green-500'
                                            : 'bg-red-50 border-red-500'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {answer.isCorrect ? (
                                                <FaCheckCircle className="text-green-600 text-xl mt-1" />
                                            ) : (
                                                <FaTimesCircle className="text-red-600 text-xl mt-1" />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    Question {index + 1}
                                                </h4>
                                                <p className="text-gray-700 mb-3">
                                                    {answer.questionText}
                                                </p>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">Your Answer: </span>
                                                        <span className={answer.isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                                            Option {String.fromCharCode(65 + answer.selectedAnswer)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Correct Answer: </span>
                                                        <span className="text-green-600 font-semibold">
                                                            Option {String.fromCharCode(65 + answer.correctAnswer)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={() => navigate(`/student/course-player/${courseId}`)}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold"
                                >
                                    Back to Course
                                </button>
                                {/* Only show retry button if student failed AND it's the last quiz */}
                                {!results.passed && isLastQuiz && (
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold"
                                    >
                                        Try Again
                                    </button>
                                )}
                            </div>

                            {/* Informative message for failed non-last quizzes */}
                            {!results.passed && !isLastQuiz && (
                                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                                    <p className="text-yellow-800 font-medium">
                                        ⚠️ You didn't pass this quiz, but you can continue with the course.
                                        However, you'll need to pass all quizzes to earn your certificate.
                                    </p>
                                </div>
                            )}

                            {/* Message for passed quiz */}
                            {results.passed && !isLastQuiz && (
                                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                    <p className="text-green-800 font-medium">
                                        ✅ Great job! Continue to the next section to complete the course.
                                    </p>
                                </div>
                            )}

                            {/* Message for last quiz passed */}
                            {results.passed && isLastQuiz && (
                                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                                    <p className="text-blue-800 font-medium">
                                        🎓 Congratulations! You've completed all quizzes. Check the Certificate section in the course player to request your certificate.
                                    </p>
                                </div>
                            )}

                            {/* Message for last quiz failed */}
                            {!results.passed && isLastQuiz && (
                                <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                                    <p className="text-orange-800 font-medium">
                                        📚 This is the final quiz. You can retry as many times as needed to pass and earn your certificate.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Quiz Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {quiz?.title || 'Quiz'}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {quiz?.description || 'Answer all questions to complete the quiz'}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className={`text-4xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-purple-600'
                                }`}>
                                <FaClock className="inline mb-2" />
                                <div>{formatTime(timeLeft)}</div>
                            </div>
                            <p className="text-sm text-gray-600">Time Left</p>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {quiz?.questions.map((question, qIndex) => (
                        <motion.div
                            key={qIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: qIndex * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Question {qIndex + 1}
                            </h3>
                            <p className="text-gray-700 mb-6 text-lg">
                                {question.questionText}
                            </p>

                            <div className="space-y-3">
                                {question.options.map((option, oIndex) => (
                                    <label
                                        key={oIndex}
                                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${answers[qIndex] === oIndex
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            value={oIndex}
                                            checked={answers[qIndex] === oIndex}
                                            onChange={() => handleAnswerChange(qIndex, oIndex)}
                                            className="w-5 h-5 text-purple-600"
                                        />
                                        <span className="ml-4 text-gray-800 font-medium">
                                            {String.fromCharCode(65 + oIndex)}. {option}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || answers.includes(null)}
                        className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TakeQuiz;
