"use client";

import Link from "next/link";
import { useCallback, useRef, useState, useEffect } from "react";
import Yolo from "@/components/companion/Yolo";

const COCO_PERSON = 0;
const COCO_BOTTLE = 39;
const COCO_CUP = 41;
const COCO_CELL_PHONE = 67;

type BgState = "red" | "green" | null;

export default function CompanionPage() {
  const [bg, setBg] = useState<BgState>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const errorAudioRef = useRef<HTMLAudioElement>(null);
  const okAudioRef = useRef<HTMLAudioElement>(null);

  // Unlock audio on first user click (browser autoplay policy)
  useEffect(() => {
    const unlock = () => {
      [errorAudioRef, okAudioRef].forEach((ref) => {
        const el = ref.current;
        if (el) {
          el.muted = true;
          el.play().then(() => { el.pause(); el.muted = false; el.currentTime = 0; }).catch(() => {});
        }
      });
      setAudioUnlocked(true);
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
    document.addEventListener("click", unlock);
    document.addEventListener("touchstart", unlock);
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      errorAudioRef.current?.pause();
      okAudioRef.current?.pause();
    };
  }, []);

  const stopAudio = useCallback((ref: React.RefObject<HTMLAudioElement | null>) => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  }, []);

  const lastBgRef = useRef<BgState>(null);

  const onDetections = useCallback(
    (classIds: number[]) => {
      const hasPerson = classIds.includes(COCO_PERSON);
      const hasCupOrBottle = classIds.includes(COCO_CUP) || classIds.includes(COCO_BOTTLE);
      const hasCellPhone = classIds.includes(COCO_CELL_PHONE);

      let newBg: BgState = null;
      if (hasPerson && hasCupOrBottle) {
        newBg = "red";
      } else if (hasPerson && hasCellPhone) {
        newBg = "green";
      }

      // Only change audio when state changes to avoid re-triggering play() every frame
      if (newBg !== lastBgRef.current) {
        lastBgRef.current = newBg;
        if (newBg === "red") {
          stopAudio(okAudioRef);
          errorAudioRef.current?.play().catch(() => {});
        } else if (newBg === "green") {
          stopAudio(errorAudioRef);
          okAudioRef.current?.play().catch(() => {});
        } else {
          stopAudio(errorAudioRef);
          stopAudio(okAudioRef);
        }
      }
      setBg(newBg);
    },
    [stopAudio]
  );

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
      {/* Hidden audio elements — rendered in DOM so browser allows playback */}
      <audio ref={errorAudioRef} src="/assets/error.mp3" loop preload="auto" />
      <audio ref={okAudioRef} src="/assets/ok.mp3" loop preload="auto" />

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
