import { useState, useEffect } from "react";

const EVENTS = [
  {
    id: "haldi",
    name: "Haldi",
    emoji: "🌼",
    color: "#D4A017",
    light: "#FFF8E7",
    icon: "🌿",
    description: "A turmeric ceremony to bless the couple with joy and prosperity",
  },
  {
    id: "sangeet",
    name: "Sangeet",
    emoji: "🎶",
    color: "#8B5CF6",
    light: "#F5F0FF",
    icon: "🎵",
    description: "An evening of music, dance, and celebration with loved ones",
  },
  {
    id: "ceremony",
    name: "Ceremony",
    emoji: "🪔",
    color: "#DC2626",
    light: "#FFF0F0",
    icon: "💍",
    description: "The sacred wedding ceremony uniting two souls",
  },
  {
    id: "reception",
    name: "Reception",
    emoji: "✨",
    color: "#0F766E",
    light: "#F0FDF8",
    icon: "🥂",
    description: "An elegant celebration to welcome the newlyweds",
  },
];

const DEFAULT_EVENT_DETAILS = {
  haldi: { date: "", time: "", venue: "", address: "", dressCode: "Yellow & White", notes: "" },
  sangeet: { date: "", time: "", venue: "", address: "", dressCode: "Festive Indian Wear", notes: "" },
  ceremony: { date: "", time: "", venue: "", address: "", dressCode: "Formal / Traditional", notes: "" },
  reception: { date: "", time: "", venue: "", address: "", dressCode: "Black Tie / Formal", notes: "" },
};

