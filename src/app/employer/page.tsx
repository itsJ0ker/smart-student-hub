import React from 'react';
import EmployerDashboard from '../../components/EmployerDashboard';

export default function EmployerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Employer Portal</h1>
      <p className="text-sm text-gray-400 mt-2">Discover and hire top talent</p>
      <div className="mt-6">
        <EmployerDashboard />
      </div>
    </div>
  );
}