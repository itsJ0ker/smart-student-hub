'use client';
import React from 'react';

export default function AIDigitalTwin({ student }: { student?: any }){
  const s = student || { placement_score: 0.42, suggested: ['Internship: Web', 'Cert: Data Analytics'], flags: [] };
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="font-semibold">AI Digital Twin</h3>
      <div className="mt-3">
        <div className="text-sm">Placement Score</div>
        <div className="text-2xl font-bold">{Math.round((s.placement_score||0)*100)}%</div>
        <div className="mt-3 text-sm">Suggested Pathway:</div>
        <ul className="list-disc list-inside text-sm">
          {s.suggested.map((it:any, idx:number)=>(<li key={idx}>{it}</li>))}
        </ul>
        {s.flags && s.flags.length>0 && (<div className="mt-2 text-sm text-yellow-300">Flags: {s.flags.join(', ')}</div>)}
      </div>
    </div>
  );
}
