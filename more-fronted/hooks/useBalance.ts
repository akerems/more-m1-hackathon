"use client";

import { useEffect, useState } from "react";
import { aptos } from "@/lib/aptos";

export function useBalance(address: string | undefined) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        
        // Ensure address is a string
        const addressStr = typeof address === 'string' ? address : String(address);
        
        // Get account resource
        const resource = await aptos.getAccountCoinsData({
          accountAddress: addressStr,
        });

        // Find MOVE balance (0x1::aptos_coin::AptosCoin)
        const moveBalance = resource.find(
          (coin) => coin.asset_type === "0x1::aptos_coin::AptosCoin"
        );

        if (moveBalance) {
          // Convert to decimal format (8 decimals for Aptos/Movement)
          const balanceInMove = Number(moveBalance.amount) / 100000000;
          setBalance(balanceInMove.toFixed(4));
        } else {
          setBalance("0.0000");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [address]);

  return { balance, loading };
}

