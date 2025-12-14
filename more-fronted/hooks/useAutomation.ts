"use client";

import { useEffect, useState } from "react";
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

  const fetchAutomationConfig = async () => {
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

      if (automationConfig) {
        setConfig({
          ...automationConfig,
          estimatedRounds: roundsRemaining,
        });
      } else {
        setConfig(null);
      }
    } catch (err) {
      console.error("Error fetching automation config:", err);
      setError("Failed to fetch automation config");
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomationConfig();

    // Refresh every 10 seconds
    const interval = setInterval(fetchAutomationConfig, 10000);

    return () => clearInterval(interval);
  }, [userAddress]);

  return { config, loading, error, refetch: fetchAutomationConfig };
}

