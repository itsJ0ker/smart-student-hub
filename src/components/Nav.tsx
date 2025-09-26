'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/authContext';
import { useTheme } from 'next-themes';
import Notifications from './Notifications';

export default function Nav(){
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <nav className="relative isolate overflow-hidden rounded-3xl border border-white/5 bg-night-800/80 backdrop-blur-xl shadow-card-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 text-sm md:flex-nowrap md:px-10">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-aurora-teal/20 text-aurora-teal shadow-glow">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10.5V6a2 2 0 012-2h6l3 3h5a2 2 0 012 2v3" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 21h8M12 17v4" />
            </svg>
          </span>
          <div>
            <Link href="/" className="font-display text-xl font-semibold tracking-tight text-white">
              Smart Student Hub
            </Link>
            <p className="text-xs text-slate-300/80">Empower, engage, and gamify the learning journey.</p>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center gap-1 rounded-full border border-white/10 bg-night-900/90 px-4 py-2 text-xs text-slate-300 transition hover:border-aurora-blue/30 hover:text-white md:flex">
          <span className="rounded-full bg-white/5 px-3 py-1 font-medium text-aurora-teal">Live</span>
          <span>Pulse</span>
          <div className="relative h-6 w-px bg-white/10">
            <div className="absolute inset-0 animate-pulse rounded-full bg-aurora-blue/40" />
          </div>
          <span className="flex items-center gap-1">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {user ? 'Synced with Supabase' : 'Guest mode'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="group relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-aurora-purple/40"
          >
            <span className="absolute inset-0 rounded-2xl bg-aurora-purple/20 opacity-0 transition group-hover:opacity-100" />
            {theme === 'dark' ? (
              <svg className="relative h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="relative h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {user && <Notifications />}

          <button
            onClick={toggleMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-aurora-blue/40 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden md:flex md:items-center md:justify-end md:gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                {user.email?.split('@')[0]}
              </div>
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/leaderboard"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
              >
                Leaderboard
              </Link>
              <Link
                href="/badges"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
              >
                Badges
              </Link>
              <Link
                href="/faculty"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
              >
                Faculty Panel
              </Link>
              <Link
                href="/profile"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
              >
                Profile
              </Link>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-blue px-4 py-2 text-sm font-semibold text-night-900 shadow-glow transition hover:scale-[1.02]"
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-purple px-5 py-2 text-sm font-semibold text-night-900 shadow-glow transition hover:scale-[1.02]"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div className="space-y-4 border-t border-white/5 px-6 py-5 text-sm">
            {user ? (
              <div className="space-y-3">
                <p className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-slate-300">
                  <span className="font-medium text-white">{user.email?.split('@')[0]}</span>
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </p>
                <Link href="/" className="block rounded-xl bg-white/5 px-4 py-3 text-white/80 hover:bg-white/10" onClick={toggleMenu}>Dashboard</Link>
                <Link href="/leaderboard" className="block rounded-xl bg-white/5 px-4 py-3 text-white/80 hover:bg-white/10" onClick={toggleMenu}>Leaderboard</Link>
                <Link href="/badges" className="block rounded-xl bg-white/5 px-4 py-3 text-white/80 hover:bg-white/10" onClick={toggleMenu}>Badges</Link>
                <Link href="/faculty" className="block rounded-xl bg-white/5 px-4 py-3 text-white/80 hover:bg-white/10" onClick={toggleMenu}>Faculty Panel</Link>
                <Link href="/profile" className="block rounded-xl bg-white/5 px-4 py-3 text-white/80 hover:bg-white/10" onClick={toggleMenu}>Profile</Link>
                <button
                  onClick={() => {
                    signOut();
                    toggleMenu();
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-aurora-teal to-aurora-blue px-4 py-3 text-sm font-semibold text-night-900 shadow-glow"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block rounded-xl bg-gradient-to-r from-aurora-teal to-aurora-purple px-4 py-3 text-center text-sm font-semibold text-night-900 shadow-glow"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
