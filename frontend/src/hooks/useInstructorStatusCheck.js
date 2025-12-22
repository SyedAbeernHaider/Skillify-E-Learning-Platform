import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { loginSuccess, logout } from '../redux/slices/authSlice';

/**
 * Hook to periodically check and update instructor approval status
 */
const useInstructorStatusCheck = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user || user.role !== 'instructor') {
            return;
        }

        // Check status every 30 seconds
        const checkStatus = async () => {
            try {
                const response = await api.get('/auth/me');
                const updatedUser = response.data.data;

                // If status changed, update Redux and sessionStorage
                if (updatedUser.instructorStatus !== user.instructorStatus) {
                    console.log('🔄 Instructor status changed:', user.instructorStatus, '→', updatedUser.instructorStatus);

                    // Update user in Redux
                    const token = sessionStorage.getItem('token');
                    const refreshToken = sessionStorage.getItem('refreshToken');

                    dispatch(loginSuccess({
                        user: updatedUser,
                        token,
                        refreshToken
                    }));

                    // Show notification based on new status
                    if (updatedUser.instructorStatus === 'approved') {
                        alert('🎉 Congratulations! Your instructor application has been approved! You can now access the dashboard.');
                        navigate('/instructor/dashboard');
                    } else if (updatedUser.instructorStatus === 'rejected') {
                        alert('❌ Your instructor application was not approved. Please contact support for more information.');
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error('Error checking instructor status:', error);
            }
        };

        // Check immediately
        checkStatus();

        // Then check every 30 seconds
        const interval = setInterval(checkStatus, 30000);

        return () => clearInterval(interval);
    }, [user, dispatch, navigate]);
};

export default useInstructorStatusCheck;
