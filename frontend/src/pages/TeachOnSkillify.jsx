import React, { useState } from 'react';
import { Link } from "react-router-dom";

// --- Images ---
// Yeh Udemy ki original, high-quality images hain
const heroBgImageUrl = 'src/assets/hk1.webp';
const tabImagePlan = 'src/assets/hk2.webp';
const tabImageRecord = 'src/assets/hk3.webp';
const tabImageLaunch = 'src/assets/hk4.webp';

// Aap ke 'reasons' section ke icons (filhaal commented hain)
// const reasonIcon1 = '/images/icon-teach.svg';
// const reasonIcon2 = '/images/icon-inspire.svg';
// const reasonIcon3 = '/images/icon-reward.svg';


const TeachOnSkillify = () => {
  const [activeTab, setActiveTab] = useState('plan');

  // --- BUTTON FIX ---
  // Yahan 'bg-skillify-purple' ki jagah 'bg-purple-700' istemal kiya hai
  // 'hover:bg-purple-800' se hover effect bhi standard purple mein kar diya hai
  const ctaButtonClasses = "bg-purple-700 text-white font-bold py-3 px-7 rounded text-lg hover:bg-purple-800 transition-colors duration-200 shadow-md";

  return (
    // 'skillify-dark' ki jagah default 'text-gray-900'
    <div className="font-sans text-gray-900">
      
      {/* ========== 1. HERO SECTION (FIXED) ========== */}
      {/* FIX: Image ko background mein lagaya hai 'bg-cover' se.
        FIX: 'relative' container banaya hai.
        FIX: 'absolute' overlay daala hai taake text saaf padha ja sake.
        FIX: Text ko 'z-10' (relative) se overlay ke oopar rakha hai.
      */}
      <section 
        className="relative w-full h-[500px] bg-cover bg-center text-white" 
        style={{ backgroundImage: `url(${heroBgImageUrl})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-start max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-lg text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Come teach with us</h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
              Become an instructor and change lives — including your own
            </p>
            {/* Button ab yahan saaf nazar aayega */}
            <Link to="/teacher-signup" className={ctaButtonClasses}>
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 2. STATS BAR ========== */}
      {/* --- BUTTON FIX --- 'bg-skillify-purple' ko 'bg-purple-700' se replace kiya */}
      <section className="flex flex-col md:flex-row justify-around items-center bg-purple-700 text-white py-10 px-4 text-center gap-8 md:gap-0">
        <div className="stat-item">
          <h2 className="text-4xl font-bold mb-1">80M</h2>
          <p className="text-lg">Students</p>
        </div>
        <div className="stat-item">
          <h2 className="text-4xl font-bold mb-1">75+</h2>
          <p className="text-lg">Languages</p>
        </div>
        <div className="stat-item">
          <h2 className="text-4xl font-bold mb-1">1.1B</h2>
          <p className="text-lg">Enrollments</p>
        </div>
        <div className="stat-item">
          <h2 className="text-4xl font-bold mb-1">180+</h2>
          <p className="text-lg">Countries</p>
        </div>
        <div className="stat-item">
          <h2 className="text-4xl font-bold mb-1">17,200+</h2>
          <p className="text-lg">Enterprise customers</p>
        </div>
      </section>

      {/* ========== 3. REASONS SECTION ========== */}
      <section className="py-20 px-6 text-center max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">So many reasons to start</h2>
        {/* Yeh section pehle se responsive tha (grid-cols-1 md:grid-cols-3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="reason-card p-4">
            {/* <img src={reasonIcon1} alt="Teach your way" className="h-16 mx-auto mb-4" /> */}
            <h3 className="text-2xl font-bold mb-3">Teach your way</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Publish the course you want, in the way you want, and always have control of your own content.
            </p>
          </div>
          
          <div className="reason-card p-4">
            {/* <img src={reasonIcon2} alt="Inspire learners" className="h-16 mx-auto mb-4" /> */}
            <h3 className="text-2xl font-bold mb-3">Inspire learners</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Teach what you know and help learners explore their interests, gain new skills, and advance their careers.
            </p>
          </div>

          <div className="reason-card p-4">
            {/* <img src={reasonIcon3} alt="Get rewarded" className="h-16 mx-auto mb-4" /> */}
            <h3 className="text-2xl font-bold mb-3">Get rewarded</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Expand your professional network, build your expertise, and earn money on each paid enrollment.
            </p>
          </div>
        </div>
      </section>

      {/* ========== 4. HOW TO BEGIN (TABS) ========== */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">How to begin</h2>
        
        {/* --- Tab Buttons --- */}
        <div className="flex justify-center gap-2 md:gap-8 mb-8 border-b-2 border-gray-200">
          <button 
            className={`pb-4 px-2 md:px-4 font-bold text-base md:text-xl border-b-4 transition-all duration-200 transform translate-y-[2px] ${
              activeTab === 'plan' 
              ? 'border-purple-700 text-gray-900' // 'skillify-purple' ki jagah 'purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('plan')}
          >
            Plan your curriculum
          </button>
          <button 
            className={`pb-4 px-2 md:px-4 font-bold text-base md:text-xl border-b-4 transition-all duration-200 transform translate-y-[2px] ${
              activeTab === 'record' 
              ? 'border-purple-700 text-gray-900' // 'skillify-purple' ki jagah 'purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('record')}
          >
            Record your video
          </button>
          <button 
            className={`pb-4 px-2 md:px-4 font-bold text-base md:text-xl border-b-4 transition-all duration-200 transform translate-y-[2px] ${
              activeTab === 'launch' 
              ? 'border-purple-700 text-gray-900' // 'skillify-purple' ki jagah 'purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('launch')}
          >
            Launch your course
          </button>
        </div>

        {/* --- Tab Content --- */}
        <div className="how-to-tab-content mt-12">
          
          {/* --- Tab 1: Plan --- */}
          {activeTab === 'plan' && (
            // Yeh section pehle se responsive tha (flex-col md:flex-row)
            <div className="flex flex-col md:flex-row items-center gap-12 text-left">
              <div className="flex-1">
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">You start with your passion and knowledge. Then choose a promising topic with the help of our Marketplace Insights tool.</p>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">The way that you teach — what you bring to it — is up to you.</p>
                <h3 className="text-xl font-bold mt-8 mb-2">How we help you</h3>
                <p className="text-lg text-gray-600 leading-relaxed">We offer plenty of resources on how to create your first course. And, our instructor dashboard and curriculum pages help keep you organized.</p>
              </div>
              <div className="flex-1 max-w-md">
                 <img src={tabImagePlan} alt="Plan your curriculum" className="w-full h-auto rounded-md shadow-lg" />
              </div>
            </div>
          )}

          {/* --- Tab 2: Record --- */}
          {activeTab === 'record' && (
            <div className="flex flex-col md:flex-row items-center gap-12 text-left">
              <div className="flex-1">
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">Use basic tools like a smartphone or a DSLR camera. Add a good microphone and you’re ready to start.</p>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">If you don’t like being on camera, just capture your screen. Either way, we recommend two hours or more of video for a paid course.</p>
                <h3 className="text-xl font-bold mt-8 mb-2">How we help you</h3>
                <p className="text-lg text-gray-600 leading-relaxed">Our support team is available to help you throughout the process and provide feedback on test videos.</p>
              </div>
              <div className="flex-1 max-w-md">
                 <img src={tabImageRecord} alt="Record your video" className="w-full h-auto rounded-md shadow-lg" />
              </div>
            </div>
          )}

          {/* --- Tab 3: Launch --- */}
          {activeTab === 'launch' && (
            <div className="flex flex-col md:flex-row items-center gap-12 text-left">
              <div className="flex-1">
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">Gather your first ratings and reviews by promoting your course through social media and your professional networks.</p>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">Your course will be discoverable in our marketplace where you earn revenue from each new enrollment.</p>
                <h3 className="text-xl font-bold mt-8 mb-2">How we help you</h3>
                <p className="text-lg text-gray-600 leading-relaxed">Our custom coupon tool lets you offer enrollment incentives while our global promotions drive traffic to courses.</p>
              </div>
              <div className="flex-1 max-w-md">
                 <img src={tabImageLaunch} alt="Launch your course" className="w-full h-auto rounded-md shadow-lg" />
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* ========== 5. FINAL CTA SECTION ========== */}
      <section className="py-20 px-6 text-center bg-gray-50">
        <h2 className="text-4xl font-bold mb-4">Become an instructor today</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join one of the world's largest online learning marketplaces.
        </p>
        {/* Yahan bhi fixed button istemal ho raha hai */}
        <Link to="/teacher-signup" className={ctaButtonClasses}>
          Get started
        </Link>
      </section>

    </div>
  )
}

export default TeachOnSkillify;