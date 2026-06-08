# Wedding Website

A full-featured wedding website with:
- Password-protected guest access (one shared password for all guests)
- 4 events: Haldi, Sangeet, Ceremony, Reception
- Household-based RSVP — one person RSVPs for the whole family
- Per-guest, per-event RSVP (Attending / Declined)
- Admin dashboard for managing guests, events, content, and viewing RSVPs
- Editable website content (story, travel, FAQ, registry)
- CSV guest import/export
- Kolam-inspired South Indian modern design

---

## Setup Guide

### Step 1 — Supabase (database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a **New Project** — pick any name, region, and a database password
3. Wait for it to provision (~1 min), then go to **SQL Editor**
4. Paste the entire contents of `supabase-schema.sql` and click **Run**
5. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2 — GitHub

1. Go to [github.com](https://github.com) and create a new repository (name it `wedding-website`)
2. Upload all these project files (maintaining the folder structure)
3. Commit

### Step 3 — Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New Project** → select your `wedding-website` repo
3. Before deploying, click **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_SITE_PASSWORD` | Password for all guests (e.g. `celebration2025`) |
| `ADMIN_PASSWORD` | Your admin dashboard password |

4. Click **Deploy** — your site will be live in ~60 seconds

---

## Using the Admin Dashboard

Go to `yoursite.vercel.app/admin`

- **Guests** — Add households + guests, assign event invitations, import via CSV
- **Events** — Fill in dates, times, venues, dress codes for each event
- **RSVPs** — See all responses in real time, export to CSV
- **Content** — Edit all website text: story, travel, FAQ, registry links
- **Settings** — Change passwords, download exports

---

## Guest CSV Import Format

Use `guest-import-template.csv` as a reference. Columns:

| Column | Description |
|--------|-------------|
| `household_name` | Groups guests into a family/household |
| `full_name` | Guest's full name (used for RSVP lookup) |
| `email` | Optional email (also used for RSVP lookup) |
| `haldi` | Y / blank |
| `sangeet` | Y / blank |
| `ceremony` | Y / blank |
| `reception` | Y / blank |

---

## Customizing Design

In Admin → **Content → Design**, you can change the primary and accent colors.

For deeper customization, edit `styles/globals.css` — all design tokens are CSS variables at the top of the file.

---

## Sharing With Guests

1. Share your site URL (e.g. `yourwedding.vercel.app`) with all guests
2. Share the **site password** on your physical invitations or via email
3. On the RSVP page, guests enter their name or email to find their household

**Optional:** Get a custom domain (e.g. `priyaandarjun.com`) via Vercel → Domains — costs ~$12/year.
