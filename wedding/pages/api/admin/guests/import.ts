import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceClient, EventId } from '../../../../lib/supabase'

const TRUTHY = ['y', 'yes', '1', 'true', 'x']

function isTruthy(v: any) {
  return TRUTHY.includes(String(v || '').toLowerCase().trim())
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const supabase = getServiceClient()
  const { rows } = req.body as { rows: Record<string, string>[] }

  // Group rows by household_name
  const hhMap: Record<string, { guests: any[] }> = {}
  rows.forEach(row => {
    const hhName = (row.household_name || row['Household Name'] || 'Unknown').trim()
    if (!hhMap[hhName]) hhMap[hhName] = { guests: [] }
    const events: EventId[] = []
    if (isTruthy(row.haldi || row.Haldi)) events.push('haldi')
    if (isTruthy(row.sangeet || row.Sangeet)) events.push('sangeet')
    if (isTruthy(row.ceremony || row.Ceremony)) events.push('ceremony')
    if (isTruthy(row.reception || row.Reception)) events.push('reception')
    hhMap[hhName].guests.push({
      full_name: (row.full_name || row['Full Name'] || '').trim(),
      email: (row.email || row.Email || '').trim() || null,
      events,
    })
  })

  for (const [hhName, { guests }] of Object.entries(hhMap)) {
    if (!guests.length) continue
    // Upsert household
    const { data: existing } = await supabase.from('households').select('id').eq('name', hhName).single()
    let hhId: string
    if (existing) {
      hhId = existing.id
    } else {
      const { data: newHh } = await supabase.from('households').insert({ name: hhName }).select('id').single()
      hhId = newHh!.id
    }
    // Insert guests
    const guestRows = guests
      .filter(g => g.full_name)
      .map(g => ({ household_id: hhId, full_name: g.full_name, email: g.email, events: g.events }))
    if (guestRows.length) {
      await supabase.from('guests').insert(guestRows)
    }
  }

  res.json({ ok: true })
}
