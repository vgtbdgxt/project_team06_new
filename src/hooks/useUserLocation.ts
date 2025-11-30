// src/hooks/useUserLocation.ts

import { useState } from "react";

export function useUserLocation() {
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
    error: string | null;
  }>({
    lat: 0,
    lon: 0,
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // NEW FLAG — used to control map auto-centering behavior
  const [justLocated, setJustLocated] = useState(false);

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          error: null,
        });

        // Set flag → tell MapView to center ONE TIME
        setJustLocated(true);

        setIsLoading(false);
      },
      () => {
        setLocation((prev) => ({
          ...prev,
          error: "Unable to retrieve your location.",
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
