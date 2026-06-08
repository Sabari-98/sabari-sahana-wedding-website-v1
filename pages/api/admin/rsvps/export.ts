import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceClient } from '../../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const supabase = getServiceClient()

  const { data } = await supabase
    .from('rsvps')
    .select('status, event_id, guests(full_name, email, households(name))')
    .order('event_id')

  const rows = (data || []).map((r: any) => ({
    household: r.guests?.households?.name || '',
    guest: r.guests?.full_name || '',
    email: r.guests?.email || '',
    event: r.event_id,
    status: r.status,
  }))

  const header = 'household,guest,email,event,status\n'
  const csv = header + rows.map(r => Object.values(r).map(v => `"${v}"`).join(',')).join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="rsvps.csv"')
  res.send(csv)
}
