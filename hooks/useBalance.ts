"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getAccountMOVEBalance } from "@/lib/aptos";

export function useBalance(address: string | undefined) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  const fetchBalance = useCallback(async () => {
    if (!address) {
      console.warn("⚠️ useBalance: No address provided");
      if (isMountedRef.current) {
        setBalance(null);
      }
      return;
    }

    try {
      console.log("🔄 useBalance: Starting fetch for address:", address);
      
      if (isMountedRef.current) {
        setLoading(true);
      }
      
      // Get MOVE balance using helper function
      const balanceInMove = await getAccountMOVEBalance(String(address));
      
      console.log("✅ useBalance: Balance fetched successfully:", balanceInMove);

      if (isMountedRef.current) {
        const formattedBalance = balanceInMove.toFixed(4);
        console.log("💾 useBalance: Setting balance to:", formattedBalance);
        setBalance(formattedBalance);
      }
    } catch (error: any) {
      if (isMountedRef.current) {
        console.error("❌ useBalance: Error fetching balance:", error);
        setBalance("0.0000");
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

  return { balance, loading, refetch: fetchBalance };
}

