import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getServiceClient()

  if (req.method === 'GET') {
    const { data } = await supabase
      .from('rsvps')
      .select('status, event_id, guests(full_name, households(name))')
      .order('event_id')

    const rsvps = (data || []).map((r: any) => ({
      guest_name: r.guests?.full_name || '',
      household_name: r.guests?.households?.name || '',
      event_id: r.event_id,
      status: r.status,
    }))

    return res.json({ rsvps })
  }

  res.status(405).end()
}
