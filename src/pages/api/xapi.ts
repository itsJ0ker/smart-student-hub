import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method !== 'POST') return res.status(405).end();
  const { statement } = req.body;
  const lrsUrl = process.env.LRS_ENDPOINT as string;
  const auth = process.env.LRS_BASIC_AUTH as string;

  if (!lrsUrl) return res.status(500).json({ error: 'No LRS_ENDPOINT configured' });

  try{
    const r = await fetch(lrsUrl, { method: 'POST', headers: { 'content-type':'application/json', 'Authorization': auth || '' }, body: JSON.stringify(statement) });
    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: 'LRS rejected', details: txt });
    }
    return res.status(200).json({ ok:true });
  }catch(e:any){
    return res.status(502).json({ error: e.message });
  }
}
