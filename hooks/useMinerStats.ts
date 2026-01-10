import { useState, useEffect, useCallback, useRef } from 'react';
import { getMinerState } from '@/lib/transactions';
import { fromSmallestUnit } from '@/lib/aptos';

export interface MinerStats {
  totalDeployed: number;
  moreEarned: number;
  roundsWon: number;
  blocksDeployedCount: number;
}

export function useMinerStats(address: string | undefined) {
  const [stats, setStats] = useState<MinerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchStats = useCallback(async () => {
    if (!address) {
      if (isMountedRef.current) {
        setStats(null);
        setLoading(false);
      }
      return;
    }

    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      const result = await getMinerState(address);
      
      if (isMountedRef.current && result && result.length >= 4) {
        setStats({
          totalDeployed: fromSmallestUnit(result[0]),
          moreEarned: fromSmallestUnit(result[1]),
          roundsWon: Number(result[2]),
          blocksDeployedCount: Number(result[3]),
        });
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Error fetching miner stats:', err);
        setError(err.message || 'Failed to fetch miner stats');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [address]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchStats();

    // Refresh every 15 seconds
    const interval = setInterval(fetchStats, 15000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

