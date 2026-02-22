"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { chatWorlds } from "@/lib/chatWorldData";
import { baseAvatars } from "@/lib/avatarData";
import type { AvatarState } from "@/lib/hooks/useAvatarState";

interface ChatMessage {
  id: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: number;
}

const RANDOM_EVENTS = [
  { type: "shake", label: "The ground rumbles!", emoji: "🌋" },
  { type: "emoji-burst", label: "A wild sparkle storm!", emoji: "✨" },
  { type: "quest-nudge", label: "Bonus quest available!", emoji: "⚔️" },
  { type: "cheer", label: "Everyone gets cheered!", emoji: "🎉" },
];

const SIMULATED_MESSAGES: ChatMessage[] = [
  { id: "s1", userName: "StarBear", userAvatar: "🐻", message: "Hey everyone! 👋", timestamp: Date.now() - 60000 },
  { id: "s2", userName: "LunaOwl", userAvatar: "🦉", message: "Just finished a quest! So proud 🌟", timestamp: Date.now() - 45000 },
  { id: "s3", userName: "CozyFox", userAvatar: "🦊", message: "This room is awesome", timestamp: Date.now() - 30000 },
  { id: "s4", userName: "BravePanda", userAvatar: "🐼", message: "Who wants to do a breathing exercise together?", timestamp: Date.now() - 15000 },
];

export default function ChatRoomScreen({
  roomId,
  onBack,
  avatarState,
}: {
  roomId: string;
  onBack: () => void;
  avatarState?: AvatarState;
}) {
  const userAvatar = avatarState
    ? (baseAvatars.find((a) => a.id === avatarState.baseAvatarId)?.emoji ?? "\u{1F98A}")
    : "\u{1F98A}";
  const world = chatWorlds.find((w) => w.id === roomId) ?? chatWorlds[0];
  const [messages, setMessages] = useState<ChatMessage[]>(SIMULATED_MESSAGES);
  const [input, setInput] = useState("");
  const [activeEvent, setActiveEvent] = useState<typeof RANDOM_EVENTS[number] | null>(null);
  const [shaking, setShaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Random events every ~25 minutes (using 90s for demo)
  useEffect(() => {
    const triggerEvent = () => {
      const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setActiveEvent(event);
      if (event.type === "shake") {
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
      }
      setTimeout(() => setActiveEvent(null), 4000);
    };

    // First event after 90 seconds for demo (25 min in production)
    eventTimerRef.current = setInterval(triggerEvent, 90_000);
    return () => {
      if (eventTimerRef.current) clearInterval(eventTimerRef.current);
    };
  }, []);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      {
        id: `user-${Date.now()}`,
        userName: "You",
        userAvatar: userAvatar,
        message: text,
        timestamp: Date.now(),
      },
    ]);
    setInput("");
  };

  // Ambient floating emojis
  const ambientElements = world.ambientEmojis.map((emoji, i) => (
    <div
      key={i}
      className="chatroom-ambient"
      style={{
        left: `${(i * 14 + 5) % 100}%`,
        animationDuration: `${8 + (i % 5) * 2}s`,
        animationDelay: `${i * 1.2}s`,
        fontSize: `${18 + (i % 3) * 6}px`,
      }}
    >
      {emoji}
    </div>
  ));

  return (
    <div className={`chatroom-screen ${shaking ? "chatroom-shake" : ""}`}>
      {/* Background */}
      <div
        className="chatroom-bg"
        style={{
          background: `linear-gradient(180deg, ${world.colorFrom}33, ${world.colorTo}22, var(--dark))`,
        }}
      />
      <div className="chatroom-ambient-layer">{ambientElements}</div>

      {/* Header */}
      <div className="chatroom-header">
        <button type="button" className="chatroom-back" onClick={onBack}>
          {"←"}
        </button>
        <div className="chatroom-header-info">
          <span className="chatroom-header-emoji">{world.emoji}</span>
          <span className="chatroom-header-name">{world.name}</span>
        </div>
        <div className="chatroom-header-count">
          <span className="online-dot-sm" />
          {world.onlineCount}
        </div>
      </div>

      {/* Event overlay */}
      {activeEvent && (
        <div className="chat-event-overlay">
          <div className="chat-event-emoji">{activeEvent.emoji}</div>
          <div className="chat-event-label">{activeEvent.label}</div>
        </div>
      )}

      {/* Quest nudge banner */}
      <div className="chatroom-quest-nudge">
        {"⚔️"} Don&apos;t forget your quests! Complete one for bonus stars {"⭐"}
      </div>

      {/* Messages */}
      <div className="chatroom-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chatroom-msg ${msg.userName === "You" ? "mine" : ""}`}
          >
            {msg.userName !== "You" && (
              <div className="chatroom-msg-avatar">{msg.userAvatar}</div>
            )}
            <div className="chatroom-msg-content">
              {msg.userName !== "You" && (
                <div className="chatroom-msg-name">{msg.userName}</div>
              )}
              <div className="chatroom-msg-text">{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chatroom-input-bar">
        <input
          className="chatroom-input"
          placeholder="Say something nice..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button type="button" className="chatroom-send" onClick={sendMessage}>
          {"➤"}
        </button>
      </div>
    </div>
  );
}
