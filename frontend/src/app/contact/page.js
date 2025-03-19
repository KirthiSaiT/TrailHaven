'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Navbar */}
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
          
          <div className="backdrop-blur-md bg-white/10 rounded-lg shadow-lg border border-white/20 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Phone</h3>
                      <p className="text-gray-300">+91 95000 55000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Email</h3>
                      <p className="text-gray-300">support@saferoute.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Address</h3>
                      <p className="text-gray-300">Kolathur, Chennai<br />Tamil Nadu, India</p>
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                      </svg>
                    </a>
                    <a href="#" className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm4.957 6.031l-1.422.499c-.51-.514-1.22-.837-2.018-.837-1.564 0-2.834 1.27-2.834 2.834 0 .22.025.435.074.642-2.355-.118-4.452-1.246-5.857-2.958-.244.42-.384.908-.384 1.428 0 .984.5 1.852 1.258 2.358-.465-.014-.9-.142-1.283-.354v.036c0 1.372.975 2.517 2.273 2.777-.238.065-.49.099-.749.099-.183 0-.361-.017-.536-.049.361 1.125 1.408 1.944 2.65 1.966-.972.759-2.195 1.213-3.525 1.213-.229 0-.456-.014-.678-.04 1.257.806 2.749 1.276 4.356 1.276 5.226 0 8.082-4.324 8.082-8.083 0-.123-.003-.247-.008-.369.555-.401 1.036-.899 1.418-1.471l-.001-.001z"></path>
                      </svg>
                    </a>
                    <a href="#" className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm2.464 7.184c.405 0 .734.328.734.734s-.329.734-.734.734-.734-.329-.734-.734.329-.734.734-.734zM9.804 8.468h1.484v5.064h-1.484V8.468zm4.872 0h1.437v.732c.32-.543.931-.822 1.437-.822 1.371 0 2.128.915 2.128 2.226v2.928h-1.437v-2.557c0-.731-.366-1.096-.915-1.096s-.915.365-.915 1.096v2.557h-1.437v-5.064h.002z"></path>
                      </svg>
                    </a>
                    <a href="#" className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm-3.11 14.83h-2.172V9.7h2.171v7.13zm-1.086-8.12c-.757 0-1.37-.613-1.37-1.37s.613-1.37 1.37-1.37 1.37.613 1.37 1.37-.613 1.37-1.37 1.37zm10.02 8.12h-2.17v-3.42c0-.811-.016-1.85-1.127-1.85-1.13 0-1.302.88-1.302 1.79v3.48H11.05V9.7h2.08v.954h.03c.29-.55 1-1.13 2.05-1.13 2.2 0 2.6 1.45 2.6 3.33v3.977z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="How can we help you?" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4" 
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your message here..." 
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full p-3 rounded-lg font-semibold transition-all ${
                      isSubmitting 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  {/* Status message */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-600/30 border border-green-600 rounded-lg text-center"
                    >
                      Your message has been sent successfully!
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}