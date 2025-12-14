"use client";

import { useEffect, useState } from "react";
import { Coins, Zap } from "lucide-react";

export default function MotherlodeDisplay() {
  const [timeRemaining, setTimeRemaining] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 59));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-card via-card to-accent-yellow/10 border border-border p-3">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-yellow/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-orange/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="relative space-y-2.5">
        {/* Motherlode header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Zap className="w-5 h-5 text-accent-yellow animate-pulse" />
              <div className="absolute inset-0 bg-accent-yellow/20 rounded-full blur-xl" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Motherlode</div>
              <div className="text-[10px] text-gray-500">1 in 625 chance</div>
            </div>
          </div>

          {/* Timer */}
          <div className="text-right">
            <div className="text-lg font-bold text-accent-yellow glow-effect">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-[10px] text-gray-400">Time remaining</div>
          </div>
        </div>

        {/* Dual jackpot display */}
        <div className="grid grid-cols-2 gap-2">
          {/* MORE tokens */}
          <div className="bg-gradient-to-br from-accent-yellow/10 to-accent-orange/10 rounded-lg p-2 border border-accent-yellow/20">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Coins className="w-3.5 h-3.5 text-accent-yellow" />
              <span className="text-[10px] text-gray-400">MORE</span>
            </div>
            <div className="text-base font-bold text-accent-yellow">2,686</div>
          </div>

          {/* MOVE tokens */}
          <div className="bg-gradient-to-br from-accent-orange/10 to-accent-gold/10 rounded-lg p-2 border border-accent-orange/20">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Coins className="w-3.5 h-3.5 text-accent-orange" />
              <span className="text-[10px] text-gray-400">MOVE</span>
            </div>
            <div className="text-base font-bold text-white">77.7</div>
          </div>
        </div>
      </div>
    </div>
  );
}

