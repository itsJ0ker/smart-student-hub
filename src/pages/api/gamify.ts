import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { studentId, points, reason, meta } = req.body;
  if (!studentId || !points) return res.status(400).json({ error: 'studentId and points required' });

  const txId = uuidv4();
  const { error } = await supabase.from('gamification_transactions').insert([{ id: txId, student_id: studentId, points, reason, meta }]);
  if (error) return res.status(500).json({ error: error.message });

  // best-effort points increment
  try {
    await supabase.rpc('increment_student_points', { p_student_id: studentId, p_points: points });
  } catch (e) {
    await supabase.from('students').update({ points: (supabase as any).raw ? (supabase as any).raw(`points + ${points}`) : { points: points } }).eq('id', studentId);
  }

  res.status(200).json({ ok:true, txId });
}
