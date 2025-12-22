import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
    FaHome,
    FaBook,
    FaGraduationCap,
    FaCertificate,
    FaTrophy,
    FaChartLine,
    FaUsers,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaPlus,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaTachometerAlt
} from 'react-icons/fa';

const DashboardLayout = ({ children, role }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // Navigation items based on role
    const getNavigationItems = () => {
        switch (role) {
            case 'student':
                return [
                    { name: 'Dashboard', path: '/student/dashboard', icon: FaTachometerAlt },
                    { name: 'My Courses', path: '/student/enrolled', icon: FaBook },
                    { name: 'Certificates', path: '/student/certificates', icon: FaCertificate },
                ];
            case 'instructor':
                return [
                    { name: 'Dashboard', path: '/instructor/dashboard', icon: FaTachometerAlt },
                    { name: 'My Courses', path: '/instructor/courses', icon: FaBook },
                    { name: 'Create Course', path: '/instructor/courses/create', icon: FaPlus },
                    { name: 'Analytics', path: '/instructor/analytics', icon: FaChartLine },
                ];
            case 'admin':
                return [
                    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
                    { name: 'Users', path: '/admin/users', icon: FaUsers },
                    { name: 'Courses', path: '/admin/courses', icon: FaBook },
                    { name: 'Instructors', path: '/admin/instructors', icon: FaChalkboardTeacher },
                    { name: 'Revenue', path: '/admin/revenue', icon: FaChartLine },
                    { name: 'Settings', path: '/admin/settings', icon: FaCog },
                ];
            default:
                return [];
        }
    };

    const navigationItems = getNavigationItems();

    const getRoleTitle = () => {
        switch (role) {
            case 'student':
                return '🎓 Student Panel';
            case 'instructor':
                return '👨‍🏫 Instructor Panel';
            case 'admin':
                return '👨‍💼 Admin Panel';
            default:
                return 'Dashboard';
        }
    };

    const getRoleSubtitle = () => {
        switch (role) {
            case 'student':
                return 'Learning Dashboard';
            case 'instructor':
                return 'Course Management';
            case 'admin':
                return 'Platform Management';
            default:
                return '';
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Top Navigation Bar */}
            <nav className="top-nav">
                <div className="nav-container">
                    <div className="nav-content">
                        {/* Left side */}
                        <div className="nav-left">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="mobile-menu-btn"
                            >
                                {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                            </button>
                            <Link to="/" className="logo">
                                Skillify
                            </Link>
                            <span className="role-badge">
                                {role}
                            </span>
                        </div>

                        {/* Right side */}
                        <div className="nav-right">
                            <Link to="/" className="home-link">
                                Home
                            </Link>
                            <div className="user-info">
                                <div className="user-avatar">
                                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="user-details">
                                    <p className="user-name">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="user-email">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">{getRoleTitle()}</h2>
                    <p className="sidebar-subtitle">{getRoleSubtitle()}</p>
                </div>

                <nav className="sidebar-nav">
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <item.icon className="sidebar-icon" />
                                <span className="sidebar-label">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt className="sidebar-icon" />
                        <span className="sidebar-label">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            <style jsx>{`
                .dashboard-layout {
                    min-height: 100vh;
                    background: #f9fafb;
                }

                /* Top Navigation */
                .top-nav {
                    background: white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 30;
                }

                .nav-container {
                    padding: 0 1rem;
                }

                .nav-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 4rem;
                }

                .nav-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .mobile-menu-btn {
                    display: block;
                    color: #6b7280;
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .mobile-menu-btn:hover {
                    color: #667eea;
                }

                .logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #667eea;
                    text-decoration: none;
                }

                .role-badge {
                    padding: 0.25rem 0.75rem;
                    background: #ede9fe;
                    color: #7c3aed;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .home-link {
                    color: #6b7280;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .home-link:hover {
                    color: #667eea;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .user-avatar {
                    width: 2.5rem;
                    height: 2.5rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                }

                .user-details {
                    display: none;
                }

                .user-name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                }

                .user-email {
                    font-size: 0.75rem;
                    color: #6b7280;
                    margin: 0;
                }

                /* Sidebar */
                .sidebar {
                    position: fixed;
                    top: 4rem;
                    left: 0;
                    bottom: 0;
                    width: 280px;
                    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                    z-index: 20;
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-open {
                    transform: translateX(0);
                }

                .sidebar-header {
                    padding: 2rem 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
                }

                .sidebar-footer {
                    padding: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .logout-btn:hover {
                    background: rgba(255, 59, 48, 0.8);
                    transform: translateY(-2px);
                }

                /* Overlay */
                .sidebar-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10;
                }

                /* Main Content */
                .main-content {
                    padding-top: 4rem;
                    min-height: 100vh;
                }

                /* Scrollbar */
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

                /* Desktop */
                @media (min-width: 1024px) {
                    .mobile-menu-btn {
                        display: none;
                    }

                    .sidebar {
                        transform: translateX(0);
                    }

                    .main-content {
                        padding-left: 280px;
                    }

                    .user-details {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
