'use client';
import React, { useEffect, useState } from 'react';
import ActivityForm from './ActivityForm';
import BadgeList from './BadgeList';
import TagsList from './TagsList';
import AIAdvisor from './AIAdvisor';
import WhatIfSimulator from './WhatIfSimulator';
import Leaderboard from './Leaderboard';
import AIDigitalTwin from './AIDigitalTwin';
import Analytics from './Analytics';
import SeasonalInsights from './SeasonalInsights';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';

export default function StudentDashboard(){
  const [activities, setActivities] = useState<any[]>([]);
  const [student, setStudent] = useState<any>({ name: 'Demo Student', placement_score: 0.42, suggested: ['Internship: Web', 'Cert: Data Analytics'], points: 120 });
  const { user } = useAuth();

  useEffect(()=>{
    if (!user) return;
    fetchActivities();
    fetchStudent();
  },[user]);

  async function fetchActivities(){
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('student_id', user!.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading activities', error);
      return;
    }
    setActivities(data || []);
  }

  async function fetchStudent(){
    const { data, error } = await supabase.from('students').select('*').eq('id', user!.id).single();
    if (error) {
      console.error('Error loading student profile', error);
      return;
    }
    if (data) {
      setStudent(prev => ({ ...prev, ...data }));
    }
  }

  return (
    <div className="space-y-10">
      <Analytics />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-night-800/60 p-6 shadow-card-lg backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white">Activity Stream</h2>
                <p className="text-sm text-slate-300/80">Track, refine, and celebrate your journey in real time.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                {activities.length} records synced
              </div>
            </div>

            <ul className="mt-6 space-y-4">
              {activities.length === 0 && (
                <li className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-400">
                  Submit your first activity to see it appear here instantly.
                </li>
              )}

              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-night-900/80 via-night-800 to-night-800/90 p-5 shadow-card-lg"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-aurora-teal via-aurora-blue to-aurora-purple" />
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-[0.2em] text-aurora-blue/70">{activity.activity_type}</p>
                      <h3 className="font-display text-xl font-semibold text-white">{activity.title}</h3>
                      <p className="text-sm text-slate-300/80">
                        {activity.hours || 0} hours • {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          activity.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : activity.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-white/10 text-white'
                        }`}
                      >
                        {activity.status}
                      </span>
                      <button className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/80 transition hover:border-aurora-teal/50 hover:text-white">
                        View Evidence
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-night-800/70 p-6 shadow-card-lg backdrop-blur">
              <h3 className="font-display text-lg font-semibold text-white">Submit new activity</h3>
              <p className="text-sm text-slate-300/80">
                Provide your latest achievement, attach evidence, and route it for faculty review.
              </p>
              <div className="mt-5">
                <ActivityForm onCreate={fetchActivities} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-night-800/70 p-6 shadow-card-lg backdrop-blur">
              <WhatIfSimulator />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-night-800/70 p-6 shadow-card-lg backdrop-blur">
            <SeasonalInsights />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-night-800 via-night-800/70 to-night-800/30 p-6 shadow-card-lg backdrop-blur">
            <AIDigitalTwin student={student} />
          </div>
          <div className="rounded-3xl border border-white/10 bg-night-800/70 p-6 shadow-card-lg backdrop-blur">
            <AIAdvisor />
          </div>
          <div className="rounded-3xl border border-white/10 bg-night-800/70 p-6 shadow-card-lg backdrop-blur">
            <BadgeList />
          </div>
          <div className="rounded-3xl border border-white/10 bg-night-800/70 p-6 shadow-card-lg backdrop-blur">
            <TagsList />
          </div>
          <div className="rounded-3xl border border-white/10 bg-night-800/70 p-6 shadow-card-lg backdrop-blur">
            <Leaderboard />
          </div>
        </aside>
      </div>
    </div>
  );
}
