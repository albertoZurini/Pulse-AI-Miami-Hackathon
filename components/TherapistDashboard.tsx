"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { ARCreatureRow } from "@/lib/supabase";

/* ─── CLIENT DATA ─── */
interface Client {
  id: string;
  av: string;
  bg: string;
  name: string;
  age: number;
  goal: string;
  status: "active" | "at-risk";
  streak: number;
  prog: number;
  mood: string;
  last: string;
  quests: number;
  critters: number;
  calm: number;
  real: number;
  stage: number;
}

const CLIENTS: Client[] = [
  { id: "marcus", av: "\u{1F9D1}\u200D\u{1F680}", bg: "rgba(255,107,0,.15)", name: "Marcus Williams", age: 22, goal: "Self-Advocacy", status: "at-risk", streak: 2, prog: 35, mood: "\u{1F614}", last: "2h ago", quests: 14, critters: 7, calm: 23, real: 5, stage: 1 },
  { id: "jordan", av: "\u{1F98B}", bg: "rgba(126,211,33,.1)", name: "Jordan Kim", age: 19, goal: "Social Integration", status: "active", streak: 14, prog: 91, mood: "\u{1F604}", last: "30m ago", quests: 31, critters: 12, calm: 38, real: 5, stage: 2 },
  { id: "riley", av: "\u{1F9D9}", bg: "rgba(0,212,255,.1)", name: "Riley Morris", age: 25, goal: "Thought Flipping", status: "active", streak: 7, prog: 72, mood: "\u{1F610}", last: "1h ago", quests: 22, critters: 9, calm: 18, real: 3, stage: 1 },
  { id: "alex", av: "\u{1F9B8}", bg: "rgba(168,85,247,.12)", name: "Alex Torres", age: 28, goal: "Vocational Readiness", status: "active", streak: 5, prog: 60, mood: "\u{1F642}", last: "4h ago", quests: 18, critters: 5, calm: 14, real: 2, stage: 1 },
  { id: "sam", av: "\u{1F916}", bg: "rgba(255,184,0,.1)", name: "Sam Lee", age: 21, goal: "Anxiety Regulation", status: "active", streak: 11, prog: 84, mood: "\u{1F60A}", last: "20m ago", quests: 26, critters: 10, calm: 41, real: 4, stage: 2 },
];

type ViewId = "dashboard" | "alerts" | "live" | "clients" | "quests" | "plans" | "reports" | "messages" | "creatures";
type ModalId = "addClient" | "note" | "assign" | "addQuest" | "addPlan" | "msg" | "addCreature" | null;

const COLOR_PRESETS = [
  { label: "Cyan", value: "#00D4FF" },
  { label: "Orange", value: "#FF6B00" },
  { label: "Purple", value: "#A855F7" },
  { label: "Pink", value: "#FF2D78" },
  { label: "Green", value: "#7ED321" },
  { label: "Amber", value: "#FFB800" },
];

const WEEK_DATA = [8, 12, 7, 16, 11, 14, 9];
const MAX_WEEK = Math.max(...WEEK_DATA);

const AI_SYS = "You are Pulse AI, a clinical assistant for a therapist using the Pulse platform \u2014 a gamified therapy app for people with mild intellectual disability. Help with client insights, message drafting, quest suggestions, and progress summaries. Respond professionally but concisely (2-4 sentences unless asked for more). Client context: Marcus Williams (22, at-risk, streak:2, mood:SAD x3, completion:35%), Jordan Kim (19, Stage 2, streak:14, thriving, 5 real-life transfers), Riley Morris (25, stable, streak:7).";

function statusTag(s: string) {
  return s === "active"
    ? <span className="tag green">Active</span>
    : <span className="tag red">Needs Attention</span>;
}

function progColor(p: number) {
  return p > 70 ? "var(--li)" : p > 40 ? "var(--am)" : "var(--mg)";
}
function streakColor(s: number) {
  return s >= 7 ? "var(--li)" : s < 3 ? "var(--mg)" : "var(--am)";
}