const STORAGE_KEY = "wedding_platform_v1";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .wp-root {
    min-height: 100vh;
    background: #0a0608;
    font-family: 'Jost', sans-serif;
    color: #f5ede0;
  }

  .wp-hero {
    text-align: center;
    padding: 60px 24px 40px;
    position: relative;
    overflow: hidden;
  }

  .wp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(180,130,60,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .wp-ornament {
    font-size: 28px;
    letter-spacing: 8px;
    color: #c9973a;
    margin-bottom: 12px;
    display: block;
  }

  .wp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 500;
    color: #f5ede0;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .wp-subtitle {
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c9973a;
    margin-bottom: 32px;
  }

  .wp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
    margin: 24px 0;
  }

  .wp-divider-line {
    height: 1px;
    width: 80px;
    background: linear-gradient(90deg, transparent, #c9973a);
  }

  .wp-divider-line.right {
    background: linear-gradient(90deg, #c9973a, transparent);
  }

  .wp-divider-diamond {
    width: 6px;
    height: 6px;
    background: #c9973a;
    transform: rotate(45deg);
  }

  .wp-nav {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0 24px 32px;
  }

  .wp-nav-btn {
    padding: 10px 24px;
    border-radius: 2px;
    border: 1px solid rgba(201,151,58,0.3);
    background: transparent;
    color: #f5ede0;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wp-nav-btn:hover { background: rgba(201,151,58,0.1); border-color: #c9973a; }
  .wp-nav-btn.active { background: #c9973a; color: #0a0608; border-color: #c9973a; }

  .wp-content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  .wp-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 500;
    color: #f5ede0;
    margin-bottom: 4px;
  }

  .wp-section-sub {
    font-size: 12px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #c9973a;
    margin-bottom: 32px;
  }

  .wp-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(201,151,58,0.2);
    border-radius: 4px;
    padding: 24px;
    margin-bottom: 16px;
  }

  .wp-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .wp-event-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .wp-event-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 500;
    flex: 1;
  }

  .wp-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  @media (max-width: 600px) {
    .wp-grid-2 { grid-template-columns: 1fr; }
  }

  .wp-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .wp-label {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(245,237,224,0.5);
  }

  .wp-input {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(201,151,58,0.2);
    border-radius: 2px;
    padding: 10px 12px;
    color: #f5ede0;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }

  .wp-input:focus { border-color: #c9973a; }
  .wp-input::placeholder { color: rgba(245,237,224,0.25); }

  textarea.wp-input { resize: vertical; min-height: 80px; }

  .wp-btn {
    padding: 10px 20px;
    border-radius: 2px;
    border: 1px solid rgba(201,151,58,0.4);
    background: transparent;
    color: #c9973a;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wp-btn:hover { background: rgba(201,151,58,0.1); }

  .wp-btn-gold {
    background: #c9973a;
    color: #0a0608;
    border-color: #c9973a;
  }

  .wp-btn-gold:hover { background: #d4a84d; }

  .wp-btn-danger {
    border-color: rgba(220,38,38,0.4);
    color: #f87171;
  }

  .wp-btn-danger:hover { background: rgba(220,38,38,0.1); }

  .wp-btn-sm {
    padding: 6px 12px;
    font-size: 11px;
  }

  .wp-guest-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(201,151,58,0.1);
  }

  .wp-guest-row:last-child { border-bottom: none; }

  .wp-guest-name {
    flex: 1;
    font-size: 15px;
  }

  .wp-guest-code {
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    letter-spacing: 3px;
    color: #c9973a;
    background: rgba(201,151,58,0.1);
    padding: 3px 8px;
    border-radius: 2px;
  }

  .wp-add-row {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .wp-tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 2px;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .wp-event-tabs {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .wp-event-tab {
    padding: 8px 16px;
    border-radius: 2px;
    border: 1px solid rgba(201,151,58,0.2);
    background: transparent;
    color: rgba(245,237,224,0.6);
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .wp-event-tab:hover { color: #f5ede0; border-color: rgba(201,151,58,0.4); }
  .wp-event-tab.active { border-color: #c9973a; color: #c9973a; background: rgba(201,151,58,0.08); }

  .wp-stat-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }

  .wp-stat {
    background: rgba(201,151,58,0.08);
    border: 1px solid rgba(201,151,58,0.2);
    border-radius: 4px;
    padding: 14px 20px;
    text-align: center;
    min-width: 100px;
  }

  .wp-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 500;
    color: #c9973a;
    line-height: 1;
  }

  .wp-stat-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(245,237,224,0.5);
    margin-top: 4px;
  }

  /* Guest view */
  .wp-guest-view {
    min-height: 100vh;
    background: #0a0608;
  }

  .wp-lookup-box {
    max-width: 440px;
    margin: 0 auto;
    padding: 40px 24px;
    text-align: center;
  }

  .wp-lookup-input-wrap {
    position: relative;
    margin: 24px 0 16px;
  }

  .wp-lookup-input {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(201,151,58,0.3);
    border-radius: 2px;
    padding: 14px 16px;
    color: #f5ede0;
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    letter-spacing: 6px;
    text-align: center;
    width: 100%;
    outline: none;
    text-transform: uppercase;
  }

  .wp-lookup-input:focus { border-color: #c9973a; }
  .wp-lookup-input::placeholder { font-size: 14px; letter-spacing: 2px; color: rgba(245,237,224,0.3); font-family: 'Jost', sans-serif; }

  .wp-event-card {
    background: rgba(255,255,255,0.04);
    border-radius: 4px;
    padding: 28px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    text-align: left;
  }

  .wp-event-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
  }

  .wp-event-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .wp-event-card-desc {
    font-size: 13px;
    color: rgba(245,237,224,0.55);
    font-style: italic;
    margin-bottom: 20px;
    font-family: 'Cormorant Garamond', serif;
  }

  .wp-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 500px) {
    .wp-detail-grid { grid-template-columns: 1fr; }
  }

  .wp-detail-item { }

  .wp-detail-label {
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(245,237,224,0.4);
    margin-bottom: 4px;
  }

  .wp-detail-value {
    font-size: 15px;
    color: #f5ede0;
  }

  .wp-error {
    color: #f87171;
    font-size: 13px;
    letter-spacing: 1px;
    margin-top: 8px;
  }

  .wp-welcome-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-style: italic;
    color: #c9973a;
    margin-bottom: 8px;
  }

  .wp-copy-btn {
    background: transparent;
    border: none;
    color: rgba(201,151,58,0.6);
    cursor: pointer;
    font-size: 12px;
    padding: 2px 6px;
    transition: color 0.2s;
  }

  .wp-copy-btn:hover { color: #c9973a; }

  .wp-couple-names {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 400;
    color: rgba(245,237,224,0.6);
    margin-bottom: 4px;
  }

  .wp-save-banner {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #c9973a;
    color: #0a0608;
    padding: 12px 20px;
    border-radius: 2px;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
    animation: fadeInUp 0.3s ease;
    z-index: 100;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .wp-toggle-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .wp-toggle {
    width: 36px;
    height: 20px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
    border: none;
    flex-shrink: 0;
  }

  .wp-toggle.on { background: #c9973a; }

  .wp-toggle::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: left 0.2s;
  }

  .wp-toggle.on::after { left: 19px; }

  .wp-scroll-hint {
    text-align: center;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(245,237,224,0.3);
    margin-bottom: 24px;
  }
`;

export default function WeddingPlatform() {
  const [view, setView] = useState("admin"); // admin | guest
  const [adminTab, setAdminTab] = useState("details"); // details | guests | preview
  const [activeEvent, setActiveEvent] = useState("haldi");
  const [saved, setSaved] = useState(false);
  const [guestCode, setGuestCode] = useState("");
  const [foundGuest, setFoundGuest] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  const [weddingInfo, setWeddingInfo] = useState({
    coupleName1: "",
    coupleName2: "",
    weddingDate: "",
  });

  const [eventDetails, setEventDetails] = useState(DEFAULT_EVENT_DETAILS);
  const [guestsByEvent, setGuestsByEvent] = useState({ haldi: [], sangeet: [], ceremony: [], reception: [] });
  const [allGuests, setAllGuests] = useState([]); // {id, name, code}
  const [newGuestName, setNewGuestName] = useState("");
  const [addingToEvent, setAddingToEvent] = useState(null); // event id or null for add all

  useEffect(() => {
    const data = loadData();
    if (data) {
      if (data.weddingInfo) setWeddingInfo(data.weddingInfo);
      if (data.eventDetails) setEventDetails({ ...DEFAULT_EVENT_DETAILS, ...data.eventDetails });
      if (data.guestsByEvent) setGuestsByEvent(data.guestsByEvent);
      if (data.allGuests) setAllGuests(data.allGuests);
    }
  }, []);

  const persistSave = (updates = {}) => {
    const data = {
      weddingInfo,
      eventDetails,
      guestsByEvent,
      allGuests,
      ...updates,
    };
    saveData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateEventDetail = (eventId, field, value) => {
    const updated = { ...eventDetails, [eventId]: { ...eventDetails[eventId], [field]: value } };
    setEventDetails(updated);
  };

  const addGuest = (eventId) => {
    const name = newGuestName.trim();
    if (!name) return;
    // Find existing guest with same name
    let guest = allGuests.find(g => g.name.toLowerCase() === name.toLowerCase());
    if (!guest) {
      guest = { id: generateCode() + generateCode(), name, code: generateCode() };
      const updatedAll = [...allGuests, guest];
      setAllGuests(updatedAll);
    }
    // Add to event if not already there
    const eventGuests = guestsByEvent[eventId] || [];
    if (!eventGuests.includes(guest.id)) {
      const updatedByEvent = { ...guestsByEvent, [eventId]: [...eventGuests, guest.id] };
      setGuestsByEvent(updatedByEvent);
      persistSave({ allGuests: allGuests.find(g => g.id === guest.id) ? allGuests : [...allGuests, guest], guestsByEvent: updatedByEvent });
    } else {
      persistSave({});
    }
    setNewGuestName("");
  };

  const removeGuestFromEvent = (eventId, guestId) => {
    const updated = { ...guestsByEvent, [eventId]: guestsByEvent[eventId].filter(id => id !== guestId) };
    setGuestsByEvent(updated);
    persistSave({ guestsByEvent: updated });
  };

  const lookupGuest = () => {
    const code = guestCode.trim().toUpperCase();
    if (!code) { setLookupError("Please enter your invitation code."); return; }
    const guest = allGuests.find(g => g.code === code);
    if (!guest) { setLookupError("We couldn't find that code. Please double-check and try again."); setFoundGuest(null); return; }
    setFoundGuest(guest);
    setLookupError("");
  };

  const getGuestEvents = (guestId) => {
    return EVENTS.filter(e => (guestsByEvent[e.id] || []).includes(guestId));
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const totalUnique = allGuests.length;

  const evt = EVENTS.find(e => e.id === activeEvent);

  return (
    <>
      <style>{styles}</style>
      <div className="wp-root">
        {/* Hero */}
        <div className="wp-hero">
          <span className="wp-ornament">✦ ✦ ✦</span>
          <div className="wp-couple-names">
            {weddingInfo.coupleName1 && weddingInfo.coupleName2
              ? `${weddingInfo.coupleName1} & ${weddingInfo.coupleName2}`
              : "Your Names Here"}
          </div>
          <h1 className="wp-title">Wedding Celebrations</h1>
          <div className="wp-subtitle">
            {weddingInfo.weddingDate ? new Date(weddingInfo.weddingDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Save the Date"}
          </div>
          <div className="wp-divider">
            <div className="wp-divider-line" />
            <div className="wp-divider-diamond" />
            <div className="wp-divider-line right" />
          </div>
        </div>

        {/* Nav */}
        <div className="wp-nav">
          <button className={`wp-nav-btn ${view === "admin" ? "active" : ""}`} onClick={() => setView("admin")}>Admin</button>
          <button className={`wp-nav-btn ${view === "guest" ? "active" : ""}`} onClick={() => { setView("guest"); setFoundGuest(null); setGuestCode(""); setLookupError(""); }}>Guest View</button>
        </div>

        <div className="wp-content">

          {/* ─── ADMIN VIEW ─── */}
          {view === "admin" && (
            <>
              {/* Wedding Info */}
              <div className="wp-card" style={{ marginBottom: 32 }}>
                <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div className="wp-section-title">Couple & Date</div>
                  </div>
                  <button className="wp-btn wp-btn-gold wp-btn-sm" onClick={() => persistSave({ weddingInfo })}>Save</button>
                </div>
                <div className="wp-grid-2">
                  <div className="wp-field">
                    <label className="wp-label">Name 1</label>
                    <input className="wp-input" placeholder="e.g. Priya" value={weddingInfo.coupleName1} onChange={e => setWeddingInfo({ ...weddingInfo, coupleName1: e.target.value })} />
                  </div>
                  <div className="wp-field">
                    <label className="wp-label">Name 2</label>
                    <input className="wp-input" placeholder="e.g. Arjun" value={weddingInfo.coupleName2} onChange={e => setWeddingInfo({ ...weddingInfo, coupleName2: e.target.value })} />
                  </div>
                </div>
                <div className="wp-field">
                  <label className="wp-label">Wedding Date</label>
                  <input type="date" className="wp-input" style={{ maxWidth: 200 }} value={weddingInfo.weddingDate} onChange={e => setWeddingInfo({ ...weddingInfo, weddingDate: e.target.value })} />
                </div>
              </div>

              {/* Stats */}
              <div className="wp-stat-row">
                <div className="wp-stat">
                  <div className="wp-stat-num">{totalUnique}</div>
                  <div className="wp-stat-label">Total Guests</div>
                </div>
                {EVENTS.map(e => (
                  <div className="wp-stat" key={e.id}>
                    <div className="wp-stat-num" style={{ color: e.color }}>{(guestsByEvent[e.id] || []).length}</div>
                    <div className="wp-stat-label">{e.name}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="wp-event-tabs">
                {EVENTS.map(e => (
                  <button key={e.id} className={`wp-event-tab ${activeEvent === e.id ? "active" : ""}`} onClick={() => setActiveEvent(e.id)} style={activeEvent === e.id ? { borderColor: e.color, color: e.color } : {}}>
                    {e.emoji} {e.name}
                  </button>
                ))}
              </div>

              {/* Sub-tabs */}
              <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
                {["details", "guests"].map(t => (
                  <button key={t} className={`wp-event-tab ${adminTab === t ? "active" : ""}`} onClick={() => setAdminTab(t)}
                    style={adminTab === t ? { borderColor: "#c9973a", color: "#c9973a" } : {}}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {adminTab === "details" && (
                <div className="wp-card">
                  <div className="wp-card-header">
                    <div className="wp-event-dot" style={{ background: evt.color }} />
                    <div className="wp-event-name" style={{ color: evt.color }}>{evt.name}</div>
                    <button className="wp-btn wp-btn-gold wp-btn-sm" onClick={() => persistSave({ eventDetails })}>Save Details</button>
                  </div>
                  <div className="wp-grid-2">
                    <div className="wp-field">
                      <label className="wp-label">Date</label>
                      <input type="date" className="wp-input" value={eventDetails[activeEvent]?.date || ""} onChange={e => updateEventDetail(activeEvent, "date", e.target.value)} />
                    </div>
                    <div className="wp-field">
                      <label className="wp-label">Time</label>
                      <input type="time" className="wp-input" value={eventDetails[activeEvent]?.time || ""} onChange={e => updateEventDetail(activeEvent, "time", e.target.value)} />
                    </div>
                    <div className="wp-field">
                      <label className="wp-label">Venue Name</label>
                      <input className="wp-input" placeholder="e.g. The Grand Ballroom" value={eventDetails[activeEvent]?.venue || ""} onChange={e => updateEventDetail(activeEvent, "venue", e.target.value)} />
                    </div>
                    <div className="wp-field">
                      <label className="wp-label">Dress Code</label>
                      <input className="wp-input" value={eventDetails[activeEvent]?.dressCode || ""} onChange={e => updateEventDetail(activeEvent, "dressCode", e.target.value)} />
                    </div>
                  </div>
                  <div className="wp-field" style={{ marginBottom: 12 }}>
                    <label className="wp-label">Address</label>
                    <input className="wp-input" placeholder="Full address" value={eventDetails[activeEvent]?.address || ""} onChange={e => updateEventDetail(activeEvent, "address", e.target.value)} />
                  </div>
                  <div className="wp-field">
                    <label className="wp-label">Notes for Guests</label>
                    <textarea className="wp-input" placeholder="Parking info, special instructions, etc." value={eventDetails[activeEvent]?.notes || ""} onChange={e => updateEventDetail(activeEvent, "notes", e.target.value)} />
                  </div>
                </div>
              )}

              {adminTab === "guests" && (
                <div className="wp-card">
                  <div className="wp-card-header">
                    <div className="wp-event-dot" style={{ background: evt.color }} />
                    <div className="wp-event-name" style={{ color: evt.color }}>{evt.name} — Guest List</div>
                    <span style={{ fontSize: 12, color: "rgba(245,237,224,0.4)" }}>{(guestsByEvent[activeEvent] || []).length} invited</span>
                  </div>

                  {(guestsByEvent[activeEvent] || []).length === 0 && (
                    <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(245,237,224,0.35)", fontSize: 14, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
                      No guests added yet
                    </div>
                  )}

                  {(guestsByEvent[activeEvent] || []).map(guestId => {
                    const g = allGuests.find(x => x.id === guestId);
                    if (!g) return null;
                    return (
                      <div className="wp-guest-row" key={guestId}>
                        <span className="wp-guest-name">{g.name}</span>
                        <span className="wp-guest-code">{g.code}</span>
                        <button className="wp-copy-btn" title="Copy code" onClick={() => copyCode(g.code)}>
                          {copiedCode === g.code ? "✓" : "⎘"}
                        </button>
                        <button className="wp-btn wp-btn-danger wp-btn-sm" onClick={() => removeGuestFromEvent(activeEvent, guestId)}>Remove</button>
                      </div>
                    );
                  })}

                  <div className="wp-add-row">
                    <input
                      className="wp-input"
                      placeholder="Guest name"
                      value={newGuestName}
                      onChange={e => setNewGuestName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addGuest(activeEvent)}
                    />
                    <button className="wp-btn wp-btn-gold" onClick={() => addGuest(activeEvent)}>Add</button>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, color: "rgba(245,237,224,0.35)" }}>
                    If a guest is already added to another event, they'll reuse the same invitation code.
                  </div>
                </div>
              )}

              {/* All guests master list */}
              {adminTab === "guests" && allGuests.length > 0 && (
                <div className="wp-card" style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 16 }}>
                    <div className="wp-section-title" style={{ fontSize: 20 }}>All Guests & Codes</div>
                    <div style={{ fontSize: 12, color: "rgba(245,237,224,0.4)", marginTop: 4 }}>Share each guest's unique code with them</div>
                  </div>
                  {allGuests.map(g => {
                    const gEvents = getGuestEvents(g.id);
                    return (
                      <div className="wp-guest-row" key={g.id}>
                        <span className="wp-guest-name">{g.name}</span>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {gEvents.map(e => (
                            <span key={e.id} className="wp-tag" style={{ background: e.color + "22", color: e.color, border: `1px solid ${e.color}44` }}>{e.name}</span>
                          ))}
                        </div>
                        <span className="wp-guest-code">{g.code}</span>
                        <button className="wp-copy-btn" title="Copy code" onClick={() => copyCode(g.code)}>
                          {copiedCode === g.code ? "✓" : "⎘"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ─── GUEST VIEW ─── */}
          {view === "guest" && (
            <div className="wp-lookup-box" style={{ maxWidth: foundGuest ? 600 : 440, transition: "max-width 0.3s" }}>
              {!foundGuest ? (
                <>
                  <div className="wp-section-title" style={{ marginBottom: 4 }}>You're Invited</div>
                  <div style={{ fontSize: 14, color: "rgba(245,237,224,0.5)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginBottom: 24 }}>
                    Enter your unique invitation code to see your events
                  </div>
                  <input
                    className="wp-lookup-input"
                    placeholder="Enter code"
                    value={guestCode}
                    onChange={e => setGuestCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && lookupGuest()}
                    maxLength={8}
                  />
                  {lookupError && <div className="wp-error">{lookupError}</div>}
                  <button className="wp-btn wp-btn-gold" style={{ marginTop: 16, width: "100%", padding: "14px" }} onClick={lookupGuest}>
                    View My Invitation
                  </button>
                  {allGuests.length === 0 && (
                    <div style={{ marginTop: 24, fontSize: 12, color: "rgba(245,237,224,0.3)", fontStyle: "italic" }}>
                      No guests have been added yet. Go to Admin to set up your guest list.
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="wp-welcome-name">Welcome, {foundGuest.name}</div>
                  <div style={{ fontSize: 13, color: "rgba(245,237,224,0.45)", marginBottom: 32 }}>
                    You're invited to {getGuestEvents(foundGuest.id).length} {getGuestEvents(foundGuest.id).length === 1 ? "event" : "events"}
                  </div>

                  {getGuestEvents(foundGuest.id).length === 0 && (
                    <div style={{ textAlign: "center", fontSize: 14, color: "rgba(245,237,224,0.4)", fontStyle: "italic" }}>
                      No events assigned yet. Check back soon!
                    </div>
                  )}

                  {getGuestEvents(foundGuest.id).map(e => {
                    const det = eventDetails[e.id] || {};
                    const hasDetails = det.date || det.venue || det.time;
                    return (
                      <div className="wp-event-card" key={e.id} style={{ borderColor: e.color + "33" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: e.color }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 22 }}>{e.emoji}</span>
                          <div className="wp-event-card-title" style={{ color: e.color }}>{e.name}</div>
                        </div>
                        <div className="wp-event-card-desc">{e.description}</div>
                        {hasDetails ? (
                          <div className="wp-detail-grid">
                            {det.date && (
                              <div className="wp-detail-item">
                                <div className="wp-detail-label">Date</div>
                                <div className="wp-detail-value">{new Date(det.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
                              </div>
                            )}
                            {det.time && (
                              <div className="wp-detail-item">
                                <div className="wp-detail-label">Time</div>
                                <div className="wp-detail-value">{det.time ? new Date("1970-01-01T" + det.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : ""}</div>
                              </div>
                            )}
                            {det.venue && (
                              <div className="wp-detail-item">
                                <div className="wp-detail-label">Venue</div>
                                <div className="wp-detail-value">{det.venue}</div>
                              </div>
                            )}
                            {det.dressCode && (
                              <div className="wp-detail-item">
                                <div className="wp-detail-label">Dress Code</div>
                                <div className="wp-detail-value">{det.dressCode}</div>
                              </div>
                            )}
                            {det.address && (
                              <div className="wp-detail-item" style={{ gridColumn: "1 / -1" }}>
                                <div className="wp-detail-label">Address</div>
                                <div className="wp-detail-value">{det.address}</div>
                              </div>
                            )}
                            {det.notes && (
                              <div className="wp-detail-item" style={{ gridColumn: "1 / -1" }}>
                                <div className="wp-detail-label">Notes</div>
                                <div className="wp-detail-value" style={{ fontSize: 14, color: "rgba(245,237,224,0.7)" }}>{det.notes}</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: 13, color: "rgba(245,237,224,0.35)", fontStyle: "italic" }}>Details coming soon</div>
                        )}
                      </div>
                    );
                  })}

                  <button className="wp-btn" style={{ marginTop: 16, width: "100%" }} onClick={() => { setFoundGuest(null); setGuestCode(""); }}>
                    ← Back
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {saved && <div className="wp-save-banner">✓ Saved</div>}
      </div>
    </>
  );
}
