import { createClient } from 'next-sanity';

// Configuration for the Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03', // Use current date (YYYY-MM-DD) to target the latest API version
  useCdn: process.env.NODE_ENV === 'production',
});

// Helper function to generate image URLs
export function urlFor(source: any) {
  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${source.asset._ref}`
    .replace('image-', '')
    .replace(/-([^\/]*)$/, '.$1');
}
