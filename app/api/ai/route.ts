import { NextRequest, NextResponse } from "next/server";
import { SPARKY_SYSTEM_PROMPT } from "@/lib/arCreatureData";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!ANTHROPIC_API_KEY) {
      console.warn("[Pulse AI] ANTHROPIC_API_KEY not set; returning fallback");
      const body = await req.json();
      const { type } = body as { type: string };
      if (type === "chat") return NextResponse.json({ text: "I'm here for you! 💛 Tell me more!" });
      if (type === "quest") return NextResponse.json({ text: (body as { correct?: boolean }).correct ? "YES! That's exactly right! You're amazing! 🎉" : "Good try! Next time, remember to ask directly — it always works better! 💪" });
      if (type === "ar") return NextResponse.json({ text: body.correct ? "🎉 CAUGHT IT! You're amazing!! 🏆" : "💛 Good try! Remember: breathing first always helps!" });
      if (type === "therapist") return NextResponse.json({ text: "Based on current client data, I recommend prioritizing Marcus today with a warm check-in message. His engagement has dropped significantly this week." });
      return NextResponse.json({ text: "Okay!" });
    }

    const body = await req.json();
    const { type, messages, system, prompt } = body as {
      type: "chat" | "quest" | "ar" | "therapist";
      messages?: { role: string; content: string }[];
      system?: string;
      prompt?: string;
    };

    const systemToUse = system ?? (type === "chat" ? SPARKY_SYSTEM_PROMPT : undefined);
    const userContent = prompt ?? (messages && messages.length > 0 ? messages[messages.length - 1].content : "");
    console.info("[Pulse AI] Calling Anthropic", { type, userContentLength: String(userContent).length });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        ...(systemToUse ? { system: systemToUse } : {}),
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Pulse AI] Anthropic error", res.status, err);
      return NextResponse.json(
        { error: "AI request failed", text: "I had a little trouble. Try again? 💛" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { content?: { text?: string }[] };
    const text = data.content?.[0]?.text ?? "I'm here for you! 💛";
    console.info("[Pulse AI] Response OK", { type, textLength: text.length });
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[Pulse AI] Route error", { error: String(e) });
    return NextResponse.json(
      { error: "Server error", text: "Oops, I had a little trouble! But I'm still here. 💛 Try again?" },
      { status: 500 }
    );
  }
}
