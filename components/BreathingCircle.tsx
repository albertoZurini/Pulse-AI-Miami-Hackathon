"use client";

const PHASE_COLORS: Record<string, string> = {
  "BREATHE IN": "#00D4FF",
  "HOLD": "#A855F7",
  "BREATHE OUT": "#FF2D78",
  "REST": "#FFB800",
};

export default function BreathingCircle({
  breathing,
  phaseWord,
  count,
}: {
  breathing: boolean;
  phaseWord: string;
  count: number;
}) {
  const color = PHASE_COLORS[phaseWord] ?? "#00D4FF";
  const isInhale = phaseWord === "BREATHE IN";
  const isExhale = phaseWord === "BREATHE OUT";

  // Circle scale: expands on inhale, shrinks on exhale
  const scale = breathing
    ? isInhale
      ? 1.15
      : isExhale
        ? 0.85
        : 1
    : 1;

  // Border radius: more circular on inhale, more square on exhale
  const borderRadius = breathing
    ? isInhale
      ? "50%"
      : isExhale
        ? "30%"
        : "40%"
    : "30%";

  return (
    <div className="breathing-circle-wrap">
      <div
        className="breathing-circle"
        style={{
          borderColor: `${color}66`,
          boxShadow: `0 0 ${breathing ? 40 : 20}px ${color}44, inset 0 0 ${breathing ? 30 : 10}px ${color}22`,
          transform: `scale(${scale})`,
          borderRadius,
          background: `radial-gradient(circle, ${color}11 0%, ${color}08 50%, transparent 70%)`,
        }}
      >
        <div
          className="breathing-glow-ring"
          style={{
            borderColor: `${color}88`,
            borderRadius,
            boxShadow: `0 0 20px ${color}66`,
            opacity: breathing ? 1 : 0.3,
          }}
        />
        <div className="breathing-center">
          <div className="breathing-word" style={{ color }}>
            {breathing ? phaseWord : "READY?"}
          </div>
          <div
            className="breathing-count"
            style={{
              color,
              textShadow: `0 0 20px ${color}`,
            }}
          >
            {breathing ? count : "▶"}
          </div>
        </div>
      </div>
    </div>
  );
}
