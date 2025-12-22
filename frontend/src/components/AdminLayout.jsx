import AdminSidebar from './AdminSidebar';

function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                {children}
            </div>

            <style jsx>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #f9fafb;
                }

                .admin-content {
                    flex: 1;
                    margin-left: 280px;
                    min-height: 100vh;
                }

                @media (max-width: 1024px) {
                    .admin-content {
                        margin-left: 0;
                    }
                }
            `}</style>
        </div>
    );
}

export default AdminLayout;
