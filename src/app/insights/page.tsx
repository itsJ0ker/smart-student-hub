import React from 'react';
import SeasonalInsights from '../../components/SeasonalInsights';

export default function InsightsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Seasonal Insights</h1>
      <p className="text-sm text-gray-400 mt-2">Analyze activity trends over time</p>
      <div className="mt-6">
        <SeasonalInsights />
      </div>
    </div>
  );
}