"use client";

import { useRef, useEffect } from "react";

export default function BuddyScreen({
  onBack,
  messages,
  onSendMessage,
  quickChipsVisible,
}: {
  onBack: () => void;
  messages: { text: string; type: "ai" | "user" }[];
  onSendMessage: (text: string) => void;
  quickChipsVisible: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const v = inputRef.current?.value?.trim();
    if (!v) return;
    onSendMessage(v);
    inputRef.current!.value = "";
  };

  const quickChips: { label: string; message: string }[] = [
    { label: "😰 I need to calm down", message: "I need help calming down 😰" },
    { label: "🎮 Let's practice!", message: "Can we practice something together?" },
    { label: "🌎 I did it for real!!", message: "I used my skill in real life today! 🎉" },
    { label: "😔 I feel sad", message: "I feel really sad right now 😔" },
    { label: "😟 I'm worried", message: "I am really worried about something" },
  ];

  return (
    <>
      <div className="buddy-top">
        <button type="button" className="q-back" onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,.8)", fontFamily: "Nunito", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          ← My World
        </button>
        <div className="buddy-avatar-big">🦊</div>
        <div className="buddy-name-big">Sparky</div>
        <div className="buddy-tagline">Your AI buddy — always here ✨</div>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`cmsg ${m.type}`}>
            {m.type === "ai" && (
              <div className="cmsg-header">
                <div className="mini-orb">✦</div>
                <span className="mini-label">SPARKY</span>
              </div>
            )}
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {quickChipsVisible && (
        <div className="quick-chips">
          {quickChips.map((chip) => (
            <button
              key={chip.message}
              type="button"
              className="qchip"
              onClick={() => onSendMessage(chip.message)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      <div className="chat-bar">
        <input
          ref={inputRef}
          className="chat-inp"
          placeholder="Tell Sparky anything..."
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button type="button" className="send" onClick={send}>
          ➤
        </button>
      </div>
    </>
  );
}
