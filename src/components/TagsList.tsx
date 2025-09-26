'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/authContext';

interface Tag {
  tag: string;
  assigned_at: string;
}

export default function TagsList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchTags();
  }, [user]);

  async function fetchTags() {
    try {
      const res = await fetch(`/api/tags?studentId=${user!.id}`);
      const data = await res.json();
      if (data.tags) setTags(data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-900 dark:text-white">Your Skill Tags</h3>
      <ul className="mt-3 space-y-2">
        {tags.map((t, idx) => (
          <li key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{t.tag}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Assigned: {new Date(t.assigned_at).toLocaleDateString()}</div>
            </div>
            <div className="text-2xl">🏆</div>
          </li>
        ))}
        {tags.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tags earned yet</p>
        )}
      </ul>
    </div>
  );
}