import { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';
import {
    FaBook,
    FaVideo,
    FaQuestionCircle,
    FaCog,
    FaArrowLeft,
    FaChartBar,
    FaUsers,
    FaComments,
    FaMedal,
    FaCertificate
} from 'react-icons/fa';

function CourseManagementSidebar() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { token, user } = useSelector(state => state.auth);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (token && courseId) {
            socketService.connect(token);
            socketService.joinCourse(courseId);

            const handleNewMessage = (message) => {
                const isOwn = message.sender._id === user._id || message.sender === user._id;
                const isOnChatPage = location.pathname.includes('/community');

                if (!isOwn && !isOnChatPage) {
                    setUnreadCount(prev => prev + 1);
                }
            };

            socketService.onNewMessage(handleNewMessage);

            // Don't disconnect here if we want to keep connection alive for child components,
            // but usually sidebar unmounts only when leaving course entirely.
            // If we navigate between child routes, sidebar stays mounted.
            return () => {
                // Remove this specific listener to avoid duplicates if re-mounting
                // But better to manage globally. For now this works.
                // We don't disconnect because other components might use it.
            };
        }
    }, [token, courseId, user, location.pathname]);

    useEffect(() => {
        if (location.pathname.includes('/community')) {
            setUnreadCount(0);
        }
    }, [location.pathname]);

    const menuItems = [
        { path: `/instructor/courses/${courseId}/overview`, icon: FaBook, label: 'Overview' },
        { path: `/instructor/courses/${courseId}/lectures`, icon: FaVideo, label: 'Lectures' },
        { path: `/instructor/courses/${courseId}/quizzes`, icon: FaQuestionCircle, label: 'Quizzes' },
        { path: `/instructor/courses/${courseId}/students`, icon: FaUsers, label: 'Students' },
        { path: `/instructor/courses/${courseId}/badges`, icon: FaMedal, label: 'Badges' },
        {
            path: `/instructor/courses/${courseId}/community`,
            icon: FaComments,
            label: 'Community Chat',
            badge: unreadCount > 0 ? unreadCount : null
        },
        { path: `/instructor/courses/${courseId}/analytics`, icon: FaChartBar, label: 'Analytics' },
        { path: `/instructor/courses/${courseId}/certificates`, icon: FaCertificate, label: 'Certificate Requests' },
    ];

    return (
        <div className="course-management-sidebar">
            <div className="sidebar-header">
                <button
                    onClick={() => navigate('/instructor/courses')}
                    className="back-button"
                >
                    <FaArrowLeft />
                    <span>Back to Courses</span>
                </button>
                <h2 className="sidebar-title">📚 Course Management</h2>
                <p className="sidebar-subtitle">Manage course content</p>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon className="sidebar-icon" />
                        <span className="sidebar-label">{item.label}</span>
                        {item.badge && (
                            <span className="badge">{item.badge}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <style jsx>{`
                .course-management-sidebar {
                    width: 280px;
                    height: 100vh;
                    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0;
                    top: 0;
                    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                }

                .sidebar-header {
                    padding: 2rem 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 1.5rem;
                    width: 100%;
                }

                .back-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateX(-3px);
                }

                .sidebar-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .sidebar-subtitle {
                    font-size: 0.875rem;
                    opacity: 0.8;
                    margin: 0.5rem 0 0 0;
                }

                .sidebar-nav {
                    flex: 1;
                    padding: 1.5rem 0;
                    overflow-y: auto;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    transition: all 0.3s ease;
                    position: relative;
                    margin: 0.25rem 0.75rem;
                    border-radius: 12px;
                }

                .sidebar-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    transform: translateX(5px);
                }

                .sidebar-link.active {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .sidebar-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 70%;
                    background: white;
                    border-radius: 0 4px 4px 0;
                }

                .sidebar-icon {
                    font-size: 1.25rem;
                    margin-right: 1rem;
                    min-width: 20px;
                }

                .sidebar-label {
                    font-size: 0.95rem;
                    flex: 1;
                }

                .badge {
                    background: #ef4444;
                    color: white;
                    font-size: 0.75rem;
                    font-weight: bold;
                    min-width: 20px;
                    height: 20px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 6px;
                }

                /* Scrollbar styling */
                .sidebar-nav::-webkit-scrollbar {
                    width: 6px;
                }

                .sidebar-nav::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }

                .sidebar-nav::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                }

                .sidebar-nav::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}

export default CourseManagementSidebar;
