"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import Yolo from "@/components/companion/Yolo";

const COCO_PERSON = 0;
const COCO_BOTTLE = 38;
const COCO_CUP = 41;
const PERSIST_MS = 1000;

const AUDIO_ERROR = "/assets/error.mp3";
const AUDIO_OK = "/assets/ok.mp3";

type BgState = "red" | "green" | null;

function playSoundOnce(src: string) {
  try {
    const audio = new Audio(src);
    audio.play().catch((e) => {
      console.warn("[Companion] Audio play failed", src, e);
    });
  } catch (e) {
    console.warn("[Companion] Audio create failed", src, e);
  }
}

export default function CompanionPage() {
  const [bg, setBg] = useState<BgState>(null);

  const personBottleStart = useRef<number | null>(null);
  const personCupStart = useRef<number | null>(null);
  const playedError = useRef(false);
  const playedOk = useRef(false);

  const onDetections = useCallback((classIds: number[]) => {
    const hasPerson = classIds.includes(COCO_PERSON);
    const hasBottle = classIds.includes(COCO_BOTTLE);
    const hasCup = classIds.includes(COCO_CUP);
    const now = Date.now();

    console.debug("[Companion] onDetections", {
      classIds,
      classIdsLength: classIds.length,
      hasPerson,
      hasBottle,
      hasCup,
      personBottleStart: personBottleStart.current,
      personCupStart: personCupStart.current,
      elapsedBottle: personBottleStart.current != null ? now - personBottleStart.current : null,
      elapsedCup: personCupStart.current != null ? now - personCupStart.current : null,
      playedError: playedError.current,
      playedOk: playedOk.current,
    });

    if (hasPerson && hasBottle) {
      if (personBottleStart.current === null) {
        personBottleStart.current = now;
        console.debug("[Companion] Person+bottle: started 1s timer");
      }
      const elapsed = now - personBottleStart.current;
      if (elapsed >= PERSIST_MS) {
        console.debug("[Companion] Person+bottle: 1s reached, setting red", { elapsed });
        setBg("red");
        if (!playedError.current) {
          playedError.current = true;
          playSoundOnce(AUDIO_ERROR);
          console.info("[Companion] Person + bottle detected for 1s — error state, playing error.mp3");
        }
      }
      personCupStart.current = null;
      playedOk.current = false;
    } else if (hasPerson && hasCup) {
      if (personCupStart.current === null) {
        personCupStart.current = now;
        console.debug("[Companion] Person+cup: started 1s timer");
      }
      const elapsed = now - personCupStart.current;
      if (elapsed >= PERSIST_MS) {
        console.debug("[Companion] Person+cup: 1s reached, setting green", { elapsed });
        setBg("green");
        if (!playedOk.current) {
          playedOk.current = true;
          playSoundOnce(AUDIO_OK);
          console.info("[Companion] Person + cup detected for 1s — ok state, playing ok.mp3");
        }
      }
      personBottleStart.current = null;
      playedError.current = false;
    } else {
      if (personBottleStart.current != null || personCupStart.current != null) {
        console.debug("[Companion] Pair lost, resetting timers and bg");
      }
      personBottleStart.current = null;
      personCupStart.current = null;
      playedError.current = false;
      playedOk.current = false;
      setBg(null);
    }
  }, []);

  const bgClass =
    bg === "red"
      ? "bg-red-900"
      : bg === "green"
        ? "bg-green-900"
        : "bg-[#0A0620]";

  return (
    <main
      className={`min-h-screen font-sans flex flex-col items-center p-4 transition-colors duration-300 ${bgClass}`}
    >
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">
            Real-Time Object Detection
          </h1>
          <Link
            href="/home"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Back to My World
          </Link>
        </div>
        <Yolo onDetections={onDetections} />
      </div>
    </main>
  );
}
