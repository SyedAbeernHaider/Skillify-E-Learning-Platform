import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from './redux/slices/authSlice';

// Components
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminRegister from './pages/AdminRegister';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import Pricing from './pages/Pricing';
import TeachOnSkillify from './pages/TeachOnSkillify';
import Cart from './pages/Cart';

// Admin Pages 
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminCourses from './pages/Admin/AdminCourses';
import AdminInstructors from './pages/Admin/AdminInstructors';
import InstructorApprovals from './pages/Admin/InstructorApprovals';
import AdminRevenue from './pages/Admin/AdminRevenue';
import Analytics from './pages/Admin/Analytics';

import InstructorCourseOverview from './pages/Instructor/InstructorCourseOverview';
import InstructorCourseAnalytics from './pages/Instructor/InstructorCourseAnalytics';

import AdminSettings from './pages/Admin/AdminSettings';
import AdminCertificates from './pages/Admin/AdminCertificates';

// Teacher Pages
import TeacherSignUp from './pages/Teacherpanel/TeacherSignUp';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentCourses from './pages/Student/StudentCourses';
import CourseDetail from './pages/Student/CourseDetail';
import EnrolledCourses from './pages/Student/EnrolledCourses';
import StudentBadges from './pages/Student/StudentBadges';
import StudentCertificates from './pages/Student/StudentCertificates';
import CertificateRequest from './pages/Student/CertificateRequest';
import StudentProgress from './pages/Student/StudentProgress';
import CoursePlayer from './pages/Student/CoursePlayer';
import TakeQuiz from './pages/Student/TakeQuiz';
import SubmitAssignment from './pages/Student/SubmitAssignment';

// Course Player Pages
import CourseOverview from './pages/Student/CoursePlayer/CourseOverview';
import CourseLectures from './pages/Student/CoursePlayer/CourseLectures';
import CourseQuizzes from './pages/Student/CoursePlayer/CourseQuizzes';
import CourseBadges from './pages/Student/CoursePlayer/CourseBadges';
import CourseCommunity from './pages/Student/CoursePlayer/CourseCommunity';
import CourseCertificate from './pages/Student/CoursePlayer/CourseCertificate';

// Instructor Pages
import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import CreateCourse from './pages/Instructor/CreateCourse';
import InstructorCourses from './pages/Instructor/InstructorCourses';
import InstructorStudents from './pages/Instructor/InstructorStudents';
import InstructorProfileForm from './pages/Instructor/InstructorProfileForm';
import InstructorProfile from './pages/Instructor/InstructorProfile';

// Course Management Pages
import ManageLectures from './pages/Instructor/CourseManagement/ManageLectures';
import ManageQuizzes from './pages/Instructor/CourseManagement/ManageQuizzes';
import CourseStudentResults from './pages/Instructor/CourseManagement/CourseStudentResults';
import InstructorCourseBadges from './pages/Instructor/CourseManagement/CourseBadges';
import InstructorCourseCommunity from './pages/Instructor/CourseManagement/CourseCommunity';
import CourseCertificates from './pages/Instructor/CourseManagement/CourseCertificates';
import CourseManagementLayout from './components/CourseManagementLayout';

// Community Pages
import CommunityChat from './pages/CommunityChat';
import useInstructorStatusCheck from './hooks/useInstructorStatusCheck';

// Layout Component
const AppLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Load user from session storage on app start
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Check instructor status periodically
  useInstructorStatusCheck();

  // Check if current page is admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  const isInstructorPage = location.pathname.startsWith('/instructor');
  const isStudentPage = location.pathname.startsWith('/student');

  // Don't show navbar/footer on dashboard pages
  const hiddenNavFooter = isAdminPage || isInstructorPage || isStudentPage;

  return (
    <>
      <ScrollToTop />

      {/* Show Navbar only on public pages */}
      {!hiddenNavFooter && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/teachonskillify" element={<TeachOnSkillify />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/teacher-signup" element={<TeacherSignUp />} />

        {/* Community Route - Accessible to all authenticated users */}
        <Route
          path="/community"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <CommunityChat />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/enrolled"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <EnrolledCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/badges"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentBadges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/certificates"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCertificates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/certificate-request"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CertificateRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/progress"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course-player/:courseId"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CoursePlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/quiz/:courseId/:sectionIndex/:lectureIndex"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <TakeQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignment/:courseId/:sectionIndex/:lectureIndex"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <SubmitAssignment />
            </ProtectedRoute>
          }
        />

        {/* Course Player Routes */}
        <Route
          path="/student/course/:courseId/overview"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseId/lectures"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseLectures />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseId/quizzes"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseId/badges"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseBadges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseId/community"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseCommunity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseId/certificate"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseCertificate />
            </ProtectedRoute>
          }
        />

        {/* Instructor Routes */}
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses/create"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/students"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/profile/complete"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorProfileForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/profile"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorProfile />
            </ProtectedRoute>
          }
        />

        {/* Course Management Routes - Wrapped with Layout */}
        <Route
          path="/instructor/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <CourseManagementLayout />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<InstructorCourseOverview />} />
          <Route path="lectures" element={<ManageLectures />} />
          <Route path="quizzes" element={<ManageQuizzes />} />
          <Route path="students" element={<CourseStudentResults />} />
          <Route path="badges" element={<InstructorCourseBadges />} />
          <Route path="community" element={<InstructorCourseCommunity />} />
          <Route path="certificates" element={<CourseCertificates />} />
          <Route path="analytics" element={<InstructorCourseAnalytics />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/instructor-approvals"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <InstructorApprovals />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminCourses />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/instructors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminInstructors />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/revenue"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminRevenue />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/certificates"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminCertificates />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold">404 - Page Not Found</h1></div>} />
      </Routes>

      {/* Show Footer only on public pages */}
      {!hiddenNavFooter && <Footer />}
    </>
  );
};

function App() {
  return <AppLayout />;
}

export default App;
