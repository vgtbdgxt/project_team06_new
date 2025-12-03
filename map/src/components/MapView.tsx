
// src/components/MapView.tsx

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
  LayerGroup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

import type { Clinic } from "../types/Clinic";
import type { ExposomeSettings, RouteBurdenResult } from "../types/Exposome";
import { generateMockGrid, mockLayerValue, valueToColor, estimateRouteBurden } from "../utils/exposome";

const userIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  clinics: Clinic[];
  filteredClinics: Clinic[];
  selectedClinic: Clinic | null;
  onSelectClinic: (clinic: Clinic) => void;
  userLocation: { lat: number; lon: number } | null;
  onRouteDistanceChange: (miles: number | null) => void;
  exposomeSettings: ExposomeSettings;
  onRouteBurdenChange: (result: RouteBurdenResult | null) => void;
}

export function MapView({
  clinics,
  filteredClinics,
  selectedClinic,
  onSelectClinic,
  userLocation,
  onRouteDistanceChange,
  exposomeSettings,
  onRouteBurdenChange,
}: MapViewProps) {
  const gridPoints = useMemo(() => generateMockGrid(12, 12), []);

  // Recompute route burden whenever the route endpoints or settings change.
  useEffect(() => {
    if (userLocation && selectedClinic) {
      const result = estimateRouteBurden(
        userLocation,
        { latitude: selectedClinic.latitude, longitude: selectedClinic.longitude },
        exposomeSettings
      );
      onRouteBurdenChange(result);
    } else {
      onRouteBurdenChange(null);
    }
  }, [userLocation, selectedClinic, exposomeSettings, onRouteBurdenChange]);

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
        <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Exposome overlay dots */}
      <LayerGroup>
        {gridPoints.map((p) => {
          const v = mockLayerValue(
            exposomeSettings.visibleLayer,
            p.lat,
            p.lon
          );
          const color = valueToColor(
            exposomeSettings.visibleLayer === "green" ? 1 - v : v
          );
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lon]}
              radius={5}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.4,
                weight: 0,
              }}
            />
          );
        })}
      </LayerGroup>

      {/* Clinic markers */}
      {filteredClinics.map((c) => {
        const dist = c.distanceMiles ?? Infinity;
        const color =
          !isFinite(dist) || dist <= 0
            ? "#3b82f6"
            : dist <= 5
            ? "#22c55e"
            : dist <= 10
            ? "#eab308"
            : "#ef4444";

        const markerIcon = L.divIcon({
          className: "clinic-marker",
          html: `<div style="
              background:${color};
              border-radius:999px;
              width:14px;
              height:14px;
              border:2px solid white;
              box-shadow:0 0 4px rgba(0,0,0,0.3);
            "></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        return (
          <Marker
            key={c.id}
            position={[c.latitude, c.longitude]}
            icon={markerIcon}
            eventHandlers={{
              click: () => onSelectClinic(c),
            }}
          >
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {c.address1}
              <br />
              {c.city}, {c.state} {c.zip}
              {c.distanceMiles != null && (
                <>
                  <br />
                  <span className="text-muted">
                    ~{c.distanceMiles.toFixed(1)} miles from you
                  </span>
                </>
              )}
            </Popup>
          </Marker>
        );
      })}

      {/* Routing line between user and selected clinic */}
      {userLocation && selectedClinic && (
        <RoutingControl
          userLocation={userLocation}
          clinic={selectedClinic}
          onRouteDistanceChange={onRouteDistanceChange}
        />
      )}
    </MapContainer>
  );
}

interface RoutingControlProps {
  userLocation: { lat: number; lon: number };
  clinic: Clinic;
  onRouteDistanceChange: (miles: number | null) => void;
}

/**
 * Wrapper around `leaflet-routing-machine` that draws the route
 * between the user and the selected clinic and reports the total
 * distance back to React state.
 */
function RoutingControl({
  userLocation,
  clinic,
  onRouteDistanceChange,
}: RoutingControlProps) {
  const map = useMap();
  const controlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    if (controlRef.current) {
      map.removeControl(controlRef.current);
      controlRef.current = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Routing: any = (L as any).Routing;
    if (!Routing || !Routing.control) {
      // eslint-disable-next-line no-console
      console.warn("leaflet-routing-machine is not available");
      return;
    }

    const control = Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lon),
        L.latLng(clinic.latitude, clinic.longitude),
      ],
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [
          {
            color: "#2563eb",
            weight: 5,
            opacity: 0.8,
          },
        ],
      },
    })
      .on("routesfound", (e: any) => {
        const route = e.routes[0];
        if (route && route.summary && typeof route.summary.totalDistance === "number") {
          const miles = route.summary.totalDistance / 1609.34;
          onRouteDistanceChange(miles);
        } else {
          onRouteDistanceChange(null);
        }
      })
      .addTo(map);

    controlRef.current = control;

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map, userLocation.lat, userLocation.lon, clinic.latitude, clinic.longitude, onRouteDistanceChange]);

  return null;
}
