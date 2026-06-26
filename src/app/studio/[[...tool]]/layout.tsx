/**
 * Studio layout — intentionally minimal.
 * The Sanity Studio manages its own styling and MUST NOT
 * inherit the site's global CSS (Tailwind/globals.css),
 * as that would break the studio UI.
 */
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
