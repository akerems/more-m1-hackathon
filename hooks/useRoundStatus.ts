import { useState, useEffect, useCallback, useRef } from 'react';
import { getRoundStatus } from '@/lib/transactions';
import { CONTRACT_ADDRESS } from '@/lib/aptos';

export interface RoundStatus {
  round: number;
  roundStart: number;
  roundEnd: number;
  timeRemaining: number;
  isEnded: boolean;
  lastSync: number;
  drift: number;
}

/**
 * ⚡ CALCULATED COUNTDOWN METHOD (30s Sync)
 * 
 * Strategy:
 * 1. Fetch round_end timestamp once from blockchain
 * 2. Calculate remaining time locally: remaining = round_end - now
 * 3. Sync every 30 seconds to check for drift/new round
 * 4. Auto-correct if drift > 2 seconds
 * 
 * Benefits:
 * - Only 2 RPC calls per minute (vs 60 with old method)
 * - Smooth countdown (updates every second)
 * - Network latency doesn't affect countdown
 * - Self-healing (corrects drift automatically)
 */
export function useRoundStatus() {
  const [roundStatus, setRoundStatus] = useState<RoundStatus>({
    round: 0,
    roundStart: 0,
    roundEnd: 0,
    timeRemaining: 0,
    isEnded: true,
    lastSync: 0,
    drift: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isMountedRef = useRef(true);
  const localTimerRef = useRef<NodeJS.Timeout | null>(null);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const serverOffsetRef = useRef<number>(0); // Server-client time offset

  /**
   * 🔄 STEP 1: Initial Fetch (Get round_end timestamp)
   */
  const fetchRoundStatus = useCallback(async (isInitialFetch = false) => {
    try {
      if (!isMountedRef.current) return;
      
      if (isInitialFetch) {
        setLoading(true);
      }
      setError(null);

      const clientRequestTime = Date.now() / 1000; // Client time when request sent
      const result = await getRoundStatus(CONTRACT_ADDRESS);
      const clientResponseTime = Date.now() / 1000; // Client time when response received

      if (!isMountedRef.current || !result || result.length < 5) return;

      const [round, roundStart, roundEnd, blockchainRemaining, isEnded] = result;

      // Calculate server-client offset (for time synchronization)
      if (isInitialFetch) {
        // Estimate server time: halfway between request and response
        const estimatedNetworkLatency = (clientResponseTime - clientRequestTime) / 2;
        const estimatedServerTime = clientResponseTime - estimatedNetworkLatency;
        const blockchainTime = Number(roundEnd) - Number(blockchainRemaining);
        serverOffsetRef.current = blockchainTime - estimatedServerTime;
        
        console.log('⏰ Time Sync:', {
          clientTime: estimatedServerTime,
          blockchainTime,
          offset: serverOffsetRef.current,
          latency: estimatedNetworkLatency
        });
      }

      // Update state with blockchain data
      const now = Date.now() / 1000 + serverOffsetRef.current;
      const calculatedRemaining = Math.floor(Math.max(0, Number(roundEnd) - now)); // Round to whole seconds
      const drift = Math.abs(calculatedRemaining - Number(blockchainRemaining));

      const roundEnded = Boolean(isEnded) || calculatedRemaining <= 0;
      
      console.log('🔄 Round Status Sync:', {
        round: Number(round),
        blockchainRemaining: Number(blockchainRemaining),
        calculatedRemaining,
        drift,
        isEnded: roundEnded
      });
      
      // ⚠️ Round bittiğinde özel uyarı
      if (roundEnded && calculatedRemaining === 0) {
        console.warn('⏰ ROUND ENDED! Waiting for complete_round() to be called...');
        console.log('📊 Check winning blocks in ~5-10 seconds (after contract completes round)');
      }

      if (isMountedRef.current) {
        setRoundStatus({
          round: Number(round),
          roundStart: Number(roundStart),
          roundEnd: Number(roundEnd),
          timeRemaining: calculatedRemaining,
          isEnded: roundEnded,
          lastSync: Date.now(),
          drift,
        });
        setLoading(false);
      }

      // If drift > 2 seconds, recalculate offset
      if (drift > 2) {
        console.warn('⚠️ Drift detected, recalculating offset:', drift);
        const blockchainTime = Number(roundEnd) - Number(blockchainRemaining);
        const clientTime = Date.now() / 1000;
        serverOffsetRef.current = blockchainTime - clientTime;
      }

    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('❌ Error fetching round status:', err);
        
        // Don't crash on RPC errors, keep using calculated values
        if (!err.message?.includes('not valid JSON') && !err.message?.includes('Rate limit')) {
          setError(err.message || 'Failed to fetch round status');
        }
        
        setLoading(false);
      }
    }
  }, []);

  /**
   * 🧮 STEP 2: Local Countdown (Calculate every second)
   */
  const startLocalCountdown = useCallback(() => {
    // Clear existing timer
    if (localTimerRef.current) {
      clearInterval(localTimerRef.current);
    }

    localTimerRef.current = setInterval(() => {
      if (!isMountedRef.current) return;

      setRoundStatus((prev) => {
        // Calculate remaining time locally
        const now = Date.now() / 1000 + serverOffsetRef.current;
        const calculatedRemaining = Math.floor(Math.max(0, prev.roundEnd - now)); // Round to whole seconds
        
        return {
          ...prev,
          timeRemaining: calculatedRemaining,
          isEnded: calculatedRemaining <= 0,
        };
      });
    }, 1000); // Update every second
  }, []);

  /**
   * 🔄 STEP 3: Periodic Sync (Every 30 seconds)
   */
  const startPeriodicSync = useCallback(() => {
    // Clear existing timer
    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
    }

    syncTimerRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      
      console.log('🔄 30s Periodic Sync');
      fetchRoundStatus(false); // Not initial fetch
    }, 30000); // Every 30 seconds
  }, [fetchRoundStatus]);

  /**
   * 🚀 STEP 4: Initialize on mount
   */
  useEffect(() => {
    isMountedRef.current = true;

    // Initial fetch
    fetchRoundStatus(true).then(() => {
      if (isMountedRef.current) {
        // Start local countdown timer
        startLocalCountdown();
        
        // Start periodic sync timer
        startPeriodicSync();
      }
    });

    // Cleanup
    return () => {
      isMountedRef.current = false;
      
      if (localTimerRef.current) {
        clearInterval(localTimerRef.current);
      }
      
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
    };
  }, [fetchRoundStatus, startLocalCountdown, startPeriodicSync]);

  /**
   * 🔄 STEP 5: Restart timer when round changes (NEW ROUND DETECTED!)
   */
  useEffect(() => {
    if (roundStatus.round > 0 && !loading && roundStatus.timeRemaining > 0) {
      console.log('🆕 Round change detected! Restarting timer...', {
        round: roundStatus.round,
        roundEnd: roundStatus.roundEnd,
        timeRemaining: roundStatus.timeRemaining,
      });
      
      // Restart local countdown with new round data
      startLocalCountdown();
    }
  }, [roundStatus.round, roundStatus.roundEnd, startLocalCountdown, loading]);

  /**
   * 🔄 Manual refetch (for after deploy)
   */
  const refetch = useCallback(() => {
    fetchRoundStatus(false);
  }, [fetchRoundStatus]);

  return {
    roundStatus,
    round: roundStatus.round,
    timeRemaining: roundStatus.timeRemaining,
    isEnded: roundStatus.isEnded,
    drift: roundStatus.drift,
    loading,
    error,
    refetch,
  };
}
