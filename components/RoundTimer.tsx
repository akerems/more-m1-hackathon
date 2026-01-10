"use client";

import { memo } from "react";
import { Clock, Zap, Wifi } from "lucide-react";
import { useRoundStatus } from "@/hooks/useRoundStatus";

function RoundTimer() {
  const { round, timeRemaining, isEnded, loading, drift } = useRoundStatus();

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && !timeRemaining) {
    return (
      <div className="bg-gradient-to-r from-card to-accent-yellow/10 rounded-xl p-4 border border-border animate-pulse">
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-card to-accent-yellow/10 rounded-xl p-4 border border-border">
      {/* Round Number */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent-yellow" />
          <span className="text-sm text-gray-400">Round</span>
        </div>
        <span className="text-lg font-bold text-accent-yellow">#{round}</span>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-yellow" />
          <span className="text-sm text-gray-400">Time Remaining</span>
        </div>
        <div className="text-right">
          {isEnded ? (
            <div className="text-red-500 font-bold text-lg">
              ENDED
            </div>
          ) : (
            <div className="text-2xl font-bold text-white font-mono">
              {formatTime(timeRemaining)}
            </div>
          )}
          {isEnded && (
            <div className="text-xs text-gray-500 mt-1">
              Deploy to start new round
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!isEnded && (
        <div className="mt-3 bg-background rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-yellow to-accent-orange transition-all duration-1000"
            style={{
              width: `${Math.max(0, Math.min(100, (timeRemaining / 60) * 100))}%`
            }}
          />
        </div>
      )}

      {/* Sync Status (Debug) */}
      {drift > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <Wifi className="w-3 h-3" />
          <span>Synced (drift: {drift.toFixed(1)}s)</span>
        </div>
      )}
    </div>
  );
}

export default memo(RoundTimer);


