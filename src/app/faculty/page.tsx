import React from 'react';
import FacultyBulkApprove from '../../components/FacultyBulkApprove';
import HEIDashboard from '../../components/HEIDashboard';

export default function FacultyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Faculty Panel</h1>
        <p className="text-sm text-gray-400 mt-2">Approve student activities and view institution insights</p>
      </div>
      <HEIDashboard />
      <FacultyBulkApprove />
    </div>
  );
}