"use client";

import { useState } from "react";
import clsx from "clsx";

interface GridBlockProps {
  blockNumber: number;
  minerCount: number;
  deployedAmount: number;
  isSelected: boolean;
  onSelect: (blockNumber: number) => void;
}

export default function GridBlock({
  blockNumber,
  minerCount,
  deployedAmount,
  isSelected,
  onSelect,
}: GridBlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(blockNumber)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "relative group p-2 rounded-lg border transition-all duration-200",
        "flex flex-col items-center justify-between gap-1",
        "aspect-square",
        "hover:scale-105 hover:z-10",
        isSelected
          ? "bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 border-accent-yellow shadow-lg shadow-accent-yellow/20"
          : "bg-card/50 border-border hover:border-accent-yellow/50",
        isHovered && !isSelected && "card-glow"
      )}
    >
      {/* Block number and miner count */}
      <div className="w-full flex items-center justify-between text-[10px]">
        <span className="text-gray-500">#{blockNumber}</span>
        <span className="text-gray-400">{minerCount}</span>
      </div>

      {/* Deployed amount */}
      <div className="text-center">
        <div
          className={clsx(
            "text-sm font-bold transition-colors",
            isSelected ? "text-accent-yellow" : "text-white"
          )}
        >
          {deployedAmount.toFixed(4)}
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

