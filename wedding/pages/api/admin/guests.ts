import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getServiceClient()

  if (req.method === 'GET') {
    const { data: guests } = await supabase
      .from('guests')
      .select('id, full_name, email, events, household_id')
      .order('full_name')

    const { data: households } = await supabase
      .from('households')
      .select('id, name')
      .order('name')

    const hhMap: Record<string, { id: string; name: string; guests: any[] }> = {}
    households?.forEach(hh => { hhMap[hh.id] = { ...hh, guests: [] } })
    guests?.forEach(g => {
      if (hhMap[g.household_id]) hhMap[g.household_id].guests.push(g)
    })

    return res.json({ households: Object.values(hhMap) })
  }

  if (req.method === 'POST') {
    const { householdName, guests } = req.body

    // Create household
    const { data: hh, error: hhErr } = await supabase
      .from('households')
      .insert({ name: householdName })
      .select('id')
      .single()

    if (hhErr || !hh) return res.status(500).json({ error: 'Failed to create household' })

    // Create guests
    const guestRows = guests.map((g: any) => ({
      household_id: hh.id,
      full_name: g.name,
      email: g.email || null,
      events: g.events || [],
    }))

    await supabase.from('guests').insert(guestRows)
    return res.json({ ok: true })
  }

  if (req.method === 'DELETE') {
    const { householdId } = req.query
    if (householdId) {
      await supabase.from('households').delete().eq('id', householdId)
    }
    return res.json({ ok: true })
  }

  res.status(405).end()
}
