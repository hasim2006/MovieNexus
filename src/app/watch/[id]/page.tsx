'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import StreamPlayer from '../../../components/player/StreamPlayer';
import ShareModal from '../../../components/share/ShareModal';
import { getStoredMovies, getStoredUser } from '../../../lib/db';
import { MediaItem } from '../../../types';

export default function WatchPage() {
  const params = useParams();
  const mediaId = params.id as string;

  const [movie, setMovie] = useState<MediaItem | null>(null);
  const [initialTimestamp, setInitialTimestamp] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const movies = getStoredMovies();
    const found = movies.find(m => m.id === mediaId || m.slug === mediaId) || movies[0];
    setMovie(found);

    const user = getStoredUser();
    const activeProfile = user.profiles.find(p => p.id === user.activeProfileId);
    if (activeProfile) {
      const cw = activeProfile.continueWatching.find(c => c.mediaId === found.id);
      if (cw && cw.timestamp > 10) {
        setInitialTimestamp(cw.timestamp);
      }
    }
  }, [mediaId]);

  if (!movie) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin red-glow" />
      </div>
    );
  }

  return (
    <>
      <StreamPlayer
        movie={movie}
        initialTimestamp={initialTimestamp}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {isShareOpen && (
        <ShareModal
          movie={movie}
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </>
  );
}
