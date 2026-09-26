import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'StreamVault - Cinematic 4K Video Streaming Platform',
  description: 'Stream unlimited 4K Ultra HD movies, series, and StreamVault originals with adaptive HLS playback, sub-second search, and offline downloads.',
  keywords: ['StreamVault', 'Movies', '4K Streaming', 'HLS Player', 'Netflix Clone', 'TV Shows'],
  openGraph: {
    title: 'StreamVault - Ultra HD Streaming',
    description: 'Experience Next-Gen Video Streaming with Adaptive HLS Bitrate & Multi-Audio.',
    url: 'https://streamvault.app',
    siteName: 'StreamVault',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'StreamVault Platform Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamVault - Ultra HD Streaming',
    description: 'Next-Gen HLS 4K Streaming Platform',
    images: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-brand selection:text-white flex flex-col">
        <Navbar />
        <main className="flex-1 pb-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
