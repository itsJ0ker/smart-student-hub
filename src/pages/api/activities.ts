import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method !== 'POST') return res.status(405).end();
  const { title, activity_type, hours, student_id } = req.body;
  if (!student_id) return res.status(401).json({ error: 'Unauthorized' });
  const id = uuidv4();

  // Insert activity
  const { data, error } = await supabase.from('activities').insert([{ id, student_id, title, activity_type, hours, status: 'pending' }]);
  if (error) return res.status(500).json({ error: error.message });

  // send xapi (best-effort)
  try {
    const { data: student } = await supabase.from('students').select('email, name').eq('id', student_id).single();
    const email = student?.email || 'student@example.com';
    const name = student?.name || 'Student';
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/xapi`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ statement: { actor: { mbox: `mailto:${email}`, name }, verb: { id: 'http://adlnet.gov/expapi/verbs/submitted', display: { 'en-US': 'submitted' } }, object: { id: `urn:activity:${id}`, definition: { name: { 'en-US': title } } }, timestamp: new Date().toISOString() } })
    });
  } catch (e) { /* ignore */ }

  res.status(200).json({ id });
}
