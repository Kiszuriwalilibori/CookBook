// lib/env.ts (or wherever you place your env config; create this file if it doesn't exist)
// This exports the Sanity config constants for use in next-sanity client setup.
// Ensure your .env.local has the vars: NEXT_PUBLIC_SANITY_PROJECT_ID=mextu0pu and NEXT_PUBLIC_SANITY_DATASET=production

export const apiVersion = "2024-10-14"; // Use a recent date; update monthly as needed (e.g., today's date minus a few days for stability)

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"; // Fallback to 'production' if undefined

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""; // Throws if missing, but ?? '' for safety

export const useCdn = process.env.NODE_ENV === "production"; // false in dev (live queries), true in prod (cached)
