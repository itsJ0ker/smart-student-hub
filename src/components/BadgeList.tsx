'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';

export default function BadgeList(){
  const [badges, setBadges] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchBadges();
  }, [user]);

  async function fetchBadges() {
    const { data, error } = await supabase.from('badges').select('*').eq('student_id', user!.id).order('issued_at', { ascending: false });
    if (!error) setBadges(data || []);
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-900 dark:text-white">Your Badges</h3>
      <ul className="mt-3 space-y-2">
        {badges.map(b => (
          <li key={b.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{b.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Issued: {new Date(b.created_at).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded transition">Verify</button>
            </div>
          </li>
        ))}
        {badges.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No badges earned yet</p>
        )}
      </ul>
    </div>
  );
}
