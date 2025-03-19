// src/app/maps/RoutingMachine.js
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ waypoints, color, startLocation, endLocation, setRouteInfo, travelMode }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints.map((wp) => L.latLng(wp[0], wp[1])),
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color, weight: 6 }],
      },
      createMarker: (i, wp, n) => {
        if (i === 0 || i === n - 1) {
          return L.marker(wp.latLng, {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              shadowSize: [41, 41],
            }),
          }).bindPopup(i === 0 ? startLocation : endLocation);
        }
        return null;
      },
    }).addTo(map);

    routingControl.on('routesfound', (e) => {
      const route = e.routes[0];
      const distance = (route.summary.totalDistance / 1000).toFixed(2);
      const time = Math.round(route.summary.totalTime / 60);
      setRouteInfo(
        `${color === '#0078A8' ? 'Shortest Route (A*)' : 'Secure Route'}: ${distance} km, ${time} minutes (${travelMode})`
      );
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints, color, startLocation, endLocation, setRouteInfo, travelMode]);

  return null;
};

export default RoutingMachine;