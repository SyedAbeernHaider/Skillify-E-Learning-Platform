const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const Badge = require('../models/Badge');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Revenue = require('../models/Revenue');
const Setting = require('../models/Setting');
const NotificationService = require('../services/notificationService');

// @desc    Get student dashboard stats
// @route   GET /api/student/dashboard
// @access  Private (Student only)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const studentId = req.user._id;

        // Get enrollments
        const enrollments = await Enrollment.find({ student: studentId })
            .populate('course', 'title thumbnail instructor')
            .populate({
                path: 'course',
                populate: {
                    path: 'instructor',
                    select: 'firstName lastName',
                },
            });

        res.status(200).json({
            success: true,
            data: {
                enrolledCourses: enrollments.length,
                badges: 0, // Placeholder for future implementation
                certificates: 0, // Placeholder for future implementation
                pendingAssignments: 0, // Placeholder for future implementation
                completedAssignments: 0, // Placeholder for future implementation
                pendingQuizzes: 0, // Placeholder for future implementation
                completedQuizzes: 0, // Placeholder for future implementation
                recentEnrollments: enrollments.slice(0, 5),
                recentBadges: [], // Placeholder for future implementation
            },
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        next(error);
    }
};

// @desc    Get all courses (public + authenticated)
// @route   GET /api/student/courses
// @access  Public
exports.getAllCourses = async (req, res, next) => {
    try {
        const { category, level, search, page = 1, limit = 12 } = req.query;

        const query = {
            approvalStatus: 'approved',
            isPublished: true,
            isActive: true,
        };

        if (category) query.category = category;
        if (level) query.level = level;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        const courses = await Course.find(query)
            .populate('instructor', 'firstName lastName profileImage')
            .select('-sections') // Don't send full course content in list
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get course details
// @route   GET /api/student/courses/:id
// @access  Public
exports.getCourseDetails = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'firstName lastName email profileImage bio expertise')
            .populate({
                path: 'reviews.student',
                select: 'firstName lastName profileImage',
            });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Increment views
        course.totalViews += 1;
        await course.save();

        // Check if user is enrolled (if authenticated)
        let isEnrolled = false;
        if (req.user) {
            const enrollment = await Enrollment.findOne({
                student: req.user.id,
                course: req.params.id,
            });
            isEnrolled = !!enrollment;
        }

        // Calculate enrollment count
        const enrollmentCount = await Enrollment.countDocuments({ course: req.params.id });

        // Return flattened response with all data
        res.status(200).json({
            success: true,
            data: {
                ...course.toObject(),
                isEnrolled,
                enrollmentCount,
                averageRating: course.rating || 0,
                reviewCount: course.reviews?.length || 0,
                totalLessons: course.sections?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Enroll in course
// @route   POST /api/student/courses/:id/enroll
// @access  Private (Student only)
exports.enrollInCourse = async (req, res, next) => {
    try {
        const studentId = req.user.id;
        const courseId = req.params.id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this course',
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            paymentStatus: course.price === 0 ? 'free' : 'completed',
            amountPaid: course.price,
        });

        // Update course enrollment count
        course.enrolledStudents.push(studentId);
        course.totalEnrollments += 1;
        await course.save();

        // Update user's enrolled courses
        await User.findByIdAndUpdate(studentId, {
            $push: { enrolledCourses: courseId },
        });

        // Create revenue record if paid course
        if (course.price > 0) {
            // Get current platform fee from settings
            const settings = await Setting.getSettings();

            await Revenue.create({
                course: courseId,
                instructor: course.instructor,
                student: studentId,
                enrollment: enrollment._id,
                totalAmount: course.price,
                platformFeePercentage: settings.platformFeePercentage,
            });
        }

        // Notify instructor
        const student = await User.findById(studentId);
        await NotificationService.notifyNewEnrollment(
            course.instructor,
            `${student.firstName} ${student.lastName}`,
            course.title
        );

        res.status(201).json({
            success: true,
            message: 'Successfully enrolled in course',
            data: enrollment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get enrolled courses
// @route   GET /api/student/enrollments
// @access  Private (Student only)
exports.getEnrolledCourses = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id })
            .populate({
                path: 'course',
                populate: {
                    path: 'instructor',
                    select: 'firstName lastName profileImage',
                },
            })
            .sort({ lastAccessedAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course progress
// @route   PUT /api/student/enrollments/:id/progress
// @access  Private (Student only)
exports.updateProgress = async (req, res, next) => {
    try {
        const { sectionIndex, lessonIndex } = req.body;

        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found',
            });
        }

        // Check if student owns this enrollment
        if (enrollment.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        // Check if lesson already completed
        const alreadyCompleted = enrollment.progress.completedLessons.some(
            lesson => lesson.sectionIndex === sectionIndex && lesson.lessonIndex === lessonIndex
        );

        if (!alreadyCompleted) {
            enrollment.progress.completedLessons.push({
                sectionIndex,
                lessonIndex,
                completedAt: new Date(),
            });
        }

        // Update current position
        enrollment.progress.currentSection = sectionIndex;
        enrollment.progress.currentLesson = lessonIndex;
        enrollment.lastAccessedAt = new Date();

        // Get course to calculate total lessons
        const course = await Course.findById(enrollment.course);
        let totalLessons = 0;
        course.sections.forEach(section => {
            totalLessons += section.lessons.length;
        });

        // Calculate completion percentage
        enrollment.calculateProgress(totalLessons);

        // Check if course is completed
        if (enrollment.progress.completionPercentage === 100) {
            enrollment.isCompleted = true;
            enrollment.completedAt = new Date();
        }

        await enrollment.save();

        res.status(200).json({
            success: true,
            message: 'Progress updated',
            data: enrollment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit assignment
// @route   POST /api/student/assignments/:id/submit
// @access  Private (Student only)
exports.submitAssignment = async (req, res, next) => {
    try {
        const { text, files } = req.body;
        const assignmentId = req.params.id;
        const studentId = req.user.id;

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found',
            });
        }

        // Check if already submitted
        const existingSubmission = assignment.submissions.find(
            sub => sub.student.toString() === studentId
        );

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: 'Assignment already submitted',
            });
        }

        // Check if late
        const isLate = new Date() > assignment.dueDate;

        // Add submission
        assignment.submissions.push({
            student: studentId,
            text,
            files,
            status: isLate ? 'late' : 'submitted',
        });

        await assignment.save();

        // Notify instructor
        const student = await User.findById(studentId);
        await NotificationService.notifyAssignmentSubmitted(
            assignment.instructor,
            `${student.firstName} ${student.lastName}`,
            assignment.title
        );

        res.status(201).json({
            success: true,
            message: 'Assignment submitted successfully',
            data: assignment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Take quiz
// @route   POST /api/student/quizzes/:id/attempt
// @access  Private (Student only)
exports.takeQuiz = async (req, res, next) => {
    try {
        const { answers, timeSpent } = req.body;
        const quizId = req.params.id;
        const studentId = req.user.id;

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found',
            });
        }

        // Check if multiple attempts allowed
        if (!quiz.allowMultipleAttempts) {
            const existingAttempt = quiz.attempts.find(
                att => att.student.toString() === studentId
            );

            if (existingAttempt) {
                return res.status(400).json({
                    success: false,
                    message: 'Multiple attempts not allowed',
                });
            }
        }

        // Calculate score
        const result = quiz.calculateScore(answers);

        // Add attempt
        quiz.attempts.push({
            student: studentId,
            completedAt: new Date(),
            answers,
            score: result.score,
            percentage: result.percentage,
            passed: result.passed,
            timeSpent,
        });

        await quiz.save();

        // Check for Certificate Eligibility
        if (result.passed) {
            const course = await Course.findById(quiz.course);
            // Check if this is the last section AND course content is locked/finished
            const isLastSection = quiz.sectionIndex >= (course.sections.length - 1);

            if (isLastSection && course.isContentLocked) {
                // Check if certificate request already exists
                const existingCert = await Certificate.findOne({
                    student: studentId,
                    course: quiz.course
                });

                if (!existingCert) {
                    await Certificate.create({
                        title: `Certificate of Completion - ${course.title}`,
                        student: studentId,
                        course: quiz.course,
                        instructor: course.instructor,
                        completionPercentage: 100,
                        approvalStatus: 'pending_instructor',
                        certificateNumber: `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`
                    });

                    // Notify Instructor
                    await NotificationService.notifyInstructor(
                        course.instructor,
                        'New Certificate Request',
                        `Student passed the final quiz for ${course.title}. Please review their certificate request.`
                    );
                }
            }
        }

        res.status(201).json({
            success: true,
            message: result.passed ? 'Quiz passed!' : 'Quiz completed',
            data: {
                score: result.score,
                totalPoints: result.totalPoints,
                percentage: result.percentage,
                passed: result.passed,
                correctAnswers: quiz.showCorrectAnswers ? quiz.questions : undefined,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student badges
// @route   GET /api/student/badges
// @access  Private (Student only)
exports.getBadges = async (req, res, next) => {
    try {
        const badges = await Badge.find({ student: req.user.id })
            .populate('course', 'title thumbnail')
            .populate('instructor', 'firstName lastName profileImage')
            .sort({ awardedAt: -1 });

        res.status(200).json({
            success: true,
            count: badges.length,
            data: badges,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student certificates
// @route   GET /api/student/certificates
// @access  Private (Student only)
exports.getCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.find({ student: req.user.id })
            .populate('course', 'title thumbnail')
            .populate('instructor', 'firstName lastName')
            .sort({ issueDate: -1 });

        res.status(200).json({
            success: true,
            count: certificates.length,
            data: certificates,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Request certificate
// @route   POST /api/student/certificates/request
// @access  Private (Student only)
exports.requestCertificate = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user.id;

        // Get course first to check locking
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        if (!course.isContentLocked) {
            return res.status(400).json({
                success: false,
                message: 'Course content is not finalized by instructor. Please ask instructor to lock the course.'
            });
        }

        // Check if enrollment exists and course is completed
        // Check if enrollment exists
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId
        });

        if (!enrollment) {
            return res.status(400).json({
                success: false,
                message: 'Not enrolled in this course',
            });
        }

        // --- SELF-HEALING: Sync QuizResults to Enrollment ---
        const QuizResult = require('../models/QuizResult');
        // Find all PASSED quiz results for this student & course
        const passedResults = await QuizResult.find({
            student: studentId,
            course: courseId,
            passed: true
        });

        if (passedResults.length > 0) {
            let changesMade = false;

            // Ensure progress object exists
            if (!enrollment.progress) {
                enrollment.progress = { completedQuizzes: [], completionPercentage: 0 };
            }
            if (!enrollment.progress.completedQuizzes) {
                enrollment.progress.completedQuizzes = [];
            }

            // Map existing completed sections
            const existingSections = new Set(enrollment.progress.completedQuizzes.map(q => q.sectionIndex));

            // Add results that aren't in enrollment
            passedResults.forEach(result => {
                if (!existingSections.has(result.sectionIndex)) {
                    enrollment.progress.completedQuizzes.push({
                        sectionIndex: result.sectionIndex,
                        score: result.earnedPoints || result.score || 0,
                        percentage: result.percentage,
                        completedAt: result.submittedAt || new Date()
                    });
                    existingSections.add(result.sectionIndex);
                    changesMade = true;
                }
            });

            if (changesMade) {
                // Recalculate completion
                const totalQuizzesForCalc = course.sections.filter(s => s.quiz && s.quiz.questions && s.quiz.questions.length > 0).length;
                const completionPercentage = totalQuizzesForCalc > 0
                    ? Math.round((enrollment.progress.completedQuizzes.length / totalQuizzesForCalc) * 100)
                    : 0;

                enrollment.progress.completionPercentage = completionPercentage;

                if (completionPercentage >= 100) {
                    enrollment.isCompleted = true;
                    enrollment.completedAt = new Date();
                }

                await enrollment.save();
                console.log('Self-healing fixed enrollment in requestCertificate');
            }
        }
        // ----------------------------------------------------

        // Verify completion dynamically (in case isCompleted flag is stale)
        const totalQuizzes = course.sections.filter(s => s.quiz && s.quiz.questions && s.quiz.questions.length > 0).length;
        const completedQuizzes = enrollment.progress?.completedQuizzes?.length || 0;

        // Calculate percentage from actual data
        const calculatedPercentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

        // Verify last quiz passed
        let lastQuizSectionIndex = -1;
        course.sections.forEach((section, index) => {
            if (section.quiz && section.quiz.questions && section.quiz.questions.length > 0) {
                lastQuizSectionIndex = index;
            }
        });
        const lastQuizPassed = enrollment.progress?.completedQuizzes?.some(
            q => q.sectionIndex === lastQuizSectionIndex && q.percentage >= (course.sections[lastQuizSectionIndex].quiz?.passingScore || 70)
        );

        console.log(`Certificate Request: ${calculatedPercentage}% completed. Last Quiz Passed: ${lastQuizPassed}. IsCompleted: ${enrollment.isCompleted}`);

        // Trust isCompleted flag if set (handled by self-healing or previous logic), otherwise enforce strict checks
        if (!enrollment.isCompleted) {
            if (calculatedPercentage < 100 || !lastQuizPassed) {
                return res.status(400).json({
                    success: false,
                    message: 'Course tasks not completed. Please complete all quizzes and pass the final exam.',
                    debug: { completed: completedQuizzes, total: totalQuizzes, lastQuizPassed }
                });
            }
        }

        // Auto-fix enrollment status if needed
        if (!enrollment.isCompleted) {
            enrollment.isCompleted = true;
            enrollment.progress.completionPercentage = 100;
            enrollment.completedAt = new Date();
            await enrollment.save();
        }

        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({
            student: studentId,
            course: courseId,
        });

        if (existingCertificate) {
            return res.status(400).json({
                success: false,
                message: 'Certificate already requested',
            });
        }

        // Create certificate request
        const certificate = await Certificate.create({
            title: `Certificate of Completion - ${course.title}`,
            student: studentId,
            course: courseId,
            instructor: course.instructor,
            completionPercentage: enrollment.progress.completionPercentage,
            approvalStatus: 'pending_instructor',
            certificateNumber: `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`
        });

        // Notify Instructor
        await NotificationService.notifyInstructor(
            course.instructor,
            'New Certificate Request',
            `Student ${req.user.firstName} requested certificate manually.`
        );

        res.status(201).json({
            success: true,
            message: 'Certificate request submitted. Awaiting instructor approval.',
            data: certificate,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student's badges for a course
// @route   GET /api/student/badges/:courseId
// @access  Private (Student)
exports.getCourseBadges = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user._id;

        // Fetch badges awarded to this student for this course
        const badges = await Badge.find({
            student: studentId,
            course: courseId
        }).sort({ awardedAt: -1 });

        // Enrich with quiz and section info from QuizResult
        const QuizResult = require('../models/QuizResult');
        const enrichedBadges = await Promise.all(badges.map(async (badge) => {
            const quizResult = await QuizResult.findOne({
                student: studentId,
                course: courseId,
                badgeId: badge._id
            });

            return {
                _id: badge._id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                sectionIndex: quizResult?.sectionIndex,
                quizTitle: quizResult?.quizTitle,
                awardedAt: badge.awardedAt
            };
        }));

        res.status(200).json({
            success: true,
            count: enrichedBadges.length,
            data: enrichedBadges
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student's quiz results for a course
// @route   GET /api/student/quiz-results/:courseId
// @access  Private (Student)
exports.getStudentQuizResults = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user._id;
        const QuizResult = require('../models/QuizResult');

        // Fetch all quiz results for this student and course
        const results = await QuizResult.find({
            student: studentId,
            course: courseId
        }).sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit embedded quiz
// @route   POST /api/student/courses/:courseId/sections/:sectionIndex/quiz/attempt
// @access  Private (Student)
exports.submitEmbeddedQuiz = async (req, res, next) => {
    console.log('=== submitEmbeddedQuiz called ===');
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('User:', req.user?.id);

    try {
        const { courseId, sectionIndex } = req.params;
        const { answers } = req.body; // Array of selected option indices
        const studentId = req.user.id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        const section = course.sections[parseInt(sectionIndex)];
        if (!section || !section.quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

        const quiz = section.quiz;

        // Calculate Score
        let score = 0;
        let correctCount = 0;
        const totalQuestions = quiz.questions.length;
        const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

        const resultsDetails = quiz.questions.map((q, idx) => {
            const selected = answers[idx];
            const isCorrect = selected === q.correctAnswer;
            if (isCorrect) {
                score += (q.points || 1);
                correctCount++;
            }
            return {
                questionText: q.questionText,
                selectedAnswer: selected,
                correctAnswer: q.correctAnswer,
                isCorrect
            };
        });

        const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
        const passed = percentage >= quiz.passingScore;

        console.log('Quiz Submission:', { courseId, sectionIndex, passed, percentage, passingScore: quiz.passingScore });

        // Update Enrollment Progress (regardless of pass/fail, but only count passed quizzes)
        const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
        console.log('Found enrollment:', enrollment ? 'Yes' : 'No');

        if (enrollment) {
            // Initialize completedQuizzes if it doesn't exist
            if (!enrollment.progress) {
                enrollment.progress = { completedQuizzes: [], completionPercentage: 0 };
            }
            if (!enrollment.progress.completedQuizzes) {
                enrollment.progress.completedQuizzes = [];
            }

            console.log('Current completedQuizzes:', enrollment.progress.completedQuizzes);

            if (passed) {
                // Check if this quiz was already completed
                const existingQuizIndex = enrollment.progress.completedQuizzes.findIndex(
                    q => q.sectionIndex === parseInt(sectionIndex)
                );

                if (existingQuizIndex >= 0) {
                    // Update existing quiz record
                    enrollment.progress.completedQuizzes[existingQuizIndex] = {
                        sectionIndex: parseInt(sectionIndex),
                        score,
                        percentage,
                        completedAt: new Date()
                    };
                } else {
                    // Add new quiz completion
                    enrollment.progress.completedQuizzes.push({
                        sectionIndex: parseInt(sectionIndex),
                        score,
                        percentage,
                        completedAt: new Date()
                    });
                }

                console.log('Updated completedQuizzes:', enrollment.progress.completedQuizzes);

                // Calculate progress: count sections with passed quizzes
                const totalQuizzes = course.sections.filter(s => s.quiz && s.quiz.questions && s.quiz.questions.length > 0).length;
                const completedQuizzesCount = enrollment.progress.completedQuizzes.length;
                const completionPercentage = totalQuizzes > 0
                    ? Math.round((completedQuizzesCount / totalQuizzes) * 100)
                    : 0;

                enrollment.progress.completionPercentage = completionPercentage;

                console.log('Progress:', { totalSections, completedSections, completionPercentage });

                // Mark as completed if 100%
                if (completionPercentage >= 100) {
                    enrollment.isCompleted = true;
                    enrollment.completedAt = new Date();
                }

                await enrollment.save();
                console.log('Enrollment saved successfully');
            }
        }

        // Certificate Logic
        if (passed) {
            // Find index of the last section that HAS a quiz
            let lastQuizSectionIndex = -1;
            course.sections.forEach((section, index) => {
                if (section.quiz && section.quiz.questions && section.quiz.questions.length > 0) {
                    lastQuizSectionIndex = index;
                }
            });

            const isLastSection = parseInt(sectionIndex) === lastQuizSectionIndex;
            if (isLastSection && course.isContentLocked) {
                const existingCert = await Certificate.findOne({ student: studentId, course: courseId });
                if (!existingCert) {
                    await Certificate.create({
                        title: `Certificate of Completion - ${course.title}`,
                        student: studentId,
                        course: courseId,
                        instructor: course.instructor,
                        completionPercentage: 100,
                        approvalStatus: 'pending_instructor',
                        certificateNumber: `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`
                    });

                    // Notify Instructor
                    await NotificationService.notifyInstructor(
                        course.instructor,
                        'New Certificate Request',
                        `Student ${req.user.firstName} passed final quiz for ${course.title}.`
                    );
                }
            }
        }

        res.status(200).json({
            success: true,
            passed,
            score,
            totalQuestions,
            correctAnswers: correctCount,
            percentage,
            answers: resultsDetails // Return breakdown to frontend
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Get certificate eligibility for a course
// @route   GET /api/student/courses/:courseId/certificate-eligibility
// @access  Private (Student)
exports.getCertificateEligibility = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // Get course with all sections
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Get enrollment
        const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Not enrolled in this course' });
        }

        // Check existing certificate
        const existingCertificate = await Certificate.findOne({ student: studentId, course: courseId });

        // --- SELF-HEALING: Sync QuizResults to Enrollment ---
        const QuizResult = require('../models/QuizResult');
        // Find all PASSED quiz results for this student & course
        const passedResults = await QuizResult.find({
            student: studentId,
            course: courseId,
            passed: true
        });

        if (passedResults.length > 0) {
            let changesMade = false;

            // Ensure progress object exists
            if (!enrollment.progress) {
                enrollment.progress = { completedQuizzes: [], completionPercentage: 0 };
            }
            if (!enrollment.progress.completedQuizzes) {
                enrollment.progress.completedQuizzes = [];
            }

            // Map existing completed sections
            const existingSections = new Set(enrollment.progress.completedQuizzes.map(q => q.sectionIndex));

            // Add results that aren't in enrollment
            passedResults.forEach(result => {
                if (!existingSections.has(result.sectionIndex)) {
                    enrollment.progress.completedQuizzes.push({
                        sectionIndex: result.sectionIndex,
                        score: result.earnedPoints || result.score || 0,
                        percentage: result.percentage,
                        completedAt: result.submittedAt || new Date()
                    });
                    existingSections.add(result.sectionIndex); // Prevent duplicates in this loop
                    changesMade = true;
                }
            });

            if (changesMade) {
                // Recalculate completion
                const totalQuizzes = course.sections.filter(s => s.quiz && s.quiz.questions && s.quiz.questions.length > 0).length;
                const completionPercentage = totalQuizzes > 0
                    ? Math.round((enrollment.progress.completedQuizzes.length / totalQuizzes) * 100)
                    : 0;

                enrollment.progress.completionPercentage = completionPercentage;

                if (completionPercentage >= 100) {
                    enrollment.isCompleted = true;
                    enrollment.completedAt = new Date();
                }

                await enrollment.save();
                // Refresh enrollment is not needed as we updated the object in memory
            }
        }
        // ----------------------------------------------------

        // Count total quizzes in course
        const totalQuizzes = course.sections.filter(s => s.quiz && s.quiz.questions && s.quiz.questions.length > 0).length;

        // Count completed quizzes from enrollment
        const completedQuizzes = enrollment.progress?.completedQuizzes?.length || 0;

        // Calculate progress percentage
        const progressPercentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

        // Check if last quiz is passed
        let lastQuizSectionIndex = -1;
        course.sections.forEach((section, index) => {
            if (section.quiz && section.quiz.questions && section.quiz.questions.length > 0) {
                lastQuizSectionIndex = index;
            }
        });

        const lastQuizPassed = enrollment.progress?.completedQuizzes?.some(
            q => q.sectionIndex === lastQuizSectionIndex && q.percentage >= (course.sections[lastQuizSectionIndex].quiz?.passingScore || 70)
        ) || false;



        // Determine eligibility
        const isEligible = course.isContentLocked && progressPercentage >= 100 && lastQuizPassed && !existingCertificate;

        res.status(200).json({
            success: true,
            data: {
                totalQuizzes,
                completedQuizzes,
                progressPercentage,
                isContentLocked: course.isContentLocked,
                lastQuizPassed,
                isEligible,
                certificate: existingCertificate || null
            }
        });

    } catch (err) {
        next(err);
    }
};

module.exports = exports;
