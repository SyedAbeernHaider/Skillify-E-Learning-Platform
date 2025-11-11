import React, { useState } from 'react';

// --- (STEP 1) ---
// YAHAN HUM NE APNE SAARE COMPONENTS IMPORT KIYE HAIN
// Yeh sab 'Adminfolder' ke andar hain, isliye path './' hai
import AdminSidebar from './AdminSidebar'; 
import DashboardHome from './DashboardHome'; 
import ManageUsers from './ManageUsers'; 
import ManageCourses from './ManageCourses'; // Aakhri component


const AdminDashboard = () => {
  // 'dashboard' default hai, is liye page load hotay hi DashboardHome dikhega
  const [activeView, setActiveView] = useState('dashboard');

  // --- (STEP 2) ---
  // YEH FUNCTION FAISLA KARTA HAI KE KYA DIKHANA HAI
  const renderView = () => {
    switch (activeView) {
      
      // Jab state 'dashboard' hogi...
      case 'dashboard':
        return <DashboardHome />; // ...Toh Stats Cards dikhao

      // Jab state 'users' hogi...
      case 'users':
        return <ManageUsers />; // ...Toh Users Table dikhao
      
      // Jab state 'courses' hogi...
      case 'courses':
        return <ManageCourses />; // ...Toh Courses Table dikhao
      
      default:
        return <DashboardHome />;
    }
  };

  return (
    // Main layout
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar (Left) */}
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />

      {/* --- (STEP 3) --- */}
      {/* Main Content (Right) */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        
        {/* Yahan STEP 2 ka UI (tasveer) show hoga */}
        {renderView()} 

      </main>

    </div>
  );
};

export default AdminDashboard;