import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Clinic } from '../data/clinics';
import { calculateDistance } from '../utils/distance';
import { getMarkerColor } from '../utils/colorScale';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  userLocation: { lat: number; lon: number } | null;
  maxDistance: number;
  onClinicSelect: (clinic: Clinic) => void;
}

function MapUpdater({
  selectedClinic,
  userLocation
}: {
  selectedClinic: Clinic | null;
  userLocation: { lat: number; lon: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedClinic) {
      map.setView([selectedClinic.lat, selectedClinic.lon], 14);
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lon], 12);
    }
  }, [selectedClinic, userLocation, map]);

  return null;
}

export function MapView({
  clinics,
  selectedClinic,
  userLocation,
  maxDistance,
  onClinicSelect
}: MapViewProps) {
  const defaultCenter: [number, number] = [34.0522, -118.2437]; // Los Angeles

  const createCustomIcon = (clinic: Clinic, color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <MapContainer
      center={userLocation ? [userLocation.lat, userLocation.lon] : defaultCenter}
      zoom={userLocation ? 12 : 11}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater selectedClinic={selectedClinic} userLocation={userLocation} />

      {/* User location marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lon]}
          icon={L.divIcon({
            className: 'user-location-marker',
            html: `<div style="
              background-color: #ef4444;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })}
        >
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Clinic markers */}
      {clinics.map((clinic) => {
        const distance = userLocation
          ? calculateDistance(userLocation.lat, userLocation.lon, clinic.lat, clinic.lon)
          : 0;
        const color = getMarkerColor(distance, maxDistance);
        const isSelected = selectedClinic?.id === clinic.id;

        return (
          <Marker
            key={clinic.id}
            position={[clinic.lat, clinic.lon]}
            icon={createCustomIcon(clinic, isSelected ? '#10b981' : color)}
            eventHandlers={{
              click: () => onClinicSelect(clinic)
            }}
          >
            <Popup>
              <div>
                <strong>{clinic.name}</strong>
                <br />
                {clinic.type.replace('_', ' ')}
                {userLocation && (
                  <>
                    <br />
                    <small>{distance.toFixed(1)} km away</small>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

