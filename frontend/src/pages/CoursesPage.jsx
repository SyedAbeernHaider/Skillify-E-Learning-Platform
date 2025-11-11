import React, { useState, useEffect } from "react";
import { FaCode, FaShieldAlt, FaDesktop, FaList } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for courses

// --- FIX 1: Saari images ko import karna zaroori hai ---
// (Main farz kar raha hoon ke yeh file 'src/pages/' mein hai aur assets 'src/assets/' mein)
import Course1Image from "../assets/course1.jpg";
import Course2Image from "../assets/course2.jpg";
import Course3Image from "../assets/course3.png";
import Course4Image from "../assets/course4.png";
import Course5Image from "../assets/course5.jpg";
import Course6Image from "../assets/course6.jpeg";
import Course7Image from "../assets/course7.png";
import Course8Image from "../assets/course8.jpeg";
import Course9Image from "../assets/course9.jpg";
import Course10Image from "../assets/course10.jpg";
import Course11Image from "../assets/course11.webp";
import Course12Image from "../assets/course12.jpg";
// --- END FIX 1 ---


// --- FIX 2: Saara static data component ke bahar rakhein (Optimization) ---
// Yeh "backend friendly" hai, aap is array ko API se replace kar sakte hain
const mockCourses = [
  // Web Development
  { id: 1, title: "Complete Web Development Bootcamp", category: "Web Development", description: "Learn HTML, CSS, JavaScript, React, Node.js.", level: "Beginner", rating: 4.7, imageUrl: Course1Image },
  { id: 2, title: "Advanced JavaScript & ES6", category: "Web Development", description: "Deep dive into modern JavaScript concepts.", level: "Advanced", rating: 4.6, imageUrl: Course2Image },
  { id: 3, title: "React & Next.js Frameworks", category: "Web Development", description: "Build high-performance web apps with React and Next.js.", level: "Intermediate", rating: 4.8, imageUrl: Course3Image },
  { id: 4, title: "Fullstack MERN Project", category: "Web Development", description: "End-to-end MERN stack project with deployment.", level: "Advanced", rating: 4.9, imageUrl: Course4Image },

  // Cybersecurity
  { id: 5, title: "Ethical Hacking Essentials", category: "Cybersecurity", description: "Understand penetration testing and secure networks.", level: "Intermediate", rating: 4.8, imageUrl: Course5Image },
  { id: 6, title: "Cyber Forensics Investigator", category: "Cybersecurity", description: "Recover and investigate digital evidence.", level: "Advanced", rating: 4.9, imageUrl: Course6Image },
  { id: 7, title: "Network Security & Defense", category: "Cybersecurity", description: "Protect against malware, ransomware, and attacks.", level: "Intermediate", rating: 4.6, imageUrl: Course7Image },
  { id: 8, title: "Penetration Testing Mastery", category: "Cybersecurity", description: "Learn advanced pentesting techniques.", level: "Advanced", rating: 4.9, imageUrl: Course8Image },

  // IT
  { id: 9, title: "Graphic Designing & Fundamentals", category: "IT", description: "Master with Adobe tools with video animation & graphics", level: "Beginner", rating: 4.5, imageUrl: Course9Image },
  { id: 10, title: "Cloud Computing Basics (AWS)", category: "IT", description: "Introduction to cloud services and AWS fundamentals.", level: "Intermediate", rating: 4.7, imageUrl: Course10Image },
  { id: 11, title: "Microsoft Azure Fundamentals", category: "IT", description: "Learn cloud concepts with Azure.", level: "Beginner", rating: 4.6, imageUrl: Course11Image },
  { id: 12, title: "Linux Administration Essentials", category: "IT", description: "Master Linux commands and server administration.", level: "Intermediate", rating: 4.8, imageUrl: Course12Image },
];

// Categories & Icons
const categories = ["All", "Web Development", "Cybersecurity", "IT"];
const categoryIcons = { "All": <FaList />, "Web Development": <FaCode />, "Cybersecurity": <FaShieldAlt />, "IT": <FaDesktop /> };
const categoryColors = { "Web Development": "bg-blue-100 text-blue-800", "Cybersecurity": "bg-red-100 text-red-800", "IT": "bg-green-100 text-green-800" };
// --- END FIX 2 ---


function CoursesPage() {
  const [allCourses, setAllCourses] = useState([]); // Master list
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Sirf initial load par data set hoga (Backend friendly)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAllCourses(mockCourses); // API call ki jagah mock data set kiya
      setLoading(false);
    }, 1000); // 1 second loading simulation
  }, []);

  // --- FIX 3: Filtering logic ko optimize kiya ---
  // Faltu loader hata diya, ab filter foran (instant) hoga
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredCourses = selectedCategory === "All"
    ? allCourses
    : allCourses.filter(course => course.category === selectedCategory);
  // --- END FIX 3 ---

  return (
    // --- FIX 4: Layout ko behtar kiya ---
    // Parent se 'min-h-screen' hata diya
    <div className="bg-gray-100">
      {/* Page ko container mein rakha */}
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row gap-8 px-4 py-8 md:py-12">

        {/* --- Sidebar (FIXED se STICKY kar diya) --- */}
        <aside className="w-full md:w-64 flex-shrink-0">
          {/* 'sticky' se yeh scroll ke saath move karega lekin footer se pehle ruk jayega */}
          {/* 'top-24' (96px) navbar (64px) + padding (32px) ke liye hai */}
          <div className="md:sticky md:top-24 bg-white p-6 shadow-lg rounded-lg">
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
          </div>
        </aside>

        {/* --- Main Content --- */}
        {/* 'flex-1' se yeh baaki jagah le lega aur 'min-h-screen' footer ko push karega */}
        <main className="flex-1 min-h-screen">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Explore Our Courses</h1>

          {/* Loader */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? filteredCourses.map(course => (
                
                // --- FIX 5: Course Card ko Link banaya ---
                <Link to={`/course/${course.id}`} key={course.id} className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col no-underline">
                  <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
                  
                  {/* Card content ko 'flex-1' diya taake card ki height barabar ho */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 self-start ${categoryColors[course.category] || 'bg-gray-100 text-gray-800'}`}>
                      {course.category}
                    </span>
                    
                    {/* --- FIX 6: Card text ki height fix ki --- */}
                    {/* 'h-16' ki jagah 'min-h-[3.5rem]' (2 lines) */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[3.5rem]">{course.title}</h3>
                    {/* 'h-20' ki jagah 'min-h-[4.5rem]' (3 lines) */}
                    <p className="text-gray-600 text-sm mb-4 min-h-[4.5rem] overflow-hidden">{course.description}</p>
                    
                    {/* 'mt-auto' se yeh hamesha card ke bottom mein rahega */}
                    <div className="flex justify-between items-center pt-3 border-t mt-auto">
                      <span className="text-sm font-semibold text-purple-600">{course.level}</span>
                      <span className="text-yellow-500 font-bold">{course.rating} ★</span>
                    </div>
                  </div>
                </Link>
                // --- END FIX 5 ---

              )) : (
                <p className="text-gray-600 col-span-3 text-center text-xl">No courses found for "{selectedCategory}".</p>
              )}
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
}

export default CoursesPage;