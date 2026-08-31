import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://shadytron-hardcore-roadbook.cubsforlife94.chatgpt.site',
  ),
  title: 'Shadytron — Hardcore Raid Roadbook',
  description:
    'A tailored Old School RuneScape Hardcore Ironman route from Moons of Peril to confident raiding.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Shadytron — Hardcore Raid Roadbook',
    description:
      'A tailored Old School RuneScape Hardcore Ironman route from Moons of Peril to confident raiding.',
    url: '/',
    siteName: 'Shadytron — Hardcore Raid Roadbook',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1731,
        height: 907,
        alt: 'Shadytron Hardcore Raid Roadbook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shadytron — Hardcore Raid Roadbook',
    description:
      'A tailored Old School RuneScape Hardcore Ironman route from Moons of Peril to confident raiding.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
