"use client";

import { chatWorlds } from "@/lib/chatWorldData";

export default function SocialHub({
  onJoinRoom,
}: {
  onJoinRoom: (roomId: string) => void;
}) {
  const totalOnline = chatWorlds.reduce((sum, w) => sum + w.onlineCount, 0);

  return (
    <div className="social-hub">
      <div className="social-hub-header">
        <div className="social-hub-title">{"💬"} Social Worlds</div>
        <div className="social-hub-online">
          <span className="online-dot" />
          {totalOnline} online
        </div>
      </div>
      <div className="social-hub-sub">
        Hang out with others in themed chat rooms!
      </div>
      <div className="social-worlds-scroll">
        {chatWorlds.map((world) => (
          <div
            key={world.id}
            className="social-world-card"
            style={{
              background: `linear-gradient(135deg, ${world.colorFrom}, ${world.colorTo})`,
            }}
            onClick={() => onJoinRoom(world.id)}
            onKeyDown={(e) => e.key === "Enter" && onJoinRoom(world.id)}
            role="button"
            tabIndex={0}
          >
            <div className="swc-emoji">{world.emoji}</div>
            <div className="swc-name">{world.name}</div>
            <div className="swc-desc">{world.description}</div>
            <div className="swc-online">
              <span className="online-dot-sm" />
              {world.onlineCount} here
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
