import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Skillify Company */}
          <div>
            <h4 className="font-semibold mb-4">Skillify Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Articles</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Affiliates</a></li>
            </ul>
          </div>

          {/* Careers */}
          <div>
            <h4 className="font-semibold mb-4">Careers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Become an Instructor</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Teach on Skillify</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Skillify for Business</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Sitemap</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Get the App</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Investors</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Row */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Skillify, Inc.
          </p>

          <div className="text-gray-400 text-sm">
            <a href="#" className="hover:text-white">English</a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
