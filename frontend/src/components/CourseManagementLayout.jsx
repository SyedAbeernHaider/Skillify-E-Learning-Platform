import { Outlet } from 'react-router-dom';
import CourseManagementSidebar from './CourseManagementSidebar';

function CourseManagementLayout() {
    return (
        <div className="course-management-layout">
            <CourseManagementSidebar />
            <div className="course-management-content">
                <Outlet />
            </div>

            <style jsx>{`
                .course-management-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #f3f4f6;
                }

                .course-management-content {
                    flex: 1;
                    padding: 2rem;
                    margin-left: 280px; /* Width of sidebar */
                }

                @media (max-width: 1024px) {
                    .course-management-layout {
                        flex-direction: column;
                    }

                    .course-management-content {
                        margin-left: 0;
                    }
                }
            `}</style>
        </div>
    );
}

export default CourseManagementLayout;
