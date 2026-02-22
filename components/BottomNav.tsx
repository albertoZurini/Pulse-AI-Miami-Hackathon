"use client";

const TABS = [
  { id: "home", icon: "🌍", label: "My World" },
  { id: "modules", icon: "🧩", label: "Skills", dot: true },
  { id: "calm", icon: "☁️", label: "Calm" },
  { id: "arworld", icon: "🔮", label: "AR World" },
  { id: "buddy", icon: "🦊", label: "Sparky" },
] as const;

export default function BottomNav({
  current,
  onNav,
}: {
  current: string;
  onNav: (id: string) => void;
}) {
  return (
    <>
      <div className="h-32"></div>
      <div className="bottom-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`bnav ${current === tab.id ? "active" : ""}`}
            onClick={() => onNav(tab.id)}
          >
            <span className="bnav-icon">{tab.icon}</span>
            <span className="bnav-label">{tab.label}</span>
            {"dot" in tab && tab.dot && <div className="bnav-dot" />}
          </button>
        ))}
      </div>
    </>
  );
}
