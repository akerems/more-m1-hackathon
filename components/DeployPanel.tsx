"use client";

import { useState } from "react";
import { Coins, Zap, Info, Bot, AlertCircle, Plus, Power } from "lucide-react";
import clsx from "clsx";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePrivy } from "@privy-io/react-auth";
import { useSignRawHash } from "@privy-io/react-auth/extended-chains";
import { getMovementWallet } from "@/lib/privy-movement";
import { useAutomation } from "@/hooks/useAutomation";
import {
  enableAutomation,
  enableAutomationNative,
  disableAutomation,
  disableAutomationNative,
  addAutomationStake,
  AutomationStrategy,
} from "@/lib/transactions";
import { toast } from "sonner";

interface DeployPanelProps {
  selectedBlocks: number[];
  onClearSelection: () => void;
  onSelectAll: () => void;
  onSmartSelect: () => void;
}

export default function DeployPanel({
  selectedBlocks,
  onClearSelection,
  onSelectAll,
  onSmartSelect,
}: DeployPanelProps) {
  const [amount, setAmount] = useState(1.0);
  const [isManual, setIsManual] = useState(true);

  // Automation state
  const [stakeAmount, setStakeAmount] = useState(50);
  const [amountPerBlock, setAmountPerBlock] = useState(1);
  const [strategy, setStrategy] = useState<AutomationStrategy>("random");
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(10);

  const { account, signAndSubmitTransaction } = useWallet();
  const { user, authenticated } = usePrivy();
  const { signRawHash } = useSignRawHash();
  const privyWallet = getMovementWallet(user);

  const currentWalletAddress = account?.address || privyWallet?.address;
  const { config, loading, refetch } = useAutomation(
    currentWalletAddress ? String(currentWalletAddress) : undefined
  );

  const totalCost = amount * selectedBlocks.length;

  const incrementAmount = (value: number) => {
    setAmount((prev) => Math.max(0, prev + value));
  };

  const handleEnableAutomation = async () => {
    if (!currentWalletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (stakeAmount < 10) {
      toast.error("Minimum stake is 10 MOVE");
      return;
    }

    try {
      setIsEnabling(true);

      let txHash: string;

      if (account && signAndSubmitTransaction) {
        txHash = await enableAutomationNative(
          stakeAmount,
          amountPerBlock,
          strategy,
          [],
          signAndSubmitTransaction
        );
      } else if (privyWallet && signRawHash) {
        txHash = await enableAutomation(
          stakeAmount,
          amountPerBlock,
          strategy,
          [],
          String(privyWallet.address),
          privyWallet.publicKey,
          signRawHash
        );
      } else {
        throw new Error("No wallet available");
      }

      toast.success("Automation enabled successfully!", {
        description: `Staked ${stakeAmount} MOVE`,
      });

      setTimeout(() => refetch(), 2000);
    } catch (error: any) {
      console.error("Enable automation error:", error);
      toast.error("Failed to enable automation", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDisableAutomation = async () => {
    if (!currentWalletAddress) return;

    try {
      setIsDisabling(true);

      let txHash: string;

      if (account && signAndSubmitTransaction) {
        txHash = await disableAutomationNative(signAndSubmitTransaction);
      } else if (privyWallet && signRawHash) {
        txHash = await disableAutomation(
          String(privyWallet.address),
          privyWallet.publicKey,
          signRawHash
        );
      } else {
        throw new Error("No wallet available");
      }

      toast.success("Automation disabled", {
        description: `Refunded ${config?.stakedBalance || 0} MOVE`,
      });

      setTimeout(() => refetch(), 2000);
    } catch (error: any) {
      console.error("Disable automation error:", error);
      toast.error("Failed to disable automation", {
        description: error.message,
      });
    } finally {
      setIsDisabling(false);
    }
  };

  const handleTopUp = async () => {
    if (!currentWalletAddress || !privyWallet || !signRawHash) {
      toast.error("Privy wallet required for top-up");
      return;
    }

    try {
      const txHash = await addAutomationStake(
        topUpAmount,
        String(privyWallet.address),
        privyWallet.publicKey,
        signRawHash
      );

      toast.success(`Added ${topUpAmount} MOVE to automation stake`);
      setTimeout(() => refetch(), 2000);
    } catch (error: any) {
      console.error("Top-up error:", error);
      toast.error("Failed to add stake", {
        description: error.message,
      });
    }
  };

  // Common stats component
  const StatsDisplay = () => (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-card/50 rounded-lg p-2 border border-border">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Coins className="w-3.5 h-3.5 text-accent-yellow" />
          <span className="text-[10px] text-gray-400">Total deployed</span>
        </div>
        <div className="text-base font-bold text-white">3.8448</div>
      </div>

      <div className="bg-card/50 rounded-lg p-2 border border-border">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Coins className="w-3.5 h-3.5 text-accent-yellow" />
          <span className="text-[10px] text-gray-400">You deployed</span>
        </div>
        <div className="text-base font-bold text-accent-yellow">0.0000</div>
      </div>
    </div>
  );

  // Common mode toggle
  const ModeToggle = () => (
    <div className="flex gap-2 p-1 bg-card/50 rounded-lg border border-border">
      <button
        onClick={() => setIsManual(true)}
        className={clsx(
          "flex-1 py-1.5 rounded-md font-medium text-sm transition-all",
          isManual
            ? "bg-accent-yellow text-black"
            : "text-gray-400 hover:text-white"
        )}
      >
        Manual
      </button>
      <button
        onClick={() => setIsManual(false)}
        className={clsx(
          "flex-1 py-1.5 rounded-md font-medium text-sm transition-all",
          !isManual
            ? "bg-accent-yellow text-black"
            : "text-gray-400 hover:text-white"
        )}
      >
        Auto
      </button>
    </div>
  );

  // Render automation UI when Auto tab is selected
  if (!isManual) {
    if (loading) {
      return (
        <div className="space-y-4">
          <StatsDisplay />
          <ModeToggle />
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent-yellow border-t-transparent"></div>
          </div>
        </div>
      );
    }

    // If automation is active
    if (config && config.isActive) {
      const strategyNames = ["Random", "All Blocks"];

      return (
        <div className="space-y-4">
          <StatsDisplay />
          <ModeToggle />

          {/* Auto-Deploy Active */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-accent-yellow" />
                <h3 className="text-base font-bold text-white">Auto-Deploy</h3>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-md">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-400">ACTIVE</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/50 rounded-lg p-2">
                <p className="text-[10px] text-gray-400 mb-0.5">Staked Balance</p>
                <p className="text-sm font-bold text-white">{config.stakedBalance.toFixed(2)} MOVE</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2">
                <p className="text-[10px] text-gray-400 mb-0.5">Per Block</p>
                <p className="text-sm font-bold text-white">{config.amountPerBlock.toFixed(2)} MOVE</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2">
                <p className="text-[10px] text-gray-400 mb-0.5">Strategy</p>
                <p className="text-xs font-bold text-accent-yellow">
                  {strategyNames[config.strategy] || "Unknown"}
                </p>
              </div>
              <div className="bg-background/50 rounded-lg p-2">
                <p className="text-[10px] text-gray-400 mb-0.5">Rounds Left</p>
                <p className="text-sm font-bold text-white">~{config.estimatedRounds}</p>
              </div>
            </div>

            {/* Total Deployments */}
            <div className="flex items-center justify-between py-1.5 px-2.5 bg-accent-yellow/10 rounded-lg border border-accent-yellow/20">
              <span className="text-[10px] text-gray-400">Total Auto-Deployments</span>
              <span className="text-sm font-bold text-accent-yellow">{config.totalDeployments}</span>
            </div>

            {/* Top-up Section */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="block text-[10px] font-medium text-gray-400">Top-up Stake</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-2 bg-background border border-border rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                  placeholder="10"
                />
                <button
                  onClick={handleTopUp}
                  className="px-3 py-2 bg-accent-yellow/20 hover:bg-accent-yellow/30 text-accent-yellow rounded-lg font-bold transition-all flex items-center gap-1.5 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>

            {/* Disable Button */}
            <button
              onClick={handleDisableAutomation}
              disabled={isDisabling}
              className="w-full py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              {isDisabling ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-red-400 border-t-transparent"></div>
                  Disabling...
                </>
              ) : (
                <>
                  <Power className="w-3.5 h-3.5" />
                  Disable Automation
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    // Automation setup form
    return (
      <div className="space-y-4">
        <StatsDisplay />
        <ModeToggle />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-accent-yellow" />
            <h3 className="text-base font-bold text-white">Auto-Deploy</h3>
          </div>

          {/* Info Alert */}
          <div className="flex items-start gap-1.5 p-2 bg-accent-yellow/10 border border-accent-yellow/20 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 text-accent-yellow flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-300">
              Stake MOVE tokens and let the protocol automatically deploy each round. Keepers
              execute your strategy 24/7.
            </p>
          </div>

          {/* Stake Amount */}
          <div>
            <label className="block text-[10px] font-medium text-gray-400 mb-1.5">
              Stake Amount (Min: 10 MOVE)
            </label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-2 bg-background border border-border rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-accent-yellow"
              placeholder="50"
            />
          </div>

          {/* Amount Per Block */}
          <div>
            <label className="block text-[10px] font-medium text-gray-400 mb-1.5">
              Amount Per Block (MOVE)
            </label>
            <input
              type="number"
              value={amountPerBlock}
              onChange={(e) => setAmountPerBlock(parseFloat(e.target.value) || 0)}
              className="w-full p-2 bg-background border border-border rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-accent-yellow"
              placeholder="1"
            />
          </div>

          {/* Strategy Selection */}
          <div>
            <label className="block text-[10px] font-medium text-gray-400 mb-1.5">
              Deployment Strategy
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as AutomationStrategy)}
              className="w-full p-2 bg-background border border-border rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-accent-yellow"
            >
              <option value="random">Random (5 blocks)</option>
              <option value="all">All Blocks (25)</option>
            </select>
          </div>

          {/* Estimate */}
          <div className="p-2 bg-background rounded-lg space-y-0.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">Cost per round (5 blocks):</span>
              <span className="text-white font-bold">
                {(amountPerBlock * 5 + 1).toFixed(2)} MOVE
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">Estimated rounds:</span>
              <span className="text-accent-yellow font-bold">
                ~{Math.floor(stakeAmount / (amountPerBlock * 5 + 1))}
              </span>
            </div>
          </div>

          {/* Enable Button */}
          <button
            onClick={handleEnableAutomation}
            disabled={isEnabling || !currentWalletAddress || stakeAmount < 10}
            className="w-full py-2 bg-gradient-to-r from-accent-yellow to-accent-orange hover:from-accent-darkYellow hover:to-accent-yellow text-black rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEnabling ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-black border-t-transparent"></div>
                Enabling...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Enable Auto-Deploy
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Manual mode UI
  return (
    <div className="space-y-4">
      <StatsDisplay />
      <ModeToggle />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-accent-yellow" />
          <h3 className="text-base font-bold text-white">Manual Deploy</h3>
        </div>

        {/* Amount Per Block */}
        <div>
          <label className="block text-[10px] font-medium text-gray-400 mb-1.5">
            Amount Per Block (MOVE)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-background border border-border rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-accent-yellow"
            placeholder="1.0"
          />
        </div>

        {/* Quick Add Buttons */}
        <div>
          <label className="block text-[10px] font-medium text-gray-400 mb-1.5">
            Quick Add
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => incrementAmount(100)}
              className="flex-1 py-2 bg-background hover:bg-border rounded-lg border border-border hover:border-accent-yellow/50 transition-all font-medium text-xs text-white"
            >
              +100
            </button>
            <button
              onClick={() => incrementAmount(10)}
              className="flex-1 py-2 bg-background hover:bg-border rounded-lg border border-border hover:border-accent-yellow/50 transition-all font-medium text-xs text-white"
            >
              +10
            </button>
            <button
              onClick={() => incrementAmount(1)}
              className="flex-1 py-2 bg-background hover:bg-border rounded-lg border border-border hover:border-accent-yellow/50 transition-all font-medium text-xs text-white"
            >
              +1
            </button>
          </div>
        </div>

        {/* Block Selection */}
        <div>
          <label className="block text-[10px] font-medium text-gray-400 mb-1.5">
            Select Blocks
          </label>
          <div className="flex gap-2">
            <button
              onClick={onSelectAll}
              className="flex-1 py-2 bg-background hover:bg-border rounded-lg border border-border hover:border-accent-yellow/50 transition-all font-medium text-xs text-white"
            >
              All
            </button>
            <button
              onClick={onClearSelection}
              className="flex-1 py-2 bg-background hover:bg-border rounded-lg border border-border hover:border-red-500/50 transition-all font-medium text-xs text-white"
            >
              Clear ({selectedBlocks.length})
            </button>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="p-2 bg-background rounded-lg space-y-0.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-400">Total cost:</span>
            <span className="text-white font-bold">
              {totalCost.toFixed(4)} MOVE
            </span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-400">Selected blocks:</span>
            <span className="text-accent-yellow font-bold">
              {selectedBlocks.length}
            </span>
          </div>
        </div>

        {/* Deploy Button */}
        <button
          disabled={selectedBlocks.length === 0}
          className={clsx(
            "w-full py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5",
            selectedBlocks.length === 0
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-accent-yellow to-accent-orange hover:from-accent-darkYellow hover:to-accent-yellow text-black"
          )}
        >
          {selectedBlocks.length === 0 ? (
            "Select blocks to deploy"
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              Deploy to {selectedBlocks.length} Blocks
            </>
          )}
        </button>

        {/* Info */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
          <Info className="w-3 h-3" />
          <span>The RNG is provably fair</span>
        </div>
      </div>
    </div>
  );
}
