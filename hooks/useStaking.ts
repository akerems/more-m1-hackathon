import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserStakeInfo, getStakingPoolInfo, getPendingRewards } from '@/lib/transactions';
import { fromSmallestUnit } from '@/lib/aptos';

export interface StakingInfo {
  stakedAmount: number;
  pendingRewards: number;
  totalClaimed: number;
  isClaimable: boolean;
}

export interface PoolInfo {
  totalStaked: number;
  totalRewardsDistributed: number;
  totalStakers: number;
}

export function useStaking(address: string | undefined) {
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      // Fetch pool info
      const poolResult = await getStakingPoolInfo();
      if (isMountedRef.current && poolResult && poolResult.length >= 3) {
        setPoolInfo({
          totalStaked: fromSmallestUnit(poolResult[0]),
          totalRewardsDistributed: fromSmallestUnit(poolResult[1]),
          totalStakers: Number(poolResult[2]),
        });
      }

      // Fetch user stake info if address provided
      if (address) {
        const userResult = await getUserStakeInfo(address);
        if (isMountedRef.current && userResult && userResult.length >= 4) {
          setStakingInfo({
            stakedAmount: fromSmallestUnit(userResult[0]),
            pendingRewards: fromSmallestUnit(userResult[1]),
            totalClaimed: fromSmallestUnit(userResult[2]),
            isClaimable: Boolean(userResult[3]),
          });
        }
      } else {
        if (isMountedRef.current) {
          setStakingInfo(null);
        }
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Error fetching staking data:', err);
        setError(err.message || 'Failed to fetch staking data');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [address]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    // Refresh every 15 seconds
    const interval = setInterval(fetchData, 15000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchData]);

  return { stakingInfo, poolInfo, loading, error, refetch: fetchData };
}
