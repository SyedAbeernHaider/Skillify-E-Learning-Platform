import React from "react";
import { FaCode, FaMobileAlt, FaRobot, FaChartLine, FaShieldAlt } from "react-icons/fa";

// Category data used to render cards
const CATEGORIES = [
  {
    id: 1,
    title: "Development",
    description: "Learn to code and build real world applications.",
    icon: <FaCode size={30} color="#7c3aed" />,
  },
  {
    id: 2,
    title: "Web Design",
    description: "Build apps for iOS and Android.",
    icon: <FaMobileAlt size={30} color="#7c3aed" />,
  },
  {
    id: 3,
    title: "AI & Robotics",
    description: "Explore automation and AI tech.",
    icon: <FaRobot size={30} color="#7c3aed" />,
  },
  {
    id: 4,
    title: "Marketing",
    description: "Learn digital growth and market strategy.",
    icon: <FaChartLine size={30} color="#7c3aed" />,
  },
  {
    id: 5,
    title: "Cyber Security",
    description: "Protect systems and network form threats.",
    icon: <FaShieldAlt size={30} color="#7c3aed" />,
  },
];

// Card to show a single category
const CategoryCard = ({ category }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
      <div className="mb-4">{category.icon}</div>

      <h3 className="text-lg font-semibold mb-2">
        {category.title}
      </h3>

      <p className="text-gray-500 text-sm">
        {category.description}
      </p>
    </div>
  );
};

// Main section to show all categories
const CategorySection = () => {
  return (
    <section className="py-16 sm:py-24 bg-white mb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-3xl font-extrabold text-center mb-4">
          Learn essential career and life skills
        </h2>

        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Skillify helps you build in-demand skills fast and advance your career in a changing job market.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((item) => (
            <CategoryCard key={item.id} category={item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
