"use client";

const BODY_REGIONS = [
  { id: "hands", label: "HANDS", cx: 50, cy: 68, rx: 15, ry: 5 },
  { id: "arms", label: "ARMS", cx: 50, cy: 52, rx: 25, ry: 8 },
  { id: "face", label: "FACE", cx: 50, cy: 15, rx: 10, ry: 10 },
  { id: "shoulders", label: "SHOULDERS", cx: 50, cy: 32, rx: 20, ry: 6 },
  { id: "stomach", label: "STOMACH", cx: 50, cy: 50, rx: 12, ry: 10 },
  { id: "legs", label: "LEGS", cx: 50, cy: 80, rx: 12, ry: 15 },
];

export default function BodyOutline({
  activeRegion,
  completedRegions,
}: {
  activeRegion: string;
  completedRegions: string[];
}) {
  return (
    <div className="body-outline-wrap">
      <svg viewBox="0 0 100 100" className="body-outline-svg">
        {/* Body silhouette - gingerbread style */}
        {/* Head */}
        <circle cx="50" cy="15" r="10" className="body-part" />
        {/* Neck */}
        <rect x="47" y="25" width="6" height="5" className="body-part" rx="2" />
        {/* Torso */}
        <rect x="35" y="30" width="30" height="30" className="body-part" rx="8" />
        {/* Left arm */}
        <rect x="20" y="32" width="15" height="7" className="body-part" rx="3" />
        <rect x="15" y="37" width="8" height="7" className="body-part" rx="3" />
        {/* Right arm */}
        <rect x="65" y="32" width="15" height="7" className="body-part" rx="3" />
        <rect x="77" y="37" width="8" height="7" className="body-part" rx="3" />
        {/* Left leg */}
        <rect x="37" y="60" width="10" height="25" className="body-part" rx="4" />
        <rect x="35" y="83" width="14" height="6" className="body-part" rx="3" />
        {/* Right leg */}
        <rect x="53" y="60" width="10" height="25" className="body-part" rx="4" />
        <rect x="51" y="83" width="14" height="6" className="body-part" rx="3" />

        {/* Glow regions */}
        {BODY_REGIONS.map((region) => {
          const isActive = activeRegion === region.id;
          const isComplete = completedRegions.includes(region.id);
          return (
            <ellipse
              key={region.id}
              cx={region.cx}
              cy={region.cy}
              rx={region.rx}
              ry={region.ry}
              className={`body-region ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
            />
          );
        })}
      </svg>

      {/* Active region label */}
      {activeRegion && (
        <div className="body-region-label">
          {BODY_REGIONS.find((r) => r.id === activeRegion)?.label}
        </div>
      )}
    </div>
  );
}
