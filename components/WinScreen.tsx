"use client";

import { useEffect, useRef } from "react";

const CONFETTI_COLORS = ["#FF2D78", "#FF6B00", "#FFB800", "#7ED321", "#00D4FF", "#A855F7", "#5B2FE8"];

export default function WinScreen({
  winMessage,
  xpEarned,
  realWorldClaimed,
  onRealWorld,
  onHome,
}: {
  winMessage: string;
  xpEarned: number;
  realWorldClaimed: boolean;
  onRealWorld: () => void;
  onHome: () => void;
}) {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!confettiRef.current) return;
    confettiRef.current.innerHTML = "";
    for (let i = 0; i < 50; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      const w = Math.random() * 10 + 5;
      const h = Math.random() * 14 + 6;
      p.style.cssText = `width:${w}px;height:${h}px;background:${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};left:${Math.random() * 100}%;animation-duration:${Math.random() * 2 + 2}s;animation-delay:${Math.random() * 1.5}s`;
      confettiRef.current.appendChild(p);
    }
  }, []);

  return (
    <>
      <div className="win-bg" />
      <div ref={confettiRef} id="confettiContainer" />
      <div className="win-content">
        <div className="win-mascot">🏆</div>
        <div className="win-title">YOU DID IT!!</div>
        <div className="win-sub">{winMessage}</div>
        <div className="xp-burst">
          <div className="xp-burst-num">+{xpEarned} ⭐</div>
          <div className="xp-burst-label">Stars earned! Level up coming soon!</div>
        </div>
        <div className="win-badges">
          <div className="wb">🗣️</div>
          <div className="wb">🔥</div>
          <div className="wb">⭐</div>
        </div>
        <button
          type="button"
          className="real-world-btn"
          onClick={onRealWorld}
          disabled={realWorldClaimed}
        >
          {realWorldClaimed ? "🌟 Amazing! That's the BIGGEST win!" : "🌎 I did this in REAL LIFE too!!"}
        </button>
        <button type="button" className="home-btn" onClick={onHome}>
          Go back to my world
        </button>
      </div>
    </>
  );
}
