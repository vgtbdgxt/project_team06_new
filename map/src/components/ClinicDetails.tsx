
// src/components/ClinicDetails.tsx

import type { Clinic } from "../types/Clinic";
import { calculateDistance } from "../utils/distance";
import type { RouteBurdenResult } from "../types/Exposome";
import { ALL_LAYERS } from "../types/Exposome";

interface Props {
  clinic: Clinic | null;
  userLocation: { lat: number; lon: number } | null;
  routeDistance?: number | null;
  routeBurden?: RouteBurdenResult | null;
}

export function ClinicDetails({
  clinic,
  userLocation,
  routeDistance,
  routeBurden,
}: Props) {
  if (!clinic) {
    return (
      <div className="p-3">
        <h5>Clinic details</h5>
        <p className="text-muted mb-0">
          Select a program on the map to see details and an estimated
          mental‑health burden for your commute.
        </p>
      </div>
    );
  }

  const categories = [clinic.category1, clinic.category2, clinic.category3].filter(
    Boolean
  ) as string[];

  let crowDistanceMiles: number | null = null;
  if (userLocation) {
    const km = calculateDistance(
      userLocation.lat,
      userLocation.lon,
      clinic.latitude,
      clinic.longitude
    );
    crowDistanceMiles = km * 0.621371;
  }

  const burdenLabel = (() => {
    if (!routeBurden) return null;
    if (routeBurden.score < 33) return "Low";
    if (routeBurden.score < 66) return "Moderate";
    return "High";
  })();

  return (
    <div className="p-3 h-100 overflow-auto">
      <h5 className="mb-2">{clinic.name}</h5>
      {clinic.orgName && (
        <div className="text-muted mb-2">{clinic.orgName}</div>
      )}

      {/* ADDRESS & CONTACT */}
      <section className="mb-3">
        <div>
          {clinic.address1}
          {clinic.address2 && <>, {clinic.address2}</>}
        </div>
        <div>
          {clinic.city}, {clinic.state} {clinic.zip}
        </div>

        {clinic.phones && (
          <div className="mt-2">
            <strong>Phone:</strong> {clinic.phones}
          </div>
        )}
        {clinic.url && (
          <div className="mt-1">
            <strong>Website:</strong>{" "}
            <a href={clinic.url} target="_blank" rel="noreferrer">
              {clinic.url}
            </a>
          </div>
        )}
        {clinic.hours && (
          <div className="mt-1">
            <strong>Hours:</strong> {clinic.hours}
          </div>
        )}
      </section>

      {/* DESCRIPTION */}
      {(clinic.description || clinic.info1 || clinic.info2) && (
        <section className="mb-3">
          <h6>What they offer</h6>
          {clinic.description && <p className="mb-1">{clinic.description}</p>}
          {clinic.info1 && <p className="mb-1">{clinic.info1}</p>}
          {clinic.info2 && <p className="mb-0">{clinic.info2}</p>}
        </section>
      )}

      {/* COMMUTE / ROUTE SUMMARY */}
      {userLocation && (
        <section className="mb-3">
          <h6>Your commute</h6>
          <ul className="list-unstyled small mb-0">
            {crowDistanceMiles != null && (
              <li>
                <strong>Straight‑line distance:</strong>{" "}
                {crowDistanceMiles.toFixed(1)} miles
              </li>
            )}
            {routeDistance != null && (
              <li>
                <strong>Route distance:</strong> {routeDistance.toFixed(1)} miles
              </li>
            )}
            {routeBurden && (
              <li className="mt-1">
                <strong>Mental‑health burden score:</strong>{" "}
                {routeBurden.score}/100{" "}
                {burdenLabel && <span className="text-muted">({burdenLabel})</span>}
              </li>
            )}
          </ul>
        </section>
      )}

      {/* BURDEN BREAKDOWN */}
      {routeBurden && (
        <section className="mb-3">
          <h6>What drives this burden?</h6>
          <p className="small text-muted">
            Mock averages of each environmental factor along the route
            (0 = low exposure, 1 = high exposure). Green space is
            protective, so higher values reduce the overall burden.
          </p>
          <ul className="list-unstyled small mb-0">
            {ALL_LAYERS.map((layer) => {
              const v = routeBurden.layerAverages[layer];
              if (v == null) return null;
              const label =
                layer === "air"
                  ? "Air quality / pollution"
                  : layer === "noise"
                  ? "Traffic & noise"
                  : layer === "heat"
                  ? "Heat / heat island"
                  : layer === "green"
                  ? "Green space (protective)"
                  : "Safety stressors";
              return (
                <li key={layer}>
                  <strong>{label}:</strong> {v.toFixed(2)}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="mb-3">
          <h6>Program category</h6>
          <ul className="mb-0">
            {categories.map((cat, idx) => (
              <li key={idx}>{cat}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
