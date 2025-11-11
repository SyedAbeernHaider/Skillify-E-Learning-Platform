import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

// --- Backend Friendly ---
// Yeh mock data hai. Asal mein yeh API se aaye ga.
const mockCourses = [
  { id: 1, title: "Complete Web Development", category: "Web Development", instructor: "Dr. Hasan Kamran", price: "PKR 3,500" },
  { id: 2, title: "AWS Certified Architect", category: "Cloud", instructor: "Eng. Haziq Zia", price: "PKR 2,500" },
  { id: 3, title: "AI Fundamentals", category: "AI/ML", instructor: "PHD. Abdul Ali Naqvi", price: "PKR 3,200" },
  { id: 4, title: "Digital Marketing Course", category: "Marketing", instructor: "MSC. Abeer Haider", price: "PKR 1,800" },
  { id: 5, title: "Python for Data Science", category: "Data Science", instructor: "Dr. Syed Ahmed", price: "PKR 4,000" },
];

// Backend call ko simulate karein
const fetchCourses = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockCourses);
    }, 1000); // 1 second delay
  });
};

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
  }, []); // Sirf ek baar load hoga

  const handleEdit = (courseId) => {
    alert(`Course ID ${courseId} ko edit karein`);
  };

  const handleDelete = (courseId) => {
    if (window.confirm(`Kya aap waqai Course ID ${courseId} ko delete karna chahte hain?`)) {
      setCourses(courses.filter(course => course.id !== courseId)); // Frontend se remove karein (simulation)
      alert(`Course ID ${courseId} delete ho gaya`);
    }
  };

  const handleAddNew = () => {
    // Future mein hum yahan ek naya form ya modal kholeinge
    alert("Naya course add karne ka form yahan khulega");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {/* --- Header with Add New Button --- */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
        <button 
          onClick={handleAddNew}
          className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        // --- Courses Table ---
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{course.title}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{course.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{course.instructor}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-800">{course.price}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(course.id)} className="text-purple-600 hover:text-purple-900 mr-4 transition-colors">
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900 transition-colors">
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;