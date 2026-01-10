import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMotherlodePool } from '@/lib/transactions';
import { CONTRACT_ADDRESS } from '@/lib/aptos';

export function useMotherlode() {
  const [pool, setPool] = useState<number>(0); // Single number for MORE only
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchMotherlodePool(CONTRACT_ADDRESS);
      
      if (isMountedRef.current && result !== null && result !== undefined) {
        // Result is now a single number, not an array
        const poolAmount = Array.isArray(result) ? Number(result[0]) : Number(result);
        setPool(poolAmount / 100000000); // Convert from 8 decimals
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Error fetching motherlode pool:', err);
        setError(err.message || 'Failed to fetch motherlode pool');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    
    // Refresh every 10 seconds (reduced from 5 for better performance)
    const interval = setInterval(fetchData, 10000);
    
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchData]);

  const refetch = useCallback(async () => {
    try {
      const result = await fetchMotherlodePool(CONTRACT_ADDRESS);
      
      if (isMountedRef.current && result !== null && result !== undefined) {
        const poolAmount = Array.isArray(result) ? Number(result[0]) : Number(result);
        setPool(poolAmount / 100000000);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Error refetching motherlode pool:', err);
      }
    }
  }, []);

  return {
    pool,
    loading,
    error,
    refetch,
  };
}
