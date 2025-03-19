// src/app/maps/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
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
const useMap = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMap),
  { ssr: false }
);

// Component to handle map view updates when location changes
const LocationMarker = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    // Ensure map is valid and position exists before calling map methods
    if (map && typeof map.getZoom === 'function' && position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return null;
};

const MapComponent = ({ userPosition }) => {
  // Load Leaflet CSS only on the client side
  useEffect(() => {
    import('leaflet/dist/leaflet.css');
    import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css');
    import('leaflet-defaulticon-compatibility');
  }, []);

  // Default center (e.g., Chennai) if user position is not available
  const defaultCenter = [13.0827, 80.2707]; // Coordinates for Chennai
  const initialZoom = 15;

  // Create custom marker icon for user's location
  const L = require('leaflet');

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="absolute inset-0" style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={userPosition || defaultCenter} // Center on user position if available, otherwise default to Chennai
        zoom={initialZoom}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        className="leaflet-map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User's current location marker */}
        {userPosition && (
          <Marker position={userPosition} icon={redIcon}>
            <Popup>
              <div>
                <strong>Your Current Location</strong>
                <br />
                Lat: {userPosition[0].toFixed(6)}
                <br />
                Lng: {userPosition[1].toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Always render LocationMarker, but pass userPosition or null */}
        <LocationMarker position={userPosition} />
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
  // State to store the user's address
  const [userAddress, setUserAddress] = useState(null);
  // State to handle geolocation errors
  const [geoError, setGeoError] = useState(null);
  // State to store accuracy information
  const [accuracy, setAccuracy] = useState(null);
  // State to store timestamp of the last location update
  const [timestamp, setTimestamp] = useState(null);
  // State to control visibility of the Live Location panel
  const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(true);
  // Ref to store the watchPosition ID
  const watchIdRef = useRef(null);

  // Function to fetch the address using Nominatim API
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TrailHaven/1.0',
          },
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setUserAddress(data.display_name);
      } else {
        setUserAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setUserAddress('Unable to fetch address');
    }
  };

  // Format timestamp to readable time
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return `${date.toLocaleTimeString()}`;
  };

  // Function to manually refresh location
  const refreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserPosition([latitude, longitude]);
          setAccuracy(accuracy);
          setTimestamp(position.timestamp);
          fetchAddress(latitude, longitude);
          setGeoError(null);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setGeoError(error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  // Function to start continuous tracking
  const startTracking = () => {
    if (navigator.geolocation && !watchIdRef.current) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserPosition([latitude, longitude]);
          setAccuracy(accuracy);
          setTimestamp(position.timestamp);
          fetchAddress(latitude, longitude);
          setGeoError(null);
        },
        (error) => {
          console.error('Geolocation watch error:', error);
          setGeoError(error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  // Function to stop tracking
  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  useEffect(() => {
    // Set map as loaded after component mounts
    setMapLoaded(true);

    // Initialize geolocation tracking
    startTracking();

    // Cleanup: Stop tracking when component unmounts
    return () => {
      stopTracking();
    };
  }, []);

  // Animation variants for Framer Motion
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

      {/* Location Info Panel */}
      <AnimatePresence>
        {isLocationPanelOpen && (
          <motion.div
            className="fixed left-4 bottom-4 z-50 bg-black/80 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-4 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Live Location
              </h3>
              <div className="flex items-center">
                <button
                  onClick={refreshLocation}
                  className="text-white/70 hover:text-white p-1 mr-2"
                  title="Refresh location"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                {watchIdRef.current ? (
                  <button
                    onClick={stopTracking}
                    className="text-white/70 hover:text-white p-1 mr-2"
                    title="Stop tracking"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={startTracking}
                    className="text-white/70 hover:text-white p-1 mr-2"
                    title="Start tracking"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                {/* Close Button */}
                <button
                  onClick={() => setIsLocationPanelOpen(false)}
                  className="text-white/70 hover:text-white p-1"
                  title="Close panel"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {userPosition ? (
              <>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-semibold">Latitude:</div>
                  <div>{userPosition[0].toFixed(6)}</div>

                  <div className="font-semibold">Longitude:</div>
                  <div>{userPosition[1].toFixed(6)}</div>

                  <div className="font-semibold">Accuracy:</div>
                  <div>{accuracy ? `±${accuracy.toFixed(1)} meters` : 'N/A'}</div>

                  <div className="font-semibold">Last update:</div>
                  <div>{formatTimestamp(timestamp)}</div>
                </div>

                <div className="mt-3 text-xs">
                  <div className="font-semibold mb-1">Current Address:</div>
                  <div className="bg-gray-800/60 p-2 rounded">{userAddress || 'Fetching address...'}</div>
                </div>

                <p className="mt-3 text-xs text-blue-300 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Tracking enabled: {watchIdRef.current ? 'Yes' : 'No'}
                </p>
              </>
            ) : (
              <div className="bg-gray-800/60 p-3 rounded flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Locating your position...</span>
              </div>
            )}

            {geoError && (
              <div className="mt-3 p-2 bg-red-600/70 rounded text-xs">
                Error: {geoError}
              </div>
            )}

            <button
              onClick={() => {
                if (userPosition) {
                  if (navigator.share) {
                    navigator.share({
                      title: 'My Current Location',
                      text: `I'm at ${userAddress || 'this location'}`,
                      url: `https://www.google.com/maps?q=${userPosition[0]},${userPosition[1]}`,
                    }).catch((err) => console.error('Error sharing:', err));
                  } else {
                    navigator.clipboard
                      .writeText(`https://www.google.com/maps?q=${userPosition[0]},${userPosition[1]}`)
                      .then(() => alert('Location link copied to clipboard!'))
                      .catch((err) => console.error('Error copying:', err));
                  }
                }
              }}
              className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-all"
              disabled={!userPosition}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share Location
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button to Toggle Route Card (Top Right) */}
      <button
        onClick={() => setIsRouteCardOpen(!isRouteCardOpen)}
        className="fixed top-20 right-4 z-50 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all shadow-lg"
      >
        {isRouteCardOpen ? 'Close' : 'Plan Route'}
      </button>

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
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A2 2 0 012 15.382V5.618a2 2 0 011.553-1.894L9 1m0 19l6-3m-6 3V1m6 19l5.447-2.724A2 2 0 0022 15.382V5.618a2 2 0 00-1.553-1.894L15 1m-6 0l6 3"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-600">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2a10 10 0 00-7.35 16.76l1.42 1.42a2 2 0 002.83 0l.71-.71 2.12-2.12a2 2 0 00-2.83-2.83L8 15.17V12a2 2 0 012-2h4a2 2 0 012 2v3.17l-.9-.85a2 2 0 00-2.83 2.83l2.12 2.12.71.71a2 2 0 002.83 0l1.42-1.42A10 10 0 0012 2z"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2a10 10 0 00-7.35 16.76l1.42 1.42a2 2 0 002.83 0l.71-.71 2.12-2.12a2 2 0 00-2.83-2.83L8 15.17V12a2 2 0 012-2h4a2 2 0 012 2v3.17l-.9-.85a2 2 0 00-2.83 2.83l2.12 2.12.71.71a2 2 0 002.83 0l1.42-1.42A10 10 0 0012 2z"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2a10 10 0 00-7.35 16.76l1.42 1.42a2 2 0 002.83 0l.71-.71 2.12-2.12a2 2 0 00-2.83-2.83L8 15.17V12a2 2 0 012-2h4a2 2 0 012 2v3.17l-.9-.85a2 2 0 00-2.83 2.83l2.12 2.12.71.71a2 2 0 002.83 0l1.42-1.42A10 10 0 0012 2z"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2a10 10 0 00-7.35 16.76l1.42 1.42a2 2 0 002.83 0l.71-.71 2.12-2.12a2 2 0 00-2.83-2.83L8 15.17V12a2 2 0 012-2h4a2 2 0 012 2v3.17l-.9-.85a2 2 0 00-2.83 2.83l2.12 2.12.71.71a2 2 0 002.83 0l1.42-1.42A10 10 0 0012 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Route Input Form */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">○</div>
                <input
                  type="text"
                  placeholder="Current location"
                  value={startPoint || (userAddress ? userAddress.split(',')[0] : '')}
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button className="p-2">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V8m0 0l-4 4m4-4l4 4m6-8v12m0 0l-4-4m4 4l4-4"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

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