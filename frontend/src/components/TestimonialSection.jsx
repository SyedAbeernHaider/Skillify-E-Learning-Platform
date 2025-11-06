import React from "react";

// Testimonial data (replace with backend API later)
const TESTIMONIALS = [
  {
    id: 1,
    name: "Emily Watson",
    feedback:
      "Skillify helped me land my first internship. The instructors explain concepts very clearly!",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 2,
    name: "David Johnson",
    feedback:
      "Best platform for learning professional skills. Very well-structured courses!",
    avatar: "https://i.pravatar.cc/150?img=52",
  },
  {
    id: 3,
    name: "Tahira Ali",
    feedback:
      "Learning here boosted my confidence. I’m now freelancing full-time!",
    avatar: "https://i.pravatar.cc/150?img=58",
  },
  {
    id: 4,
    name: "Mohammad Iqbal",
    feedback:
      "Highly recommend Skillify for career growth. Updated content & practical lessons.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 5,
    name: "Lean Smith",
    feedback:
      "Amazing platform! Helped me build strong foundations in AI & Data Science.",
    avatar: "https://i.pravatar.cc/150?img=21",
  },
  {
    id: 6,
    name: "Maryam Nawaz",
    feedback:
      "The instructors are super helpful. I can finally build real-world projects!",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
];

// Each student review card
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <p className="text-gray-600 italic mb-6">
        "{testimonial.feedback}"
      </p>

      <div className="flex items-center">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />

        <div>
          <p className="font-semibold text-gray-900">
            {testimonial.name}
          </p>
        </div>
      </div>
    </div>
  );
};

// Testimonial card grid section
const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-purple-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-3xl font-extrabold text-center mb-12">
          Join others transforming their lives through learning
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
