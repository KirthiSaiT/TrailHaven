'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

// Custom component to integrate Leaflet Routing Machine with react-leaflet
const RoutingMachine = dynamic(
  () => import('./RoutingMachine').then((mod) => mod.default),
  { ssr: false }
);

// Chennai points of interest and coordinates with categories
const chennaiLocations = {
  Residential: {
    "Anna Nagar": [13.0850, 80.2101],
    Velachery: [12.9815, 80.2176],
    Adyar: [13.0012, 80.2565],
    "Besant Nagar": [13.0002, 80.2668],
    Mylapore: [13.0336, 80.2687],
    Kodambakkam: [13.0510, 80.2272],
    Kilpauk: [13.0833, 80.2417],
    Nungambakkam: [13.0569, 80.2425],
    "West Mambalam": [13.0411, 80.2175],
    Alwarpet: [13.0324, 80.2568],
    Mandaveli: [13.0229, 80.2664],
    Purasawalkam: [13.0885, 80.2470],
    Chetpet: [13.0713, 80.2440],
    Thiruvanmiyur: [12.9827, 80.2590],
    Mogappair: [13.0958, 80.1712],
    Valasaravakkam: [13.0428, 80.1862],
    Virugambakkam: [13.0543, 80.1968],
    Kolathur: [13.1227, 80.2265],
    Medavakkam: [12.9243, 80.1924],
    Nanganallur: [12.9853, 80.1924],
  },
  Commercial: {
    "T Nagar": [13.0410, 80.2339],
    Sowcarpet: [13.0927, 80.2786],
    "George Town": [13.0921, 80.2864],
    "Mount Road": [13.0628, 80.2416],
    "OMR Road": [12.9512, 80.2322],
    "DLF IT Park": [12.9879, 80.2482],
    "Tidel Park": [12.9896, 80.2486],
  },
  Transport: {
    "Chennai Central": [13.0827, 80.2707],
    "Chennai Airport": [12.9941, 80.1709],
    "Chennai Central Bus Station": [13.0819, 80.2755],
    "Koyambedu Bus Terminal": [13.0693, 80.1937],
    Egmore: [13.0732, 80.2608],
  },
  Industrial: {
    Ambattur: [13.1143, 80.1548],
    Guindy: [13.0067, 80.2206],
    Padi: [13.1037, 80.1914],
    Sriperumbudur: [12.9682, 79.9493],
  },
  Suburban: {
    Porur: [13.0374, 80.1575],
    Tambaram: [12.9249, 80.1000],
    Chromepet: [12.9516, 80.1462],
    Sholinganallur: [12.9010, 80.2279],
    Pallavaram: [12.9675, 80.1491],
    Perungudi: [12.9531, 80.2425],
    Thoraipakkam: [12.9242, 80.2298],
    Avadi: [13.1067, 80.1019],
    Poonamallee: [13.0466, 80.1173],
    "Red Hills": [13.1927, 80.1841],
    Selaiyur: [12.9144, 80.1402],
    Vandalur: [12.8928, 80.0822],
    Kelambakkam: [12.7782, 80.2203],
    Siruseri: [12.8210, 80.2295],
    Madhavaram: [13.1487, 80.2311],
    Pallikaranai: [12.9390, 80.2101],
  },
  Historical: {
    Triplicane: [13.0569, 80.2711],
    Chintadripet: [13.0735, 80.2718],
    Royapettah: [13.0578, 80.2597],
    Choolai: [13.0967, 80.2636],
    "Park Town": [13.0805, 80.2764],
  },
  Beach: {
    "Marina Beach": [13.0500, 80.2824],
    "ECR Road": [12.9984, 80.2643],
    "Kovalam Beach": [12.7894, 80.2553],
  },
  Other: {
    Vadapalani: [13.0519, 80.2121],
    Saidapet: [13.0226, 80.2209],
    Washermanpet: [13.1171, 80.2893],
    Tondiarpet: [13.1285, 80.2839],
    Royapuram: [13.1088, 80.2996],
    Kotturpuram: [13.0169, 80.2428],
    Perambur: [13.1164, 80.2339],
    "IIT Madras": [12.9914, 80.2336],
    "MRC Nagar": [13.0172, 80.2771],
    Ramapuram: [13.0306, 80.1843],
  },
};

