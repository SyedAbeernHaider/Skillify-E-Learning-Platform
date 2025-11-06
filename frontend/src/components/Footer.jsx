import React from "react";
import { Link } from "react-router-dom"; // Links ke liye 'a' tag ki jagah

// --- NAYA GLOBE ICON ---
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const Footer = () => {
  // Links ke liye common classes
  const linkClass = "text-gray-300 hover:text-white transition-colors no-underline text-sm";

  return (
    // 'bg-skillify-dark' ki jagah 'bg-gray-900' (default tailwind class)
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Links ka naya 4-column layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Column 1: About */}
          <div>
            <ul className="space-y-3">
              <li><Link to="/about" className={linkClass}>About Us</Link></li>
              <li><Link to="/careers" className={linkClass}>Careers</Link></li>
              <li><Link to="/contact" className={linkClass}>Contact Us</Link></li>
              <li><Link to="/blog" className={linkClass}>Blog</Link></li>
              <li><Link to="/investors" className={linkClass}>Investors</Link></li>
            </ul>
          </div>

          {/* Column 2: Discover Skillify */}
          <div>
            <ul className="space-y-3">
              <li><Link to="/get-the-app" className={linkClass}>Get the App</Link></li>
              <li><Link to="/teachonskillify" className={linkClass}>Teach on Skillify</Link></li>
              <li><Link to="/pricing" className={linkClass}>Plans & Pricing</Link></li>
              <li><Link to="/affiliates" className={linkClass}>Affiliates</Link></li>
              <li><Link to="/help" className={linkClass}>Help and Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Skillify for Business */}
          <div>
            <ul className="space-y-3">
              <li><Link to="/business" className={linkClass}>Skillify for Business</Link></li>
              <li><Link to="/become-instructor" className={linkClass}>Become an Instructor</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Support */}
          <div>
            <ul className="space-y-3">
              <li><Link to="/terms" className={linkClass}>Terms</Link></li>
              <li><Link to="/privacy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link to="/sitemap" className={linkClass}>Sitemap</Link></li>
              <li><Link to="/accessibility" className={linkClass}>Accessibility Statement</Link></li>
            </ul>
          </div>

        </div>
        
        {/* Border Line */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Left Side: Logo and Copyright */}
            <div className="flex items-center mb-4 md:mb-0">
              {/* Skillify Logo (Text) -- YAHAN COLOR CHANGE KIYA HAI -- */}
              <Link to="/" className="text-2xl font-bold text-purple-600 no-underline mr-4">Skillify</Link>
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Skillify, Inc.
              </p>
            </div>

            {/* Right Side: Language Button */}
            <div>
              <button className="flex items-center text-gray-300 hover:text-white border border-gray-500 rounded-md px-3 py-2 transition-colors">
                <GlobeIcon />
                <span>English</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;