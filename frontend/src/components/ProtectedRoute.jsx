import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    // Check if user data exists in sessionStorage to prevent redirect on reload
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');

        // If we have token and user in storage, wait a moment for Redux to hydrate
        if (token && storedUser) {
            // Small delay to allow Redux state to load from storage
            const timer = setTimeout(() => {
                setIsChecking(false);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsChecking(false);
        }
    }, []);

    // Show nothing while checking (prevents flash of redirect)
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // If not authenticated, redirect to login and save the attempted location
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If roles are specified, check if user has the required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Redirect to appropriate dashboard based on user role
        switch (user?.role) {
            case 'student':
                return <Navigate to="/student/dashboard" replace />;
            case 'instructor':
                return <Navigate to="/instructor/dashboard" replace />;
            case 'admin':
                return <Navigate to="/admin/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
