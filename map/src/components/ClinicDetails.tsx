// src/components/ClinicDetails.tsx
import type { Clinic } from "../types/Clinic";
import { calculateDistance } from "../utils/distance";

interface Props {
  clinic: Clinic | null;
  userLocation: { lat: number; lon: number } | null;
}

export function ClinicDetails({ clinic, userLocation }: Props) {
  if (!clinic) {
    return (
      <div className="p-3">
        <h5>Clinic Details</h5>
        <p className="text-muted">Click a marker on the map to see details here.</p>
      </div>
    );
  }

  // Distance calculation
  const distanceKm = userLocation
    ? calculateDistance(
      userLocation.lat,
      userLocation.lon,
      clinic.latitude,
      clinic.longitude
    )
    : null;

  const distanceMiles = distanceKm ? distanceKm * 0.621371 : null;

  // Category consolidation
  const categories: string[] = [
    clinic.category1,
    clinic.category2,
    clinic.category3,
  ]
    .filter(Boolean)
    .flatMap((str) =>
      (str as string)
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    );

  return (
    <div className="clinic-details p-3 overflow-auto" style={{ height: "100%" }}>
      {/* NAME */}
      <h5 className="fw-bold mb-1">{clinic.name}</h5>

      {/* DISTANCE */}
      {distanceMiles !== null && (
        <span className="badge bg-primary mb-3">
          {distanceMiles.toFixed(1)} miles away
        </span>
      )}

      {/* ADDRESS */}
      <section className="mb-3">
        <h6>Address</h6>
        <p className="mb-1">{clinic.address1}</p>
        {clinic.address2 && <p className="mb-1">{clinic.address2}</p>}
        <p className="mb-0">
          {clinic.city}, {clinic.state} {clinic.zip ?? ""}
        </p>
      </section>

      {/* CONTACT */}
      <section className="mb-3">
        <h6>Contact</h6>

        {clinic.phones && (
          <p className="mb-1">
            <strong>Phone:</strong> {clinic.phones}
          </p>
        )}

        {clinic.email && (
          <p className="mb-1">
            <strong>Email:</strong> {clinic.email}
          </p>
        )}

        {clinic.url && (
          <p className="mb-1">
            <strong>Website:</strong>{" "}
            <a
              href={clinic.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ wordBreak: "break-all" }}
            >
              {clinic.url}
            </a>
          </p>
        )}
      </section>

      {/* HOURS */}
      {clinic.hours && (
        <section className="mb-3">
          <h6>Hours</h6>
          <p className="mb-0">{clinic.hours}</p>
        </section>
      )}

      {/* PROGRAM INFO */}
      {(clinic.description || clinic.info1 || clinic.info2) && (
        <section className="mb-3">
          <h6>Program Info</h6>
          {clinic.description && <p>{clinic.description}</p>}
          {clinic.info1 && <p>{clinic.info1}</p>}
          {clinic.info2 && <p>{clinic.info2}</p>}
        </section>
      )}

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="mb-3">
          <h6>Category</h6>
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
