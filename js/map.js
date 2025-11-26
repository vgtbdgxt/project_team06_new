// js/map.js
// 依赖全局 Leaflet 对象 L（在 index.html 里通过 CDN 引入）

import { distanceKm, distanceToColor } from './utils.js';

let map;
let clinicsLayer;
let userLocation = null;
let userMarker = null;
let clinicsData = [];
let currentFilterFn = () => true;
let onClinicSelectedCallback = null;

export function initMap(initialClinics, onClinicSelected) {
  clinicsData = initialClinics;
  onClinicSelectedCallback = onClinicSelected;

  map = L.map('map').setView([34.0522, -118.2437], 11); // default LA

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  clinicsLayer = L.layerGroup().addTo(map);

  renderClinics();
}

export function setUserLocation(lat, lon, zoomTo = true) {
  userLocation = { lat, lon };
  if (userMarker) {
    map.removeLayer(userMarker);
  }
  userMarker = L.circleMarker([lat, lon], {
    radius: 10,
    color: '#22c55e',
    fillColor: '#22c55e',
    fillOpacity: 0.9,
    weight: 2
  }).addTo(map).bindTooltip("You are here");

  if (zoomTo) {
    map.setView([lat, lon], 12);
  }
  renderClinics();
}

export function getUserLocation() {
  return userLocation;
}

export function setFilterFn(fn) {
  currentFilterFn = fn;
  renderClinics();
}

function renderClinics() {
  if (!clinicsLayer) return;
  clinicsLayer.clearLayers();

  clinicsData.forEach(clinic => {
    let d = null;
    if (userLocation) {
      d = distanceKm(userLocation.lat, userLocation.lon, clinic.lat, clinic.lon);
    }

    if (!currentFilterFn(clinic, d)) return;

    const color = distanceToColor(d);
    const marker = L.circleMarker([clinic.lat, clinic.lon], {
      radius: 8,
      color,
      fillColor: color,
      fillOpacity: 0.9,
      weight: 2
    });

    let tooltipText = clinic.name;
    if (d != null) {
      tooltipText += ` (${d.toFixed(1)} km)`;
    }
    marker.bindTooltip(tooltipText);

    marker.on('click', () => {
      if (onClinicSelectedCallback) {
        onClinicSelectedCallback(clinic, d);
      }
    });

    clinicsLayer.addLayer(marker);
  });
}
