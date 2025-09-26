'use client';
import React from 'react';
import BadgeList from '../../components/BadgeList';

export default function BadgesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">My Badges</h1>
      <p className="text-sm text-gray-400 mt-2">Earned badges for activities</p>
      <div className="mt-6">
        <BadgeList />
      </div>
    </div>
  );
}