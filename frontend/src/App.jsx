import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Pricing from "./pages/Pricing";


function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;


 