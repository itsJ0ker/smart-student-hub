'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FacultyBulkApprove(){
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    const { data, error } = await supabase.from('activities').select('id, title, student_id').eq('status', 'pending');
    if (error) return;
    // Fetch student names separately
    const withNames = await Promise.all(data.map(async (act: any) => {
      const { data: stud } = await supabase.from('students').select('name').eq('id', act.student_id).single();
      return { ...act, student: stud?.name || 'Unknown' };
    }));
    setPending(withNames);
  }

  async function bulkApprove(selected:any[], awardPoints=10){
    for (const act of selected){
      await fetch('/api/approve', { method: 'PATCH', headers: { 'content-type':'application/json' }, body: JSON.stringify({ activityId: act.id, approverId: 'faculty-1', approve: true }) });
      await fetch('/api/verify-ai', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ activityId: act.id }) });
    }
    fetchPending();
    alert('Bulk approve done');
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="font-semibold">Faculty — Bulk Approve</h3>
      <ul className="mt-3 space-y-2">
        {pending.map(p=> (
          <li key={p.id} className="p-2 bg-gray-700 rounded flex justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-400">{p.student}</div>
            </div>
            <div>
              <button onClick={()=>bulkApprove([p])} className="px-3 py-1 bg-green-600 rounded">Approve</button>
            </div>
          </li>
        ))}
      </ul>
      {pending.length>1 && (<div className="mt-3"><button onClick={()=>bulkApprove(pending)} className="px-4 py-2 bg-indigo-600 rounded">Approve All</button></div>)}
    </div>
  );
}
