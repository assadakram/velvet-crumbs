'use client';

/**
 * Sanity Studio embedded inside Next.js at /studio
 * Sara accesses this URL to manage pre-order settings.
 * Protected by Sanity's own Google/email login system.
 */
import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity/sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
