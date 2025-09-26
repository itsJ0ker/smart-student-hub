'use client';

import { useState, useEffect } from 'react';

interface MonthlyData {
  month: string;
  count: number;
}

export default function SeasonalInsights() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/activities');
      if (response.ok) {
        const activities = await response.json();
        const monthlyCounts: { [key: string]: number } = {};

        activities.forEach((activity: any) => {
          const date = new Date(activity.created_at);
          const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        const data = Object.entries(monthlyCounts).map(([month, count]) => ({ month, count }));
        setData(data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Seasonal Insights</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Track activity trends across different months and seasons.
      </p>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <span className="text-gray-900 dark:text-white font-medium">{item.month}</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(item.count / Math.max(...data.map(d => d.count))) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-600 dark:text-gray-300 text-sm">{item.count} activities</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}