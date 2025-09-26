'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../lib/authContext';
import { supabase } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', roll_no: '', department: '' });

  useEffect(() => {
    if (!user) return;
    fetchStudent();
  }, [user]);

  async function fetchStudent() {
    const { data, error } = await supabase.from('students').select('*').eq('id', user!.id).single();
    if (!error && data) {
      setStudent(data);
      setFormData({ name: data.name || '', roll_no: data.roll_no || '', department: data.department || '' });
    }
  }

  async function updateProfile() {
    const { error } = await supabase.from('students').update(formData).eq('id', user!.id);
    if (!error) {
      setEditing(false);
      fetchStudent();
    } else {
      alert('Update failed');
    }
  }

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="mt-6 bg-gray-800 p-6 rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <p>{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Name</label>
            {editing ? (
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 rounded bg-gray-700"
              />
            ) : (
              <p>{student.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Roll No</label>
            {editing ? (
              <input
                value={formData.roll_no}
                onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                className="w-full p-2 rounded bg-gray-700"
              />
            ) : (
              <p>{student.roll_no}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Department</label>
            {editing ? (
              <input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-2 rounded bg-gray-700"
              />
            ) : (
              <p>{student.department}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Points</label>
            <p>{student.points}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Level</label>
            <p>{student.level}</p>
          </div>
        </div>
        <div className="mt-6">
          {editing ? (
            <div className="space-x-4">
              <button onClick={updateProfile} className="bg-green-600 px-4 py-2 rounded">Save</button>
              <button onClick={() => setEditing(false)} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="bg-blue-600 px-4 py-2 rounded">Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}