'use client';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Analytics() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [activityTypes, setActivityTypes] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchActivities();
  }, [user]);

  async function fetchActivities() {
    const { data, error } = await supabase.from('activities').select('*').eq('student_id', user!.id);
    if (!error && data) {
      setActivities(data);

      // Aggregate by activity_type
      const typeCount: { [key: string]: number } = {};
      data.forEach((a: any) => {
        typeCount[a.activity_type] = (typeCount[a.activity_type] || 0) + 1;
      });
      const types = Object.keys(typeCount).map(type => ({ name: type, value: typeCount[type] }));
      setActivityTypes(types);
    }
  }

  const totalHours = activities.reduce((sum, a) => sum + (a.hours || 0), 0);
  const totalPoints = activities.reduce((sum, a) => sum + (a.points || 0), 0); // Assuming points are added

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-night-900 via-night-800 to-night-800/70 p-6 shadow-card-lg backdrop-blur">
        <span className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-aurora-teal/20 text-aurora-teal">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" />
          </svg>
        </span>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Total activities</p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-white">{activities.length}</h2>
        <p className="mt-auto text-xs text-slate-300/80">Every approved submission pushes your portfolio higher.</p>
      </div>

      <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-night-900 via-night-800 to-night-800/70 p-6 shadow-card-lg backdrop-blur">
        <span className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-aurora-blue/20 text-aurora-blue">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v18M5 12h14" />
          </svg>
        </span>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Hours invested</p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-white">{totalHours}</h2>
        <p className="mt-auto text-xs text-slate-300/80">Keep the momentum—set a weekly target to stay consistent.</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-night-900 via-night-800 to-night-800/70 p-6 shadow-card-lg backdrop-blur">
        <h3 className="font-display text-lg font-semibold text-white">Activity mix</h3>
        <p className="text-xs text-slate-300/80">Diversity across experiences keeps your profile balanced.</p>
        <div className="mt-5 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activityTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                innerRadius={55}
                dataKey="value"
              >
                {activityTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0C1024', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-night-800/70 p-6 shadow-card-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-display text-lg font-semibold text-white">Status distribution</h3>
          <p className="text-xs text-slate-300/80">Monitor review progress and follow up where needed.</p>
        </div>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Approved', count: activities.filter(a => a.status === 'approved').length },
              { name: 'Pending', count: activities.filter(a => a.status === 'pending').length },
              { name: 'Rejected', count: activities.filter(a => a.status === 'rejected').length }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0C1024', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Legend />
              <Bar dataKey="count" radius={[12, 12, 12, 12]} fill="#7A5AF8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}