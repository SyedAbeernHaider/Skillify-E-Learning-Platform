import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaQuestionCircle, FaSpinner, FaCheckCircle, FaTimes, FaClock, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCourseDetails } from '../../../services/api/studentService';
import api from '../../../config/api';
import CoursePlayerLayout from '../../../components/CoursePlayerLayout';

function CourseQuizzes() {
    const { courseId } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [quizResults, setQuizResults] = useState({}); // Store results by sectionIndex

    useEffect(() => {
        fetchCourseDetails();
        fetchQuizResults();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await getCourseDetails(courseId);
            setCourse(response.data);
        } catch (error) {
            toast.error('Failed to load quizzes');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizResults = async () => {
        try {
            // Fetch all quiz results for this student and course
            const response = await api.get(`/student/quiz-results/${courseId}`);
            const results = response.data.data || [];

            // Create a map of sectionIndex to result
            // The API returns results sorted by submittedAt desc (newest first)
            // We want to keep the NEWEST result for each section
            const resultsMap = {};
            results.forEach(result => {
                if (!resultsMap[result.sectionIndex]) {
                    resultsMap[result.sectionIndex] = result;
                }
            });
            setQuizResults(resultsMap);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
        }
    };

    const selectSection = (sectionIndex) => {
        const section = course.sections[sectionIndex];
        if (!section.quiz) {
            toast.info('No quiz available for this section');
            return;
        }

        setSelectedSection(sectionIndex);
        setSelectedQuiz(section.quiz);

        // Check if student has already taken this quiz
        const existingResult = quizResults[sectionIndex];
        if (existingResult) {
            // Show previous results
            setScore({
                correct: existingResult.correctAnswers,
                total: existingResult.totalQuestions,
                earnedPoints: existingResult.earnedPoints,
                totalPoints: existingResult.totalPoints,
                percentage: existingResult.percentage,
                passed: existingResult.passed
            });
            setAnswers(existingResult.answers || {});
            setSubmitted(true);
        } else {
            // Reset for new quiz
            setAnswers({});
            setSubmitted(false);
            setScore(null);
        }
    };

    const handleRetry = () => {
        setSubmitted(false);
        setScore(null);
        setAnswers({});
        // Scroll to top of quiz area
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAnswerChange = (questionIndex, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const submitQuiz = async () => {
        if (Object.keys(answers).length < selectedQuiz.questions.length) {
            toast.warning('Please answer all questions');
            return;
        }

        setSubmitting(true);

        try {
            // Calculate score
            let correctCount = 0;
            let totalPoints = 0;
            let earnedPoints = 0;

            selectedQuiz.questions.forEach((question, index) => {
                totalPoints += question.points || 1;
                if (answers[index] === question.correctAnswer) {
                    correctCount++;
                    earnedPoints += question.points || 1;
                }
            });

            const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
            const passed = percentage >= (selectedQuiz.passingScore || 70);

            // Submit to backend
            await api.post(`/student/quiz-results`, {
                courseId,
                sectionIndex: selectedSection,
                quizTitle: selectedQuiz.title,
                totalQuestions: selectedQuiz.questions.length,
                correctAnswers: correctCount,
                totalPoints,
                earnedPoints,
                percentage: percentage.toFixed(2),
                passed,
                answers,
                studentName: `${user.firstName} ${user.lastName}`,
                studentEmail: user.email
            });

            setScore({
                correct: correctCount,
                total: selectedQuiz.questions.length,
                earnedPoints,
                totalPoints,
                percentage: percentage.toFixed(2),
                passed
            });
            setSubmitted(true);

            if (passed) {
                toast.success('🎉 Congratulations! You passed the quiz!');
            } else {
                toast.info('Quiz submitted. You can view your results below.');
            }

            // Refresh quiz results
            await fetchQuizResults();
        } catch (error) {
            toast.error('Failed to submit quiz');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <CoursePlayerLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <FaSpinner className="animate-spin text-6xl text-purple-600" />
                </div>
            </CoursePlayerLayout>
        );
    }

    const sectionsWithQuizzes = course?.sections?.filter(section => section.quiz) || [];

    // Determine if selected section is the last one with a quiz
    let lastQuizSectionIndex = -1;
    if (course?.sections) {
        course.sections.forEach((section, index) => {
            if (section.quiz && section.quiz.questions && section.quiz.questions.length > 0) {
                lastQuizSectionIndex = index;
            }
        });
    }
    const isLastQuiz = selectedSection === lastQuizSectionIndex;

    return (
        <CoursePlayerLayout>
            <div className="course-quizzes">
                <h1 className="page-title">❓ Course Quizzes</h1>
                <p className="page-subtitle">Test your knowledge for each section</p>

                {sectionsWithQuizzes.length === 0 ? (
                    <div className="no-quizzes">
                        <FaQuestionCircle className="no-quiz-icon" />
                        <h3>No Quizzes Available</h3>
                        <p>Your instructor hasn't added any quizzes yet</p>
                    </div>
                ) : (
                    <div className="quizzes-container">
                        {/* Section Selection */}
                        <div className="sections-sidebar">
                            <h3>Sections</h3>
                            <div className="sections-list">
                                {course.sections.map((section, index) => (
                                    section.quiz && (
                                        <div
                                            key={index}
                                            className={`section-item ${selectedSection === index ? 'active' : ''} ${quizResults[index] ? 'completed' : ''}`}
                                            onClick={() => selectSection(index)}
                                        >
                                            <div className="section-number">Section {index + 1}</div>
                                            <div className="section-title">{section.title}</div>
                                            <div className="quiz-info">
                                                <FaQuestionCircle /> {section.quiz.questions?.length || 0} questions
                                                {quizResults[index] && (
                                                    <span className="completed-badge">
                                                        <FaCheckCircle /> Completed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Quiz Content */}
                        <div className="quiz-content">
                            {selectedQuiz ? (
                                <>
                                    <div className="quiz-header">
                                        <h2>{selectedQuiz.title}</h2>
                                        {selectedQuiz.description && <p>{selectedQuiz.description}</p>}
                                        <div className="quiz-meta">
                                            {selectedQuiz.timeLimit && (
                                                <span><FaClock /> {selectedQuiz.timeLimit} minutes</span>
                                            )}
                                            <span><FaTrophy /> Passing Score: {selectedQuiz.passingScore || 70}%</span>
                                            <span><FaQuestionCircle /> {selectedQuiz.questions?.length || 0} questions</span>
                                        </div>
                                    </div>

                                    {!submitted ? (
                                        <>
                                            {/* Questions */}
                                            <div className="questions-list">
                                                {selectedQuiz.questions.map((question, qIndex) => (
                                                    <div key={qIndex} className="question-card">
                                                        <div className="question-header">
                                                            <h3>Question {qIndex + 1}</h3>
                                                            <span className="points">{question.points || 1} point{(question.points || 1) > 1 ? 's' : ''}</span>
                                                        </div>
                                                        <p className="question-text">{question.questionText}</p>

                                                        <div className="options-list">
                                                            {question.options.map((option, oIndex) => (
                                                                <label
                                                                    key={oIndex}
                                                                    className={`option-label ${answers[qIndex] === oIndex ? 'selected' : ''}`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={`question-${qIndex}`}
                                                                        value={oIndex}
                                                                        checked={answers[qIndex] === oIndex}
                                                                        onChange={() => handleAnswerChange(qIndex, oIndex)}
                                                                    />
                                                                    <span>{option}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                className="submit-btn"
                                                onClick={submitQuiz}
                                                disabled={submitting || Object.keys(answers).length < selectedQuiz.questions.length}
                                            >
                                                {submitting ? (
                                                    <><FaSpinner className="animate-spin" /> Submitting...</>
                                                ) : (
                                                    'Submit Quiz'
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {/* Results */}
                                            <div className="results-card">
                                                <h3>Quiz Results</h3>
                                                <div className="score-display">
                                                    <div className={`score-circle ${score.passed ? 'passed' : 'failed'}`}>
                                                        <span className="score-percentage">{Number(score.percentage).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="score-details">
                                                        <p>Correct Answers: {score.correct} / {score.total}</p>
                                                        <p>Points Earned: {score.earnedPoints} / {score.totalPoints}</p>
                                                        <p className={score.passed ? 'passed-text' : 'failed-text'}>
                                                            {score.passed ? '✅ Passed!' : '❌ Failed'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Review Answers */}
                                                <div className="answers-review">
                                                    <h4>Review Your Answers</h4>
                                                    {selectedQuiz.questions.map((question, qIndex) => (
                                                        <div key={qIndex} className="review-question">
                                                            <h5>Question {qIndex + 1}</h5>
                                                            <p>{question.questionText}</p>
                                                            <div className="review-options">
                                                                {question.options.map((option, oIndex) => (
                                                                    <div
                                                                        key={oIndex}
                                                                        className={`review-option ${oIndex === question.correctAnswer
                                                                            ? 'correct'
                                                                            : answers[qIndex] === oIndex
                                                                                ? 'incorrect'
                                                                                : ''
                                                                            }`}
                                                                    >
                                                                        {oIndex === question.correctAnswer && <FaCheckCircle />}
                                                                        {answers[qIndex] === oIndex && oIndex !== question.correctAnswer && <FaTimes />}
                                                                        <span>{option}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {question.explanation && (
                                                                <div className="explanation">
                                                                    <strong>Explanation:</strong> {question.explanation}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="quiz-completed-message">
                                                    {/* Failed + Last Quiz = Retry Button */}
                                                    {!score.passed && isLastQuiz && (
                                                        <div className="retry-section">
                                                            <div className="message-box warning">
                                                                <p>📚 <strong>Final Quiz:</strong> You didn't pass, but you can retry until you succeed!</p>
                                                            </div>
                                                            <button onClick={handleRetry} className="retry-btn">
                                                                Try Again
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Failed + NOT Last Quiz */}
                                                    {!score.passed && !isLastQuiz && (
                                                        <div className="message-box warning">
                                                            <p>⚠️ You didn't pass, but you should continue with the course. Good luck on the next one!</p>
                                                        </div>
                                                    )}

                                                    {/* Passed + Last Quiz */}
                                                    {score.passed && isLastQuiz && (
                                                        <div className="message-box success">
                                                            <p>🎓 <strong>Congratulations!</strong> You've completed all quizzes. Don't forget to request your certificate.</p>
                                                        </div>
                                                    )}

                                                    {/* Passed + NOT Last Quiz */}
                                                    {score.passed && !isLastQuiz && (
                                                        <div className="message-box success">
                                                            <p>✅ Quiz completed! Keep up the great work.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="empty-state">
                                    <FaQuestionCircle className="empty-icon" />
                                    <h3>Select a Section</h3>
                                    <p>Choose a section from the left to start the quiz</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <style jsx>{`
                    .course-quizzes {
                        max-width: 1400px;
                        margin: 0 auto;
                    }

                    .page-title {
                        font-size: 2rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 0.5rem;
                    }

                    .page-subtitle {
                        color: #6b7280;
                        margin-bottom: 2rem;
                    }

                    .no-quizzes {
                        background: white;
                        padding: 4rem 2rem;
                        border-radius: 12px;
                        text-align: center;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .no-quiz-icon, .empty-icon {
                        font-size: 4rem;
                        color: #d1d5db;
                        margin-bottom: 1rem;
                    }

                    .no-quizzes h3, .empty-state h3 {
                        font-size: 1.5rem;
                        color: #1f2937;
                        margin: 0 0 0.5rem 0;
                    }

                    .no-quizzes p, .empty-state p {
                        color: #6b7280;
                    }

                    .quizzes-container {
                        display: grid;
                        grid-template-columns: 300px 1fr;
                        gap: 2rem;
                    }

                    .sections-sidebar {
                        background: white;
                        border-radius: 12px;
                        padding: 1.5rem;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        height: fit-content;
                    }

                    .sections-sidebar h3 {
                        font-size: 1.125rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 1rem 0;
                    }

                    .sections-list {
                        display: flex;
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .section-item {
                        padding: 1rem;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    }

                    .section-item:hover {
                        border-color: #667eea;
                        background: #f9fafb;
                    }

                    .section-item.active {
                        border-color: #667eea;
                        background: #ede9fe;
                    }

                    .section-number {
                        font-size: 0.75rem;
                        font-weight: 600;
                        color: #667eea;
                        margin-bottom: 0.25rem;
                    }

                    .section-title {
                        font-weight: 600;
                        color: #1f2937;
                        margin-bottom: 0.5rem;
                    }

                    .quiz-info {
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 0.5rem;
                        font-size: 0.875rem;
                        color: #6b7280;
                    }

                    .completed-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.25rem;
                        background: #d1fae5;
                        color: #065f46;
                        padding: 0.125rem 0.5rem;
                        border-radius: 4px;
                        font-size: 0.75rem;
                        font-weight: 600;
                    }

                    .section-item.completed {
                        border-color: #10b981;
                        background: #f0fdf4;
                    }

                    .quiz-completed-message {
                        background: #d1fae5;
                        border-left: 4px solid #10b981;
                        padding: 1rem;
                        border-radius: 8px;
                        margin-top: 2rem;
                    }

                    .quiz-completed-message p {
                        margin: 0;
                        color: #065f46;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .quiz-content {
                        background: white;
                        border-radius: 12px;
                        padding: 2rem;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .quiz-header h2 {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 0.5rem 0;
                    }

                    .quiz-header p {
                        color: #6b7280;
                        margin: 0 0 1rem 0;
                    }

                    .quiz-meta {
                        display: flex;
                        gap: 2rem;
                        color: #667eea;
                        font-weight: 600;
                        margin-bottom: 2rem;
                        padding-bottom: 1rem;
                        border-bottom: 2px solid #e5e7eb;
                    }

                    .quiz-meta span {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .questions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                        margin-bottom: 2rem;
                    }

                    .question-card {
                        background: #f9fafb;
                        padding: 1.5rem;
                        border-radius: 8px;
                    }

                    .question-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1rem;
                    }

                    .question-header h3 {
                        font-size: 1rem;
                        font-weight: 600;
                        color: #667eea;
                        margin: 0;
                    }

                    .points {
                        background: #ede9fe;
                        color: #667eea;
                        padding: 0.25rem 0.75rem;
                        border-radius: 4px;
                        font-size: 0.875rem;
                        font-weight: 600;
                    }

                    .question-text {
                        font-size: 1.125rem;
                        color: #1f2937;
                        margin: 0 0 1rem 0;
                    }

                    .options-list {
                        display: flex;
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .option-label {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 1rem;
                        background: white;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    }

                    .option-label:hover {
                        border-color: #667eea;
                    }

                    .option-label.selected {
                        border-color: #667eea;
                        background: #ede9fe;
                    }

                    .option-label input[type="radio"] {
                        width: 20px;
                        height: 20px;
                        cursor: pointer;
                    }

                    .submit-btn, .retry-btn {
                        width: 100%;
                        padding: 1rem;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1.125rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    }

                    .submit-btn:hover:not(:disabled), .retry-btn:hover {
                        transform: translateY(-2px);
                    }

                    .submit-btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    .results-card {
                        background: #f9fafb;
                        padding: 2rem;
                        border-radius: 12px;
                    }

                    .results-card h3 {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 1.5rem 0;
                        text-align: center;
                    }

                    .score-display {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 2rem;
                        margin-bottom: 2rem;
                        padding-bottom: 2rem;
                        border-bottom: 2px solid #e5e7eb;
                    }

                    .score-circle {
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .score-circle.passed {
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    }

                    .score-circle.failed {
                        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    }

                    .score-percentage {
                        font-size: 2rem;
                        font-weight: 700;
                        color: white;
                    }

                    .score-details {
                        text-align: left;
                    }

                    .score-details p {
                        margin: 0.5rem 0;
                        font-size: 1.125rem;
                        color: #1f2937;
                    }

                    .passed-text {
                        color: #10b981;
                        font-weight: 700;
                    }

                    .failed-text {
                        color: #ef4444;
                        font-weight: 700;
                    }

                    .answers-review {
                        margin-bottom: 2rem;
                    }

                    .answers-review h4 {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 1rem 0;
                    }

                    .review-question {
                        background: white;
                        padding: 1.5rem;
                        border-radius: 8px;
                        margin-bottom: 1rem;
                    }

                    .review-question h5 {
                        font-size: 0.875rem;
                        font-weight: 600;
                        color: #667eea;
                        margin: 0 0 0.5rem 0;
                    }

                    .review-question p {
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0 0 1rem 0;
                    }

                    .review-options {
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                        margin-bottom: 1rem;
                    }

                    .review-option {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.75rem;
                        border-radius: 6px;
                        background: #f3f4f6;
                    }

                    .review-option.correct {
                        background: #d1fae5;
                        color: #065f46;
                        font-weight: 600;
                    }

                    .review-option.incorrect {
                        background: #fee2e2;
                        color: #991b1b;
                    }

                    .explanation {
                        padding: 1rem;
                        background: #fef3c7;
                        border-left: 4px solid #f59e0b;
                        border-radius: 4px;
                        color: #92400e;
                    }

                    .empty-state {
                        text-align: center;
                        padding: 4rem 2rem;
                    }

                    /* New Styles for Retry Logic */
                    .retry-section {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        align-items: center;
                    }

                    .message-box {
                        padding: 1rem;
                        border-radius: 8px;
                        width: 100%;
                        border-left: 4px solid;
                    }

                    .message-box p {
                        margin: 0;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .message-box.success {
                        background: #d1fae5;
                        border-color: #10b981;
                        color: #065f46;
                    }

                    .message-box.warning {
                        background: #fff7ed;
                        border-color: #f97316;
                        color: #9a3412;
                    }

                    .retry-btn {
                        width: auto;
                        min-width: 200px;
                        padding: 1rem 2rem;
                        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1.125rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: transform 0.2s, box-shadow 0.2s;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.4);
                    }

                    .retry-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.4);
                    }

                    @media (max-width: 1024px) {
                        .quizzes-container {
                            grid-template-columns: 1fr;
                        }
                    }
                `}</style>
            </div>
        </CoursePlayerLayout>
    );
}

export default CourseQuizzes;
