
// src/data/clinics.ts
//
// Normalisation pipeline that converts the ArcGIS style JSON
// in `clinics_raw.json` into a clean list of `Clinic` objects
// consumed by the React app.

import raw from "./clinics_raw.json";
import type { Clinic } from "../types/Clinic";

interface ArcGisFeature {
  attributes: any;
  geometry?: { x: number; y: number };
}

const features: ArcGisFeature[] = (raw as any).features ?? raw ?? [];

/**
 * Convert a single ArcGIS feature into our `Clinic` model.
 * If we cannot determine a valid latitude / longitude, `null`
 * is returned and the record is skipped.
 */
function normalizeClinic(f: ArcGisFeature): Clinic | null {
  const a = f.attributes ?? {};

  const lat =
    typeof a.latitude === "number"
      ? a.latitude
      : typeof a.POINT_Y === "number"
      ? a.POINT_Y
      : f.geometry?.y;

  const lon =
    typeof a.longitude === "number"
      ? a.longitude
      : typeof a.POINT_X === "number"
      ? a.POINT_X
      : f.geometry?.x;

  if (typeof lat !== "number" || typeof lon !== "number") {
    return null;
  }

  const rawName: string =
    (a.name ?? a.Name ?? a.org_name ?? "").toString().trim();

  const name = rawName || "Unknown Program";

  const clinic: Clinic = {
    id: typeof a.OBJECTID === "number" ? a.OBJECTID : Math.random(),
    name,
    orgName: a.org_name ?? null,

    address1: (a.addrln1 ?? a.address1 ?? "").toString(),
    address2: (a.addrln2 ?? a.address2 ?? null) || null,
    city: (a.city ?? "").toString(),
    state: (a.state ?? "CA").toString(),
    zip: a.zip ? String(a.zip) : null,

    latitude: lat,
    longitude: lon,

    phones: a.phones ?? null,
    email: a.email ?? null,
    url: a.url ?? a.link ?? null,
    hours: a.hours ?? null,

    description: a.description ?? null,
    info1: a.info1 ?? null,
    info2: a.info2 ?? null,

    category1: a.cat1 ?? null,
    category2: a.cat2 ?? null,
    category3: a.cat3 ?? null,
  };

  return clinic;
}

/**
 * Export final clinic list
 */
export const clinics: Clinic[] = features
  .map(normalizeClinic)
  .filter((c): c is Clinic => c !== null);

// Small debug log to verify that the transformation worked during development.
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-console
  console.log("Loaded clinics:", clinics.length);
}
