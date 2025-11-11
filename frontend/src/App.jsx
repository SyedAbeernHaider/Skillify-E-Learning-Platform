// --- FIX: useLocation import karna hai ---
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Pricing from "./pages/Pricing";
import TeachOnSkillify from "./pages/TeachOnSkillify";
import Cart from "./pages/Cart";
import TeacherSignUp from "./pages/Teacherpanel/TeacherSignUp";
import CoursesPage from "./pages/CoursesPage";
// Path aap ka 'Adminfolder' wala bilkul theek hai
import AdminDashboard from "./pages/Adminfolder/AdminDashboard";


// --- NAYA COMPONENT: Layout ko manage karne ke liye ---
// Yeh component App.jsx file ke andar hi rahega
const AppLayout = () => {
  const location = useLocation();
  
  // Yeh check karega ke URL '/admin' se shuru ho raha hai ya nahi
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {/* ScrollToTop har page ke liye kaam karega */}
      <ScrollToTop />
      
      {/* --- FIX: Sirf tab Navbar dikhayein jab admin page NA ho --- */}
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/teachonskillify" element={<TeachOnSkillify />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/teacher-signup" element={<TeacherSignUp />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      
      {/* --- FIX: Sirf tab Footer dikhayein jab admin page NA ho --- */}
      {!isAdminPage && <Footer />}
    </>
  );
};


// --- App component ab sirf Router aur AppLayout ko render karega ---
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;