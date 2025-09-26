import './globals.css';
import React from 'react';
import Nav from '../components/Nav';
import { AuthProvider } from '../lib/authContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Smart Student Hub Prototype',
  description: 'Gamified student activity tracking platform',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-night-900 text-gray-100 antialiased">
        <div className="pointer-events-none fixed inset-0 bg-grid-glow bg-[length:40px_40px] opacity-40" aria-hidden />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 pb-12 pt-8 md:px-10">
              <Nav />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
