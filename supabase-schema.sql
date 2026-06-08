-- ============================================================
-- WEDDING WEBSITE DATABASE SCHEMA
-- Run this in your Supabase SQL editor (supabase.com → your project → SQL Editor)
-- ============================================================

-- Site configuration (stores all editable content + passwords)
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed default config
INSERT INTO site_config (key, value) VALUES
  ('couple_name_1', 'Priya'),
  ('couple_name_2', 'Arjun'),
  ('wedding_date', '2025-11-15'),
  ('site_password', 'celebration2025'),
  ('hero_tagline', 'Two families. One celebration.'),
  ('story_title', 'Our Story'),
  ('story_content', 'Tell your story here — how you met, your journey together, and what makes your love unique.'),
  ('travel_content', 'Add travel and accommodation information here.'),
  ('faq_content', '[{"q":"What should I wear?","a":"Smart casual to formal for most events."},{"q":"Is there parking?","a":"Yes, complimentary parking is available at all venues."}]'),
  ('registry_note', 'Your presence is the greatest gift. For those who wish to give, we are registered at the links below.'),
  ('registry_links', '[{"name":"Zola","url":"https://zola.com"},{"name":"Amazon","url":"https://amazon.com"}]'),
  ('primary_color', '#1C1917'),
  ('accent_color', '#C8860A'),
  ('font_display', 'Cormorant Garamond'),
  ('font_body', 'Jost');

-- Events table
CREATE TABLE events (
  id TEXT PRIMARY KEY CHECK (id IN ('haldi','sangeet','ceremony','reception')),
  name TEXT NOT NULL,
  event_date DATE,
  event_time TIME,
  venue TEXT DEFAULT '',
  address TEXT DEFAULT '',
  dress_code TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true
);

INSERT INTO events (id, name) VALUES
  ('haldi', 'Haldi'),
  ('sangeet', 'Sangeet'),
  ('ceremony', 'Ceremony'),
  ('reception', 'Reception');

-- Households
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guests
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  events TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVPs (one row per guest per event)
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('attending','declined','pending')) DEFAULT 'pending',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guest_id, event_id)
);

-- Indexes for fast lookup
CREATE INDEX idx_guests_email ON guests(LOWER(email));
CREATE INDEX idx_guests_name ON guests(LOWER(full_name));
CREATE INDEX idx_guests_household ON guests(household_id);
CREATE INDEX idx_rsvps_guest ON rsvps(guest_id);

-- Enable Row Level Security but allow anon reads for guests
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Public read policies (site is password-protected at app level)
CREATE POLICY "public_read_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "public_read_events" ON events FOR SELECT USING (true);
CREATE POLICY "public_read_households" ON households FOR SELECT USING (true);
CREATE POLICY "public_read_guests" ON guests FOR SELECT USING (true);
CREATE POLICY "public_read_rsvps" ON rsvps FOR SELECT USING (true);

-- Allow guest rsvp updates via anon
CREATE POLICY "public_upsert_rsvps" ON rsvps FOR ALL USING (true) WITH CHECK (true);

-- Service role has full access (used by admin API routes)