// Define danger areas in Chennai, including crime levels from the second code
const dangerAreas = {
  highCrime: [
    { name: "Washermanpet", coords: [13.1171, 80.2893], radius: 1000 },
    { name: "Royapuram", coords: [13.1088, 80.2996], radius: 800 },
    { name: "Pulianthope", coords: [13.1041, 80.2606], radius: 1200 },
    { name: "Vyasarpadi", coords: [13.1184, 80.2517], radius: 900 },
    { name: "Otteri", coords: [13.0946, 80.2511], radius: 850 },
    { name: "Perambur", coords: [13.1164, 80.2339], radius: 750 },
  ],
  floodProne: [
    { name: "Velachery", coords: [12.9815, 80.2176], radius: 1500 },
    { name: "Mudichur", coords: [12.9138, 80.0686], radius: 1200 },
    { name: "Tambaram", coords: [12.9249, 80.1000], radius: 1000 },
    { name: "Pulianthope", coords: [13.1041, 80.2606], radius: 900 },
    { name: "Pallikaranai", coords: [12.9390, 80.2101], radius: 1800 },
    { name: "Perungudi", coords: [12.9531, 80.2425], radius: 1200 },
    { name: "Semmancheri", coords: [12.8735, 80.2279], radius: 1100 },
    { name: "Madipakkam", coords: [12.9572, 80.1983], radius: 1300 },
  ],
  heavyTraffic: [
    { name: "T Nagar", coords: [13.0410, 80.2339], radius: 800 },
    { name: "Guindy", coords: [13.0067, 80.2206], radius: 1000 },
    { name: "Koyambedu", coords: [13.0698, 80.1947], radius: 900 },
    { name: "Poonamallee High Road", coords: [13.0709, 80.2228], radius: 700 },
    { name: "Anna Salai", coords: [13.0628, 80.2416], radius: 1100 },
    { name: "OMR Junction", coords: [12.9512, 80.2322], radius: 950 },
    { name: "Kathipara Junction", coords: [13.0079, 80.2025], radius: 800 },
    { name: "Vadapalani", coords: [13.0519, 80.2121], radius: 750 },
    { name: "Chromepet", coords: [12.9516, 80.1462], radius: 700 },
  ],
  crimeLevels: [
    { area: "T. Nagar", center: [13.0418, 80.2336], radius: 300, crimeLevel: 7 },
    { area: "Anna Nagar", center: [13.0853, 80.2108], radius: 350, crimeLevel: 6 },
    { area: "New Prince Bhavani Engineering College", center: [12.9146, 80.1662], radius: 200, crimeLevel: 3 },
    { area: "Expanded Velachery North", center: [12.9725, 80.2210], radius: 500, crimeLevel: 6 },
    { area: "Adyar", center: [13.0067, 80.2570], radius: 300, crimeLevel: 4 },
    { area: "Kodambakkam", center: [13.0582, 80.2301], radius: 300, crimeLevel: 6 },
    { area: "Mylapore", center: [13.0337, 80.2671], radius: 250, crimeLevel: 5 },
    { area: "Nungambakkam", center: [13.0634, 80.2435], radius: 350, crimeLevel: 7 },
    { area: "Royapettah", center: [13.0603, 80.2684], radius: 300, crimeLevel: 8 },
    { area: "Saidapet", center: [13.0236, 80.2210], radius: 250, crimeLevel: 6 },
    { area: "Triplicane", center: [13.0604, 80.2760], radius: 300, crimeLevel: 8 },
    { area: "Perambur", center: [13.1143, 80.2472], radius: 350, crimeLevel: 6 },
    { area: "Tambaram", center: [12.9229, 80.1275], radius: 400, crimeLevel: 5 },
    { area: "Chromepet", center: [12.9508, 80.1444], radius: 300, crimeLevel: 5 },
    { area: "Guindy", center: [13.0084, 80.2170], radius: 320, crimeLevel: 7 },
    { area: "Thiruvanmiyur", center: [12.9823, 80.2591], radius: 280, crimeLevel: 4 },
    { area: "Egmore", center: [13.0787, 80.2614], radius: 300, crimeLevel: 7 },
    { area: "Vepery", center: [13.0835, 80.2605], radius: 250, crimeLevel: 6 },
    { area: "Parrys", center: [13.0908, 80.2935], radius: 320, crimeLevel: 9 },
    { area: "Washermanpet", center: [13.1183, 80.2895], radius: 300, crimeLevel: 8 },
    { area: "Broadway", center: [13.0855, 80.2832], radius: 280, crimeLevel: 8 },
  ],
};

