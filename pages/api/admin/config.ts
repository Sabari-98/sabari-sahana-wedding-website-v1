import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getServiceClient()

  if (req.method === 'GET') {
    const { data } = await supabase.from('site_config').select('key, value')
    const config: Record<string, string> = {}
    data?.forEach(r => { config[r.key] = r.value })
    return res.json({ config })
  }

  if (req.method === 'PUT') {
    const { updates } = req.body as { updates: Record<string, string> }
    const rows = Object.entries(updates).map(([key, value]) => ({ key, value }))
    await supabase.from('site_config').upsert(rows, { onConflict: 'key' })
    return res.json({ ok: true })
  }

  res.status(405).end()
}