export default function TherapistDashboard() {
  const [view, setView] = useState<ViewId>("dashboard");
  const [modal, setModal] = useState<ModalId>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Supabase creatures
  const supabase = createClient();
  const [creatures, setCreatures] = useState<ARCreatureRow[]>([]);
  const [creaturesLoading, setCreaturesLoading] = useState(true);
  const [newCreature, setNewCreature] = useState({
    name: "", emoji: "", skill: "", context: "", practice_question: "",
    choice1: "", choice2: "", choice3: "", correctChoice: 0,
    color: "#00D4FF", badge: false,
  });

  const fetchCreatures = useCallback(async () => {
    if (!supabase) { setCreaturesLoading(false); return; }
    const { data, error } = await supabase.from("ar_creatures").select("*").order("sort_order", { ascending: true });
    if (!error && data) setCreatures(data as ARCreatureRow[]);
    setCreaturesLoading(false);
  }, [supabase]);

  useEffect(() => { fetchCreatures(); }, [fetchCreatures]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("therapist_creatures")
      .on("postgres_changes", { event: "*", schema: "public", table: "ar_creatures" }, () => fetchCreatures())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetchCreatures]);

  const addCreature = useCallback(async () => {
    if (!supabase || !newCreature.name || !newCreature.emoji) return;
    const choices = [
      { t: newCreature.choice1, c: newCreature.correctChoice === 0 },
      { t: newCreature.choice2, c: newCreature.correctChoice === 1 },
      { t: newCreature.choice3, c: newCreature.correctChoice === 2 },
    ];
    const position = { top: 100 + Math.floor(Math.random() * 150), left: 30 + Math.floor(Math.random() * 120), dur: 2.5 + Math.random() * 2, delay: Math.random() };
    await supabase.from("ar_creatures").insert({
      name: newCreature.name, emoji: newCreature.emoji, skill: newCreature.skill,
      context: newCreature.context, practice_question: newCreature.practice_question,
      choices, position, color: newCreature.color, badge: newCreature.badge,
      sort_order: creatures.length,
    });
    setNewCreature({ name: "", emoji: "", skill: "", context: "", practice_question: "", choice1: "", choice2: "", choice3: "", correctChoice: 0, color: "#00D4FF", badge: false });
    showToast("Creature added to Wild Zone! Clients see it instantly \u2713");
    setModal(null);
  }, [supabase, newCreature, creatures.length, showToast]);

  const removeCreature = useCallback(async (id: string) => {
    if (!supabase) return;
    await supabase.from("ar_creatures").delete().eq("id", id);
    showToast("Creature removed from Wild Zone \u2713");
  }, [supabase, showToast]);

  // AI panel
  const [aiMessages, setAiMessages] = useState<{ role: "ai" | "user"; text: string }[]>([
    { role: "ai", text: "Good morning, Dr. Ram\u00EDrez! You have 3 alerts and 5 unread messages. Marcus Williams flagged with mood drop \u2014 I'd recommend outreach today. Jordan Kim hit a real-life milestone! \u{1F389} What do you want to focus on?" },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const aiMsgsRef = useRef<HTMLDivElement>(null);

  // Client insight
  const [clientInsight, setClientInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  // Therapist reply
  const [therapistReply, setTherapistReply] = useState("");

  const navigate = useCallback((id: ViewId) => {
    setView(id);
    setSelectedClient(null);
  }, []);

  const openClient = useCallback((id: string) => {
    const c = CLIENTS.find((x) => x.id === id) ?? CLIENTS[0];
    setSelectedClient(c);
    setView("clients");
    setClientInsight(null);
    setInsightLoading(true);
    // Load AI insight for client
    (async () => {
      const prompt = `You are Pulse AI, a clinical co-pilot for a therapist. Write a brief (2-3 sentences, professional tone) clinical insight about: ${c.name}, age ${c.age}, goal: ${c.goal}, streak: ${c.streak} days, quest completion: ${c.prog}%, mood: ${c.mood}, stage: ${c.stage}. Be specific and actionable.`;
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "therapist", prompt }),
        });
        const data = await res.json();
        setClientInsight(data.text);
      } catch {
        setClientInsight(`${c.name} shows ${c.prog > 70 ? "strong" : c.prog > 40 ? "moderate" : "low"} engagement. ${c.mood === "\u{1F614}" ? "Current mood flag warrants outreach today." : "Mood indicators are positive."} ${c.streak < 3 ? "Consider a motivational message or session review." : "Maintain current plan trajectory."}`);
      } finally {
        setInsightLoading(false);
      }
    })();
  }, []);

  // AI panel send
  const sendAI = useCallback(async (override?: string) => {
    const msg = (override ?? aiInput).trim();
    if (!msg || aiLoading) return;
    setAiInput("");
    setAiMessages((m) => [...m, { role: "user", text: msg }]);
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "therapist", prompt: msg, system: AI_SYS }),
      });
      const data = await res.json();
      setAiMessages((m) => [...m, { role: "ai", text: data.text }]);
    } catch {
      setAiMessages((m) => [...m, { role: "ai", text: "Based on your client data, I recommend prioritizing Marcus today with a warm check-in message." }]);
    } finally {
      setAiLoading(false);
    }
  }, [aiInput, aiLoading]);

  useEffect(() => {
    aiMsgsRef.current?.scrollTo({ top: aiMsgsRef.current.scrollHeight, behavior: "smooth" });
  }, [aiMessages, aiLoading]);

  // Draft reply helpers
  const draftReply = useCallback(async (type: string) => {
    const prompts: Record<string, string> = {
      "check-in": "Write a 2-sentence warm check-in message from therapist to Marcus who seems sad and missed quests. Supportive, not clinical.",
      quest: "Write a 1-2 sentence upbeat quest reminder to a client. Make it feel exciting, not pressuring.",
      session: "Write a 1-sentence message scheduling a check-in session with a client who seems to be struggling.",
      adjust: "Write a 1-sentence message telling a client their quests have been adjusted to be a bit easier this week \u2014 frame positively.",
    };
    setTherapistReply("Drafting...");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "therapist", prompt: prompts[type] }),
      });
      const data = await res.json();
      setTherapistReply(data.text);
    } catch {
      setTherapistReply("Hey! Just wanted to check in. Remember I'm here whenever you need me \u{1F499}");
    }
  }, []);

  const titles: Record<ViewId, string> = {
    dashboard: "Dashboard",
    clients: "Clients",
    quests: "Quest Library",
    plans: "Treatment Plans",
    reports: "Reports & Analytics",
    messages: "Messages",
    alerts: "Alerts & Flags",
    live: "Live Monitor",
    creatures: "Wild Zone",
  };

  return (
    <div className="therapist-root" style={{ fontFamily: "'Nunito', sans-serif", background: "#050316", color: "#fff", height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sb-logo">
          <div className="sb-logo-mark">{"\u{1F9E0}"}</div>
          <div>
            <div className="sb-logo-txt">Pulse</div>
            <div className="sb-logo-badge">Clinical</div>
          </div>
        </div>

        <div className="sb-section">Overview</div>
        <button type="button" className={`sb-item ${view === "dashboard" ? "active" : ""}`} onClick={() => navigate("dashboard")}><span className="sb-ico">{"\u26A1"}</span>Dashboard</button>
        <button type="button" className={`sb-item ${view === "alerts" ? "active" : ""}`} onClick={() => navigate("alerts")}><span className="sb-ico">{"\u{1F514}"}</span>Alerts<span className="sb-badge">3</span></button>
        <button type="button" className={`sb-item ${view === "live" ? "active" : ""}`} onClick={() => navigate("live")}><span className="sb-ico">{"\u{1F441}\uFE0F"}</span>Live Monitor</button>

        <div className="sb-section">Clients</div>
        <button type="button" className={`sb-item ${view === "clients" ? "active" : ""}`} onClick={() => navigate("clients")}><span className="sb-ico">{"\u{1F465}"}</span>All Clients</button>
        <button type="button" className={`sb-item ${view === "quests" ? "active" : ""}`} onClick={() => navigate("quests")}><span className="sb-ico">{"\u2694\uFE0F"}</span>Quest Library</button>
        <button type="button" className={`sb-item ${view === "creatures" ? "active" : ""}`} onClick={() => navigate("creatures")}><span className="sb-ico">{"\u{1F43E}"}</span>Wild Zone<span className="sb-badge" style={{ background: "var(--li)", animation: "none" }}>{creatures.length}</span></button>
        <button type="button" className={`sb-item ${view === "plans" ? "active" : ""}`} onClick={() => navigate("plans")}><span className="sb-ico">{"\u{1F4CB}"}</span>Treatment Plans</button>

        <div className="sb-section">Data</div>
        <button type="button" className={`sb-item ${view === "reports" ? "active" : ""}`} onClick={() => navigate("reports")}><span className="sb-ico">{"\u{1F4CA}"}</span>Reports</button>
        <button type="button" className={`sb-item ${view === "messages" ? "active" : ""}`} onClick={() => navigate("messages")}><span className="sb-ico">{"\u2709\uFE0F"}</span>Messages<span className="sb-badge" style={{ background: "var(--cy)", animation: "none" }}>5</span></button>

        <div className="sb-spacer" />
        <div className="sb-user">
          <div className="sb-user-av">{"\u{1F469}\u200D\u2695\uFE0F"}</div>
          <div>
            <div className="sb-user-nm">Dr. Ram{"\u00ED"}rez</div>
            <div className="sb-user-role">Licensed Therapist</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="t-main">
        <div className="topbar">
          <div className="topbar-title">{titles[view]}</div>
          <div className="ai-status"><div className="ai-dot" />Pulse AI Active</div>
          <button type="button" className="tb-btn" onClick={() => setModal("note")}>{"\u{1F4DD}"} Add Note</button>
          <button type="button" className="tb-btn" onClick={() => setModal("msg")}>{"\u2709\uFE0F"} Message</button>
          <button type="button" className="tb-btn primary" onClick={() => setModal("addClient")}>+ New Client</button>
        </div>

        <div className="t-content">
          {/* DASHBOARD VIEW */}
          {view === "dashboard" && (
            <div className="t-view active">
              <div className="metrics">
                <div className="metric" style={{ "--mc": "var(--in)" } as React.CSSProperties}><div className="m-val" style={{ color: "var(--pu)" }}>12</div><div className="m-lbl">Active Clients</div><div className="m-chg up">{"\u2191"} 2 this month</div></div>
                <div className="metric" style={{ "--mc": "var(--li)" } as React.CSSProperties}><div className="m-val" style={{ color: "var(--li)" }}>74%</div><div className="m-lbl">Avg Quest Completion</div><div className="m-chg up">{"\u2191"} 8% vs last week</div></div>
                <div className="metric" style={{ "--mc": "var(--cy)" } as React.CSSProperties}><div className="m-val" style={{ color: "var(--cy)" }}>6.8d</div><div className="m-lbl">Avg Streak</div><div className="m-chg up">{"\u2191"} 1.2 days</div></div>
                <div className="metric" style={{ "--mc": "var(--mg)" } as React.CSSProperties}><div className="m-val" style={{ color: "var(--mg)" }}>2</div><div className="m-lbl">Needs Attention</div><div className="m-chg dn">{"\u2191"} 1 new alert</div></div>
              </div>

              <div className="alert-c">
                <div className="al-ico">{"\u{1F614}"}</div>
                <div><div className="al-ttl">Marcus W. {"\u2014"} Mood dip detected</div><div className="al-txt">AI flagged 3 consecutive &quot;SAD&quot; check-ins. Quest completion dropped from 80% {"\u2192"} 20% this week. Last session: 4 days ago.</div></div>
                <button type="button" className="al-act" onClick={() => openClient("marcus")}>View Client {"\u2192"}</button>
              </div>
              <div className="alert-c warn">
                <div className="al-ico">{"\u{1F4C9}"}</div>
                <div><div className="al-ttl">Jordan K. {"\u2014"} Skipped 2 assigned quests</div><div className="al-txt">Both &quot;Speak Up at Work&quot; quests missed this week {"\u2014"} unusual for Jordan who normally completes 90%+.</div></div>
                <button type="button" className="al-act" style={{ background: "rgba(255,184,0,.12)", borderColor: "rgba(255,184,0,.2)", color: "var(--am)" }}>Review {"\u2192"}</button>
              </div>

              <div className="two-col">
                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u{1F4C8}"} This Week&apos;s Completions</div></div>
                  <div style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                      <span style={{ fontSize: 10, color: "var(--mt)" }}>Quest completions across all clients</span>
                      <span className="tag green">+23 this week</span>
                    </div>
                    <div className="mini-chart">
                      {WEEK_DATA.map((v, i) => (
                        <div key={i} className="chart-bar" style={{ height: (v / MAX_WEEK) * 50, background: "linear-gradient(180deg,var(--pu),var(--in))", opacity: 0.8 }} />
                      ))}
                    </div>
                    <div className="chart-lbl-row">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <span key={d} className="chart-lbl">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "0 18px 14px" }}>
                    <div style={{ fontSize: 10, color: "var(--mt)", marginBottom: 8, fontWeight: 700 }}>By Skill Area</div>
                    {[
                      { label: "\u{1F5E3}\uFE0F Speak Up", pct: 78, grad: "var(--mg),var(--or)", color: "var(--mg)" },
                      { label: "\u{1F4AD} Think It", pct: 65, grad: "var(--in),var(--pu)", color: "var(--pu)" },
                      { label: "\u2601\uFE0F Calm", pct: 82, grad: "var(--cy),var(--in)", color: "var(--cy)" },
                      { label: "\u{1F30E} Real Life", pct: 41, grad: "var(--li),var(--cy)", color: "var(--li)" },
                    ].map((s) => (
                      <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                        <span style={{ fontSize: 10, width: 70 }}>{s.label}</span>
                        <div className="pb" style={{ flex: 1 }}><div className="pbf" style={{ width: `${s.pct}%`, background: `linear-gradient(90deg,${s.grad})` }} /></div>
                        <span style={{ fontSize: 10, color: s.color, fontWeight: 800 }}>{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u2726"} AI Insights</div><span className="tag purple">Auto-generated</span></div>
                  <div style={{ padding: 12 }}>
                    <div className="insight">
                      <div className="ins-hdr"><div className="ins-orb">{"\u2726"}</div><div><div className="ins-lbl">Pattern Detected</div><div className="ins-nm">Marcus needs re-engagement</div></div></div>
                      <div className="ins-txt">Marcus&apos;s engagement dropped after missing Thursday. Historical data shows best completion Tue/Wed. Suggest rescheduling or a Sparky check-in today.</div>
                      <div className="ins-btns"><button type="button" className="ins-btn cta" onClick={() => openClient("marcus")}>View Marcus</button><button type="button" className="ins-btn" onClick={() => setModal("msg")}>Message</button></div>
                    </div>
                    <div className="insight">
                      <div className="ins-hdr"><div className="ins-orb">{"\u2726"}</div><div><div className="ins-lbl">Milestone Ready</div><div className="ins-nm">Jordan {"\u2014"} advance to Stage 2?</div></div></div>
                      <div className="ins-txt">Jordan logged 5 real-life skill transfers this month {"\u2014"} a personal record. Data suggests readiness for Stage 2: community integration goals.</div>
                      <div className="ins-btns"><button type="button" className="ins-btn cta" onClick={() => openClient("jordan")}>Review Plan</button><button type="button" className="ins-btn" onClick={() => setModal("note")}>Add Note</button></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-hdr"><div className="panel-ttl">{"\u{1F465}"} Client Snapshot</div><button type="button" className="p-act" onClick={() => navigate("clients")}>View All {"\u2192"}</button></div>
                <table className="ctable">
                  <thead><tr><th>Client</th><th>Status</th><th>Quest Progress</th><th>Streak</th><th>Mood</th><th>Last Active</th></tr></thead>
                  <tbody>
                    {CLIENTS.map((c) => (
                      <tr key={c.id} className="crow" onClick={() => openClient(c.id)}>
                        <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="c-av" style={{ background: c.bg }}>{c.av}</div><div><div className="c-nm">{c.name}</div><div className="c-sub">Age {c.age} {"\u00B7"} Stage {c.stage}</div></div></div></td>
                        <td>{statusTag(c.status)}</td>
                        <td><div style={{ display: "flex", alignItems: "center", gap: 6 }}><div className="pb" style={{ width: 90 }}><div className="pbf" style={{ width: `${c.prog}%`, background: "linear-gradient(90deg,var(--in),var(--pu))" }} /></div><span style={{ fontSize: 10, color: progColor(c.prog), fontWeight: 800 }}>{c.prog}%</span></div></td>
                        <td style={{ color: streakColor(c.streak), fontWeight: 800 }}>{c.streak}d {"\u{1F525}"}</td>
                        <td style={{ fontSize: 17 }}>{c.mood}</td>
                        <td style={{ fontSize: 10, color: "var(--mt)" }}>{c.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CLIENTS VIEW */}
          {view === "clients" && !selectedClient && (
            <div className="t-view active">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <input className="f-inp" placeholder="\u{1F50D}  Search clients..." style={{ maxWidth: 240 }} readOnly />
                <div style={{ display: "flex", gap: 6 }}><span className="tag green">Active (10)</span><span className="tag red">At-Risk (2)</span></div>
                <button type="button" className="tb-btn primary" style={{ marginLeft: "auto" }} onClick={() => setModal("addClient")}>+ Add Client</button>
              </div>
              <div className="panel">
                <div className="panel-hdr"><div className="panel-ttl">All Clients</div></div>
                <table className="ctable">
                  <thead><tr><th>Client</th><th>Age</th><th>Primary Goal</th><th>Status</th><th>Quest %</th><th>Streak</th><th>Last Active</th><th></th></tr></thead>
                  <tbody>
                    {CLIENTS.map((c) => (
                      <tr key={c.id} className="crow" onClick={() => openClient(c.id)}>
                        <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="c-av" style={{ background: c.bg }}>{c.av}</div><div><div className="c-nm">{c.name}</div><div className="c-sub">Age {c.age} {"\u00B7"} Stage {c.stage}</div></div></div></td>
                        <td style={{ fontSize: 11 }}>{c.age}</td>
                        <td style={{ fontSize: 11 }}>{c.goal}</td>
                        <td>{statusTag(c.status)}</td>
                        <td><div style={{ display: "flex", alignItems: "center", gap: 6 }}><div className="pb" style={{ width: 80 }}><div className="pbf" style={{ width: `${c.prog}%`, background: "linear-gradient(90deg,var(--in),var(--pu))" }} /></div><span style={{ fontSize: 10, color: progColor(c.prog), fontWeight: 800 }}>{c.prog}%</span></div></td>
                        <td style={{ color: streakColor(c.streak), fontWeight: 800, fontSize: 11 }}>{c.streak}d</td>
                        <td style={{ fontSize: 10, color: "var(--mt)" }}>{c.last}</td>
                        <td><button type="button" className="p-act" onClick={(e) => { e.stopPropagation(); setModal("assign"); }}>+ Quest</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CLIENT DETAIL */}
          {view === "clients" && selectedClient && (
            <div className="t-view active">
              <button type="button" className="back-btn" onClick={() => setSelectedClient(null)}>{"\u2190"} All Clients</button>
              <div className="cd-hero">
                <div className="cd-av">{selectedClient.av}</div>
                <div style={{ flex: 1 }}>
                  <div className="cd-nm">{selectedClient.name}</div>
                  <div className="cd-meta">Age {selectedClient.age} {"\u00B7"} Stage {selectedClient.stage} Treatment {"\u00B7"} Last active {selectedClient.last}</div>
                  <div className="cd-tags">
                    {statusTag(selectedClient.status)}
                    <span className="tag purple">{selectedClient.goal}</span>
                    <span className={`tag ${selectedClient.streak >= 7 ? "green" : selectedClient.streak < 3 ? "red" : "amber"}`}>{selectedClient.streak} day streak {"\u{1F525}"}</span>
                  </div>
                </div>
                <div className="cd-acts">
                  <button type="button" className="tb-btn primary" onClick={() => setModal("msg")}>{"\u2709\uFE0F"} Message</button>
                  <button type="button" className="tb-btn" onClick={() => setModal("assign")}>+ Assign Quest</button>
                  <button type="button" className="tb-btn" onClick={() => setModal("note")}>{"\u{1F4DD}"} Add Note</button>
                </div>
              </div>

              <div className="cd-stats-row">
                <div className="cd-stat"><div className="cds-val" style={{ color: "var(--am)" }}>{selectedClient.quests}</div><div className="cds-lbl">{"\u2694\uFE0F"} Quests Done</div></div>
                <div className="cd-stat"><div className="cds-val" style={{ color: "var(--cy)" }}>{selectedClient.critters}</div><div className="cds-lbl">{"\u{1F43E}"} Creatures</div></div>
                <div className="cd-stat"><div className="cds-val" style={{ color: "var(--pu)" }}>{selectedClient.calm}</div><div className="cds-lbl">{"\u2601\uFE0F"} Calm Sessions</div></div>
                <div className="cd-stat"><div className="cds-val" style={{ color: "var(--li)" }}>{selectedClient.real}</div><div className="cds-lbl">{"\u{1F30E}"} Real Life Wins</div></div>
                <div className="cd-stat"><div className="cds-val" style={{ color: streakColor(selectedClient.streak) }}>{selectedClient.streak}</div><div className="cds-lbl">{"\u{1F525}"} Day Streak</div></div>
              </div>

              <div className="cd-2col">
                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u{1F4CB}"} Treatment Goals</div><button type="button" className="p-act" onClick={() => setModal("addPlan")}>Edit Plan</button></div>
                  <div style={{ padding: 13 }}>
                    <div className="goal-row">
                      <div className="goal-ico">{"\u{1F5E3}\uFE0F"}</div>
                      <div style={{ flex: 1 }}>
                        <div className="goal-ttl">Self-Advocacy</div>
                        <div className="goal-desc">Asking for help in work, medical, and community contexts</div>
                        <div className="goal-prog"><div className="pb" style={{ flex: 1 }}><div className="pbf" style={{ width: `${selectedClient.prog}%`, background: "linear-gradient(90deg,var(--mg),var(--or))" }} /></div><span className="goal-pct" style={{ color: progColor(selectedClient.prog) }}>{selectedClient.prog}%</span></div>
                      </div>
                    </div>
                    <div className="goal-row">
                      <div className="goal-ico">{"\u{1F9D8}"}</div>
                      <div style={{ flex: 1 }}>
                        <div className="goal-ttl">Calm Zone Practice</div>
                        <div className="goal-desc">Daily breathing; PMR 3x/week target</div>
                        <div className="goal-prog"><div className="pb" style={{ flex: 1 }}><div className="pbf" style={{ width: "81%", background: "linear-gradient(90deg,var(--cy),var(--in))" }} /></div><span className="goal-pct" style={{ color: "var(--cy)" }}>81%</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u2726"} AI Insight</div><span className="tag purple">Live</span></div>
                  <div style={{ padding: 12 }}>
                    <div className="insight">
                      <div className="ins-hdr"><div className="ins-orb">{"\u2726"}</div><div><div className="ins-lbl">{insightLoading ? "Analyzing..." : "AI Clinical Insight"}</div><div className="ins-nm" style={{ fontSize: 12 }}>{selectedClient.name} {"\u2014"} Today</div></div></div>
                      <div className="ins-txt">
                        {insightLoading ? <div className="ai-dots"><span /><span /><span /></div> : clientInsight}
                      </div>
                      {!insightLoading && (
                        <div className="ins-btns"><button type="button" className="ins-btn cta" onClick={() => setModal("msg")}>Message</button><button type="button" className="ins-btn" onClick={() => setModal("note")}>Add Note</button></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="cd-2col">
                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u2694\uFE0F"} Assigned Quests</div><button type="button" className="p-act" onClick={() => setModal("assign")}>+ Assign</button></div>
                  <div style={{ padding: 10 }}>
                    <div className="qac assigned"><div className="qac-emj">{"\u{1F3E2}"}</div><div><div className="qac-nm">Ask for Help at Work</div><div className="qac-desc">Due: Today</div></div><span className="tag amber">In Progress</span></div>
                    <div className="qac assigned"><div className="qac-emj">{"\u{1F32C}\uFE0F"}</div><div><div className="qac-nm">Box Breathing</div><div className="qac-desc">Completed 4x this week</div></div><span className="tag green">Done {"\u2713"}</span></div>
                    <div className="qac"><div className="qac-emj">{"\u{1F4AD}"}</div><div><div className="qac-nm">Flip a Sneaky Thought</div><div className="qac-desc">Due: Tomorrow</div></div><span className="tag red">Missed</span></div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u{1F4DC}"} Session Timeline</div></div>
                  <div className="tl">
                    <div className="tl-item"><div className="tl-dot" style={{ background: "var(--mg)" }} /><div className="tl-date">Today</div><div className="tl-txt"><div className="tl-type" style={{ color: "var(--mg)" }}>MOOD ALERT</div>Logged &quot;SAD&quot; mood check-in. Sparky provided support. AI alert sent to therapist.</div></div>
                    <div className="tl-item"><div className="tl-dot" style={{ background: "var(--cy)" }} /><div className="tl-date">3 days ago</div><div className="tl-txt"><div className="tl-type" style={{ color: "var(--cy)" }}>CALM SESSION</div>Completed 3 rounds box breathing in Ocean Deep World. Duration: 8 mins.</div></div>
                    <div className="tl-item"><div className="tl-dot" /><div className="tl-date">5 days ago</div><div className="tl-txt"><div className="tl-type" style={{ color: "var(--li)" }}>QUEST COMPLETE</div>Completed &quot;Ask for Help at Work&quot; {"\u2014"} scored 3/3. AI feedback delivered. +50 Stars.</div></div>
                    <div className="tl-item"><div className="tl-dot" style={{ background: "var(--am)" }} /><div className="tl-date">1 week ago</div><div className="tl-txt"><div className="tl-type" style={{ color: "var(--am)" }}>SESSION NOTE</div>Dr. Ram{"\u00ED"}rez: Good engagement. Avoidance on real-world transfer. Continue Stage 1.</div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ALERTS VIEW */}
          {view === "alerts" && (
            <div className="t-view active">
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, marginBottom: 14 }}>Alerts & Flags</div>
              <div className="alert-c"><div className="al-ico">{"\u{1F614}"}</div><div><div className="al-ttl">Marcus W. {"\u2014"} 3x Consecutive SAD Mood</div><div className="al-txt">Auto-detected by Pulse AI. Last therapist note: 4 days ago. Quest completion: 20%. Recommend check-in today.</div></div><button type="button" className="al-act" onClick={() => openClient("marcus")}>Open Profile {"\u2192"}</button></div>
              <div className="alert-c warn"><div className="al-ico">{"\u{1F4C9}"}</div><div><div className="al-ttl">Jordan K. {"\u2014"} Skipped 2 Assigned Quests</div><div className="al-txt">Normally 90%+ completion. Both Speak Up quests skipped this week. Possible regression or external stressor.</div></div><button type="button" className="al-act" style={{ background: "rgba(255,184,0,.12)", borderColor: "rgba(255,184,0,.2)", color: "var(--am)" }}>Investigate {"\u2192"}</button></div>
              <div className="alert-c good"><div className="al-ico">{"\u{1F525}"}</div><div><div className="al-ttl">Riley M. {"\u2014"} 7 Day Streak Milestone!</div><div className="al-txt">Riley hit their first 7-day streak! A great moment to send encouragement and review progress.</div></div><button type="button" className="al-act" onClick={() => setModal("msg")}>Celebrate! {"\u2192"}</button></div>
              <div className="alert-c info"><div className="al-ico">{"\u{1F30E}"}</div><div><div className="al-ttl">Jordan K. {"\u2014"} 5th Real Life Transfer!</div><div className="al-txt">Jordan confirmed using a skill in real life for the 5th time this month {"\u2014"} a new record. Stage 2 advancement recommended.</div></div><button type="button" className="al-act" style={{ background: "rgba(0,212,255,.1)", borderColor: "rgba(0,212,255,.2)", color: "var(--cy)" }}>Review Plan {"\u2192"}</button></div>

              <div className="panel" style={{ marginTop: 4 }}>
                <div className="panel-hdr"><div className="panel-ttl">{"\u{1F916}"} Alert Rules {"\u2014"} AI Monitoring</div><button type="button" className="p-act">Customize</button></div>
                <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    "\u{1F614} Alert when client logs SAD mood 3+ days in a row",
                    "\u{1F4C9} Alert when quest completion drops below 30%",
                    "\u{1F514} Alert when client hasn\u2019t opened app in 5+ days",
                    "\u{1F30E} Celebrate every real-life skill transfer",
                    "\u26A0\uFE0F Crisis keyword detection in Sparky chat",
                    "\u{1F525} Notify on streak milestones (7, 14, 30 days)",
                  ].map((rule) => (
                    <div key={rule} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "rgba(255,255,255,.03)", borderRadius: 9, fontSize: 11 }}>{rule}<span className="tag green">Active</span></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LIVE MONITOR VIEW */}
          {view === "live" && (
            <div className="t-view active">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18 }}>Live Monitor</div>
                <span className="tag live">{"\u25CF"} 8 clients active now</span>
              </div>
              <div className="insight" style={{ marginBottom: 16 }}>
                <div className="ins-hdr"><div className="ins-orb">{"\u2726"}</div><div><div className="ins-lbl">Real-Time Overview</div><div className="ins-nm">5 in Chat Worlds {"\u00B7"} 2 in Calm Zone {"\u00B7"} 1 completing quest</div></div></div>
                <div className="ins-txt">No crisis flags active. Sparky has had 3 conversations in the last hour. Marcus started a breathing session 4 minutes ago {"\u2014"} positive signal after mood dip.</div>
              </div>
              <div className="two-col">
                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u{1F30A}"} Ocean Deep World</div><span className="tag blue">3 clients</span></div>
                  <div style={{ padding: 10 }}>
                    <div className="sess-card"><div className="sess-av">{"\u{1F98B}"}</div><div><div className="sess-nm">Jordan K.</div><div className="sess-loc">Chatting + completing quests</div></div><div className="sess-right"><div className="sess-time">22 min</div><div className="sess-mood">{"\u{1F60A}"}</div></div></div>
                    <div className="sess-card"><div className="sess-av">{"\u{1F9D9}"}</div><div><div className="sess-nm">Riley M.</div><div className="sess-loc">In chat room</div></div><div className="sess-right"><div className="sess-time">8 min</div><div className="sess-mood">{"\u{1F610}"}</div></div></div>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u2615"} Cozy Cafe World</div><span className="tag amber">2 clients</span></div>
                  <div style={{ padding: 10 }}>
                    <div className="sess-card"><div className="sess-av">{"\u{1F9B8}"}</div><div><div className="sess-nm">Alex T.</div><div className="sess-loc">Just completed a quest! {"\u{1F389}"}</div></div><div className="sess-right"><div className="sess-time">35 min</div><div className="sess-mood">{"\u{1F604}"}</div></div></div>
                  </div>
                </div>
              </div>
              <div className="two-col">
                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u2601\uFE0F"} Calm Zone {"\u2014"} Active Sessions</div><span className="tag purple">2 active</span></div>
                  <div style={{ padding: 10 }}>
                    <div className="sess-card" style={{ borderColor: "rgba(91,47,232,.2)" }}><div className="sess-av">{"\u{1F9D1}\u200D\u{1F680}"}</div><div><div className="sess-nm">Marcus W.</div><div className="sess-loc">Box Breathing {"\u2014"} Round 3 {"\u2726"} Good sign!</div></div><div className="sess-right"><div className="sess-time">4 min</div><div className="sess-mood">{"\u{1F60C}"}</div></div></div>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{"\u{1F98A}"} Sparky Chat {"\u2014"} Active</div><span className="tag green">3 this hour</span></div>
                  <div style={{ padding: 10 }}>
                    <div className="sess-card"><div className="sess-av" style={{ fontSize: 17 }}>{"\u{1F916}"}</div><div><div className="sess-nm">Sam L. + Sparky</div><div className="sess-loc">Talking about feeling nervous at school</div></div><div className="sess-right"><div className="sess-time">Live</div><div className="sess-mood">{"\u{1F630}"}</div></div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES VIEW */}
          {view === "messages" && (
            <div className="t-view active">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18 }}>Messages</div>
                <span className="tag red">5 unread</span>
                <button type="button" className="tb-btn primary" style={{ marginLeft: "auto" }} onClick={() => setModal("msg")}>{"\u2709\uFE0F"} New Message</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
                <div className="panel" style={{ maxHeight: 580, overflowY: "auto" }}>
                  <div className="panel-hdr"><div className="panel-ttl">Inbox</div></div>
                  <div className="msg-item unread"><div className="msg-dot" /><div className="msg-av" style={{ background: "rgba(255,107,0,.15)" }}>{"\u{1F9D1}\u200D\u{1F680}"}</div><div style={{ flex: 1 }}><div className="msg-nm">Marcus W. <span style={{ fontSize: 9, color: "var(--mt)" }}>via Sparky</span></div><div className="msg-prev">I feel really sad right now. I didn&apos;t do my quests...</div></div><div className="msg-time">2h ago</div></div>
                  <div className="msg-item unread"><div className="msg-dot" /><div className="msg-av" style={{ background: "rgba(126,211,33,.1)" }}>{"\u{1F98B}"}</div><div style={{ flex: 1 }}><div className="msg-nm">Jordan K.</div><div className="msg-prev">I did it in real life!! Asked my boss for help today! {"\u{1F389}"}</div></div><div className="msg-time">4h ago</div></div>
                  <div className="msg-item unread"><div className="msg-dot" /><div className="msg-av" style={{ background: "rgba(91,47,232,.15)" }}>{"\u2726"}</div><div style={{ flex: 1 }}><div className="msg-nm">Pulse AI <span className="tag purple" style={{ fontSize: 7 }}>ALERT</span></div><div className="msg-prev">Marcus logged SAD mood 3x in a row</div></div><div className="msg-time">3h ago</div></div>
                  <div className="msg-item"><div className="msg-av" style={{ background: "rgba(0,212,255,.1)", marginLeft: 14 }}>{"\u{1F9D9}"}</div><div style={{ flex: 1 }}><div className="msg-nm">Riley M.</div><div className="msg-prev">Can we change my session time next week?</div></div><div className="msg-time">1d ago</div></div>
                </div>
                <div className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">Marcus Williams {"\u2014"} Sparky Chat Log</div><div style={{ display: "flex", gap: 6 }}><span className="tag red">Mood: SAD</span><button type="button" className="p-act" onClick={() => setModal("msg")}>Reply</button></div></div>
                  <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
                    <div style={{ fontSize: 9, textAlign: "center", color: "rgba(255,255,255,.2)" }}>Today 10:22 AM {"\u2014"} Sparky Chat Session</div>
                    <div className="aip-msg ai"><div className="aip-msg-hdr">{"\u{1F98A}"} SPARKY</div>Hey!! I&apos;m SO happy you&apos;re here! What do you need today?</div>
                    <div className="aip-msg user">I feel really sad right now {"\u{1F614}"}</div>
                    <div className="aip-msg ai"><div className="aip-msg-hdr">{"\u{1F98A}"} SPARKY</div>I&apos;m really sorry you&apos;re feeling sad. That&apos;s totally okay to feel. I&apos;m right here with you {"\u{1F49B}"} Do you want to talk about what&apos;s making you sad, or do something calming together?</div>
                    <div className="aip-msg user">nothing feels good lately. i missed all my quests this week</div>
                    <div className="aip-msg ai"><div className="aip-msg-hdr">{"\u{1F98A}"} SPARKY</div>Missing quests doesn&apos;t make you a bad person {"\u2014"} it just means this week was hard. And hard weeks happen to EVERYONE {"\u{1F499}"} You reached out today {"\u2014"} and that&apos;s brave! Want to try one tiny calm exercise together?</div>
                    <div style={{ background: "rgba(255,45,120,.07)", border: "1px solid rgba(255,45,120,.2)", borderRadius: 9, padding: 9, fontSize: 10, color: "var(--mt)" }}>
                      <strong style={{ color: "var(--mg)" }}>{"\u26A0\uFE0F"} AI Flag:</strong> Client expressed persistent sadness + low motivation. Mood alert sent to therapist. No crisis keywords detected. Recommend therapist follow-up within 24h.
                    </div>
                  </div>
                  <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,.05)" }}>
                    <div style={{ fontSize: 10, color: "var(--mt)", fontWeight: 800, marginBottom: 7, letterSpacing: ".5px" }}>{"\u2726"} AI Suggested Responses:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 9 }}>
                      <button type="button" className="aip-chip" onClick={() => draftReply("check-in")}>Send warm check-in</button>
                      <button type="button" className="aip-chip" onClick={() => draftReply("quest")}>Assign easier quest today</button>
                      <button type="button" className="aip-chip" onClick={() => draftReply("session")}>Schedule a session</button>
                      <button type="button" className="aip-chip" onClick={() => draftReply("adjust")}>Reduce quest difficulty</button>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input className="f-inp" placeholder="Write a message to Marcus via Sparky..." style={{ fontSize: 11 }} value={therapistReply} onChange={(e) => setTherapistReply(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { showToast("Message sent to Marcus via Sparky \u2713"); setTherapistReply(""); } }} />
                      <button type="button" className="aip-send" onClick={() => { showToast("Message sent to Marcus via Sparky \u2713"); setTherapistReply(""); }}>{"\u27A4"}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QUEST LIBRARY VIEW */}
          {view === "quests" && (
            <div className="t-view active">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18 }}>Quest Library</div>
                <span className="tag purple">28 quests</span>
                <button type="button" className="tb-btn primary" style={{ marginLeft: "auto" }} onClick={() => setModal("addQuest")}>+ Create Quest</button>
              </div>
              <div className="three-col">
                {[
                  { title: "\u{1F5E3}\uFE0F Speak Up", color: "var(--mg)", borderColor: "rgba(255,45,120,.15)", count: "8 quests", countTag: "red", items: [
                    { emj: "\u{1F3E2}", nm: "Ask for Help at Work", desc: "7 clients assigned", assigned: true },
                    { emj: "\u{1F37D}\uFE0F", nm: "Order at a Restaurant", desc: "Self-advocacy in public" },
                    { emj: "\u{1F469}\u200D\u2695\uFE0F", nm: "Talk to a Doctor", desc: "Medical self-advocacy" },
                    { emj: "\u{1F68C}", nm: "Ask for Bus Help", desc: "Public transport" },
                  ]},
                  { title: "\u{1F4AD} Think It", color: "var(--pu)", borderColor: "rgba(168,85,247,.15)", count: "7 quests", countTag: "purple", items: [
                    { emj: "\u{1F9E0}", nm: "Flip a Sneaky Thought", desc: "5 clients assigned", assigned: true },
                    { emj: "\u{1F4D4}", nm: "Worry Journal", desc: "Written thought tracking" },
                    { emj: "\u{1F324}\uFE0F", nm: "Silver Lining Finder", desc: "Positive reframing" },
                    { emj: "\u{1F3AD}", nm: "Feeling Name Game", desc: "Emotion identification" },
                  ]},
                  { title: "\u2601\uFE0F Calm Zone", color: "var(--cy)", borderColor: "rgba(0,212,255,.15)", count: "6 quests", countTag: "blue", items: [
                    { emj: "\u{1F32C}\uFE0F", nm: "Box Breathing (5 rounds)", desc: "9 clients assigned", assigned: true },
                    { emj: "\u{1F4AA}", nm: "Body Relax (PMR)", desc: "Progressive muscle relax" },
                    { emj: "\u{1F343}", nm: "Worry Float", desc: "Mindful worry release" },
                    { emj: "\u{1F30A}", nm: "5-4-3-2-1 Grounding", desc: "Sensory grounding" },
                  ]},
                ].map((col) => (
                  <div key={col.title} className="panel">
                    <div className="panel-hdr" style={{ borderBottomColor: col.borderColor }}><div className="panel-ttl" style={{ color: col.color }}>{col.title}</div><span className={`tag ${col.countTag}`}>{col.count}</span></div>
                    <div style={{ padding: 10 }}>
                      {col.items.map((item) => (
                        <div key={item.nm} className={`qac ${item.assigned ? "assigned" : ""}`}>
                          <div className="qac-emj">{item.emj}</div>
                          <div><div className="qac-nm">{item.nm}</div><div className="qac-desc">{item.desc}</div></div>
                          {item.assigned ? <span className="tag green">Active</span> : <div className="qac-acts"><button type="button" className="assign-btn" onClick={() => setModal("assign")}>Assign</button></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TREATMENT PLANS VIEW */}
          {view === "plans" && (
            <div className="t-view active">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18 }}>Treatment Plans</div>
                <button type="button" className="tb-btn primary" style={{ marginLeft: "auto" }} onClick={() => setModal("addPlan")}>+ New Plan</button>
              </div>
              {[
                { name: "Marcus Williams", stage: "Stage 1", stageTag: "amber", summary: "Marcus (22) presents with mild ID, comorbid anxiety. Primary goals: self-advocacy at work/community, emotional regulation, reducing avoidance. Adapted CBT with gamified reinforcement via Pulse app. Weekly session + 5x/week app-based quests.", summaryBg: "rgba(91,47,232,.1)", summaryBorder: "rgba(91,47,232,.15)", summaryLeft: "var(--in)", goals: [
                  { ico: "\u{1F5E3}\uFE0F", ttl: "Goal 1: Self-Advocacy (Speak Up)", desc: "Practice asking for help in work, community, and medical contexts. Target: 3x per week in app + 1x real-world transfer per month.", pct: 68, grad: "var(--mg),var(--or)", color: "var(--mg)", label: "68% \u2014 Stage 1" },
                  { ico: "\u{1F4AD}", ttl: "Goal 2: Thought Flipping (Cognitive Reframing)", desc: "Identify and challenge automatic negative thoughts. Complete \"Flip a Sneaky Thought\" 2x per week.", pct: 45, grad: "var(--in),var(--pu)", color: "var(--pu)", label: "45% \u2014 Building" },
                  { ico: "\u{1F9D8}", ttl: "Goal 3: Anxiety Regulation (Calm Zone)", desc: "Daily breathing practice. PMR 3x/week. Target: client self-initiates calm practice without prompting within 60 days.", pct: 81, grad: "var(--cy),var(--in)", color: "var(--cy)", label: "81% \u2014 Strong" },
                ], weekQuests: [{ t: "\u2705 Ask for Help at Work", c: "green" }, { t: "\u2705 Box Breathing", c: "green" }, { t: "\u23F3 Flip a Sneaky Thought", c: "amber" }, { t: "\u274C Real Life Transfer", c: "red" }] },
              ].map((plan) => (
                <div key={plan.name} className="panel">
                  <div className="panel-hdr"><div className="panel-ttl">{plan.name} {"\u2014"} Active Plan</div><div style={{ display: "flex", gap: 6 }}><span className={`tag ${plan.stageTag}`}>{plan.stage}</span><button type="button" className="p-act" onClick={() => setModal("addPlan")}>Edit</button></div></div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 11, color: "var(--mt)", lineHeight: 1.6, background: plan.summaryBg, border: `1px solid ${plan.summaryBorder}`, borderRadius: 10, padding: 12, marginBottom: 14, borderLeft: `3px solid ${plan.summaryLeft}` }}>
                      <strong style={{ color: "#fff" }}>Clinical Summary:</strong> {plan.summary}
                    </div>
                    {plan.goals.map((g) => (
                      <div key={g.ttl} className="goal-row">
                        <div className="goal-ico">{g.ico}</div>
                        <div style={{ flex: 1 }}>
                          <div className="goal-ttl">{g.ttl}</div>
                          <div className="goal-desc">{g.desc}</div>
                          <div className="goal-prog"><div className="pb" style={{ flex: 1 }}><div className="pbf" style={{ width: `${g.pct}%`, background: `linear-gradient(90deg,${g.grad})` }} /></div><span className="goal-pct" style={{ color: g.color }}>{g.label}</span></div>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.05)" }}>
                      <div style={{ fontSize: 10, color: "var(--mt)", fontWeight: 900, marginBottom: 7, letterSpacing: ".5px" }}>THIS WEEK&apos;S QUESTS</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {plan.weekQuests.map((q) => <span key={q.t} className={`tag ${q.c}`}>{q.t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* WILD ZONE / CREATURES VIEW */}
          {view === "creatures" && (
            <div className="t-view active">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18 }}>{"\u{1F43E}"} Wild Zone Creatures</div>
                <span className="tag green">{creatures.length} active</span>
                <button type="button" className="tb-btn primary" style={{ marginLeft: "auto" }} onClick={() => setModal("addCreature")}>+ Add Creature</button>
              </div>

              <div className="insight" style={{ marginBottom: 16 }}>
                <div className="ins-hdr"><div className="ins-orb">{"\u{1F33F}"}</div><div><div className="ins-lbl">Real-Time Sync</div><div className="ins-nm">Creatures you add or remove appear instantly in client AR worlds</div></div></div>
                <div className="ins-txt">Each creature teaches a therapeutic skill through a practice question. Clients catch creatures in the Wild Zone to practice skills like breathing, thought flipping, and self-advocacy.</div>
              </div>

              {creaturesLoading ? (
                <div className="panel" style={{ padding: 30, textAlign: "center" }}>
                  <div className="ai-dots" style={{ justifyContent: "center" }}><span /><span /><span /></div>
                  <div style={{ fontSize: 11, color: "var(--mt)", marginTop: 8 }}>Loading creatures from Supabase...</div>
                </div>
              ) : !supabase ? (
                <div className="alert-c warn">
                  <div className="al-ico">{"\u26A0\uFE0F"}</div>
                  <div><div className="al-ttl">Supabase Not Connected</div><div className="al-txt">Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables to manage Wild Zone creatures.</div></div>
                </div>
              ) : creatures.length === 0 ? (
                <div className="panel" style={{ padding: 30, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{"\u{1F43E}"}</div>
                  <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, marginBottom: 4 }}>No creatures yet</div>
                  <div style={{ fontSize: 11, color: "var(--mt)", marginBottom: 14 }}>Add your first creature and it will appear in your clients{"\u2019"} Wild Zone instantly.</div>
                  <button type="button" className="tb-btn primary" onClick={() => setModal("addCreature")}>+ Add First Creature</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                  {creatures.map((cr) => (
                    <div key={cr.id} className="panel" style={{ marginBottom: 0 }}>
                      <div className="panel-hdr" style={{ borderBottomColor: `${cr.color}33` }}>
                        <div style={{ fontSize: 26, flexShrink: 0 }}>{cr.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div className="panel-ttl" style={{ color: cr.color }}>{cr.name}</div>
                          <div style={{ fontSize: 9, color: "var(--mt)", marginTop: 1 }}>{cr.skill}</div>
                        </div>
                        {cr.badge && <span className="tag green">Badge</span>}
                      </div>
                      <div style={{ padding: 12 }}>
                        <div style={{ fontSize: 10, color: "var(--mt)", marginBottom: 6, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase" }}>Context</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", marginBottom: 10, lineHeight: 1.5 }}>{cr.context}</div>

                        <div style={{ fontSize: 10, color: "var(--mt)", marginBottom: 6, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase" }}>Practice Question</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", marginBottom: 10, lineHeight: 1.5 }}>{cr.practice_question}</div>

                        <div style={{ fontSize: 10, color: "var(--mt)", marginBottom: 6, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase" }}>Choices</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                          {(Array.isArray(cr.choices) ? cr.choices : []).map((ch, i) => (
                            <div key={i} style={{
                              fontSize: 10, padding: "5px 9px", borderRadius: 8,
                              background: ch.c ? "rgba(126,211,33,.1)" : "rgba(255,255,255,.03)",
                              border: `1px solid ${ch.c ? "rgba(126,211,33,.25)" : "rgba(255,255,255,.06)"}`,
                              color: ch.c ? "var(--li)" : "rgba(255,255,255,.6)",
                            }}>
                              {ch.c ? "\u2713 " : ""}{ch.t}
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", gap: 6 }}>
                          <div style={{ width: 14, height: 14, borderRadius: 4, background: cr.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, color: "var(--mt)" }}>{cr.color}</span>
                          <button
                            type="button"
                            style={{
                              marginLeft: "auto", background: "rgba(255,45,120,.1)", border: "1px solid rgba(255,45,120,.25)",
                              borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 800, color: "var(--mg)",
                              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                            }}
                            onClick={() => removeCreature(cr.id)}
                          >
                            {"\u{1F5D1}"} Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REPORTS VIEW */}
          {view === "reports" && (
            <div className="t-view active">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18 }}>Reports & Analytics</div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <button type="button" className="tb-btn">{"\u2726"} Generate AI Report</button>
                  <button type="button" className="tb-btn primary">{"\u2193"} Export PDF</button>
                </div>
              </div>
              <div className="metrics">
                <div className="metric" style={{ "--mc": "var(--li)" } as React.CSSProperties}><div className="m-val" style={{ color: "var(--li)" }}>89</div><div className="m-lbl">Quests Completed</div><div className="m-chg up">{"\u2191"} 23 this week</div></div>
                <div className="metric" style={{ "--mc": "var(--cy)" } as React.CSSProperties}><div className="m-val" style={{ color: "var(--cy)" }}>47</div><div className="m-lbl">Calm Sessions</div><div className="m-chg up">{"\u2191"} 12% avg/client</div></div>
                <div className="metric" style={{ "--mc": "var(--am)" } as React.CSSProperties}><div className="m-val" style={{ color: "var(--am)" }}>18</div><div className="m-lbl">Real Life Transfers</div><div className="m-chg up">{"\u2191"} 6 this month</div></div>
                <div className="metric" style={{ "--mc": "var(--pu)" } as React.CSSProperties}><div className="m-val" style={{ color: "var(--pu)" }}>31</div><div className="m-lbl">Creatures Caught</div><div className="m-chg up">{"\u2191"} All-time high</div></div>
              </div>
              <div className="panel">
                <div className="panel-hdr"><div className="panel-ttl">{"\u{1F4CB}"} Individual Client Summary</div></div>
                <table className="ctable">
                  <thead><tr><th>Client</th><th>Quests Done</th><th>Streak</th><th>Creatures</th><th>Calm Sessions</th><th>Real Life</th><th>Trend</th></tr></thead>
                  <tbody>
                    {CLIENTS.slice(0, 3).map((c) => (
                      <tr key={c.id}>
                        <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="c-av" style={{ background: c.bg }}>{c.av}</div><div><div className="c-nm">{c.name}</div><div className="c-sub">{c.age} {"\u00B7"} {c.goal}</div></div></div></td>
                        <td style={{ fontWeight: 700 }}>{c.quests}</td>
                        <td style={{ color: streakColor(c.streak) }}>{c.streak}d {c.streak >= 7 ? "\u2191" : "\u2193"}</td>
                        <td>{c.critters}</td>
                        <td style={{ color: "var(--cy)" }}>{c.calm}</td>
                        <td style={{ color: "var(--am)" }}>{c.real}</td>
                        <td>{c.status === "at-risk" ? <span className="tag red">{"\u2193"} Declining</span> : c.streak >= 7 ? <span className="tag green">{"\u2191"} Thriving</span> : <span className="tag amber">{"\u2192"} Stable</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI ASSISTANT PANEL */}
      <div className="ai-panel">
        <div className="aip-hdr">
          <div className="aip-orb">{"\u2726"}</div>
          <div><div className="aip-ttl">Pulse AI</div><div className="aip-sub">Your clinical co-pilot</div></div>
        </div>
        <div className="aip-msgs" ref={aiMsgsRef}>
          {aiMessages.map((msg, i) => (
            <div key={i} className={`aip-msg ${msg.role}`}>
              {msg.role === "ai" && <div className="aip-msg-hdr">{"\u2726"} PULSE AI</div>}
              {msg.text}
            </div>
          ))}
          {aiLoading && (
            <div className="aip-msg ai"><div className="aip-msg-hdr">{"\u2726"} PULSE AI</div><div className="ai-dots"><span /><span /><span /></div></div>
          )}
        </div>
        <div className="aip-chips">
          {["Who needs attention today?", "Summarize Marcus's week", "Suggest quests for Jordan", "Draft a check-in message", "Group progress this week"].map((chip) => (
            <button key={chip} type="button" className="aip-chip" onClick={() => sendAI(chip)}>{chip}</button>
          ))}
        </div>
        <div className="aip-bar">
          <input className="aip-inp" placeholder="Ask Pulse AI anything..." value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendAI()} />
          <button type="button" className="aip-send" onClick={() => sendAI()}>{"\u27A4"}</button>
        </div>
      </div>

      {/* MODALS */}
      {modal === "addClient" && (
        <div className="t-overlay show" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-ttl">Add New Client</div>
            <div className="modal-sub">Create a client profile in the Pulse ecosystem. They&apos;ll receive an app invite and their quests will sync instantly.</div>
            <div className="f-2col"><div className="f-row"><label className="f-lbl">First Name</label><input className="f-inp" placeholder="e.g. Marcus" /></div><div className="f-row"><label className="f-lbl">Last Name</label><input className="f-inp" placeholder="e.g. Williams" /></div></div>
            <div className="f-2col"><div className="f-row"><label className="f-lbl">Age</label><input className="f-inp" type="number" placeholder="22" /></div><div className="f-row"><label className="f-lbl">Pronouns</label><select className="f-sel"><option>He/Him</option><option>She/Her</option><option>They/Them</option></select></div></div>
            <div className="f-row"><label className="f-lbl">Clinical Notes / Diagnosis</label><textarea className="f-ta" placeholder="e.g. Mild intellectual disability, comorbid anxiety..." /></div>
            <div className="f-row"><label className="f-lbl">Primary Treatment Goal</label><select className="f-sel"><option>Self-Advocacy (Speak Up)</option><option>Cognitive Reframing (Think It)</option><option>Anxiety Regulation (Calm Zone)</option><option>Social Integration</option><option>Vocational Readiness</option></select></div>
            <div className="modal-foot"><button type="button" className="modal-btn cancel" onClick={() => setModal(null)}>Cancel</button><button type="button" className="modal-btn save" onClick={() => { showToast("Client profile created! App invite sent. \u2713"); setModal(null); }}>Create Profile {"\u2713"}</button></div>
          </div>
        </div>
      )}

      {modal === "note" && (
        <div className="t-overlay show" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-ttl">Add Clinical Note</div>
            <div className="modal-sub">Notes are stored securely in the client&apos;s timeline and can be reviewed alongside AI-generated insights.</div>
            <div className="f-row"><label className="f-lbl">Client</label><select className="f-sel"><option>Marcus Williams</option><option>Jordan Kim</option><option>Riley Morris</option></select></div>
            <div className="f-row"><label className="f-lbl">Note Type</label><select className="f-sel"><option>Session Note</option><option>Progress Update</option><option>Plan Adjustment</option><option>Alert / Concern</option><option>Milestone / Win {"\u{1F389}"}</option></select></div>
            <div className="f-row"><label className="f-lbl">Note</label><textarea className="f-ta" style={{ minHeight: 110 }} placeholder="e.g. Marcus showed strong engagement with Speak Up scenarios but continues to avoid real-world transfer tasks..." /></div>
            <div className="modal-foot"><button type="button" className="modal-btn cancel" onClick={() => setModal(null)}>Cancel</button><button type="button" className="modal-btn save" onClick={() => { showToast("Note saved to client timeline \u2713"); setModal(null); }}>Save Note {"\u2713"}</button></div>
          </div>
        </div>
      )}

      {modal === "msg" && (
        <div className="t-overlay show" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-ttl">Send Message</div>
            <div className="modal-sub">Messages are delivered through Sparky in the client&apos;s app {"\u2014"} warm, in-world, and non-clinical feeling.</div>
            <div className="f-row"><label className="f-lbl">To</label><select className="f-sel"><option>Marcus Williams</option><option>Jordan Kim</option><option>Riley Morris</option><option>All Clients</option></select></div>
            <div className="f-row"><label className="f-lbl">Message</label><textarea className="f-ta" style={{ minHeight: 90 }} placeholder="Write a message..." /></div>
            <div className="modal-foot"><button type="button" className="modal-btn cancel" onClick={() => setModal(null)}>Cancel</button><button type="button" className="modal-btn save" onClick={() => { showToast("Message sent via Sparky! Client will see it in-app \u2713"); setModal(null); }}>Send Message {"\u2713"}</button></div>
          </div>
        </div>
      )}

      {modal === "assign" && (
        <div className="t-overlay show" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-ttl">Assign Quest</div>
            <div className="modal-sub">Assigned quests appear in the client&apos;s Pulse app immediately and show as priority items.</div>
            <div className="f-row"><label className="f-lbl">Select Client(s)</label><div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 5 }}><label className="f-check"><input type="checkbox" defaultChecked /> Marcus Williams</label><label className="f-check"><input type="checkbox" /> Jordan Kim</label><label className="f-check"><input type="checkbox" /> Riley Morris</label></div></div>
            <div className="modal-foot"><button type="button" className="modal-btn cancel" onClick={() => setModal(null)}>Cancel</button><button type="button" className="modal-btn save" onClick={() => { showToast("Quest assigned! Appearing in client app now \u2713"); setModal(null); }}>Assign Quest {"\u2713"}</button></div>
          </div>
        </div>
      )}

      {modal === "addQuest" && (
        <div className="t-overlay show" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-ttl">Create Custom Quest</div>
            <div className="modal-sub">Design a tailored skill scenario. Write at 6th grade reading level {"\u2014"} Pulse AI can help.</div>
            <div className="f-row"><label className="f-lbl">Quest Name</label><input className="f-inp" placeholder="e.g. Ask for Help at the Grocery Store" /></div>
            <div className="f-2col"><div className="f-row"><label className="f-lbl">Skill Area</label><select className="f-sel"><option>{"\u{1F5E3}\uFE0F"} Speak Up</option><option>{"\u{1F4AD}"} Think It</option><option>{"\u2601\uFE0F"} Calm Zone</option><option>{"\u{1F30E}"} Real World</option></select></div><div className="f-row"><label className="f-lbl">Star Reward</label><input className="f-inp" type="number" placeholder="50" /></div></div>
            <div className="f-row"><label className="f-lbl">Scenario</label><textarea className="f-ta" placeholder="You are at the grocery store and you can't find the bread. There's a store worker nearby..." /></div>
            <div className="modal-foot"><button type="button" className="modal-btn cancel" onClick={() => setModal(null)}>Cancel</button><button type="button" className="modal-btn save" onClick={() => { showToast("Custom quest added to library! \u2713"); setModal(null); }}>Create Quest {"\u2713"}</button></div>
          </div>
        </div>
      )}

      {modal === "addPlan" && (
        <div className="t-overlay show" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-ttl">Treatment Plan</div>
            <div className="modal-sub">Define client goals, app structure, and stage. Plans sync to the client&apos;s Pulse world in real time.</div>
            <div className="f-row"><label className="f-lbl">Client</label><select className="f-sel"><option>Marcus Williams</option><option>Jordan Kim</option><option>Riley Morris</option></select></div>
            <div className="f-2col"><div className="f-row"><label className="f-lbl">Treatment Stage</label><select className="f-sel"><option>Stage 1 {"\u2014"} Skill Building</option><option>Stage 2 {"\u2014"} Transfer & Generalization</option><option>Stage 3 {"\u2014"} Independence</option></select></div><div className="f-row"><label className="f-lbl">Plan Review Date</label><input className="f-inp" type="date" /></div></div>
            <div className="f-row"><label className="f-lbl">Clinical Summary</label><textarea className="f-ta" placeholder="Presentation, primary challenges, treatment rationale..." /></div>
            <div className="f-row"><label className="f-lbl">Primary Goal</label><input className="f-inp" placeholder="e.g. Self-advocacy in work and community settings" /></div>
            <div className="modal-foot"><button type="button" className="modal-btn cancel" onClick={() => setModal(null)}>Cancel</button><button type="button" className="modal-btn save" onClick={() => { showToast("Treatment plan saved and synced to client app \u2713"); setModal(null); }}>Save Plan {"\u2713"}</button></div>
          </div>
        </div>
      )}

      {modal === "addCreature" && (
        <div className="t-overlay show" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-ttl">{"\u{1F43E}"} Add Wild Zone Creature</div>
            <div className="modal-sub">Create a therapeutic creature. It will appear in all clients&apos; Wild Zone AR world instantly via real-time sync.</div>
            <div className="f-2col">
              <div className="f-row"><label className="f-lbl">Creature Name</label><input className="f-inp" placeholder="e.g. Breathe Bear" value={newCreature.name} onChange={(e) => setNewCreature((s) => ({ ...s, name: e.target.value }))} /></div>
              <div className="f-row"><label className="f-lbl">Emoji</label><input className="f-inp" placeholder="e.g. 🐻‍❄️" value={newCreature.emoji} onChange={(e) => setNewCreature((s) => ({ ...s, emoji: e.target.value }))} /></div>
            </div>
            <div className="f-2col">
              <div className="f-row"><label className="f-lbl">Skill Area</label><input className="f-inp" placeholder="e.g. Breathing" value={newCreature.skill} onChange={(e) => setNewCreature((s) => ({ ...s, skill: e.target.value }))} /></div>
              <div className="f-row">
                <label className="f-lbl">Color</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                  {COLOR_PRESETS.map((c) => (
                    <button key={c.value} type="button" onClick={() => setNewCreature((s) => ({ ...s, color: c.value }))} style={{
                      width: 28, height: 28, borderRadius: 8, background: c.value, border: newCreature.color === c.value ? "2px solid #fff" : "2px solid transparent",
                      cursor: "pointer", transition: "all .15s",
                    }} title={c.label} />
                  ))}
                </div>
              </div>
            </div>
            <div className="f-row"><label className="f-lbl">Context / Situation</label><textarea className="f-ta" placeholder="e.g. Feeling really nervous right now?" value={newCreature.context} onChange={(e) => setNewCreature((s) => ({ ...s, context: e.target.value }))} /></div>
            <div className="f-row"><label className="f-lbl">Practice Question</label><textarea className="f-ta" placeholder="e.g. When you feel really nervous, what's a great first step?" value={newCreature.practice_question} onChange={(e) => setNewCreature((s) => ({ ...s, practice_question: e.target.value }))} /></div>

            <div style={{ fontSize: 10, fontWeight: 900, color: "var(--mt)", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 8 }}>Answer Choices (select the correct one)</div>
            {[0, 1, 2].map((i) => {
              const key = `choice${i + 1}` as "choice1" | "choice2" | "choice3";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <button
                    type="button"
                    onClick={() => setNewCreature((s) => ({ ...s, correctChoice: i }))}
                    style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: "pointer",
                      background: newCreature.correctChoice === i ? "var(--li)" : "rgba(255,255,255,.05)",
                      border: newCreature.correctChoice === i ? "2px solid var(--li)" : "2px solid rgba(255,255,255,.1)",
                      color: newCreature.correctChoice === i ? "#000" : "var(--mt)",
                      fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {newCreature.correctChoice === i ? "\u2713" : ""}
                  </button>
                  <input className="f-inp" style={{ marginBottom: 0 }} placeholder={`Choice ${i + 1}`} value={newCreature[key]} onChange={(e) => setNewCreature((s) => ({ ...s, [key]: e.target.value }))} />
                </div>
              );
            })}

            <div className="f-row" style={{ marginTop: 10 }}>
              <label className="f-check"><input type="checkbox" checked={newCreature.badge} onChange={(e) => setNewCreature((s) => ({ ...s, badge: e.target.checked }))} /> Show badge indicator (!) on creature</label>
            </div>

            <div className="modal-foot">
              <button type="button" className="modal-btn cancel" onClick={() => setModal(null)}>Cancel</button>
              <button type="button" className="modal-btn save" onClick={addCreature} disabled={!newCreature.name || !newCreature.emoji}>Add Creature {"\u2713"}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="t-toast">{toast}</div>}
    </div>
  );
}
