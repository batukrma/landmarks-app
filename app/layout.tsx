import type { Metadata } from 'next';
import { Geist, Geist_Mono, Zain } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const zain = Zain({
  variable: '--font-zain',
  subsets: ['latin'],
  weight: '800',
});

export const metadata: Metadata = {
  title: 'Landmarks App',
  description: 'Plan your future!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${zain.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
