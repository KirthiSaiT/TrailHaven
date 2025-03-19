'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Mock crime data (replace with MongoDB later)
const crimeData = [
  { lat: 37.7749, lng: -122.4194, intensity: 0.8 },
  { lat: 37.7649, lng: -122.4294, intensity: 0.6 },
  { lat: 37.7849, lng: -122.4094, intensity: 0.9 },
];

export default function Map({ setAlert }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [routes, setRoutes] = useState([]);
  const [map, setMap] = useState(null); // Store map instance

  // Initialize heatmap only after the map is mounted
  useEffect(() => {
    if (map) {
      L.heatLayer(crimeData.map(d => [d.lat, d.lng, d.intensity]), { radius: 25 }).addTo(map);
    }
  }, [map]);

  const calculateRoutes = async () => {
    if (!start || !end) return;

    // Mock route calculation (replace with OpenStreetMap/Google Maps API later)
    const mockRoutes = [
      {
        path: [
          [37.7749, -122.4194],
          [37.7649, -122.4294],
          [37.7549, -122.4394],
        ],
        crimeScore: 3,
      },
      {
        path: [
          [37.7749, -122.4194],
          [37.7849, -122.4094],
          [37.7949, -122.3994],
        ],
        crimeScore: 1,
      },
    ];

    const sortedRoutes = mockRoutes.sort((a, b) => a.crimeScore - b.crimeScore);
    setRoutes(sortedRoutes);

    // Simulate geofencing for alerts
    const userPos = [37.7749, -122.4194]; // Mock user position
    const nearCrime = crimeData.some(
      d => L.latLng(d.lat, d.lng).distanceTo(userPos) < 500 // 500 meters
    );
    if (nearCrime) setAlert('Warning: You are near a crime hotspot!');
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Start location"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border rounded-md p-2 mr-2"
        />
        <input
          type="text"
          placeholder="End location"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border rounded-md p-2 mr-2"
        />
        <button
          onClick={calculateRoutes}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Find Safe Route
        </button>
      </div>
      <MapContainer
        center={[37.7749, -122.4194]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        whenCreated={setMap} // Set map instance when created
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {routes.length > 0 && (
          <Polyline positions={routes[0].path} color="green" weight={5} />
        )}
      </MapContainer>
      {routes.length > 0 && (
        <p className="mt-2 text-gray-600">Safest route displayed in green.</p>
      )}
    </div>
  );
}