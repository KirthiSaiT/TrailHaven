'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

// RoutingMachine component to integrate leaflet-routing-machine with react-leaflet
const RoutingMachine = ({ waypoints, color, startLocation, endLocation, setRouteInfo, travelMode }) => {
  const map = useMap(); // Get the map instance from react-leaflet

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) return;

    // Create the routing control
    const routingControl = L.Routing.control({
      waypoints: waypoints.map((wp) => L.latLng(wp[0], wp[1])),
      routeWhileDragging: false,
      show: false, // Hide the default routing UI
      addWaypoints: false, // Disable adding new waypoints by clicking
      fitSelectedRoutes: true, // Automatically zoom to fit the route
      lineOptions: {
        styles: [{ color: color, weight: 4 }],
      },
      createMarker: () => null, // Disable default markers (we already have custom markers)
    }).addTo(map);

    // Update route info when a route is found
    routingControl.on('routesfound', (e) => {
      const route = e.routes[0];
      const distance = (route.summary.totalDistance / 1000).toFixed(2); // Convert to km
      const time = (route.summary.totalTime / 60).toFixed(2); // Convert to minutes
      setRouteInfo(
        `Route from ${startLocation} to ${endLocation} (${travelMode}): ${distance} km, ${time} mins`
      );
    });

    // Cleanup: Remove the routing control when the component unmounts
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, waypoints, color, startLocation, endLocation, setRouteInfo, travelMode]);

  return null; // This component doesn't render anything itself
};

export default RoutingMachine;