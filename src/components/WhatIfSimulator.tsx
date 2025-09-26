'use client';
import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';

interface HypotheticalActivity {
  title: string;
  hours: number;
  type: string;
}

export default function WhatIfSimulator() {
  const [hypotheticals, setHypotheticals] = useState<HypotheticalActivity[]>([]);
  const [projection, setProjection] = useState<any>({});
  const { user } = useAuth();

  const addHypothetical = () => {
    setHypotheticals([...hypotheticals, { title: '', hours: 1, type: 'hackathon' }]);
  };

  const updateHypothetical = (index: number, field: string, value: any) => {
    const updated = [...hypotheticals];
    updated[index] = { ...updated[index], [field]: value };
    setHypotheticals(updated);
  };

  const removeHypothetical = (index: number) => {
    setHypotheticals(hypotheticals.filter((_, i) => i !== index));
  };

  const simulate = async () => {
    if (!user) return;
    try {
      const { data: student } = await supabase
        .from('students')
        .select('points, level')
        .eq('id', user.id)
        .single();

      let currentPoints = student?.points || 0;
      let currentLevel = student?.level || 1;
      let newBadges: string[] = [];
      let newTags: string[] = [];

      const tagMap: { [key: string]: string } = {
        'hackathon': 'Innovator',
        'competition': 'Achiever',
        'team project': 'Team Player',
        'leadership': 'Leader',
        'nss': 'Community Servant',
        'ncc': 'Disciplined',
        'club': 'Creative',
        'volunteer': 'Altruist',
        'workshop': 'Learner',
        'seminar': 'Knowledge Seeker'
      };

      hypotheticals.forEach(h => {
        currentPoints += h.hours * 10;
        const tag = tagMap[h.type.toLowerCase()];
        if (tag && !newTags.includes(tag)) newTags.push(tag);
        if (!newBadges.includes(`Badge for ${h.title}`)) newBadges.push(`Badge for ${h.title}`);
      });

      currentLevel = Math.floor(currentPoints / 100) + 1;

      setProjection({
        points: currentPoints,
        level: currentLevel,
        badges: newBadges,
        tags: newTags
      });
    } catch (error) {
      console.error('Error simulating:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-900 dark:text-white">What-If Simulator</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Add hypothetical activities to see your projected growth.</p>

      <div className="mt-4 space-y-2">
        {hypotheticals.map((h, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Activity Title"
              value={h.title}
              onChange={(e) => updateHypothetical(idx, 'title', e.target.value)}
              className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              value={h.hours}
              onChange={(e) => updateHypothetical(idx, 'hours', parseInt(e.target.value))}
              className="w-20 p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
            <select
              value={h.type}
              onChange={(e) => updateHypothetical(idx, 'type', e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="hackathon">Hackathon</option>
              <option value="competition">Competition</option>
              <option value="team project">Team Project</option>
              <option value="leadership">Leadership</option>
              <option value="nss">NSS</option>
              <option value="club">Club</option>
            </select>
            <button onClick={() => removeHypothetical(idx)} className="px-2 py-1 bg-red-500 text-white rounded">X</button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={addHypothetical} className="px-4 py-2 bg-blue-500 text-white rounded">Add Activity</button>
        <button onClick={simulate} className="px-4 py-2 bg-green-500 text-white rounded">Simulate</button>
      </div>

      {projection.points && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
          <h4 className="font-semibold">Projection:</h4>
          <p>Points: {projection.points}</p>
          <p>Level: {projection.level}</p>
          <p>New Badges: {projection.badges.join(', ')}</p>
          <p>New Tags: {projection.tags.join(', ')}</p>
        </div>
      )}
    </div>
  );
}