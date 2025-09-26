'use client';
import React, { useEffect } from 'react';
import { useAuth } from '../lib/authContext';
import { useRouter } from 'next/navigation';
import StudentDashboard from '../components/StudentDashboard';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold">Smart Student Hub — Prototype</h1>
      <p className="text-sm text-gray-400 mt-2">Web prototype built with Next.js + Supabase</p>
      <div className="mt-6">
        <StudentDashboard />
      </div>
    </div>
  );
}
