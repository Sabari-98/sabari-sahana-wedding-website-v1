import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceClient } from '../../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const supabase = getServiceClient()

  const { data: guests } = await supabase
    .from('guests')
    .select('full_name, email, events, household_id, households(name)')
    .order('full_name')

  const rows = (guests || []).map((g: any) => ({
    household_name: g.households?.name || '',
    full_name: g.full_name,
    email: g.email || '',
    haldi: g.events?.includes('haldi') ? 'Y' : '',
    sangeet: g.events?.includes('sangeet') ? 'Y' : '',
    ceremony: g.events?.includes('ceremony') ? 'Y' : '',
    reception: g.events?.includes('reception') ? 'Y' : '',
  }))

  const header = 'household_name,full_name,email,haldi,sangeet,ceremony,reception\n'
  const csv = header + rows.map(r => Object.values(r).map(v => `"${v}"`).join(',')).join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="guests.csv"')
  res.send(csv)
}
