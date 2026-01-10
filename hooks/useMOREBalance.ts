import { useState, useEffect, useCallback, useRef } from 'react';
import { getMOREBalance } from '@/lib/aptos';

export function useMOREBalance(address: string | undefined) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchBalance = useCallback(async () => {
    if (!address) {
      console.warn("⚠️ useMOREBalance: No address provided");
      if (isMountedRef.current) {
        setBalance(0);
        setLoading(false);
      }
      return;
    }

    try {
      console.log("🔄 useMOREBalance: Starting fetch for address:", address);
      
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      const bal = await getMOREBalance(address);
      
      console.log("✅ useMOREBalance: Balance fetched successfully:", bal);
      
      if (isMountedRef.current) {
        console.log("💾 useMOREBalance: Setting balance to:", bal);
        setBalance(bal);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('❌ useMOREBalance: Error fetching MORE balance:', err);
        setError(err.message || 'Failed to fetch MORE balance');
        setBalance(0);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [address]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchBalance();

    // Refresh balance every 15 seconds
    const interval = setInterval(fetchBalance, 15000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchBalance]);

  return { balance, loading, error, refetch: fetchBalance };
}

