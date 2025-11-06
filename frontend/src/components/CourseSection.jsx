import React from "react";

const COURSES = [
  {
    id: 1,
    title: "Complete Web Development",
    instructor: "Dr. Hasan Kamran",
    rating: 4.8,
    reviews: 12456,
    price: "$12.99",
    image: "src/assets/web development.jpg"
  },
  {
    id: 2,
    title: "AWS Certified Solutions Architect",
    instructor: "Eng. Haziq Zia",
    rating: 4.6,
    reviews: 9873,
    price: "$9.99",
    image: "src/assets/AWSS.png"
  },
  {
    id: 3,
    title: "Artificial Intelligence Fundamentals",
    instructor: "PHD. Abdul Ali Naqvi",
    rating: 4.7,
    reviews: 14582,
    price: "$11.99",
    image: "src/assets/AI.jpg"
  },
  {
    id: 4,
    title: "Digital Marketing Crash Course",
    instructor: "MSC. Abeer Haider",
    rating: 4.5,
    reviews: 8642,
    price: "$8.99",
    image: "src/assets/Digital.jpg"
  },
  {
    id: 5,
    title: "Python for Data Science",
    instructor: "Dr. Syed Ahmed",
    rating: 4.9,
    reviews: 21876,
    price: "$13.99",
    image: "src/assets/python.jpg"
  },
  {
    id: 6,
    title: "Cybersecurity & Ethical Hacking",
    instructor: "BSC. King Faiz",
    rating: 4.7,
    reviews: 14220,
    price: "$10.49",
    image: "src/assets/cyber.jpg"
  }
];

const StarIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 ${filled ? "text-yellow-400" : "text-gray-600"}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


const CourseCard = ({ course }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarIcon key={i} filled={i <= Math.round(course.rating)} />);
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
      <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate group-hover:text-purple-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          {course.instructor}
        </p>

        <div className="flex items-center mb-4">
          <span className="text-yellow-500 font-bold mr-1">
            {course.rating.toFixed(1)}
          </span>

          <div className="flex items-center mr-2">
            {renderStars()}
          </div>

          <span className="text-sm text-gray-400">
            ({course.reviews.toLocaleString()})
          </span>
        </div>

        <p className="text-xl font-bold text-gray-900">
          {course.price}
        </p>
      </div>
    </div>
  );
};


const CourseSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-3xl font-extrabold text-center mb-12">
          Featured Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((item) => (
            <CourseCard key={item.id} course={item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default CourseSection;
