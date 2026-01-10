import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchGameState } from '@/lib/transactions';
import { CONTRACT_ADDRESS } from '@/lib/aptos';

export interface GameState {
  round: number;
  totalDeployed: number;
  motherlodeMore: number;
  isActive: boolean;
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchGameState(CONTRACT_ADDRESS);
      
      if (isMountedRef.current && result && Array.isArray(result) && result.length >= 4) {
        setGameState({
          round: Number(result[0]),
          totalDeployed: Number(result[1]) / 100000000, // Convert from 8 decimals
          motherlodeMore: Number(result[2]) / 100000000,
          isActive: Boolean(result[3]),
        });
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Error fetching game state:', err);
        setError(err.message || 'Failed to fetch game state');
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
      const result = await fetchGameState(CONTRACT_ADDRESS);
      
      if (isMountedRef.current && result && Array.isArray(result) && result.length >= 4) {
        setGameState({
          round: Number(result[0]),
          totalDeployed: Number(result[1]) / 100000000,
          motherlodeMore: Number(result[2]) / 100000000,
          isActive: Boolean(result[3]),
        });
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Error refetching game state:', err);
      }
    }
  }, []);

  return {
    gameState,
    currentRound: gameState?.round || 0,
    isActive: gameState?.isActive || false,
    loading,
    error,
    refetch,
  };
}
