/* ═══════════════════════════════════════════════════════════════
   LAYOUT.JS — App Layout Wrapper
   ═══════════════════════════════════════════════════════════════ */

import { Inter, Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'TSEC Assignment Hub — Stop Searching WhatsApp Groups',
  description: 'Assignments, Notes, Lab Files, and Previous Year Papers for Thakur Shyamnarayan Engineering College — All in One Place.',
  keywords: ['TSEC', 'Thakur Shyamnarayan', 'Engineering', 'Assignments', 'Syllabus', 'Lab Manuals', 'Notes', 'PYQs'],
  authors: [{ name: 'TSEC Contributor Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased selection:bg-sky-500 selection:text-white">
        {/* Ambient background particles */}
        <div className="global-bg" aria-hidden="true">
          <div className="global-bg__grid"></div>
          <div className="global-bg__orbs">
            <div className="global-bg__orb global-bg__orb--1"></div>
            <div className="global-bg__orb global-bg__orb--2"></div>
            <div className="global-bg__orb global-bg__orb--3"></div>
            <div className="global-bg__orb global-bg__orb--4"></div>
          </div>
        </div>
        <div className="scanlines" aria-hidden="true"></div>
        {children}
      </body>
    </html>
  );
}
