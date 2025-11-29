// js/utils.js

// Haversine distance between two lat/lon points (km)
export function distanceKm(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Map distance to color (for marker)
export function distanceToColor(d) {
  if (d == null) return '#cbd5f5'; // unknown
  if (d <= 1) return '#1d4ed8';      // deep blue
  if (d <= 3) return '#3b82f6';      // medium blue
  if (d <= 5) return '#60a5fa';      // lighter blue
  if (d <= 10) return '#bfdbfe';     // pale blue
  return '#e5e7eb';                  // grey (far)
}

export function prettyType(t) {
  switch (t) {
    case "hospital": return "Hospital";
    case "outpatient": return "Outpatient clinic";
    case "specialized": return "Specialized program";
    case "urgent_care": return "Urgent care";
    default: return t;
  }
}
