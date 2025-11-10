import React, { useState, useEffect } from "react";
import { FaCode, FaShieldAlt, FaDesktop, FaList } from "react-icons/fa";

// --- Mock Data (12 Courses) ---
const mockCourses = [
  // Web Development
  { id: 1, title: "Complete Web Development Bootcamp", category: "Web Development", description: "Learn HTML, CSS, JavaScript, React, Node.js.", level: "Beginner", rating: 4.7, imageUrl: "src/assets/course1.jpg" },
  { id: 2, title: "Advanced JavaScript & ES6", category: "Web Development", description: "Deep dive into modern JavaScript concepts.", level: "Advanced", rating: 4.6, imageUrl: "src/assets/course2.jpg" },
  { id: 3, title: "React & Next.js Frameworks", category: "Web Development", description: "Build high-performance web apps with React and Next.js.", level: "Intermediate", rating: 4.8, imageUrl: "src/assets/course3.png" },
  { id: 4, title: "Fullstack MERN Project", category: "Web Development", description: "End-to-end MERN stack project with deployment.", level: "Advanced", rating: 4.9, imageUrl: "src/assets/course4.png" },

  // Cybersecurity
  { id: 5, title: "Ethical Hacking Essentials", category: "Cybersecurity", description: "Understand penetration testing and secure networks.", level: "Intermediate", rating: 4.8, imageUrl: "src/assets/course5.jpg" },
  { id: 6, title: "Cyber Forensics Investigator", category: "Cybersecurity", description: "Recover and investigate digital evidence.", level: "Advanced", rating: 4.9, imageUrl: "src/assets/course6.jpeg" },
  { id: 7, title: "Network Security & Defense", category: "Cybersecurity", description: "Protect against malware, ransomware, and attacks.", level: "Intermediate", rating: 4.6, imageUrl: "src/assets/course7.png" },
  { id: 8, title: "Penetration Testing Mastery", category: "Cybersecurity", description: "Learn advanced pentesting techniques.", level: "Advanced", rating: 4.9, imageUrl: "src/assets/course8.jpeg" },

  // IT
  { id: 9, title: "Graphic Designing & Fundamentals", category: "IT", description: "Master with Adobe tools with video animation & graphics", level: "Beginner", rating: 4.5, imageUrl: "src/assets/course9.jpg" },
  { id: 10, title: "Cloud Computing Basics (AWS)", category: "IT", description: "Introduction to cloud services and AWS fundamentals.", level: "Intermediate", rating: 4.7, imageUrl: "src/assets/course10.jpg" },
  { id: 11, title: "Microsoft Azure Fundamentals", category: "IT", description: "Learn cloud concepts with Azure.", level: "Beginner", rating: 4.6, imageUrl: "src/assets/course11.webp" },
  { id: 12, title: "Linux Administration Essentials", category: "IT", description: "Master Linux commands and server administration.", level: "Intermediate", rating: 4.8, imageUrl: "src/assets/course12.jpg" },
];

// Categories & Icons
const categories = ["All", "Web Development", "Cybersecurity", "IT"];
const categoryIcons = { "All": <FaList />, "Web Development": <FaCode />, "Cybersecurity": <FaShieldAlt />, "IT": <FaDesktop /> };
const categoryColors = { "Web Development": "bg-blue-100 text-blue-800", "Cybersecurity": "bg-red-100 text-red-800", "IT": "bg-green-100 text-green-800" };

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    setLoading(true); // Show loader on initial fetch
    // Simulate backend fetch with timeout
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000); // 1 second loading
  }, []);

  // Handle category change
  const handleCategoryChange = (category) => {
    setLoading(true);
    setSelectedCategory(category);
    // Simulate delay for UX
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const filteredCourses = selectedCategory === "All"
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="hidden md:block w-full md:w-1/5 lg:w-64 bg-white p-6 shadow-lg h-full fixed">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Categories</h2>
        <ul className="space-y-3">
          {categories.map(category => (
            <li key={category}>
              <button
                onClick={() => handleCategoryChange(category)}
                className={`w-full flex items-center text-left p-3 rounded-md font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-lg transform -translate-y-1"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <span className="mr-3 text-lg">{categoryIcons[category]}</span>
                {category}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-1/5 lg:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Explore Our Courses</h1>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${categoryColors[course.category] || 'bg-gray-100 text-gray-800'}`}>
                    {course.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 h-16">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">{course.description}</p>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm font-semibold text-purple-600">{course.level}</span>
                    <span className="text-yellow-500 font-bold">{course.rating} ★</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-600 col-span-3 text-center text-xl">No courses found for "{selectedCategory}".</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default CoursesPage;
