'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';

export default function AIAdvisor() {
  const [advice, setAdvice] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    generateAdvice();
  }, [user]);

  async function generateAdvice() {
    try {
      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('student_id', user!.id);

      const { data: student } = await supabase
        .from('students')
        .select('points, level')
        .eq('id', user!.id)
        .single();

      let tips: string[] = [];

      const approvedActivities = activities?.filter(a => a.status === 'approved') || [];
      const totalHours = approvedActivities.reduce((sum, a) => sum + (a.hours || 0), 0);

      if (approvedActivities.length < 3) {
        tips.push('Consider participating in more extracurricular activities to boost your profile.');
      }

      if (totalHours < 50) {
        tips.push('Aim for at least 50 hours of activities this semester to reach the next level.');
      }

      const types = approvedActivities.map(a => a.activity_type);
      const uniqueTypes = new Set(types);
      if (uniqueTypes.size < 3) {
        tips.push('Try diversifying your activities: include leadership, technical, and community service.');
      }

      if (student?.points < 200) {
        tips.push('Focus on high-impact activities like hackathons or competitions to earn more points quickly.');
      }

      if (tips.length === 0) {
        tips.push('Great job! Keep up the excellent work in balancing academics and extracurriculars.');
      }

      setAdvice(tips.join(' '));
    } catch (error) {
      console.error('Error generating advice:', error);
      setAdvice('Unable to generate advice at this time.');
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-900 dark:text-white">AI Advisor</h3>
      <p className="mt-3 text-gray-700 dark:text-gray-300">{advice}</p>
    </div>
  );
}