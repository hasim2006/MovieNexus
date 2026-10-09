import { SAMPLE_MOVIES } from '../../../lib/sample-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://streamvault.app';

  const movieUrls = SAMPLE_MOVIES.map((movie) => `
    <url>
      <loc>${baseUrl}/watch/${movie.id}</loc>
      <lastmod>${movie.createdAt.split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${baseUrl}/browse</loc>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
    ${movieUrls}
  </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
