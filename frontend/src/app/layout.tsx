import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'LENSLESS.AI — AI-Based Lensless Imaging Reconstruction',
  description:
    'Recovering visual information from encoded lensless optical measurements. An AI-powered computational imaging system uniting computational optics, inverse problems, and deep learning. PRISMTECH 2026.',
  keywords: [
    'Lensless Imaging',
    'Computational Optics',
    'Inverse Problems',
    'DiffuserCam',
    'FlatCam',
    'Deep Learning Reconstruction',
    'Point Spread Function',
  ],
  authors: [{ name: 'LENSLESS.AI Research Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#07080a] text-[#efede6] font-sans selection:bg-[#ff5a36] selection:text-white">{children}</body>
    </html>
  );
}
