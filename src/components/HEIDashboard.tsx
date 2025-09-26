'use client';

import { useState, useEffect } from 'react';

interface Stats {
  totalStudents: number;
  totalActivities: number;
  avgPoints: number;
  topTags: { tag: string; count: number }[];
}

export default function HEIDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, activitiesRes, tagsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/activities'),
        fetch('/api/tags')
      ]);

      const students = studentsRes.ok ? await studentsRes.json() : [];
      const activities = activitiesRes.ok ? await activitiesRes.json() : [];
      const tags = tagsRes.ok ? await tagsRes.json() : [];

      const totalStudents = students.length;
      const totalActivities = activities.length;
      const avgPoints = totalStudents > 0 ? students.reduce((sum: number, s: any) => sum + s.points, 0) / totalStudents : 0;

      // Mock top tags count
      const tagCounts: { [key: string]: number } = {};
      tags.forEach((t: any) => {
        tagCounts[t.tag] = (tagCounts[t.tag] || 0) + 1;
      });
      const topTags = Object.entries(tagCounts).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count).slice(0, 5);

      setStats({ totalStudents, totalActivities, avgPoints: Math.round(avgPoints), topTags });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">HEI Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Total Students</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{stats?.totalStudents}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Total Activities</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">{stats?.totalActivities}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Average Points</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{stats?.avgPoints}</p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Skill Tags</h3>
        <ul className="space-y-2">
          {stats?.topTags.map((item, index) => (
            <li key={index} className="flex justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <span className="text-gray-900 dark:text-white">{item.tag}</span>
              <span className="text-gray-600 dark:text-gray-300">{item.count} students</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}