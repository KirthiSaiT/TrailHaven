// src/app/maps/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
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

// Define danger areas in Chennai
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
};

const MapComponent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS and confirm mounting
    Promise.all([
      import('leaflet/dist/leaflet.css'),
      import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'),
      import('leaflet-defaulticon-compatibility'),
      import('leaflet-routing-machine/dist/leaflet-routing-machine.css'),
    ]).then(() => {
      setIsMounted(true);
    });
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
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
    </>
  );
};

export default function Maps() {
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

  const defaultCenter = [13.0827, 80.2707]; // Chennai
  const initialZoom = 12;

  // Haversine distance formula
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

    dangerPoints.forEach((point) => {
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
            grid[i][j] = point.name.includes('High Crime') && avoidHighCrime ? Infinity : 10;
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
        <MapContainer
          center={defaultCenter}
          zoom={initialZoom}
          style={{ height: '100%', width: '100%', zIndex: 10 }}
          className="leaflet-map-container"
        >
          <MapComponent />
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
      </div>

      {/* Controls Panel */}
      <motion.div
        className="fixed top-20 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-[320px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-bold mb-4 text-gray-800">Chennai Route Finder</h3>

        <div className="mb-4">
          <label htmlFor="start" className="block font-bold text-gray-600 mb-1">
            Start Location:
          </label>
          <select
            id="start"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50"
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
          <label htmlFor="end" className="block font-bold text-gray-600 mb-1">
            End Location:
          </label>
          <select
            id="end"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50"
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
          <label htmlFor="travelMode" className="block font-bold text-gray-600 mb-1">
            Travel Mode:
          </label>
          <select
            id="travelMode"
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50"
          >
            <option value="car">Car</option>
            <option value="walk">Walking</option>
            <option value="bike">Bicycle</option>
          </select>
        </div>

        <div className="mb-4 border-t border-gray-200 pt-2">
          <h4
            className="text-blue-600 cursor-pointer mb-2"
            onClick={() => setShowAvoidAreas(!showAvoidAreas)}
          >
            Avoid Areas
          </h4>
          {showAvoidAreas && (
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="area1"
                  checked={avoidHighCrime}
                  onChange={(e) => setAvoidHighCrime(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="area1" className="text-gray-700">
                  High Crime Areas
                </label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="area2"
                  checked={avoidFloodProne}
                  onChange={(e) => setAvoidFloodProne(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="area2" className="text-gray-700">
                  Flood-Prone Areas
                </label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="area3"
                  checked={avoidHeavyTraffic}
                  onChange={(e) => setAvoidHeavyTraffic(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="area3" className="text-gray-700">
                  Heavy Traffic Areas
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={findShortestRoute}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Find Shortest Route (A*)
          </button>
          <button
            onClick={findSecureRoute}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            Find Secure Route
          </button>
          <button
            onClick={toggleTraffic}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Toggle Traffic
          </button>
          <button
            onClick={exportRoute}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Route
          </button>
          <button
            onClick={clearRoutes}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear
          </button>
        </div>

        <div className="p-2 bg-gray-100 rounded text-gray-700 text-sm">{routeInfo}</div>

        <div className="mt-4 pt-2 border-t border-gray-200 text-gray-600 text-sm">
          {weatherInfo}
        </div>
      </motion.div>

      {/* Map Legend */}
      <motion.div
        className="fixed bottom-8 right-4 z-50 bg-white p-3 rounded-lg shadow-lg border border-gray-200"
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
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
          <span className="text-gray-700 text-xs">Heavy Traffic Area</span>
        </div>
      </motion.div>
    </div>
  );
}