// Function to get circle color based on crime level
const getCircleColor = (crimeLevel) => {
  if (crimeLevel <= 3) {
    return "#ff9800"; // Orange for moderate crime levels
  } else if (crimeLevel <= 6) {
    return "#f44336"; // Red for high crime levels
  } else {
    return "#b71c1c"; // Dark red for very high crime levels
  }
};

// Calculate distance between two coordinates in meters using Haversine formula
const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Radius of the earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in meters
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Check if user's location is in any danger zone
const checkLocation = (lat, lon) => {
  for (let i = 0; i < dangerAreas.crimeLevels.length; i++) {
    const area = dangerAreas.crimeLevels[i];
    const distance = getDistanceFromLatLonInM(lat, lon, area.center[0], area.center[1]);
    if (distance <= area.radius) {
      return {
        isInDangerZone: true,
        areaInfo: area,
      };
    }
  }
  return {
    isInDangerZone: false,
    areaInfo: null,
  };
};

const MapComponent = ({
  userPosition,
  shortestRouteWaypoints,
  secureRouteWaypoints,
  startLocation,
  endLocation,
  setRouteInfo,
  travelMode,
  mapRef,
  handleLocateMe,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [leafletInstance, setLeafletInstance] = useState(null);

  // Load Leaflet and its dependencies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import('leaflet'),
        import('leaflet/dist/leaflet.css'),
        import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'),
        import('leaflet-defaulticon-compatibility'),
        import('leaflet-routing-machine/dist/leaflet-routing-machine.css'),
      ])
        .then(([L]) => {
          // Fix for default marker icons in React Leaflet
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          });

          setLeafletInstance(L);
          setLeafletLoaded(true);
          setIsMounted(true);
        })
        .catch((error) => {
          console.error('Failed to load Leaflet dependencies:', error);
        });
    }
  }, []);

  // Default center (e.g., Chennai) if user position is not available
  const defaultCenter = [13.0827, 80.2707]; // Coordinates for Chennai
  const initialZoom = 12;

  // Only render the map if both the component is mounted and Leaflet is loaded
  if (!isMounted || !leafletLoaded || !leafletInstance) {
    return <div>Loading map...</div>;
  }

  // Create custom marker icon for user's location
  const redIcon = new leafletInstance.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Create custom marker icons for start and end points of the shortest path
  const greenIcon = new leafletInstance.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const blueIcon = new leafletInstance.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Get start and end coordinates for the shortest path
  const startCoords = shortestRouteWaypoints.length > 0 ? shortestRouteWaypoints[0] : null;
  const endCoords = shortestRouteWaypoints.length > 0 ? shortestRouteWaypoints[shortestRouteWaypoints.length - 1] : null;

  return (
    <div className="absolute inset-0" style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={userPosition || defaultCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        className="leaflet-map-container"
        whenCreated={(map) => {
          mapRef.current = map;
        }}
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

        {/* Start marker for shortest path */}
        {startCoords && shortestRouteWaypoints.length > 0 && (
          <Marker position={startCoords} icon={greenIcon}>
            <Popup>
              <div>
                <strong>Start: {startLocation}</strong>
                <br />
                Lat: {startCoords[0].toFixed(6)}
                <br />
                Lng: {startCoords[1].toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}

        {/* End marker for shortest path */}
        {endCoords && shortestRouteWaypoints.length > 0 && (
          <Marker position={endCoords} icon={blueIcon}>
            <Popup>
              <div>
                <strong>End: {endLocation}</strong>
                <br />
                Lat: {endCoords[0].toFixed(6)}
                <br />
                Lng: {endCoords[1].toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render danger areas using react-leaflet's Circle component */}
        {dangerAreas.highCrime.map((area, index) => (
          <Circle
            key={`highCrime-${index}`}
            center={area.coords}
            radius={area.radius}
            pathOptions={{ color: '#FF6B6B', fillColor: '#FF6B6B', fillOpacity: 0.2 }}
          >
            <Popup>High Crime Area: {area.name}</Popup>
          </Circle>
        ))}
        {dangerAreas.floodProne.map((area, index) => (
          <Circle
            key={`floodProne-${index}`}
            center={area.coords}
            radius={area.radius}
            pathOptions={{ color: '#4D96FF', fillColor: '#4D96FF', fillOpacity: 0.2 }}
          >
            <Popup>Flood-Prone Area: {area.name}</Popup>
          </Circle>
        ))}
        {dangerAreas.heavyTraffic.map((area, index) => (
          <Circle
            key={`heavyTraffic-${index}`}
            center={area.coords}
            radius={area.radius}
            pathOptions={{ color: '#FFD166', fillColor: '#FFD166', fillOpacity: 0.2 }}
          >
            <Popup>Heavy Traffic Area: {area.name}</Popup>
          </Circle>
        ))}
        {/* Render crime level areas with color-coded circles */}
        {dangerAreas.crimeLevels.map((location, index) => (
          <Circle
            key={`crimeLevel-${index}`}
            center={location.center}
            radius={location.radius}
            pathOptions={{
              color: getCircleColor(location.crimeLevel),
              weight: 2,
              fillColor: getCircleColor(location.crimeLevel),
              fillOpacity: 0.5,
            }}
          >
            <Popup>
              <b>{location.area}</b>
              <br />
              Crime Level: {location.crimeLevel}/10
            </Popup>
          </Circle>
        ))}

        {/* Render routes */}
        {shortestRouteWaypoints.length > 0 && (
          <RoutingMachine
            waypoints={shortestRouteWaypoints}
            color="#0078A8"
            startLocation={startLocation}
            endLocation={endLocation}
            setRouteInfo={setRouteInfo}
            travelMode={travelMode}
          />
        )}
        {secureRouteWaypoints.length > 0 && (
          <RoutingMachine
            waypoints={secureRouteWaypoints}
            color="#4CAF50"
            startLocation={startLocation}
            endLocation={endLocation}
            setRouteInfo={setRouteInfo}
            travelMode={travelMode}
          />
        )}
      </MapContainer>

      {/* Locate Me button */}
      <button
        onClick={handleLocateMe}
        className="fixed top-20 left-4 z-50 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-lg font-semibold transition-all shadow-lg"
      >
        Locate Me
      </button>
    </div>
  );
};

export default function Maps() {
  // State for starting point and destination
  const [startLocation, setStartLocation] = useState('Chennai Central');
  const [endLocation, setEndLocation] = useState('Chennai Airport');
  const [travelMode, setTravelMode] = useState('car');
  const [avoidHighCrime, setAvoidHighCrime] = useState(true);
  const [avoidFloodProne, setAvoidFloodProne] = useState(true);
  const [avoidHeavyTraffic, setAvoidHeavyTraffic] = useState(true);
  const [routeInfo, setRouteInfo] = useState(
    'Select start and end locations, then click a button to find a route.'
  );
  const [weatherInfo, setWeatherInfo] = useState('Loading weather information...');
  const [trafficVisible, setTrafficVisible] = useState(false);
  const [shortestRouteWaypoints, setShortestRouteWaypoints] = useState([]);
  const [secureRouteWaypoints, setSecureRouteWaypoints] = useState([]);
  const [showAvoidAreas, setShowAvoidAreas] = useState(false);

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
  // Ref to store the map instance
  const mapRef = useRef(null);
  // State for status messages
  const [statusMessage, setStatusMessage] = useState(null);
  const [messageType, setMessageType] = useState('safe');

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

  // Haversine distance formula (in km)
  const getDistance = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[0] * Math.PI) / 180) *
        Math.cos((coord2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Handle user location finding with "Locate Me" button
  const handleLocateMe = () => {
    setStatusMessage("Fetching your location...");
    setMessageType('safe');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserPosition([latitude, longitude]);
          setAccuracy(accuracy);
          setTimestamp(position.timestamp);
          fetchAddress(latitude, longitude);
          setGeoError(null);

          // Center map on user's location
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 14);
          }

          // Check if user is in any danger zone
          const locationCheck = checkLocation(latitude, longitude);

          if (locationCheck.isInDangerZone) {
            const area = locationCheck.areaInfo;
            setStatusMessage(`Warning: You are in ${area.area} (Crime Level: ${area.crimeLevel}/10)`);
            setMessageType('danger');
          } else {
            setStatusMessage("You are in a safe area.");
            setMessageType('safe');
          }

          // Hide message after 5 seconds
          setTimeout(() => {
            setStatusMessage(null);
          }, 5000);
        },
        (error) => {
          let errorMessage;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
          }

          setStatusMessage(errorMessage);
          setMessageType('danger');

          // Hide message after 5 seconds
          setTimeout(() => {
            setStatusMessage(null);
          }, 5000);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000,
        }
      );
    } else {
      setStatusMessage("Geolocation is not supported by this browser.");
      setMessageType('danger');

      // Hide message after 5 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    }
  };

  // A* Algorithm Implementation
  const aStarAlgorithm = (start, end, dangerPoints) => {
    const gridSize = 0.005; // approx 500m grid cells
    const bounds = {
      minLat: 12.8,
      maxLat: 13.3,
      minLng: 80.0,
      maxLng: 80.4,
    };

    const latCells = Math.ceil((bounds.maxLat - bounds.minLat) / gridSize);
    const lngCells = Math.ceil((bounds.maxLng - bounds.minLng) / gridSize);

    const grid = [];
    for (let i = 0; i < latCells; i++) {
      grid[i] = [];
      for (let j = 0; j < lngCells; j++) {
        grid[i][j] = 1; // Base cost
      }
    }

    // Include crime levels in the danger points for A* pathfinding
    const allDangerPoints = [...dangerPoints];
    if (avoidHighCrime) {
      dangerAreas.crimeLevels.forEach((area) => {
        if (area.crimeLevel >= 7) { // Consider areas with crime level 7+ as high crime
          allDangerPoints.push({
            name: area.area,
            coords: area.center,
            radius: area.radius,
          });
        }
      });
    }

    allDangerPoints.forEach((point) => {
      const latIdx = Math.floor((point.coords[0] - bounds.minLat) / gridSize);
      const lngIdx = Math.floor((point.coords[1] - bounds.minLng) / gridSize);

      const cellRadius = Math.ceil(point.radius / 1000 / gridSize);

      for (
        let i = Math.max(0, latIdx - cellRadius);
        i < Math.min(latCells, latIdx + cellRadius);
        i++
      ) {
        for (
          let j = Math.max(0, lngIdx - cellRadius);
          j < Math.min(lngCells, lngIdx + cellRadius);
          j++
        ) {
          const lat = bounds.minLat + i * gridSize;
          const lng = bounds.minLng + j * gridSize;

          const distance = getDistance([lat, lng], point.coords);
          if (distance < point.radius / 1000) {
            grid[i][j] = point.name.includes('High Crime') || point.crimeLevel >= 7 ? Infinity : 10;
          }
        }
      }
    });

    const toGridIndices = (coords) => {
      const latIdx = Math.floor((coords[0] - bounds.minLat) / gridSize);
      const lngIdx = Math.floor((coords[1] - bounds.minLng) / gridSize);
      return {
        lat: Math.max(0, Math.min(latCells - 1, latIdx)),
        lng: Math.max(0, Math.min(lngCells - 1, lngIdx)),
      };
    };

    const toLatLng = (indices) => {
      return [bounds.minLat + indices.lat * gridSize, bounds.minLng + indices.lng * gridSize];
    };

    const startPos = toGridIndices(start);
    const endPos = toGridIndices(end);

    const openSet = new Map();
    const closedSet = new Set();

    const posKey = (pos) => `${pos.lat},${pos.lng}`;

    const speed = { car: 40, walk: 5, bike: 15 }; // km/h

    openSet.set(posKey(startPos), {
      pos: startPos,
      g: 0, // Time in minutes
      h: (getDistance(toLatLng(startPos), end) / speed[travelMode]) * 60,
      f: (getDistance(toLatLng(startPos), end) / speed[travelMode]) * 60,
      parent: null,
    });

    const directions = [
      { lat: -1, lng: -1 },
      { lat: -1, lng: 0 },
      { lat: -1, lng: 1 },
      { lat: 0, lng: -1 },
      { lat: 0, lng: 1 },
      { lat: 1, lng: -1 },
      { lat: 1, lng: 0 },
      { lat: 1, lng: 1 },
    ];

    let path = [];
    let finalNode = null;

    while (openSet.size > 0) {
      let currentKey = null;
      let current = null;
      let lowestF = Infinity;

      for (const [key, node] of openSet.entries()) {
        if (node.f < lowestF) {
          lowestF = node.f;
          currentKey = key;
          current = node;
        }
      }

      openSet.delete(currentKey);
      closedSet.add(currentKey);

      if (current.pos.lat === endPos.lat && current.pos.lng === endPos.lng) {
        finalNode = current;
        break;
      }

      for (const dir of directions) {
        const neighbor = {
          lat: current.pos.lat + dir.lat,
          lng: current.pos.lng + dir.lng,
        };

        if (
          neighbor.lat < 0 ||
          neighbor.lat >= latCells ||
          neighbor.lng < 0 ||
          neighbor.lng >= lngCells
        ) {
          continue;
        }

        const neighborKey = posKey(neighbor);

        if (closedSet.has(neighborKey) || grid[neighbor.lat][neighbor.lng] === Infinity) {
          continue;
        }

        const neighborPos = toLatLng(neighbor);
        const distance = getDistance(toLatLng(current.pos), neighborPos);
        const timeCost = ((distance / speed[travelMode]) * 60 * grid[neighbor.lat][neighbor.lng]);
        const g = current.g + timeCost;

        const existingNeighbor = openSet.get(neighborKey);
        if (!existingNeighbor || g < existingNeighbor.g) {
          const h = (getDistance(neighborPos, end) / speed[travelMode]) * 60;
          openSet.set(neighborKey, {
            pos: neighbor,
            g: g,
            h: h,
            f: g + h,
            parent: current,
          });
        }
      }
    }

    if (finalNode) {
      let current = finalNode;
      while (current) {
        path.unshift(toLatLng(current.pos));
        current = current.parent;
      }
    }

    return path;
  };

  // Function to calculate waypoints for secure route
  const calculateSecureWaypoints = (start, end) => {
    const secureWaypoints = [];
    const safeAreas = [];

    for (const category in chennaiLocations) {
      for (const location in chennaiLocations[category]) {
        const coords = chennaiLocations[category][location];
        let isSafe = true;

        if (avoidHighCrime) {
          for (const area of dangerAreas.highCrime) {
            if (getDistance(coords, area.coords) < area.radius / 1000) {
              isSafe = false;
              break;
            }
          }
          for (const area of dangerAreas.crimeLevels) {
            if (area.crimeLevel >= 7 && getDistance(coords, area.center) < area.radius / 1000) {
              isSafe = false;
              break;
            }
          }
        }

        if (isSafe && avoidFloodProne) {
          for (const area of dangerAreas.floodProne) {
            if (getDistance(coords, area.coords) < area.radius / 1000) {
              isSafe = false;
              break;
            }
          }
        }

        if (isSafe && avoidHeavyTraffic) {
          for (const area of dangerAreas.heavyTraffic) {
            if (getDistance(coords, area.coords) < area.radius / 1000) {
              isSafe = false;
              break;
            }
          }
        }

        if (isSafe) safeAreas.push(location);
      }
    }

    const distancesFromStart = safeAreas.map((area) => {
      const areaCoords = getCoordinates(area);
      return {
        name: area,
        coords: areaCoords,
        distanceFromStart: getDistance(start, areaCoords),
        distanceToEnd: getDistance(areaCoords, end),
      };
    });

    distancesFromStart.sort((a, b) => {
      const totalDistA = a.distanceFromStart + a.distanceToEnd;
      const totalDistB = b.distanceFromStart + b.distanceToEnd;
      return totalDistA - totalDistB;
    });

    const directDistance = getDistance(start, end);
    let numWaypoints = 1;
    if (directDistance > 10) numWaypoints = 3;
    else if (directDistance > 5) numWaypoints = 2;

    for (let i = 0; i < numWaypoints && i < distancesFromStart.length; i++) {
      secureWaypoints.push(distancesFromStart[i].coords);
    }

    return secureWaypoints;
  };

  // Function to get coordinates from location name
  const getCoordinates = (locationName) => {
    for (const category in chennaiLocations) {
      if (chennaiLocations[category][locationName]) {
        return chennaiLocations[category][locationName];
      }
    }
    return chennaiLocations['Transport']['Chennai Central'];
  };

  // Fetch weather information (mocked since API key is missing)
  useEffect(() => {
    const updateWeatherInfo = async () => {
      try {
        // Replace 'YOUR_API_KEY' with your OpenWeatherMap API key
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=YOUR_API_KEY&units=metric'
        );
        const data = await response.json();
        setWeatherInfo(`Weather: ${data.weather[0].description}, Temp: ${data.main.temp}°C`);
      } catch (error) {
        setWeatherInfo('Weather info unavailable');
      }
    };

    // Mock weather info if API key is not provided
    setWeatherInfo('Weather: Clear, Temp: 30°C');
    // Uncomment the following line and add your API key to fetch real weather data
    // updateWeatherInfo();
  }, []);

  // Find shortest route using A*
  const findShortestRoute = () => {
    const startCoords = getCoordinates(startLocation);
    const endCoords = getCoordinates(endLocation);

    const dangerPoints = [];
    if (avoidHighCrime) dangerPoints.push(...dangerAreas.highCrime);
    if (avoidFloodProne) dangerPoints.push(...dangerAreas.floodProne);
    if (avoidHeavyTraffic) dangerPoints.push(...dangerAreas.heavyTraffic);

    const path = aStarAlgorithm(startCoords, endCoords, dangerPoints);
    setShortestRouteWaypoints(path);
    setSecureRouteWaypoints([]); // Clear secure route
  };

  // Find secure route
  const findSecureRoute = () => {
    const startCoords = getCoordinates(startLocation);
    const endCoords = getCoordinates(endLocation);

    const secureWaypoints = calculateSecureWaypoints(startCoords, endCoords);
    const waypoints = [startCoords, ...secureWaypoints, endCoords];
    setSecureRouteWaypoints(waypoints);
    setShortestRouteWaypoints([]); // Clear shortest route
  };

  // Toggle traffic layer (mocked since OpenTraffic API is not available)
  const toggleTraffic = () => {
    setTrafficVisible((prev) => !prev);
    // Note: OpenTraffic API is not publicly available; you can integrate a real traffic layer if you have access to one.
  };

  // Export route as GeoJSON
  const exportRoute = () => {
    const waypoints = shortestRouteWaypoints.length > 0 ? shortestRouteWaypoints : secureRouteWaypoints;
    if (waypoints.length === 0) {
      alert('Please generate a route first!');
      return;
    }

    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: waypoints.map((wp) => [wp[1], wp[0]]),
          },
          properties: {
            name: shortestRouteWaypoints.length > 0 ? 'Shortest Route' : 'Secure Route',
            travelMode: travelMode,
          },
        },
      ],
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'route.geojson');
    downloadAnchor.click();
  };

  // Clear routes
  const clearRoutes = () => {
    setShortestRouteWaypoints([]);
    setSecureRouteWaypoints([]);
    setRouteInfo('Select start and end locations, then click a button to find a route.');
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
        {mapLoaded && (
          <MapComponent
            userPosition={userPosition}
            shortestRouteWaypoints={shortestRouteWaypoints}
            secureRouteWaypoints={secureRouteWaypoints}
            startLocation={startLocation}
            endLocation={endLocation}
            setRouteInfo={setRouteInfo}
            travelMode={travelMode}
            mapRef={mapRef}
            handleLocateMe={handleLocateMe}
          />
        )}
      </div>

      {/* Location Info Panel */}
      <AnimatePresence>
        {isLocationPanelOpen && (
          <motion.div
            className="fixed left-4 bottom-4 z-50 bg-black/80 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-4 max-w-md w-full sm:max-w-sm"
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
            key="route-card"
            className="fixed top-32 right-4 z-50 bg-white p-6 rounded-lg shadow-xl border border-gray-200 w-full max-w-[350px] sm:max-w-[400px] max-h-[70vh] overflow-y-auto mx-4 sm:mx-0"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsRouteCardOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
              title="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-800">Chennai Route Finder</h3>

            <div className="mb-4">
              <label htmlFor="start" className="block font-semibold text-gray-700 mb-1">
                Start Location:
              </label>
              <select
                id="start"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(chennaiLocations).map(([category, locations]) => (
                  <optgroup key={category} label={category}>
                    {Object.keys(locations).map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="end" className="block font-semibold text-gray-700 mb-1">
                End Location:
              </label>
              <select
                id="end"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(chennaiLocations).map(([category, locations]) => (
                  <optgroup key={category} label={category}>
                    {Object.keys(locations).map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="travelMode" className="block font-semibold text-gray-700 mb-1">
                Travel Mode:
              </label>
              <select
                id="travelMode"
                value={travelMode}
                onChange={(e) => setTravelMode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="car">Car</option>
                <option value="walk">Walking</option>
                <option value="bike">Bicycle</option>
              </select>
            </div>

            <div className="mb-4 border-t border-gray-200 pt-3">
              <h4
                className="text-blue-600 cursor-pointer mb-2 font-semibold"
                onClick={() => setShowAvoidAreas(!showAvoidAreas)}
              >
                Avoid Areas {showAvoidAreas ? '▲' : '▼'}
              </h4>
              {showAvoidAreas && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="area1"
                      checked={avoidHighCrime}
                      onChange={(e) => setAvoidHighCrime(e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="area1" className="text-gray-700">
                      High Crime Areas
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="area2"
                      checked={avoidFloodProne}
                      onChange={(e) => setAvoidFloodProne(e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="area2" className="text-gray-700">
                      Flood-Prone Areas
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="area3"
                      checked={avoidHeavyTraffic}
                      onChange={(e) => setAvoidHeavyTraffic(e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="area3" className="text-gray-700">
                      Heavy Traffic Areas
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={findShortestRoute}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Shortest Route (A*)
              </button>
              <button
                onClick={findSecureRoute}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
              >
                Secure Route
              </button>
              <button
                onClick={toggleTraffic}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Toggle Traffic
              </button>
              <button
                onClick={exportRoute}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export Route
              </button>
              <button
                onClick={clearRoutes}
                className="col-span-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Routes
              </button>
            </div>

            <div className="p-3 bg-gray-100 rounded-lg text-gray-700 text-sm">{routeInfo}</div>

            <div className="mt-4 pt-3 border-t border-gray-200 text-gray-600 text-sm">
              {weatherInfo}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend */}
      <motion.div
        className="fixed bottom-8 right-4 z-50 bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-[200px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h4 className="text-sm font-bold mb-2 text-gray-800">Map Legend</h4>
        <div className="flex items-center mb-1">
          <span className="w-5 h-1 bg-blue-600 mr-2"></span>
          <span className="text-gray-700 text-xs">Shortest Route (A*)</span>
        </div>
        <div className="flex items-center mb-1">
          <span className="w-5 h-1 bg-green-600 mr-2"></span>
          <span className="text-gray-700 text-xs">Secure Route</span>
        </div>
        <div className="flex items-center mb-1">
          <span className="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
          <span className="text-gray-700 text-xs">High Crime Area</span>
        </div>
        <div className="flex items-center mb-1">
          <span className="w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
          <span className="text-gray-700 text-xs">Flood-Prone Area</span>
        </div>
        <div className="flex items-center mb-1">
          <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
          <span className="text-gray-700 text-xs">Heavy Traffic Area</span>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <h4 className="text-sm font-bold mb-2 text-gray-800">Crime Levels</h4>
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
            <span className="text-gray-700 text-xs">Moderate (1-3)</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-gray-700 text-xs">High (4-6)</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-800 mr-2"></span>
            <span className="text-gray-700 text-xs">Very High (7-10)</span>
          </div>
        </div>
      </motion.div>

      {/* Status message */}
      {statusMessage && (
        <motion.div
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold text-center"
          style={{
            backgroundColor: messageType === 'safe' ? '#4caf50' : '#f44336',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {statusMessage}
        </motion.div>
      )}
    </div>
  );
}