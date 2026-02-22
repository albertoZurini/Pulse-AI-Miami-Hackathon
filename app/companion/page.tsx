"use client";

import Link from "next/link";
import Yolo from "@/components/companion/Yolo";

export default function CompanionPage() {
  return (
    <main className="min-h-screen bg-[#0A0620] font-sans flex flex-col items-center p-4">
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
        <Yolo />
      </div>
    </main>
  );
}
