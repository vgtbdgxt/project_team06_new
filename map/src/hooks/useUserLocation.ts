
// src/hooks/useUserLocation.ts
//
// Thin wrapper around `navigator.geolocation` that exposes
// the current user position together with a loading flag and
// any error message suitable for display in the UI.

import { useState } from "react";

interface LocationState {
  lat: number;
  lon: number;
  error: string | null;
}

export function useUserLocation() {
  const [location, setLocation] = useState<LocationState>({
    lat: 0,
    lon: 0,
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [justLocated, setJustLocated] = useState(false);

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported in this browser.",
      }));
      return;
    }

    setIsLoading(true);
    setLocation((prev) => ({ ...prev, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          error: null,
        });
        setIsLoading(false);
        setJustLocated(true);
        // reset the "just located" flag after a short delay so that
        // we can animate the user marker if desired.
        window.setTimeout(() => setJustLocated(false), 2000);
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.message || "Unable to determine your location.",
        }));
        setIsLoading(false);
      }
    );
  }

  return {
    location,
    isLoading,
    requestLocation,
    justLocated,
    setJustLocated,
  };
}
