"use client";

const TABS = [
  { id: "home", icon: "\u{1F30D}", label: "My World" },
  { id: "modules", icon: "\u{1F9E9}", label: "Skills", dot: true },
  { id: "calm", icon: "\u2601\uFE0F", label: "Calm" },
  { id: "quests", icon: "\u2694\uFE0F", label: "Quests" },
  { id: "buddy", icon: "\u{1F98A}", label: "Sparky" },
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
