import React, { useState, useEffect } from 'react';
// --- FIX: Sahi Path ---
// Kyunke 'StatsCard.jsx' isi folder mein hai
import StatsCard from './StatsCard'; 
import { FaUsers, FaBook, FaMoneyBillWave } from 'react-icons/fa';

// --- Backend Friendly ---
// Yeh data aap backend se fetch kareinge. Filhaal hum mock data daal rahe hain.
const getDashboardStats = () => {
  // Yeh ek 'Promise' hai jo backend call ko simulate kar raha hai
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalUsers: 1250,
        totalCourses: 75,
        totalEarnings: 1578000, // PKR mein
      });
    }, 1000); // 1 second delay
  });
};


const DashboardHome = () => {
  const [stats, setStats] = useState(null); // Data store karne ke liye
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    // Data fetch karein
    getDashboardStats().then(data => {
      setStats(data); // Data ko state mein set karein
      setLoading(false); // Loading ko band kar dein
    });
  }, []); // Empty array [] ka matlab hai ke yeh sirf ek baar load hoga

  // Loader state
  // Jab tak data load ho raha hai (loading === true), yeh dikhayein
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Jab data load ho jaye (loading === false), yeh dikhayein
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, Admin!</h1>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <StatsCard 
          icon={<FaUsers className="w-6 h-6" />}
          title="Total Users"
          value={stats.totalUsers.toLocaleString()} // '1,250'
          colorClass="bg-purple-500"
        />
        
        <StatsCard 
          icon={<FaBook className="w-6 h-6" />}
          title="Total Courses"
          value={stats.totalCourses}
          colorClass="bg-blue-500"
        />
        
        <StatsCard 
          icon={<FaMoneyBillWave className="w-6 h-6" />}
          title="Total Earnings"
          // PKR format
          value={`PKR ${stats.totalEarnings.toLocaleString()}`} 
          colorClass="bg-green-500"
        />

      </div>

      {/* Yahan aap baad mein charts ya recent activity daal sakte hain */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-600">Recent activity feed coming soon...</p>
      </div>

    </div>
  );
};

export default DashboardHome;