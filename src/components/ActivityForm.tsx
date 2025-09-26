'use client';
import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';

export default function ActivityForm({ onCreate }: { onCreate: (a:any)=>void }){
  const [title, setTitle] = useState('');
  const [type, setType] = useState('workshop');
  const [hours, setHours] = useState('');
  const [evidence, setEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if (!user || submitting) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'content-type':'application/json', 'Authorization': `Bearer ${(await user?.getIdToken?.()) || ''}` },
        body: JSON.stringify({
          title,
          activity_type: type,
          hours: parseInt(hours, 10) || 0,
          evidence_url: evidence,
          student_id: user?.id
        })
      });

      if (!res.ok) {
        console.error('Failed to submit activity');
        return;
      }

      const data = await res.json();
      onCreate({ id: data.id || crypto.randomUUID(), title, hours: parseInt(hours, 10) || 0, status: 'pending' });
      setTitle('');
      setHours('');
      setEvidence('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Activity title</label>
        <input
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Eg. Hackathon finalist, IEEE workshop presenter"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aurora-teal/60 focus:outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Experience type</label>
          <select
            value={type}
            onChange={e=>setType(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-aurora-purple/60 focus:outline-none"
          >
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
            <option value="certification">Certification</option>
            <option value="internship">Internship</option>
            <option value="club">Club Activity</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Hours invested</label>
          <input
            type="number"
            value={hours}
            onChange={e=>setHours(e.target.value)}
            placeholder="4"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aurora-blue/60 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Evidence link</label>
        <input
          value={evidence}
          onChange={e=>setEvidence(e.target.value)}
          placeholder="Share a drive link, portfolio item, or credential URL"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aurora-teal/60 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-400">Faculty moderators will review within 48 hours.</div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-blue px-5 py-2.5 text-sm font-semibold text-night-900 shadow-glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit activity'}
        </button>
      </div>
    </form>
  );
}
