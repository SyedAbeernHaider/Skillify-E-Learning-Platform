import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


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

function App() {
  return (
    <Router>
      
      {/* 2. Is component ko yahan 'Router' ke bilkul andar daal dein */}
      <ScrollToTop /> 
      
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/teachonskillify" element={<TeachOnSkillify />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/teacher-signup" element={<TeacherSignUp />} />
        <Route path="/courses" element={<CoursesPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;