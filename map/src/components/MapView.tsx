// src/components/MapView.tsx

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

import type { Clinic } from "../types/Clinic";

// ----------------------------
// Fix default marker icons
// ----------------------------
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const userIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const clinicIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:18px;
      height:18px;
      border-radius:50%;
      background:${color};
      border:2px solid white;
      box-shadow:0 0 6px rgba(0,0,0,0.45);
    "></div>`,
  });

// ============================================================
// Routing Component — draws route + returns route distance
// ============================================================
function Routing({ userLocation, clinic, onRouteDistance }: any) {
  const map = useMap();
  const routingRef = useRef<any>(null);

  useEffect(() => {
    if (!userLocation || !clinic) return;

    // Remove old route
    if (routingRef.current) routingRef.current.remove();

    // Create new routing control
    const control = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lon),
        L.latLng(clinic.latitude, clinic.longitude),
      ],
      show: false,              // ✨ Disable default panel
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null, // hide routing markers
      lineOptions: {
        addWaypoints: false,
        styles: [{ color: "#007bff", weight: 5 }],
      },
    })
      .on("routesfound", (e: any) => {
        const summary = e.routes[0].summary;
        const miles = summary.totalDistance * 0.000621371;
        onRouteDistance(miles);
      })
      .addTo(map);

    // ✨ Completely remove the default white instruction panel
    const container = control.getContainer();
    if (container) {
      container.style.display = "none"; // Full hide
    }

    routingRef.current = control;

    return () => {
      if (routingRef.current) map.removeControl(routingRef.current);
    };
  }, [userLocation, clinic, map, onRouteDistance]);

  return null;
}

// ============================================================
// Main Map Component
// ============================================================
export function MapView({
  clinics,
  selectedClinic,
  onClinicSelect,
  userLocation,
  justLocated,
  setJustLocated,
  maxDistanceMiles,
  setRouteDistance,
}: {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onClinicSelect: (clinic: Clinic) => void;
  userLocation: { lat: number; lon: number } | null;
  justLocated: boolean;
  setJustLocated: (v: boolean) => void;
  maxDistanceMiles: number;
  setRouteDistance: (m: number | null) => void;
}) {
  return (
    <MapContainer
      center={[34.05, -118.25]}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Tiles */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lon]}
          icon={userIcon}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Clinic markers */}
      {clinics.map((c) => {
        const dist = c.distanceMiles ?? Infinity;
        const color =
          dist <= 5 ? "green" : dist <= 10 ? "orange" : "red";

        return (
          <Marker
            key={c.id}
            position={[c.latitude, c.longitude]}
            icon={clinicIcon(color)}
            eventHandlers={{ click: () => onClinicSelect(c) }}
          >
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {c.address1}
              <br />
              {c.city}, CA
              <br />
              {dist && !isNaN(dist) && (
                <span>{dist.toFixed(1)} miles away</span>
              )}
            </Popup>
          </Marker>
        );
      })}

      {/* Routing */}
      {userLocation && selectedClinic && (
        <Routing
          userLocation={userLocation}
          clinic={selectedClinic}
          onRouteDistance={setRouteDistance}
        />
      )}
    </MapContainer>
  );
}
