// src/app/maps/RoutingMachine.js
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ waypoints, color, startLocation, endLocation, setRouteInfo, travelMode }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    // Create the routing control
    const routingControl = L.Routing.control({
      waypoints: waypoints.map((wp) => L.latLng(wp[0], wp[1])),
      lineOptions: {
        styles: [{ color: color, weight: 4 }],
      },
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false, // Hides the itinerary (directions card)
      createMarker: () => null, // Disables default markers
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: travelMode === 'car' ? 'driving' : travelMode === 'bike' ? 'cycling' : 'walking',
      }),
    }).addTo(map);

    // Listen for route events to update route info
    routingControl.on('routesfound', (e) => {
      const routes = e.routes;
      if (routes.length > 0) {
        const route = routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2); // Convert to km
        const time = (route.summary.totalTime / 60).toFixed(2); // Convert to minutes
        setRouteInfo(
          `Route from ${startLocation} to ${endLocation}: ${distance} km, ${time} minutes`
        );
      }
    });

    // Cleanup on unmount
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints, color, startLocation, endLocation, setRouteInfo, travelMode]);

  return null;
};

export default RoutingMachine;