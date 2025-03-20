'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';

// Placeholder HotspotDemo Component
const HotspotDemo = () => {
  return (
    <div className="relative w-full h-64 bg-gray-800 rounded-lg overflow-hidden">
      {/* Mock heatmap visualization */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-transparent opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-lg font-semibold">
          Crime Hotspot Visualization Preview
        </p>
      </div>
      {/* Add a mock map-like background */}
      <div className="absolute inset-0 bg-[url('https://via.placeholder.com/800x400?text=Map+Background')] bg-cover opacity-30" />
    </div>
  );
};

// Placeholder ChatbotPreview Component
const ChatbotPreview = () => {
  return (
    <div className="relative w-full bg-gray-800 rounded-lg p-4">
      <div className="flex flex-col space-y-3">
        {/* Mock chat messages */}
        <div className="flex justify-start">
          <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
            <p>Hello! How can I assist you today?</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-gray-600 text-white p-3 rounded-lg max-w-xs">
            <p>I need legal advice for a situation.</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
            <p>Of course! Please describe your situation, and I’ll provide guidance.</p>
          </div>
        </div>
      </div>
      {/* Mock input field */}
      <div className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
          disabled
        />
        <button
          className="p-2 bg-blue-600 rounded-r-lg text-white"
          disabled
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation variants for Framer Motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl -top-20 -right-20" />
        <div className="absolute w-96 h-96 rounded-full bg-purple-500/10 blur-3xl bottom-10 -left-20" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex flex-col justify-center items-center text-center px-4 z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div
          className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-blue-500/30 blur-xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-purple-500/20 blur-xl"
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          variants={fadeInUp}
        >
          Welcome to HavenTrail
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl mb-8 max-w-2xl"
          variants={fadeInUp}
        >
          Your AI-powered safe travel companion. Navigate with confidence using real-time crime data, route suggestions, and 24/7 legal assistance.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row gap-4"
        >
          <Link href="/maps">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all"
            >
              Explore Safe Routes
            </motion.button>
          </Link>
          <Link href="/auth/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-transparent border-2 border-white hover:bg-white/10 rounded-full text-lg font-semibold transition-all"
            >
              Login / Sign Up
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.section>

      {/* Crime Hotspot Visualization Preview */}
      <motion.section
        className="relative py-20 px-4 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-4xl font-bold text-center mb-6">Crime Hotspot Visualization</h2>
        <motion.p className="text-center text-xl max-w-3xl mx-auto mb-12" variants={fadeInUp}>
          Our advanced heatmap technology shows you exactly where crime occurs most frequently, helping you make informed decisions about your travel routes.
        </motion.p>
        <motion.div
          className="max-w-5xl mx-auto bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl"
          variants={fadeInUp}
        >
          <HotspotDemo />
        </motion.div>
      </motion.section>

      {/* Statistics Section with Glassmorphism */}
      <motion.section
        className="relative py-20 px-4 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="p-8 backdrop-blur-md bg-white/10 rounded-xl shadow-lg border border-white/20 flex flex-col items-center"
            variants={fadeInUp}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <h3 className="text-4xl font-bold mb-2">10M+</h3>
            <p className="text-center text-gray-300">Safe journeys planned through high-risk areas</p>
          </motion.div>
          <motion.div
            className="p-8 backdrop-blur-md bg-white/10 rounded-xl shadow-lg border border-white/20 flex flex-col items-center"
            variants={fadeInUp}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-4xl font-bold mb-2">24/7</h3>
            <p className="text-center text-gray-300">AI Chatbot Assistance for legal and safety guidance</p>
          </motion.div>
          <motion.div
            className="p-8 backdrop-blur-md bg-white/10 rounded-xl shadow-lg border border-white/20 flex flex-col items-center"
            variants={fadeInUp}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-4xl font-bold mb-2">95%</h3>
            <p className="text-center text-gray-300">Crime Hotspot Prediction Accuracy</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="relative py-20 px-4 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose HavenTrail?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-6 rounded-xl backdrop-blur-sm border border-blue-700/30 shadow-xl"
            variants={fadeInUp}
          >
            <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Safe Route Suggestions</h3>
            <p className="text-gray-300">Plan your journey with routes optimized for safety, avoiding crime hotspots. Our algorithm analyzes historical crime data to suggest the safest path to your destination.</p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-6 rounded-xl backdrop-blur-sm border border-purple-700/30 shadow-xl"
            variants={fadeInUp}
          >
            <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Real-Time Alerts</h3>
            <p className="text-gray-300">Get instant notifications about unsafe areas and traffic updates. Our geofencing technology alerts you when you approach areas with increased risk.</p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-green-900/40 to-green-800/40 p-6 rounded-xl backdrop-blur-sm border border-green-700/30 shadow-xl"
            variants={fadeInUp}
          >
            <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">AI Chatbot Support</h3>
            <p className="text-gray-300">Access legal and procedural guidance anytime with our 24/7 virtual assistant. Get immediate answers to safety questions and procedural advice during emergencies.</p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 p-6 rounded-xl backdrop-blur-sm border border-cyan-700/30 shadow-xl"
            variants={fadeInUp}
          >
            <div className="w-12 h-12 bg-cyan-500/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Traffic Management</h3>
            <p className="text-gray-300">Dynamic routing for Chennai using real-time GPS and vehicle data. Avoid congested areas and reach your destination faster while staying safe.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Chatbot Preview Section */}
      <motion.section
        className="relative py-20 px-4 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-4xl font-bold text-center mb-6">24/7 Legal Assistance</h2>
        <motion.p className="text-center text-xl max-w-3xl mx-auto mb-12" variants={fadeInUp}>
          Get instant access to legal advice and procedural guidance with our AI-powered chatbot.
        </motion.p>
        <motion.div
          className="max-w-lg mx-auto bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl"
          variants={fadeInUp}
        >
          <ChatbotPreview />
        </motion.div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="relative py-20 px-4 z-10 bg-gradient-to-r from-blue-900/50 to-purple-900/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Travel Safely?</h2>
          <p className="text-xl mb-8">Join thousands of users who are navigating cities with confidence using HavenTrail.</p>
          <Link href="/auth/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-xl font-semibold transition-all shadow-lg"
            >
              Create Your Free Account
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-md py-10 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">HavenTrail</h3>
            <p className="text-gray-400">Your AI-powered safe travel companion for navigating urban environments with confidence.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/maps" className="text-gray-400 hover:text-white transition-colors">Maps</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 4.864v14.272a2.864 2.864 0 01-2.864 2.864H16.24v-7.08h2.368l.4-2.968H16.24V9.68c0-.8.216-1.448 1.448-1.448h1.568V5.632a16.68 16.68 0 00-2.256-.12c-2.312 0-3.888 1.408-3.888 3.984v2.224H10.64v2.968h2.48V22H4.864A2.864 2.864 0 012 19.136V4.864A2.864 2.864 0 014.864 2h14.272A2.864 2.864 0 0122 4.864z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.39c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.438zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-10 text-gray-500">
          <p>© {new Date().getFullYear()} HavenTrail. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}