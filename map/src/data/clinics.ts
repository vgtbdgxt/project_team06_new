// src/data/clinics.ts
import raw from "./clinics_raw.json";
import type { Clinic } from "../types/Clinic";

interface ArcGisFeature {
  attributes: any;
  geometry?: { x: number; y: number };
}

const features: ArcGisFeature[] = (raw as any).features ?? raw ?? [];

/**
 * convert a single ArcGIS feature to Clinic
 */
function normalizeClinic(f: ArcGisFeature): Clinic | null {
  const a = f.attributes ?? {};

  // ------------------------------
  // name extraction
  // ------------------------------
  const rawOrg = (a["org_name"] ?? "").toString().trim();
  const programNameLower = (a["name"] ?? "").toString().trim();
  const programNameUpper = (a["Name"] ?? "").toString().trim();

  //
  const finalName =
    rawOrg ||
    programNameUpper ||
    programNameLower ||
    "Unnamed Program";

  // ------------------------------
  // lat n long
  // ------------------------------
  const latitude =
    a.latitude ??
    a.LATITUDE ??
    a.POINT_Y ??
    f.geometry?.y;

  const longitude =
    a.longitude ??
    a.LONGITUDE ??
    a.POINT_X ??
    f.geometry?.x;

  if (latitude == null || longitude == null) return null;

  // ------------------------------
  // category string processing
  // ------------------------------
  const categories = [a.cat1, a.cat2, a.cat3]
    .filter(Boolean)
    .flatMap((entry: string) =>
      entry
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    );

  // ------------------------------
  //  URL processing
  // ------------------------------
  let safeUrl: string | null = a.url ?? a.link ?? null;
  if (safeUrl && typeof safeUrl === "string") {
    safeUrl = safeUrl.trim();
    if (
      safeUrl &&
      !safeUrl.startsWith("http://") &&
      !safeUrl.startsWith("https://")
    ) {
      safeUrl = "https://" + safeUrl;
    }
  }

  const clinic: Clinic = {
    id: a.OBJECTID ?? a.objectid ?? Math.random(),

    name: finalName,
    orgName: rawOrg || null,

    address1: a.addrln1 ?? "",
    address2: a.addrln2 ?? null,
    city: a.city ?? "",
    state: a.state ?? "CA",
    zip: a.zip ?? null,

    latitude,
    longitude,

    phones: a.phones ?? null,
    hours: a.hours ?? null,
    url: safeUrl,
    email: a.email ?? null,

    description: a.description ?? null,
    info1: a.info1 ?? null,
    info2: a.info2 ?? null,

    category1: a.cat1 ?? null,
    category2: a.cat2 ?? null,
    category3: a.cat3 ?? null,
    // categories
  };

  return clinic;
}

/**
 * export final clinic list
 */
export const clinics: Clinic[] = features
  .map(normalizeClinic)
  .filter((c): c is Clinic => c !== null);


const debugClinic10049 = clinics.find(
  (c) => c.id === 10049
);
if (debugClinic10049) {

  console.log("DEBUG clinic 10049:", debugClinic10049);
}
