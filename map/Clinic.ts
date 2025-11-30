// src/types/Clinic.ts

export interface Clinic {
    id: number;

    // The final resolved name used everywhere in the UI.
    // This may come from org_name OR name from the dataset.
    name: string;

    // Optional: original org_name if present
    orgName?: string | null;

    // Address
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    zip?: string | null;

    // Coordinates (always required)
    latitude: number;
    longitude: number;

    // Contact fields
    phones?: string | null;
    email?: string | null;
    url?: string | null;

    // Program fields
    description?: string | null;
    info1?: string | null;
    info2?: string | null;

    // Category fields — raw from LA County dataset
    category1?: string | null;
    category2?: string | null;
    category3?: string | null;

    // Additional metadata (optional)
    hours?: string | null;

    // Computed dynamic field (only set at runtime)
    distanceKm?: number;
}
