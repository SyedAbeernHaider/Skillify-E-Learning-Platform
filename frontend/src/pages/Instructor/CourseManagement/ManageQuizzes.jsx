import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaChevronDown, FaChevronUp, FaQuestionCircle, FaLock, FaUnlock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../config/api';
import { updateCourse } from '../../../services/api/instructorService';

function ManageQuizzes() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState(null);
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        timeLimit: 30,
        passingScore: 70,
        questions: []
    });
    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1,
        explanation: ''
    });

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/instructor/courses/${courseId}`);
            setCourse(response.data.data);
        } catch (error) {
            toast.error('Failed to load course details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFinish = async () => {
        try {
            const updatedData = {
                isContentLocked: !course.isContentLocked
            };
            const response = await updateCourse(courseId, updatedData);
            if (response.success) {
                setCourse({ ...course, isContentLocked: updatedData.isContentLocked });
                toast.success(updatedData.isContentLocked ? 'Course Finished & Locked' : 'Course Unlocked, Continue Editing');
            }
        } catch (error) {
            toast.error('Failed to update course status');
        }
    };

    const selectSection = (sectionIndex) => {
        setSelectedSection(sectionIndex);
        const section = course.sections[sectionIndex];

        if (section.quiz) {
            // Load existing quiz
            setQuizData({
                title: section.quiz.title || '',
                description: section.quiz.description || '',
                timeLimit: section.quiz.timeLimit || 30,
                passingScore: section.quiz.passingScore || 70,
                questions: section.quiz.questions || []
            });
        } else {
            resetQuizForm();
        }
        setShowQuizForm(false);
    };

    const resetQuizForm = () => {
        setQuizData({
            title: '',
            description: '',
            timeLimit: 30,
            passingScore: 70,
            questions: []
        });
    };

    const addQuestion = () => {
        if (!currentQuestion.questionText || currentQuestion.options.some(opt => !opt)) {
            toast.warning('Please fill all question fields');
            return;
        }

        setQuizData(prev => ({
            ...prev,
            questions: [...prev.questions, { ...currentQuestion }]
        }));

        setCurrentQuestion({
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            points: 1,
            explanation: ''
        });

        toast.success('Question added!');
    };

    const removeQuestion = (index) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
        toast.success('Question removed');
    };

    const saveQuiz = async () => {
        if (!quizData.title || quizData.questions.length === 0) {
            toast.warning('Please add a title and at least one question');
            return;
        }

        try {
            // Update the course sections with the quiz data
            const updatedSections = [...course.sections];
            updatedSections[selectedSection].quiz = {
                title: quizData.title,
                description: quizData.description,
                timeLimit: quizData.timeLimit,
                passingScore: quizData.passingScore,
                questions: quizData.questions
            };

            // Save to database
            await api.put(`/instructor/courses/${courseId}`, {
                sections: updatedSections
            });

            toast.success('Quiz saved successfully!');
            fetchCourseDetails();
            setShowQuizForm(false);
        } catch (error) {
            console.error('Save quiz error:', error);
            toast.error('Failed to save quiz');
        }
    };

    const deleteQuiz = async () => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return;

        try {
            const updatedSections = [...course.sections];
            delete updatedSections[selectedSection].quiz;

            await api.put(`/instructor/courses/${courseId}`, {
                sections: updatedSections
            });

            toast.success('Quiz deleted');
            fetchCourseDetails();
            resetQuizForm();
        } catch (error) {
            toast.error('Failed to delete quiz');
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
        <div className="manage-quizzes">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="page-title">❓ Manage Quizzes</h1>
                    <p className="page-subtitle">Create and manage quizzes for each section</p>
                </div>
                <button
                    onClick={handleToggleFinish}
                    className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${course?.isContentLocked
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                >
                    {course?.isContentLocked ? (
                        <>
                            <FaUnlock /> Continue Editing
                        </>
                    ) : (
                        <>
                            <FaLock /> Finish Quizzes
                        </>
                    )}
                </button>
            </div>

            <div className="content-grid">
                {/* Section Selection */}
                <div className="sections-panel">
                    <h2>Select Section</h2>
                    <div className="sections-list">
                        {course?.sections?.map((section, index) => (
                            <div
                                key={index}
                                className={`section-item ${selectedSection === index ? 'active' : ''}`}
                                onClick={() => selectSection(index)}
                            >
                                <div className="section-info">
                                    <h3>Section {index + 1}</h3>
                                    <p>{section.title}</p>
                                </div>
                                {section.quiz && (
                                    <span className="quiz-badge">
                                        <FaQuestionCircle /> Quiz Added
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quiz Management */}
                <div className="quiz-panel">
                    {selectedSection !== null ? (
                        <>
                            <div className="panel-header">
                                <h2>Quiz for Section {selectedSection + 1}</h2>
                                {course.sections[selectedSection].quiz && !showQuizForm && !course.isContentLocked && (
                                    <div className="header-actions">
                                        <button onClick={() => setShowQuizForm(true)} className="btn-edit">
                                            <FaEdit /> Edit Quiz
                                        </button>
                                        <button onClick={deleteQuiz} className="btn-delete">
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!showQuizForm && !course.sections[selectedSection].quiz && (
                                <div className="empty-state">
                                    <FaQuestionCircle className="empty-icon" />
                                    <h3>No Quiz Created</h3>
                                    <p>Create a quiz for this section</p>
                                    {!course.isContentLocked && (
                                        <button onClick={() => setShowQuizForm(true)} className="btn-create">
                                            <FaPlus /> Create Quiz
                                        </button>
                                    )}
                                </div>
                            )}

                            {!showQuizForm && course.sections[selectedSection].quiz && (
                                <div className="quiz-preview">
                                    <h3>{course.sections[selectedSection].quiz.title}</h3>
                                    <p>{course.sections[selectedSection].quiz.description}</p>
                                    <div className="quiz-meta">
                                        <span>⏱️ {course.sections[selectedSection].quiz.timeLimit} minutes</span>
                                        <span>📊 Passing: {course.sections[selectedSection].quiz.passingScore}%</span>
                                        <span>❓ {course.sections[selectedSection].quiz.questions?.length || 0} questions</span>
                                    </div>
                                </div>
                            )}

                            {showQuizForm && (
                                <div className="quiz-form">
                                    {/* Quiz Details */}
                                    <div className="form-section">
                                        <h3>Quiz Details</h3>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Quiz Title *</label>
                                                <input
                                                    type="text"
                                                    value={quizData.title}
                                                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                                    placeholder="e.g., Section 1 Quiz"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <input
                                                    type="text"
                                                    value={quizData.description}
                                                    onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                                                    placeholder="Brief description"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Time Limit (minutes)</label>
                                                <input
                                                    type="number"
                                                    value={quizData.timeLimit}
                                                    onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Passing Score (%)</label>
                                                <input
                                                    type="number"
                                                    value={quizData.passingScore}
                                                    onChange={(e) => setQuizData({ ...quizData, passingScore: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add Question */}
                                    <div className="form-section">
                                        <h3>Add Question</h3>
                                        <div className="form-group">
                                            <label>Question Text *</label>
                                            <textarea
                                                value={currentQuestion.questionText}
                                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                                                placeholder="Enter your question"
                                                rows="3"
                                            />
                                        </div>

                                        <div className="options-grid">
                                            {currentQuestion.options.map((option, index) => (
                                                <div key={index} className="option-group">
                                                    <label>Option {index + 1} *</label>
                                                    <div className="option-input">
                                                        <input
                                                            type="radio"
                                                            name="correctAnswer"
                                                            checked={currentQuestion.correctAnswer === index}
                                                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => {
                                                                const newOptions = [...currentQuestion.options];
                                                                newOptions[index] = e.target.value;
                                                                setCurrentQuestion({ ...currentQuestion, options: newOptions });
                                                            }}
                                                            placeholder={`Option ${index + 1}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Points</label>
                                                <input
                                                    type="number"
                                                    value={currentQuestion.points}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Explanation (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={currentQuestion.explanation}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                                                    placeholder="Explain the correct answer"
                                                />
                                            </div>
                                        </div>

                                        <button onClick={addQuestion} className="btn-add-question">
                                            <FaPlus /> Add Question
                                        </button>
                                    </div>

                                    {/* Questions List */}
                                    {quizData.questions.length > 0 && (
                                        <div className="form-section">
                                            <h3>Questions ({quizData.questions.length})</h3>
                                            <div className="questions-list">
                                                {quizData.questions.map((q, index) => (
                                                    <div key={index} className="question-card">
                                                        <div className="question-header">
                                                            <span>Q{index + 1}</span>
                                                            <button onClick={() => removeQuestion(index)} className="btn-remove">
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                        <p className="question-text">{q.questionText}</p>
                                                        <div className="question-options">
                                                            {q.options.map((opt, i) => (
                                                                <span key={i} className={i === q.correctAnswer ? 'correct' : ''}>
                                                                    {i === q.correctAnswer && '✓ '}{opt}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Form Actions */}
                                    <div className="form-actions">
                                        <button onClick={() => setShowQuizForm(false)} className="btn-cancel">
                                            Cancel
                                        </button>
                                        <button onClick={saveQuiz} className="btn-save">
                                            Save Quiz
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <FaQuestionCircle className="empty-icon" />
                            <h3>Select a Section</h3>
                            <p>Choose a section from the left to manage its quiz</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .manage-quizzes {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 2rem;
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

                .content-grid {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 2rem;
                }

                .sections-panel, .quiz-panel {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .sections-panel h2, .quiz-panel h2 {
                    font-size: 1.25rem;
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

                .section-info h3 {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #667eea;
                    margin: 0 0 0.25rem 0;
                }

                .section-info p {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }

                .quiz-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    background: #10b981;
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-top: 0.5rem;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .header-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn-edit, .btn-delete, .btn-create, .btn-cancel, .btn-save, .btn-add-question {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .btn-edit {
                    background: #3b82f6;
                    color: white;
                }

                .btn-delete, .btn-remove {
                    background: #ef4444;
                    color: white;
                }

                .btn-create, .btn-save, .btn-add-question {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-cancel {
                    background: #e5e7eb;
                    color: #6b7280;
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                }

                .empty-icon {
                    font-size: 4rem;
                    color: #d1d5db;
                    margin-bottom: 1rem;
                }

                .empty-state h3 {
                    font-size: 1.5rem;
                    color: #1f2937;
                    margin: 0 0 0.5rem 0;
                }

                .empty-state p {
                    color: #6b7280;
                    margin: 0 0 1.5rem 0;
                }

                .quiz-preview {
                    background: #f9fafb;
                    padding: 1.5rem;
                    border-radius: 8px;
                }

                .quiz-preview h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 0.5rem 0;
                }

                .quiz-preview p {
                    color: #6b7280;
                    margin: 0 0 1rem 0;
                }

                .quiz-meta {
                    display: flex;
                    gap: 1.5rem;
                    color: #667eea;
                    font-weight: 600;
                }

                .quiz-form {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .form-section {
                    background: #f9fafb;
                    padding: 1.5rem;
                    border-radius: 8px;
                }

                .form-section h3 {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 1rem 0;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 0.875rem;
                }

                .form-group input, .form-group textarea {
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 6px;
                    font-family: inherit;
                }

                .form-group input:focus, .form-group textarea:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .options-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin: 1rem 0;
                }

                .option-input {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .option-input input[type="radio"] {
                    width: 20px;
                    height: 20px;
                }

                .option-input input[type="text"] {
                    flex: 1;
                }

                .questions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .question-card {
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }

                .question-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .question-header span {
                    font-weight: 700;
                    color: #667eea;
                }

                .btn-remove {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.875rem;
                }

                .question-text {
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0 0 0.75rem 0;
                }

                .question-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .question-options span {
                    padding: 0.5rem;
                    background: #f3f4f6;
                    border-radius: 4px;
                    font-size: 0.875rem;
                }

                .question-options span.correct {
                    background: #d1fae5;
                    color: #065f46;
                    font-weight: 600;
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e5e7eb;
                }

                @media (max-width: 1024px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default ManageQuizzes;
