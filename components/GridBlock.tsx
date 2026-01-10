"use client";

import { useState, memo, useCallback } from "react";
import clsx from "clsx";

interface GridBlockProps {
  blockNumber: number;
  minerCount: number;
  deployedAmount: number;
  isWinning: boolean; // 🏆 Winning block
  isSelected: boolean;
  onSelect: (blockNumber: number) => void;
}

function GridBlock({
  blockNumber,
  minerCount,
  deployedAmount,
  isWinning,
  isSelected,
  onSelect,
}: GridBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = useCallback(() => {
    onSelect(blockNumber);
  }, [blockNumber, onSelect]);

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "relative group p-2 rounded-lg border transition-all duration-200",
        "flex flex-col items-center justify-between gap-1",
        "aspect-square",
        "hover:scale-105 hover:z-10",
        isWinning
          ? "bg-gradient-to-br from-green-500/30 to-green-600/40 border-green-500 shadow-lg shadow-green-500/50 ring-2 ring-green-500/50"
          : isSelected
          ? "bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 border-accent-yellow shadow-lg shadow-accent-yellow/20"
          : "bg-card/50 border-border hover:border-accent-yellow/50",
        isHovered && !isSelected && !isWinning && "card-glow"
      )}
    >
      {/* Block number */}
      <div className="w-full flex items-center justify-between text-[10px]">
        <span className={clsx(
          "font-medium",
          isWinning ? "text-green-400" :
          deployedAmount > 0 ? "text-accent-yellow" : "text-gray-500"
        )}>
          #{blockNumber}
        </span>
        <span className="text-gray-400">{minerCount}👤</span>
      </div>

      {/* Deployed amount - MORE VISIBLE */}
      <div className="text-center flex-1 flex flex-col items-center justify-center">
        <div className={clsx(
          "text-[8px] mb-0.5",
          isWinning ? "text-green-400" : "text-gray-500"
        )}>
          {isWinning ? "WINNER!" : "DEPLOYED"}
        </div>
        <div
          className={clsx(
            "text-base font-bold transition-colors leading-tight",
            isWinning ? "text-green-400" :
            isSelected ? "text-accent-yellow" : 
            deployedAmount > 0 ? "text-white" : "text-gray-600"
          )}
        >
          {deployedAmount > 0 ? deployedAmount.toFixed(2) : "0.00"}
        </div>
        <div className={clsx(
          "text-[8px] mt-0.5",
          isWinning ? "text-green-400" : "text-gray-500"
        )}>
          {isWinning ? "🏆" : "MOVE"}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-yellow rounded-full flex items-center justify-center">
          <svg
            className="w-2.5 h-2.5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      {/* Hover glow effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow/10 to-accent-orange/10 rounded-lg pointer-events-none" />
      )}
    </button>
  );
}

export default memo(GridBlock);

