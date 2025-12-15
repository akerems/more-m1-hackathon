"use client";

import { useState } from "react";
import Header from "@/components/Header";
import MiningGrid from "@/components/MiningGrid";
import MotherlodeDisplay from "@/components/MotherlodeDisplay";
import DeployPanel from "@/components/DeployPanel";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [selectedBlocks, setSelectedBlocks] = useState<number[]>([]);

  const handleBlockSelect = (blockNumber: number) => {
    setSelectedBlocks((prev) =>
      prev.includes(blockNumber)
        ? prev.filter((b) => b !== blockNumber)
        : [...prev, blockNumber]
    );
  };

  const handleSelectAll = () => {
    if (selectedBlocks.length === 25) {
      setSelectedBlocks([]);
    } else {
      setSelectedBlocks(Array.from({ length: 25 }, (_, i) => i + 1));
    }
  };

  const handleSmartSelect = () => {
    // Smart select: randomly select 5 blocks
    const randomBlocks: number[] = [];
    while (randomBlocks.length < 5) {
      const randomBlock = Math.floor(Math.random() * 25) + 1;
      if (!randomBlocks.includes(randomBlock)) {
        randomBlocks.push(randomBlock);
      }
    }
    setSelectedBlocks(randomBlocks);
  };

  const handleClearSelection = () => {
    setSelectedBlocks([]);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      {/* Decorative elements */}
      <div className="fixed top-20 right-10 animate-float">
        <Sparkles className="w-8 h-8 text-accent-yellow opacity-20" />
      </div>
      <div className="fixed bottom-20 left-10 animate-float" style={{ animationDelay: "1s" }}>
        <Sparkles className="w-8 h-8 text-accent-orange opacity-20" />
      </div>
      <div className="fixed top-1/2 left-10 animate-float" style={{ animationDelay: "2s" }}>
        <Sparkles className="w-6 h-6 text-accent-gold opacity-20" />
      </div>

      <main className="container mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left side - Mining grid */}
          <div className="xl:col-span-2 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-400">
                Deploy MOVE, compete on the grid, win MORE tokens & dual jackpots
              </p>
            </div>

            <MiningGrid
              selectedBlocks={selectedBlocks}
              onBlockSelect={handleBlockSelect}
            />
          </div>

          {/* Right side - Control panel */}
          <div className="space-y-4">
            <MotherlodeDisplay />
            <DeployPanel
              selectedBlocks={selectedBlocks}
              onClearSelection={handleClearSelection}
              onSelectAll={handleSelectAll}
              onSmartSelect={handleSmartSelect}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

