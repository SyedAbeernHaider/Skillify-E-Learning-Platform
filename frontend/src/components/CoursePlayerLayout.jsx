import CoursePlayerSidebar from './CoursePlayerSidebar';

function CoursePlayerLayout({ children }) {
    return (
        <div className="course-player-layout">
            <CoursePlayerSidebar />
            <main className="course-player-main">
                {children}
            </main>

            <style jsx>{`
                .course-player-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #f9fafb;
                }

                .course-player-main {
                    flex: 1;
                    margin-left: 280px;
                    padding: 2rem;
                    min-height: 100vh;
                }

                @media (max-width: 1024px) {
                    .course-player-main {
                        margin-left: 0;
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default CoursePlayerLayout;
