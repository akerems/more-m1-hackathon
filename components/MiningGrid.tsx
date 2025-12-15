"use client";

import { useState } from "react";
import GridBlock from "./GridBlock";

// Mock data for 25 blocks
const generateMockData = () => {
  return Array.from({ length: 25 }, (_, i) => ({
    blockNumber: i + 1,
    minerCount: Math.floor(Math.random() * 40) + 20,
    deployedAmount: Math.random() * 0.05 + 0.15,
  }));
};

interface MiningGridProps {
  selectedBlocks: number[];
  onBlockSelect: (blockNumber: number) => void;
}

export default function MiningGrid({
  selectedBlocks,
  onBlockSelect,
}: MiningGridProps) {
  const [blocks] = useState(generateMockData());

  return (
    <div className="grid grid-cols-5 gap-2 w-full max-w-2xl mx-auto">
      {blocks.map((block) => (
        <GridBlock
          key={block.blockNumber}
          blockNumber={block.blockNumber}
          minerCount={block.minerCount}
          deployedAmount={block.deployedAmount}
          isSelected={selectedBlocks.includes(block.blockNumber)}
          onSelect={onBlockSelect}
        />
      ))}
    </div>
  );
}

