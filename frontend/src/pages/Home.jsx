import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBook,
  FaUsers,
  FaCertificate,
  FaStar,
  FaArrowRight,
  FaPlay,
  FaCheckCircle,
  FaGraduationCap,
  FaChartLine,
  FaTrophy,
  FaRocket,
  FaLightbulb,
  FaCode,
  FaPalette,
  FaDatabase,
  FaMobile,
  FaChartBar
} from 'react-icons/fa';
import { getAllCourses } from '../services/api/studentService';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    students: '50,000+',
    courses: '1,000+',
    instructors: '500+',
    certificates: '25,000+'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data.slice(0, 6)); // Get top 6 courses
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Web Development', icon: FaCode, color: 'from-blue-500 to-blue-600', count: '250+' },
    { name: 'Data Science', icon: FaChartBar, color: 'from-purple-500 to-purple-600', count: '180+' },
    { name: 'Design', icon: FaPalette, color: 'from-pink-500 to-pink-600', count: '150+' },
    { name: 'Mobile Dev', icon: FaMobile, color: 'from-green-500 to-green-600', count: '120+' },
    { name: 'Database', icon: FaDatabase, color: 'from-yellow-500 to-yellow-600', count: '100+' },
    { name: 'Business', icon: FaLightbulb, color: 'from-red-500 to-red-600', count: '200+' }
  ];

  const features = [
    {
      icon: FaGraduationCap,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of experience',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FaCertificate,
      title: 'Certified Courses',
      description: 'Get recognized certificates upon course completion',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FaChartLine,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FaTrophy,
      title: 'Earn Badges',
      description: 'Unlock achievements and showcase your skills',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-white opacity-5 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white opacity-5 rounded-full"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <FaRocket className="text-yellow-300" />
                  #1 Online Learning Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                Learn Without
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Limits
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed"
              >
                Master new skills with expert-led courses. Join thousands of learners achieving their goals.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/courses"
                  className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 hover:text-purple-700 transition transform hover:scale-105 shadow-2xl flex items-center gap-2"
                >
                  Explore Courses
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  to="/signup"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition transform hover:scale-105 flex items-center gap-2"
                >
                  <FaPlay />
                  Get Started Free
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{stats.students}</div>
                  <div className="text-sm text-blue-200">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{stats.courses}</div>
                  <div className="text-sm text-blue-200">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{stats.instructors}</div>
                  <div className="text-sm text-blue-200">Instructors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{stats.certificates}</div>
                  <div className="text-sm text-blue-200">Certificates</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 bg-white rounded-2xl shadow-2xl p-6 w-64"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <FaBook className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">1,000+</div>
                    <div className="text-sm text-gray-600">Active Courses</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-0 bg-white rounded-2xl shadow-2xl p-6 w-64"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">50,000+</div>
                    <div className="text-sm text-gray-600">Happy Students</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4.9/5.0</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Top <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-xl text-gray-600">Choose from our most popular learning paths</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition cursor-pointer group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <category.icon className="text-3xl text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} courses</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Courses</span>
            </h2>
            <p className="text-xl text-gray-600">Start learning with our most popular courses</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Link to={`/course/${course._id}`}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                      {/* Course Image */}
                      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-500 overflow-hidden">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FaBook className="text-6xl text-white opacity-50" />
                          </div>
                        )}
                        {course.price === 0 && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            FREE
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <div className="bg-white rounded-full p-4">
                            <FaPlay className="text-purple-600 text-2xl" />
                          </div>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {course.category}
                          </span>
                          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                            {course.level}
                          </span>
                        </div>

                        <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                          {course.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {course.shortDescription}
                        </p>

                        {/* Instructor */}
                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                          <FaGraduationCap className="text-purple-600" />
                          <span>{course.instructor?.firstName} {course.instructor?.lastName}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <FaUsers className="text-blue-600" />
                            <span>{course.enrollmentCount || 0} students</span>
                          </div>
                          {course.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-400" />
                              <span className="font-semibold text-gray-800">{course.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {course.price === 0 ? 'Free' : `$${course.price}`}
                          </div>
                          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform group-hover:scale-105">
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/courses"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-xl"
            >
              View All Courses <FaArrowRight className="inline ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Skillify</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need to succeed in your learning journey</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition text-center"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition`}>
                  <feature.icon className="text-4xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students already learning on Skillify
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 hover:text-purple-700 transition transform hover:scale-105 shadow-2xl flex items-center gap-2"
              >
                <FaCheckCircle />
                Sign Up Now
              </Link>
              <Link
                to="/courses"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition transform hover:scale-105"
              >
                Browse Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
