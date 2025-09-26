import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method !== 'POST') return res.status(405).end();
  const { activityId } = req.body;
  if (!activityId) return res.status(400).json({ error: 'activityId required' });

  const { data: act, error: actErr } = await supabase.from('activities').select('student_id, title').eq('id', activityId).single();
  if (actErr || !act) return res.status(404).json({ error: 'Activity not found' });

  const badgeId = uuidv4();
  const badgePayload = {
    id: `urn:badge:${badgeId}`,
    name: `Badge for ${act.title}`,
    criteria: 'Approved evidence for activity',
    issued_at: new Date().toISOString()
  };

  const { error } = await supabase.from('badges').insert([{ id: badgeId, student_id: act.student_id, activity_id: activityId, name: badgePayload.name, criteria: badgePayload.criteria }]);
  if (error) return res.status(500).json({ error: error.message });

  // In production: sign VC and update vc_jwt
  return res.status(200).json({ badge: badgePayload });
}
