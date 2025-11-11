import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import BrandsSection from "../components/BrandsSection";

const plans = [
  {
    title: "Personal Plan",
    subtitle: "For you",
    iconText: "Individual",
    price: "Rs 5000 per month",
    buttonText: "Try it free",
    type: "personal",
    features: [
      "Access to 26,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
    ],
    highlight: false,
  },
  {
    title: "Team Plan",
    subtitle: "For your team",
    iconText: "2 to 50 people",
    price: "RS 10,000 a month per user",
    buttonText: "Try it free",
    type: "team",
    features: [
      "Access to 13,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
      "Analytics and adoption reports",
    ],
    highlight: true,
  },
  {
    title: "Enterprise Plan",
    subtitle: "For your organization",
    iconText: "More than 20 people",
    price: "Contact sales for pricing",
    buttonText: "Request a demo",
    type: "enterprise",
    features: [
      "Access to 30,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
      "Advanced analytics and insights",
      "Dedicated customer success team",
      "International course collection (15 languages)",
      "Customizable content",
      "Hands-on tech training with add-on",
      "Strategic implementation services"
    ],
    highlight: false,
  },
];

function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
        Choose a plan for success
      </h1>
      <p className="text-center text-gray-500 mb-12">
        Pick a plan for yourself, your team, or your organization.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.type}
            className={`border rounded-lg p-6 shadow-sm bg-white relative group cursor-pointer transition-all duration-300 transform
            ${plan.highlight ? "shadow-md border-gray-200" : "border-gray-200"}
            hover:-translate-y-2 hover:scale-[1.03] hover:border-purple-600 hover:shadow-2xl hover:shadow-purple-300/50`}
          >

            {/* Animated bottom line */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-purple-600 transition-all duration-300 group-hover:w-full"></div>

            <h3 className="text-xl font-bold mb-1 text-gray-800">{plan.title}</h3>
            <p className="text-sm text-gray-500 mb-1">{plan.subtitle}</p>
            <p className="text-xs text-gray-400 mb-4">{plan.iconText}</p>

            <p className="font-semibold text-gray-800 mb-6">{plan.price}</p>

            <button
              className={`w-full py-3 rounded-md font-semibold mb-6 transition ${plan.highlight
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
            >
              {plan.buttonText}
            </button>

            <ul className="space-y-2 text-sm text-gray-600">
              {plan.features.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gray-200 mt-5">
        <BrandsSection />
      </div>

    </div>
  );
}

export default Pricing;
