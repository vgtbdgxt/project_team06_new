// src/types/Clinic.ts

export interface Clinic {
    id: number;

    name: string;

    orgName?: string | null;

    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    zip?: string | null;

    latitude: number;
    longitude: number;

    phones?: string | null;
    email?: string | null;
    url?: string | null;
    hours?: string | null;

    description?: string | null;
    info1?: string | null;
    info2?: string | null;


    category1?: string | null;
    category2?: string | null;
    category3?: string | null;

    distanceKm?: number;
}
