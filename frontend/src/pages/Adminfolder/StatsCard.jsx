import React from 'react';

// Yeh component props lega (icon, title, value, color)
const StatsCard = ({ icon, title, value, colorClass }) => {
  return (
    // Card ka container
    <div className={`bg-white p-6 rounded-lg shadow-lg flex items-center transition-transform transform hover:scale-105`}>
      {/* Icon (background color prop se aaye ga) */}
      <div className={`p-4 rounded-full ${colorClass} text-white mr-4`}>
        {icon}
      </div>
      
      {/* Content */}
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;