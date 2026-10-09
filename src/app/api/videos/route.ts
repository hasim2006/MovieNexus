import { NextResponse } from 'next/server';
import { SAMPLE_MOVIES } from '../../../lib/sample-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase();
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  let filtered = [...SAMPLE_MOVIES];

  if (category === 'movies') {
    filtered = filtered.filter(m => m.type === 'movie');
  } else if (category === 'series') {
    filtered = filtered.filter(m => m.type === 'series');
  } else if (category === 'originals') {
    filtered = filtered.filter(m => m.isOriginal);
  }

  if (q) {
    filtered = filtered.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    movies: filtered.slice(0, limit),
  });
}
