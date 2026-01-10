"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getAutomationConfig, estimateRoundsRemaining } from "@/lib/transactions";

export interface AutomationConfig {
  isActive: boolean;
  stakedBalance: number;
  amountPerBlock: number;
  strategy: number;
  lastDeployedRound: number;
  totalDeployments: number;
  estimatedRounds: number;
}

export function useAutomation(userAddress: string | undefined) {
  const [config, setConfig] = useState<AutomationConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchAutomationConfig = useCallback(async () => {
    if (!userAddress) {
      setConfig(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [automationConfig, roundsRemaining] = await Promise.all([
        getAutomationConfig(userAddress),
        estimateRoundsRemaining(userAddress),
      ]);

      if (isMountedRef.current) {
        if (automationConfig) {
          setConfig({
            ...automationConfig,
            estimatedRounds: roundsRemaining,
          });
        } else {
          setConfig(null);
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Error fetching automation config:", err);
        setError("Failed to fetch automation config");
        setConfig(null);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [userAddress]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchAutomationConfig();

    // Refresh every 15 seconds (increased from 10 for better performance)
    const interval = setInterval(fetchAutomationConfig, 15000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchAutomationConfig]);

  return { config, loading, error, refetch: fetchAutomationConfig };
}

