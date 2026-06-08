import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getServiceClient()

  if (req.method === 'GET') {
    const { data } = await supabase.from('events').select('*').order('id')
    return res.json({ events: data || [] })
  }

  if (req.method === 'PUT') {
    const { id, event_date, event_time, venue, address, dress_code, notes } = req.body
    await supabase.from('events').update({ event_date, event_time, venue, address, dress_code, notes }).eq('id', id)
    return res.json({ ok: true })
  }

  res.status(405).end()
}
