// src/app/maps/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const MapComponent = ({ userPosition }) => {
  // Move L import inside the useEffect to ensure it only runs client-side
  const [L, setL] = useState(null);
  const [redIcon, setRedIcon] = useState(null);

  useEffect(() => {
    // Import leaflet only on client side
    import('leaflet/dist/leaflet.css');
    import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css');
    import('leaflet-defaulticon-compatibility');
    
    // Set L for use with marker icon
    const leaflet = require('leaflet');
    setL(leaflet);
    
    // Create custom red marker icon
    const icon = new leaflet.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    setRedIcon(icon);
  }, []);

  // Default map center (Chennai, Tamil Nadu) if user location is not available
  const defaultCenter = [13.0827, 80.2707]; // Latitude, Longitude

  // Make sure we have the user's position and the Leaflet library loaded before rendering
  if (!L || !redIcon) {
    return <div className="flex items-center justify-center h-full">Loading map resources...</div>;
  }

  return (
    <div className="absolute inset-0" style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={userPosition || defaultCenter}
        zoom={userPosition ? 15 : 12} // Closer zoom when user position is available
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        className="leaflet-map-container"
        key={userPosition ? `user-${userPosition[0]}-${userPosition[1]}` : 'default'} // Force re-render when userPosition changes
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userPosition && (
          <Marker position={userPosition} icon={redIcon}>
            <Popup>
              Your current location<br/>
              Latitude: {userPosition[0].toFixed(6)}<br/>
              Longitude: {userPosition[1].toFixed(6)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default function Maps() {
  // State for starting point and destination
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  // State to toggle the route card visibility
  const [isRouteCardOpen, setIsRouteCardOpen] = useState(false);
  // State to handle map loading
  const [mapLoaded, setMapLoaded] = useState(false);
  // State to store user's current position
  const [userPosition, setUserPosition] = useState(null);
  // State to track if geolocation is available
  const [geoAvailable, setGeoAvailable] = useState(true);

  useEffect(() => {
    // Set map as loaded after component mounts
    setMapLoaded(true);

    // Handle geolocation
    if (navigator.geolocation) {
      // Initial position fetch with loading indicator
      const positionPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      // Show loading indicator while getting position
      positionPromise
        .then((position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          console.log("User position found:", latitude, longitude);
          
          // Auto-fill starting point with user's current location
          setStartPoint("My Current Location");
        })
        .catch((error) => {
          console.error('Geolocation error:', error);
          setGeoAvailable(false);
          setUserPosition([13.0827, 80.2707]); // Fallback to default center (Chennai)
          alert('Unable to retrieve your location. Using default location (Chennai).');
        });

      // Continuously watch for position updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.error('Geolocation watch error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Cleanup: Stop watching position when component unmounts
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error('Geolocation is not supported by this browser.');
      setGeoAvailable(false);
      setUserPosition([13.0827, 80.2707]); // Fallback to default center (Chennai)
      alert('Geolocation is not supported by your browser. Using default location (Chennai).');
    }
  }, []);

  // Handler to use current location as starting point
  const useCurrentLocationAsStart = () => {
    if (userPosition) {
      setStartPoint("My Current Location");
    } else {
      alert("Unable to get your current location. Please enable location services.");
    }
  };

  // Animation variants for Framer Motion (for the route card pop-up)
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Full-Screen Map Container */}
      <div className="absolute inset-0 mt-16 z-10">
        {mapLoaded && <MapComponent userPosition={userPosition} />}
      </div>

      {/* Button to Toggle Route Card (Top Right) */}
      <button
        onClick={() => setIsRouteCardOpen(!isRouteCardOpen)}
        className="fixed top-20 right-4 z-50 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all shadow-lg"
      >
        {isRouteCardOpen ? 'Close' : 'Plan Route'}
      </button>

      {/* User Location Status Indicator */}
      {!geoAvailable && (
        <div className="fixed top-20 left-4 z-50 px-4 py-2 bg-red-600 rounded-lg text-sm">
          Location services disabled
        </div>
      )}

      {/* Route Card Pop-Up */}
      <AnimatePresence>
        {isRouteCardOpen && (
          <motion.div
            className="fixed top-32 right-4 w-[350px] backdrop-blur-md bg-white/10 rounded-lg shadow-lg border border-white/20 p-6 z-50"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Plan Your Safe Route</h2>

            {/* Travel Mode Icons */}
            <div className="flex justify-around mb-4">
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 012 15.382V5.618a2 2 0 011.553-1.894L9 1m0 19l6-3m-6 3V1m6 19l5.447-2.724A2 2 0 0022 15.382V5.618a2 2 0 00-1.553-1.894L15 1m-6 0l6 3"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 00-7.35 16.76l1.42 1.42a2 2 0 002.83 0l.71-.71 2.12-2.12a2 2 0 00-2.83-2.83L8 15.17V12a2 2 0 012-2h4a2 2 0 012 2v3.17l-.9-.85a2 2 0 00-2.83 2.83l2.12 2.12.71.71a2 2 0 002.83 0l1.42-1.42A10 10 0 0012 2z"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 00-7.35 16.76l1.42 1.42a2 2 0 002.83 0l.71-.71 2.12-2.12a2 2 0 00-2.83-2.83L8 15.17V12a2 2 0 012-2h4a2 2 0 012 2v3.17l-.9-.85a2 2 0 00-2.83 2.83l2.12 2.12.71.71a2 2 0 002.83 0l1.42-1.42A10 10 0 0012 2z"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 00-7.35 16.76l1.42 1.42a2 2 0 002.83 0l.71-.71 2.12-2.12a2 2 0 00-2.83-2.83L8 15.17V12a2 2 0 012-2h4a2 2 0 012 2v3.17l-.9-.85a2 2 0 00-2.83 2.83l2.12 2.12.71.71a2 2 0 002.83 0l1.42-1.42A10 10 0 0012 2z"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 00-7.35 16.76l1.42 1.42a2 2 0 002.83 0l.71-.71 2.12-2.12a2 2 0 00-2.83-2.83L8 15.17V12a2 2 0 012-2h4a2 2 0 012 2v3.17l-.9-.85a2 2 0 00-2.83 2.83l2.12 2.12.71.71a2 2 0 002.83 0l1.42-1.42A10 10 0 0012 2z"></path>
                </svg>
              </button>
            </div>

            {/* Route Input Form */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">○</div>
                <input
                  type="text"
                  placeholder="Choose starting point, or click on the map"
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                  onClick={useCurrentLocationAsStart}
                >
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Choose destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* User's Current Location */}
            {userPosition && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-sm flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  Location: {userPosition[0].toFixed(4)}, {userPosition[1].toFixed(4)}
                </p>
              </div>
            )}

            {/* Button to Find Route */}
            <button className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all">
              Find Safe Route
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}