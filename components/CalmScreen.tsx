"use client";

import { useState, useRef, useEffect } from "react";
import { calmScenes } from "@/lib/calmSceneData";
import { useVoiceGuidance } from "@/lib/hooks/useVoiceGuidance";
import BreathingCircle from "./BreathingCircle";
import BodyOutline from "./BodyOutline";

const BREATH_PHASES = [
  { w: "BREATHE IN", c: 4, i: "Breathe in slowly through your nose..." },
  { w: "HOLD", c: 4, i: "Hold it... nice and still..." },
  { w: "BREATHE OUT", c: 4, i: "Breathe out slowly through your mouth..." },
  { w: "HOLD", c: 4, i: "Rest... you're doing great..." },
];

const LEAVE_EMOJIS = ["🍃", "🍂", "🍁", "🌿", "🌸"];

const PMR_STEPS = [
  { region: "hands", text: "Squeeze your HANDS really tight... hold... NOW let go!" },
  { region: "arms", text: "Tense your ARMS like a superhero... hold... NOW relax them!" },
  { region: "face", text: "Scrunch your FACE tight... hold... NOW let it go smooth!" },
  { region: "shoulders", text: "Pull your SHOULDERS up to your ears... hold... NOW drop them!" },
  { region: "stomach", text: "Tighten your STOMACH muscles... hold... NOW let them soften!" },
  { region: "legs", text: "Push your LEGS down hard... hold... NOW relax them completely!" },
];

