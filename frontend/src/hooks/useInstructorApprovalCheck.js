import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/**
 * Hook to check if instructor is approved before accessing protected pages
 * Redirects to appropriate page based on instructor status
 */
const useInstructorApprovalCheck = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Don't check on profile-related pages
        const isProfilePage = location.pathname.includes('/instructor/profile');
        if (isProfilePage) {
            return;
        }

        if (user && user.role === 'instructor') {
            // If profile not completed, redirect to complete it
            if (!user.profileCompleted) {
                toast.dismiss(); // Clear any existing toasts
                toast.info('Please complete your profile to continue');
                navigate('/instructor/profile/complete');
                return;
            }

            // If profile completed but not approved yet
            if (user.instructorStatus === 'pending') {
                toast.dismiss(); // Clear any existing toasts
                toast.warning('Your instructor application is pending admin approval. Please wait for approval to access this page.');
                navigate('/');
                return;
            }

            // If application was rejected
            if (user.instructorStatus === 'rejected') {
                toast.dismiss(); // Clear any existing toasts
                toast.error('Your instructor application was not approved by the admin. Please contact support for more information.');
                navigate('/');
                return;
            }
        }
    }, [user, navigate, location.pathname]);

    return user?.instructorStatus === 'approved';
};

export default useInstructorApprovalCheck;
