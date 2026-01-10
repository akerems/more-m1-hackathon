"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { useMinerStats } from "@/hooks/useMinerStats";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePrivy } from "@privy-io/react-auth";
import { getMovementWallet } from "@/lib/privy-movement";

// Dynamic imports for better code splitting
const MiningGrid = dynamic(() => import("@/components/MiningGrid"), {
  loading: () => <div className="h-96 bg-card/50 rounded-lg animate-pulse" />,
});

const RoundTimer = dynamic(() => import("@/components/RoundTimer"), {
  loading: () => <div className="h-24 bg-card/50 rounded-lg animate-pulse" />,
});

const MotherlodeDisplay = dynamic(() => import("@/components/MotherlodeDisplay"), {
  loading: () => <div className="h-32 bg-card/50 rounded-lg animate-pulse" />,
});

const DeployPanel = dynamic(() => import("@/components/DeployPanel"), {
  loading: () => <div className="h-96 bg-card/50 rounded-lg animate-pulse" />,
});

export default function Home() {
  const [selectedBlocks, setSelectedBlocks] = useState<number[]>([]);
  const [gridRefreshTrigger, setGridRefreshTrigger] = useState(0); // For immediate block data refresh
  const [timerKey, setTimerKey] = useState(0); // For timer remount (force round status refresh)
  
  // Get wallet address
  const { account } = useWallet();
  const { user } = usePrivy();
  const privyWallet = getMovementWallet(user);
  const currentWalletAddress = account?.address || privyWallet?.address;
  
  // Fetch real blockchain data
  const { gameState, refetch: refetchGameState } = useGameState();
  const { stats, refetch: refetchStats } = useMinerStats(currentWalletAddress ? String(currentWalletAddress) : undefined);

  const handleBlockSelect = useCallback((blockNumber: number) => {
    setSelectedBlocks((prev) =>
      prev.includes(blockNumber)
        ? prev.filter((b) => b !== blockNumber)
        : [...prev, blockNumber]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedBlocks.length === 25) {
      setSelectedBlocks([]);
    } else {
      setSelectedBlocks(Array.from({ length: 25 }, (_, i) => i + 1));
    }
  }, [selectedBlocks.length]);

  const handleSmartSelect = useCallback(() => {
    // Smart select: randomly select 5 blocks
    const randomBlocks: number[] = [];
    while (randomBlocks.length < 5) {
      const randomBlock = Math.floor(Math.random() * 25) + 1;
      if (!randomBlocks.includes(randomBlock)) {
        randomBlocks.push(randomBlock);
      }
    }
    setSelectedBlocks(randomBlocks);
  }, []);

  const handleDeploySuccess = useCallback(() => {
    // Refetch game state and miner stats after successful deployment
    console.log('🎉 Deploy successful! Refreshing all data (including timer)...');
    refetchGameState();
    refetchStats();
    // Trigger immediate block data refresh
    setGridRefreshTrigger(prev => prev + 1);
    // Trigger timer refresh (yeni round başlamış olabilir!)
    setTimerKey(prev => prev + 1);
  }, [refetchGameState, refetchStats]);

  const handleClearSelection = useCallback(() => {
    setSelectedBlocks([]);
  }, []);

  return (
    <div className="min-h-screen pb-12">
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
            {/* Real-time Stats */}
            <div className="bg-card/50 rounded-xl p-4 border border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Current Round</div>
                  <div className="text-2xl font-bold text-accent-yellow">
                    #{gameState?.round || 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Total Deployed</div>
                  <div className="text-2xl font-bold text-white">
                    {gameState?.totalDeployed.toFixed(2) || "0.00"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Your Deployed</div>
                  <div className="text-2xl font-bold text-accent-yellow">
                    {stats?.totalDeployed.toFixed(2) || "0.00"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Rounds Won</div>
                  <div className="text-2xl font-bold text-green-500">
                    {stats?.roundsWon || 0}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-gray-400">
                Deploy MOVE, compete on the grid, win MORE tokens & dual jackpots
              </p>
            </div>

            <MiningGrid
              selectedBlocks={selectedBlocks}
              onBlockSelect={handleBlockSelect}
              refreshTrigger={gridRefreshTrigger}
            />
          </div>

          {/* Right side - Control panel */}
          <div className="space-y-4">
            <RoundTimer key={timerKey} />
            <MotherlodeDisplay />
            <DeployPanel
              selectedBlocks={selectedBlocks}
              onClearSelection={handleClearSelection}
              onSelectAll={handleSelectAll}
              onSmartSelect={handleSmartSelect}
              onDeploySuccess={handleDeploySuccess}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

