'use client';
import React from 'react';
import Leaderboard from '../../components/Leaderboard';

export default function LeaderboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <p className="text-sm text-gray-400 mt-2">Top students by points</p>
      <div className="mt-6">
        <Leaderboard />
      </div>
    </div>
  );
}