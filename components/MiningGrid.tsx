"use client";

import { useMemo, memo, useState, useEffect, useRef } from "react";
import GridBlock from "./GridBlock";
import { getBlockState } from "@/lib/transactions";
import { fromSmallestUnit } from "@/lib/aptos";
import { useGameState } from "@/hooks/useGameState";

interface MiningGridProps {
  selectedBlocks: number[];
  onBlockSelect: (blockNumber: number) => void;
  refreshTrigger?: number; // Increment this to force immediate refresh
}

interface BlockData {
  blockNumber: number;
  minerCount: number;
  deployedAmount: number;
  isWinning: boolean; // 🏆 Winning block indicator
}

function MiningGrid({
  selectedBlocks,
  onBlockSelect,
  refreshTrigger = 0,
}: MiningGridProps) {
  const [blocks, setBlocks] = useState<BlockData[]>(() => 
    Array.from({ length: 25 }, (_, i) => ({
      blockNumber: i + 1,
      minerCount: 0,
      deployedAmount: 0,
      isWinning: false,
    }))
  );
  const [loading, setLoading] = useState(true); // Loading state
  const { gameState } = useGameState(); // Track round number
  const previousRoundRef = useRef<number>(0); // Track previous round

  // Fetch real blockchain data with Promise.all() (FAST! ~100-200ms)
  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        console.log('🔄 Fetching block data...');
        setLoading(true);
        
        // ⚡ Paralel 25 bloğu aynı anda çek (HIZLI!)
        const blockPromises = Array.from({ length: 25 }, (_, i) => 
          getBlockState(i).catch(() => [0, 0, false])
        );
        
        const results = await Promise.all(blockPromises);
        
        // 🔍 DEBUG: Log raw contract data
        console.log('🔍 Raw contract data (first 5 blocks):', 
          results.slice(0, 5).map((r, i) => ({
            block: i,
            deployed: r[0],
            miners: r[1],
            isWinning: r[2],
            rawResult: r
          }))
        );
        
        const newBlocks = results.map((result, i) => ({
          blockNumber: i + 1,
          minerCount: result && result[1] ? Number(result[1]) : 0,
          deployedAmount: result && result[0] ? fromSmallestUnit(result[0]) : 0,
          isWinning: result && result[2] ? Boolean(result[2]) : false, // 🏆 3rd param = is_winning
        }));
        
        setBlocks(newBlocks);
        setLoading(false);
        
        const winningBlocks = newBlocks.filter(b => b.isWinning);
        console.log('✅ Block data updated:', 
          newBlocks.filter(b => b.deployedAmount > 0).length, 'blocks with deployments',
          winningBlocks.length > 0 ? `| 🏆 ${winningBlocks.length} winning blocks: ${winningBlocks.map(b => b.blockNumber).join(', ')}` : '| ⚠️ No winning blocks detected'
        );
      } catch (error) {
        console.error('❌ Error fetching block data:', error);
        setLoading(false);
      }
    };

    // Immediate fetch on mount or when refreshTrigger changes
    fetchBlockData();
    
    // ⚡ 5 saniyede bir refresh (Guide tavsiyesi - optimal!)
    const interval = setInterval(fetchBlockData, 5000);
    
    return () => clearInterval(interval);
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  // 🔄 Reset blocks when round changes (new round = clean slate)
  useEffect(() => {
    if (gameState?.round && previousRoundRef.current > 0 && gameState.round !== previousRoundRef.current) {
      console.log('🆕 New round detected! Clearing blocks...', {
        oldRound: previousRoundRef.current,
        newRound: gameState.round,
      });
      
      // Reset all blocks to 0 (including winning status)
      setBlocks(Array.from({ length: 25 }, (_, i) => ({
        blockNumber: i + 1,
        minerCount: 0,
        deployedAmount: 0,
        isWinning: false,
      })));
    }
    
    // Update previous round
    if (gameState?.round) {
      previousRoundRef.current = gameState.round;
    }
  }, [gameState?.round]);

  // Memoize selected blocks set for faster lookup
  const selectedSet = useMemo(() => new Set(selectedBlocks), [selectedBlocks]);

  // Loading state
  if (loading && blocks.every(b => b.deployedAmount === 0)) {
    return (
      <div className="grid grid-cols-5 gap-2 w-full max-w-2xl mx-auto">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className="aspect-square bg-card/30 rounded-lg border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-2 w-full max-w-2xl mx-auto">
      {blocks.map((block) => (
        <GridBlock
          key={block.blockNumber}
          blockNumber={block.blockNumber}
          minerCount={block.minerCount}
          deployedAmount={block.deployedAmount}
          isWinning={block.isWinning}
          isSelected={selectedSet.has(block.blockNumber)}
          onSelect={onBlockSelect}
        />
      ))}
    </div>
  );
}

export default memo(MiningGrid);

