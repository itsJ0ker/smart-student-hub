'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  roll_no: string;
  department: string;
  points: number;
  level: number;
  tags: string[];
}

export default function EmployerDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        // Mock tags for now, in real would fetch from tags API
        const studentsWithTags = data.map((student: any) => ({
          ...student,
          tags: ['Innovator', 'Team Player'] // Mock
        }));
        setStudents(studentsWithTags);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Employer Dashboard</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Discover top talent from our institution with verified skills and achievements.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{student.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{student.roll_no} - {student.department}</p>
            <div className="mt-2">
              <p className="text-sm">Points: {student.points} | Level: {student.level}</p>
              <div className="flex flex-wrap mt-1">
                {student.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs mr-1 mb-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}