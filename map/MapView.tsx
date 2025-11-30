// src/components/MapView.tsx

import { useEffect, useState } from "react";
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

// Fix default Leaflet icon paths (needed for Vite)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ---------------------------------------------------------------------------
// BLUE USER LOCATION MARKER
// ---------------------------------------------------------------------------
const userIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// CLINIC MARKERS (color-coded)
const clinicIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:16px;
      height:16px;
      border-radius:50%;
      background:${color};
      border:2px solid white;
      box-shadow:0 0 6px rgba(0,0,0,0.4);
    "></div>`,
  });

// ---------------------------------------------------------------------------
// Floating route distance overlay
// ---------------------------------------------------------------------------
function DistanceOverlay({ distance }: { distance: number | null }) {
  if (!distance) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "15px",
        right: "15px",
        background: "white",
        padding: "8px 12px",
        borderRadius: "6px",
        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
        zIndex: 1000,
        fontWeight: "bold",
      }}
    >
      Route Distance: {distance} miles
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recenter logic: only recenter on "Locate Me" click
// ---------------------------------------------------------------------------
function MapUpdater({
  selectedClinic,
  userLocation,
  justLocated,
  setJustLocated,
}: any) {
  const map = useMap();

  // Center after user presses "Locate Me"
  useEffect(() => {
    if (justLocated && userLocation) {
      map.setView([userLocation.lat, userLocation.lon], 13);
      setJustLocated(false);
    }
  }, [justLocated, userLocation]);

  // Slight pan on clinic click (no zoom)
  useEffect(() => {
    if (selectedClinic) {
      map.panTo([selectedClinic.latitude, selectedClinic.longitude]);
    }
  }, [selectedClinic]);

  return null;
}

// ---------------------------------------------------------------------------
// RouteDrawer: Draw a real OSRM route + measure distance
// ---------------------------------------------------------------------------
function RouteDrawer({
  userLocation,
  selectedClinic,
  setRouteDistance,
}: {
  userLocation: { lat: number; lon: number } | null;
  selectedClinic: Clinic | null;
  setRouteDistance: (dist: number | null) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !selectedClinic) return;

    setRouteDistance(null); // reset before drawing a new one

    const control = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lon),
        L.latLng(selectedClinic.latitude, selectedClinic.longitude),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      fitSelectedRoutes: true,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      lineOptions: {
        styles: [{ color: "#1d4ed8", weight: 5 }],
      },
    })
      .on("routesfound", function (e: any) {
        const route = e.routes[0];
        const meters = route.summary.totalDistance;
        const miles = meters / 1609.34;

        setRouteDistance(parseFloat(miles.toFixed(2)));
      })
      .addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [userLocation, selectedClinic]);

  return null;
}

// ---------------------------------------------------------------------------
// MAIN MAP VIEW (Named Export)
// ---------------------------------------------------------------------------
export function MapView({
  clinics,
  selectedClinic,
  onClinicSelect,
  userLocation,
  justLocated,
  setJustLocated,
}: {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onClinicSelect: (clinic: Clinic) => void;
  userLocation: { lat: number; lon: number } | null;
  justLocated: boolean;
  setJustLocated: (v: boolean) => void;
}) {
  const [routeDistance, setRouteDistance] = useState<number | null>(null);

  // Clear distance when nothing selected
  useEffect(() => {
    if (!selectedClinic) setRouteDistance(null);
  }, [selectedClinic]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Distance Box */}
      <DistanceOverlay distance={routeDistance} />

      <MapContainer
        center={[34.05, -118.25]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        minZoom={8}
        maxZoom={18}
      >
        {/* Map tiles */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Recenter logic */}
        <MapUpdater
          selectedClinic={selectedClinic}
          userLocation={userLocation}
          justLocated={justLocated}
          setJustLocated={setJustLocated}
        />

        {/* Real route + distance calculation */}
        <RouteDrawer
          userLocation={userLocation}
          selectedClinic={selectedClinic}
          setRouteDistance={setRouteDistance}
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lon]}
            icon={userIcon}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Clinic markers */}
        {clinics.map((clinic) => {
          const color =
            clinic.distanceKm && clinic.distanceKm <= 5
              ? "green"
              : clinic.distanceKm && clinic.distanceKm <= 10
                ? "orange"
                : "red";

          return (
            <Marker
              key={clinic.id}
              position={[clinic.latitude, clinic.longitude]}
              icon={clinicIcon(color)}
              eventHandlers={{
                click: () => onClinicSelect(clinic),
              }}
            >
              <Popup>
                <strong>{clinic.name}</strong>
                <br />
                {clinic.address1}
                <br />
                {clinic.city}, {clinic.state}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