export default function CalmScreen({
  onBack,
  onARWorld,
}: {
  onBack: () => void;
  onARWorld: () => void;
}) {
  const [calmTab, setCalmTab] = useState<"box" | "leaves" | "pmr">("box");
  const [selectedScene, setSelectedScene] = useState(calmScenes[0]);

  // Voice guidance
  const { voiceEnabled, speak, stop, toggleVoice } = useVoiceGuidance();

  // Breathing state
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathCount, setBreathCount] = useState(4);
  const [breathInstr, setBreathInstr] = useState("Tap the button to start breathing with me");
  const breathTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Leaves state
  const [leafInput, setLeafInput] = useState("");
  const leavesRenderedRef = useRef(false);
  const leavesContainerRef = useRef<HTMLDivElement>(null);

  // PMR state
  const [pmrStep, setPmrStep] = useState(-1);
  const [pmrCompletedRegions, setPmrCompletedRegions] = useState<string[]>([]);
  const pmrDone = pmrStep >= PMR_STEPS.length;
  const pmrTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Breathing timer
  useEffect(() => {
    if (!breathing) return;
    const p = BREATH_PHASES[breathPhase];
    setBreathInstr(p.i);
    if (voiceEnabled && breathCount === p.c) {
      speak(p.i);
    }
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
  }, [breathing, breathPhase, breathCount, voiceEnabled, speak]);

  const toggleBreath = () => {
    if (breathing) {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
      setBreathing(false);
      setBreathPhase(0);
      setBreathCount(4);
      setBreathInstr("Tap the button to start breathing with me");
      stop();
    } else {
      setBreathing(true);
      setBreathPhase(0);
      setBreathCount(4);
    }
  };

  // Leaves setup
  useEffect(() => {
    if (calmTab !== "leaves" || !leavesContainerRef.current || leavesRenderedRef.current) return;
    leavesRenderedRef.current = true;
    LEAVE_EMOJIS.forEach((e) => {
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
    if (voiceEnabled) speak("Letting it go... watch it float away...");
    const el = document.createElement("div");
    el.className = "leaf";
    el.style.cssText =
      "bottom:80px;font-size:14px;background:rgba(255,255,255,.15);padding:4px 8px;border-radius:10px;animation-duration:12s;color:white;font-weight:700";
    el.textContent = v.substring(0, 20) + "...";
    leavesContainerRef.current.appendChild(el);
    setTimeout(() => el.remove(), 13000);
  };

  // PMR with body regions
  const startPMR = () => {
    setPmrStep(0);
    setPmrCompletedRegions([]);
    if (voiceEnabled) speak(PMR_STEPS[0].text);

    const run = (i: number) => {
      if (i >= PMR_STEPS.length) {
        setPmrStep(PMR_STEPS.length);
        if (voiceEnabled) speak("Great job! Your whole body is relaxed now. You did it!");
        return;
      }
      setPmrStep(i);
      if (i > 0) {
        setPmrCompletedRegions((prev) => [...prev, PMR_STEPS[i - 1].region]);
        if (voiceEnabled) speak(PMR_STEPS[i].text);
      }
      pmrTimerRef.current = setTimeout(() => run(i + 1), 5000);
    };
    pmrTimerRef.current = setTimeout(() => run(1), 5000);
  };

  useEffect(() => {
    return () => {
      if (pmrTimerRef.current) clearTimeout(pmrTimerRef.current);
    };
  }, []);

  // Calm particles
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

  // Player level for scene unlocking (hardcoded for now, will come from player state later)
  const playerLevel = 7;

  return (
    <div style={{ background: selectedScene.bgGradient, minHeight: "100%", position: "relative" }}>
      <div className="calm-particles">{calmParticles}</div>
      <div className="calm-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            type="button"
            className="q-back"
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              fontFamily: "Nunito",
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {"←"} My World
          </button>
          <button
            type="button"
            className="voice-toggle"
            onClick={toggleVoice}
            style={{
              background: voiceEnabled ? "rgba(0, 212, 255, 0.15)" : "rgba(255, 255, 255, 0.06)",
              border: `1px solid ${voiceEnabled ? "rgba(0, 212, 255, 0.4)" : "rgba(255, 255, 255, 0.1)"}`,
              borderRadius: 12,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              color: voiceEnabled ? "var(--cyan)" : "var(--muted)",
              fontFamily: "Nunito",
            }}
          >
            {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
          </button>
        </div>
        <div className="calm-title">{"☁️"} Calm Time</div>
        <div className="calm-sub">This is your safe space. No rush here.</div>
      </div>

      {/* Scene selector */}
      <div className="calm-scene-scroll">
        {calmScenes.map((scene) => {
          const locked = scene.unlockLevel > playerLevel;
          return (
            <button
              key={scene.id}
              type="button"
              className={`calm-scene-card ${selectedScene.id === scene.id ? "selected" : ""} ${locked ? "locked" : ""}`}
              onClick={() => !locked && setSelectedScene(scene)}
              disabled={locked}
            >
              <span className="csc-emoji">{scene.emoji}</span>
              <span className="csc-name">{locked ? "🔒" : scene.name}</span>
            </button>
          );
        })}
      </div>

      <div className="calm-tabs">
        <button type="button" className={`calm-tab ${calmTab === "box" ? "active" : ""}`} onClick={() => setCalmTab("box")}>
          {"🫁"} Box Breathing
        </button>
        <button type="button" className={`calm-tab ${calmTab === "leaves" ? "active" : ""}`} onClick={() => setCalmTab("leaves")}>
          {"🍃"} Leaves on Stream
        </button>
        <button type="button" className={`calm-tab ${calmTab === "pmr" ? "active" : ""}`} onClick={() => setCalmTab("pmr")}>
          {"💪"} Body Relax
        </button>
      </div>

      {calmTab === "box" && (
        <div id="calmBox" className="box-breath">
          <BreathingCircle
            breathing={breathing}
            phaseWord={BREATH_PHASES[breathPhase].w}
            count={breathCount}
          />
          <div className="breath-instruction" id="breathInstr">
            {breathInstr}
          </div>
          <button type="button" className="breath-start-btn" onClick={toggleBreath}>
            {breathing ? "Stop" : "Start Breathing 🌊"}
          </button>
        </div>
      )}

      {calmTab === "leaves" && (
        <div
          id="calmLeaves"
          className={`leaves-scene ${calmTab === "leaves" ? "active" : ""}`}
          ref={leavesContainerRef}
        >
          <div className="leaf-input-area">
            <div className="leaf-title">{"🍃"} Put It on a Leaf</div>
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
              Let it Float Away {"🍃"}
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
          <BodyOutline
            activeRegion={pmrStep >= 0 && pmrStep < PMR_STEPS.length ? PMR_STEPS[pmrStep].region : ""}
            completedRegions={pmrCompletedRegions}
          />
          <div style={{ fontFamily: "Fredoka One", fontSize: 22, marginTop: 8 }}>Body Relax</div>
          <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, minHeight: 48 }}>
            {pmrDone
              ? "Great job! Your whole body is relaxed now. 🌟 You did it!"
              : pmrStep >= 0 && pmrStep < PMR_STEPS.length
                ? PMR_STEPS[pmrStep].text
                : "Relax each part of your body, one at a time."}
          </div>
          <button
            type="button"
            className="breath-start-btn"
            style={{ marginTop: 12, fontSize: 16 }}
            onClick={startPMR}
          >
            {pmrStep < 0 ? "Start Body Relax 💪" : "Start Over 💪"}
          </button>
        </div>
      )}

      <div style={{ height: 12 }} />
      <div
        className="ar-calm-card"
        onClick={onARWorld}
        onKeyDown={(e) => e.key === "Enter" && onARWorld()}
        role="button"
        tabIndex={0}
      >
        <div className="ar-calm-icon">{"🌿"}</div>
        <div className="ar-calm-text">
          <div className="ar-calm-title">Open Wild Zone</div>
          <div className="ar-calm-sub">Find calm creatures & practice your skills</div>
        </div>
        <div className="ar-live">LIVE</div>
      </div>
      <div style={{ height: 10 }} />
    </div>
  );
}
