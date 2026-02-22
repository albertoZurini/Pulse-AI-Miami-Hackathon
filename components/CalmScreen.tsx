"use client";

import { useState, useRef, useEffect } from "react";

const BREATH_PHASES = [
  { w: "BREATHE IN", c: 4, i: "Breathe in slowly through your nose... 🌬️" },
  { w: "HOLD", c: 4, i: "Hold it... nice and still... 😌" },
  { w: "BREATHE OUT", c: 4, i: "Breathe out slowly through your mouth... 💨" },
  { w: "HOLD", c: 4, i: "Rest... you're doing great... 🌊" },
];

const LEAVE_EMOJIS = ["🍃", "🍂", "🍁", "🌿", "🌸"];
const PMR_STEPS = [
  "Squeeze your HANDS really tight... hold... NOW let go! 😌",
  "Tense your ARMS like a superhero... hold... NOW relax them! 💪",
  "Scrunch your FACE tight... hold... NOW let it go smooth! 😄",
];

export default function CalmScreen({
  onBack,
  onARWorld,
}: {
  onBack: () => void;
  onARWorld: () => void;
}) {
  const [calmTab, setCalmTab] = useState<"box" | "leaves" | "pmr">("box");
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathCount, setBreathCount] = useState(4);
  const [breathInstr, setBreathInstr] = useState("Tap the button to start breathing with me");
  const breathTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [leafInput, setLeafInput] = useState("");
  const leavesRenderedRef = useRef(false);
  const leavesContainerRef = useRef<HTMLDivElement>(null);

  const [pmrStep, setPmrStep] = useState(0);
  const pmrDone = pmrStep >= PMR_STEPS.length;

  useEffect(() => {
    if (!breathing) return;
    const p = BREATH_PHASES[breathPhase];
    setBreathInstr(p.i);
    const t = setTimeout(() => {
      if (breathCount <= 1) {
        const nextPhase = (breathPhase + 1) % 4;
        setBreathPhase(nextPhase);
        setBreathCount(BREATH_PHASES[nextPhase].c);
      } else {
        setBreathCount((c) => c - 1);
      }
    }, 1000);
    breathTimerRef.current = t;
    return () => {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, [breathing, breathPhase, breathCount]);

  const toggleBreath = () => {
    if (breathing) {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
      setBreathing(false);
      setBreathPhase(0);
      setBreathCount(4);
      setBreathInstr("Tap the button to start breathing with me");
    } else {
      setBreathing(true);
      setBreathPhase(0);
      setBreathCount(4);
    }
  };

  useEffect(() => {
    if (calmTab !== "leaves" || !leavesContainerRef.current || leavesRenderedRef.current) return;
    leavesRenderedRef.current = true;
    LEAVE_EMOJIS.forEach((e, i) => {
      const el = document.createElement("div");
      el.className = "leaf";
      el.textContent = e;
      el.style.cssText = `bottom:${60 + Math.random() * 40}px;animation-duration:${8 + Math.random() * 6}s;animation-delay:${-Math.random() * 14}s`;
      leavesContainerRef.current?.appendChild(el);
    });
  }, [calmTab]);

  const releaseLeaf = () => {
    const v = leafInput.trim();
    if (!v || !leavesContainerRef.current) return;
    setLeafInput("");
    const el = document.createElement("div");
    el.className = "leaf";
    el.style.cssText =
      "bottom:80px;font-size:14px;background:rgba(255,255,255,.15);padding:4px 8px;border-radius:10px;animation-duration:12s;color:white;font-weight:700";
    el.textContent = v.substring(0, 20) + "…";
    leavesContainerRef.current.appendChild(el);
    setTimeout(() => el.remove(), 13000);
  };

  const startPMR = () => {
    setPmrStep(0);
    const run = (i: number) => {
      if (i >= PMR_STEPS.length) return;
      setPmrStep(i);
      setTimeout(() => run(i + 1), 4000);
    };
    run(0);
  };

  const calmParticles = [];
  const colors = ["#00D4FF", "#A855F7", "#FF2D78", "#FFB800", "#7ED321"];
  for (let i = 0; i < 20; i++) {
    const size = Math.random() * 8 + 4;
    calmParticles.push(
      <div
        key={i}
        className="cp"
        style={{
          width: size,
          height: size,
          background: colors[Math.floor(Math.random() * colors.length)],
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 6 + 6}s`,
          animationDelay: `${Math.random() * 6}s`,
        }}
      />
    );
  }

  return (
    <>
      <div className="calm-particles">{calmParticles}</div>
      <div className="calm-header">
        <button type="button" className="q-back" onClick={onBack} style={{ background: "none", border: "none", color: "var(--muted)", fontFamily: "Nunito", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          ← My World
        </button>
        <div className="calm-title">☁️ Calm Time</div>
        <div className="calm-sub">This is your safe space. No rush here.</div>
      </div>
      <div className="calm-tabs">
        <button type="button" className={`calm-tab ${calmTab === "box" ? "active" : ""}`} onClick={() => setCalmTab("box")}>
          🫁 Box Breathing
        </button>
        <button type="button" className={`calm-tab ${calmTab === "leaves" ? "active" : ""}`} onClick={() => setCalmTab("leaves")}>
          🍃 Leaves on Stream
        </button>
        <button type="button" className={`calm-tab ${calmTab === "pmr" ? "active" : ""}`} onClick={() => setCalmTab("pmr")}>
          💪 Body Relax
        </button>
      </div>

      {calmTab === "box" && (
        <div id="calmBox" className="box-breath">
          <div className="box-wrap">
            <div className="box-outline">
              <div className="box-dot" />
              <div className="box-center">
                <div className="box-word">{breathing ? BREATH_PHASES[breathPhase].w : "READY?"}</div>
                <div className="box-count">{breathing ? breathCount : "▶"}</div>
              </div>
            </div>
          </div>
          <div className="breath-instruction" id="breathInstr">
            {breathInstr}
          </div>
          <button type="button" className="breath-start-btn" onClick={toggleBreath}>
            {breathing ? "Stop" : "Start Breathing 🌊"}
          </button>
        </div>
      )}

      {calmTab === "leaves" && (
        <div id="calmLeaves" className={`leaves-scene ${calmTab === "leaves" ? "active" : ""}`} ref={leavesContainerRef}>
          <div className="leaf-input-area">
            <div className="leaf-title">🍃 Put It on a Leaf</div>
            <div className="leaf-desc">
              Think of a worry or bad feeling. Type it below. Then watch it float away on the stream.
            </div>
            <input
              className="leaf-input"
              placeholder="My worry is..."
              value={leafInput}
              onChange={(e) => setLeafInput(e.target.value)}
            />
            <button type="button" className="leaf-btn" onClick={releaseLeaf}>
              Let it Float Away 🍃
            </button>
          </div>
          <div className="stream" />
        </div>
      )}

      {calmTab === "pmr" && (
        <div
          id="calmPmr"
          style={{
            display: "flex",
            padding: 20,
            textAlign: "center",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 56 }}>💪</div>
          <div style={{ fontFamily: "Fredoka One", fontSize: 22 }}>Body Relax</div>
          <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
            {pmrDone
              ? "Great job! Your whole body is relaxed now. 🌟 You did it!"
              : PMR_STEPS[pmrStep]}
          </div>
          <button type="button" className="breath-start-btn" style={{ marginTop: 12, fontSize: 16 }} onClick={startPMR}>
            {pmrStep === 0 && !pmrDone ? "Start Body Relax 💪" : "Start Over 💪"}
          </button>
        </div>
      )}

      <div style={{ height: 12 }} />
      <div className="ar-calm-card" onClick={onARWorld} onKeyDown={(e) => e.key === "Enter" && onARWorld()} role="button" tabIndex={0}>
        <div className="ar-calm-icon">🔮</div>
        <div className="ar-calm-text">
          <div className="ar-calm-title">Open AR Calm World</div>
          <div className="ar-calm-sub">Fill your room with calm creatures & breathing guides</div>
        </div>
        <div className="ar-live">LIVE</div>
      </div>
      <div style={{ height: 10 }} />
    </>
  );
}
