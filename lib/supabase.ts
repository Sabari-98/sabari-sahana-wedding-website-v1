import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getServiceClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export type EventId = 'haldi' | 'sangeet' | 'ceremony' | 'reception'

export interface WeddingEvent {
  id: EventId
  name: string
  date: string
  time: string
  venue: string
  address: string
  dress_code: string
  notes: string
  description: string
}

export interface Household {
  id: string
  name: string
  created_at: string
}

export interface Guest {
  id: string
  household_id: string
  full_name: string
  email: string | null
  events: EventId[]
  rsvp: Record<EventId, 'attending' | 'declined' | 'pending'>
  created_at: string
}

export interface SiteConfig {
  key: string
  value: string
}

export const EVENT_META: Record<EventId, { label: string; emoji: string; color: string; accent: string; description: string }> = {
  haldi: {
    label: 'Haldi',
    emoji: '🌼',
    color: '#C8860A',
    accent: '#FDF3DC',
    description: 'A turmeric blessing ceremony to usher in joy and prosperity',
  },
  sangeet: {
    label: 'Sangeet',
    emoji: '🎶',
    color: '#7C3D8F',
    accent: '#F5EEF8',
    description: 'An evening of music, dance and celebration with loved ones',
  },
  ceremony: {
    label: 'Ceremony',
    emoji: '🪔',
    color: '#B91C1C',
    accent: '#FEF2F2',
    description: 'The sacred union of two souls bound in love',
  },
  reception: {
    label: 'Reception',
    emoji: '✨',
    color: '#0F766E',
    accent: '#F0FDFA',
    description: 'A grand celebration welcoming the newly wed couple',
  },
}
