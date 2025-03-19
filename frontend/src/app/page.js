// app/page.js
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import styles from './globals.css';

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="h-screen flex flex-col justify-center items-center text-center px-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
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
        <motion.div variants={fadeInUp}>
          <Link href="/maps">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all">
              Explore Safe Routes
            </button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Statistics Section with Glassmorphism */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="p-6 backdrop-blur-md bg-white/10 rounded-lg shadow-lg border border-white/20"
            variants={fadeInUp}
          >
            <h3 className="text-3xl font-bold">10M+</h3>
            <p>Safe journeys planned</p>
          </motion.div>
          <motion.div
            className="p-6 backdrop-blur-md bg-white/10 rounded-lg shadow-lg border border-white/20"
            variants={fadeInUp}
          >
            <h3 className="text-3xl font-bold">24/7</h3>
            <p>AI Chatbot Assistance</p>
          </motion.div>
          <motion.div
            className="p-6 backdrop-blur-md bg-white/10 rounded-lg shadow-lg border border-white/20"
            variants={fadeInUp}
          >
            <h3 className="text-3xl font-bold">95%</h3>
            <p>Crime Hotspot Accuracy</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose HavenTrail?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div className="p-4" variants={fadeInUp}>
            <h3 className="text-2xl font-semibold mb-2">Safe Route Suggestions</h3>
            <p>Plan your journey with routes optimized for safety, avoiding crime hotspots.</p>
          </motion.div>
          <motion.div className="p-4" variants={fadeInUp}>
            <h3 className="text-2xl font-semibold mb-2">Real-Time Alerts</h3>
            <p>Get instant notifications about unsafe areas and traffic updates.</p>
          </motion.div>
          <motion.div className="p-4" variants={fadeInUp}>
            <h3 className="text-2xl font-semibold mb-2">AI Chatbot Support</h3>
            <p>Access legal and procedural guidance anytime with our 24/7 virtual assistant.</p>
          </motion.div>
          <motion.div className="p-4" variants={fadeInUp}>
            <h3 className="text-2xl font-semibold mb-2">Traffic Management</h3>
            <p>Dynamic routing for Tuticorin using real-time GPS and vehicle data.</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}