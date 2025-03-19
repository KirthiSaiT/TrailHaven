// src/app/about/page.js
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import styles from '../globals.css';

export default function About() {
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
          About HavenTrail
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl mb-8 max-w-2xl"
          variants={fadeInUp}
        >
          Empowering safe travel with AI-driven insights, real-time alerts, and community-focused solutions.
        </motion.p>
        <motion.div variants={fadeInUp}>
          <Link href="/maps">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all">
              Discover Safe Routes
            </button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-4xl font-bold text-center mb-12">Our Mission</h2>
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            className="text-lg mb-6"
            variants={fadeInUp}
          >
            At HavenTrail, we are committed to making travel safer for everyone. By leveraging advanced crime analysis, real-time traffic data, and AI-powered tools, we provide users with the safest routes, timely alerts, and 24/7 support. Our goal is to reduce the risks associated with travel, especially in high-crime areas, and to empower communities with actionable insights.
          </motion.p>
          <motion.p
            className="text-lg"
            variants={fadeInUp}
          >
            We are particularly focused on cities like Tuticorin, where our traffic management system uses local maps, GPS data, and vehicle counts to ensure smooth and safe travel for all.
          </motion.p>
        </div>
      </motion.section>

      {/* Vision Section with Glassmorphism */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-4xl font-bold text-center mb-12">Our Vision</h2>
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="p-6 backdrop-blur-md bg-white/10 rounded-lg shadow-lg border border-white/20 text-center"
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-semibold mb-4">A Safer World</h3>
            <p className="text-lg">
              We envision a world where every journey is safe, informed, and stress-free. By integrating crime data, traffic insights, and AI technology, we aim to set a new standard for travel safety and urban mobility.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="p-6 backdrop-blur-md bg-white/10 rounded-lg shadow-lg border border-white/20 text-center"
            variants={fadeInUp}
          >
            <h3 className="text-xl font-semibold mb-2">Jane Doe</h3>
            <p className="text-gray-300">Founder & CEO</p>
            <p className="mt-2">A visionary leader with a passion for using technology to solve real-world problems.</p>
          </motion.div>
          <motion.div
            className="p-6 backdrop-blur-md bg-white/10 rounded-lg shadow-lg border border-white/20 text-center"
            variants={fadeInUp}
          >
            <h3 className="text-xl font-semibold mb-2">John Smith</h3>
            <p className="text-gray-300">Chief Technology Officer</p>
            <p className="mt-2">An expert in AI and data science, driving innovation at HavenTrail.</p>
          </motion.div>
          <motion.div
            className="p-6 backdrop-blur-md bg-white/10 rounded-lg shadow-lg border border-white/20 text-center"
            variants={fadeInUp}
          >
            <h3 className="text-xl font-semibold mb-2">Emily Brown</h3>
            <p className="text-gray-300">Head of Community Outreach</p>
            <p className="mt-2">Dedicated to building partnerships and ensuring user safety.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-16 px-4 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-3xl font-bold mb-4"
          variants={fadeInUp}
        >
          Join Us in Making Travel Safer
        </motion.h2>
        <motion.p
          className="text-lg mb-8 max-w-2xl mx-auto"
          variants={fadeInUp}
        >
          Whether you're a traveler, a city planner, or a community leader, we invite you to collaborate with us to create a safer future.
        </motion.p>
        <motion.div variants={fadeInUp}>
          <Link href="/contact">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all">
              Get in Touch
            </button>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}