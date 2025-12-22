import { NavLink } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaBook,
    FaPlus,
    FaUsers,
    FaChartBar,
    FaUser,
    FaComments,
    FaSignOutAlt
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';

function InstructorSidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/instructor/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
        { path: '/instructor/courses', icon: FaBook, label: 'My Courses' },
        { path: '/instructor/courses/create', icon: FaPlus, label: 'Create Course' },
        { path: '/instructor/profile', icon: FaUser, label: 'Profile' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="instructor-sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">👨‍🏫 Instructor Panel</h2>
                <p className="sidebar-subtitle">Course Management</p>
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
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt className="sidebar-icon" />
                    <span className="sidebar-label">Logout</span>
                </button>
            </div>

            <style jsx>{`
                .instructor-sidebar {
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

export default InstructorSidebar;
