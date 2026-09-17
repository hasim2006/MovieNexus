import { MediaItem } from '../types';

export interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'video.movie' | 'video.tv_show';
  canonicalUrl?: string;
}

export function generateSeoMetadata({
  title = 'StreamVault - Premium Cinematic Video Streaming',
  description = 'Stream 4K Ultra HD Movies, Originals, and Exclusive TV Shows with adaptive HLS video streaming, multi-audio tracks, and immersive subtitles.',
  image = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
  type = 'website',
  canonicalUrl = 'https://streamvault.app',
}: MetadataProps) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'StreamVault',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export function generateJsonLdSchema(movie: MediaItem) {
  return {
    '@context': 'https://schema.org',
    '@type': movie.type === 'series' ? 'TVSeries' : 'Movie',
    name: movie.title,
    description: movie.description,
    image: movie.posterUrl,
    dateCreated: movie.createdAt,
    director: {
      '@type': 'Person',
      name: movie.director,
    },
    actor: movie.cast.map(name => ({
      '@type': 'Person',
      name,
    })),
    genre: movie.genres,
    duration: movie.duration,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (movie.matchPercentage / 20).toFixed(1), // convert 98% to 4.9/5
      bestRating: '5',
      ratingCount: (movie.viewsCount / 100).toFixed(0),
    },
  };
}
