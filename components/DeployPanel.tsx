"use client";

import { useState, memo, useCallback, useMemo } from "react";
import { Coins, Zap, Info, Bot, AlertCircle, Plus, Power, Droplets, CheckCircle, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePrivy } from "@privy-io/react-auth";
import { useSignRawHash } from "@privy-io/react-auth/extended-chains";
import { getMovementWallet } from "@/lib/privy-movement";
import { useAutomation } from "@/hooks/useAutomation";
import { useMOREBalance } from "@/hooks/useMOREBalance";
import { useBalance } from "@/hooks/useBalance";
import {
  enableAutomation,
  enableAutomationNative,
  disableAutomation,
  disableAutomationNative,
  addAutomationStake,
  AutomationStrategy,
  deployToBlocks,
} from "@/lib/transactions";
import { CONTRACT_ADDRESS, MODULES, getTxExplorerUrl } from "@/lib/aptos";
import { toast } from "sonner";

interface DeployPanelProps {
  selectedBlocks: number[];
  onClearSelection: () => void;
  onSelectAll: () => void;
  onSmartSelect: () => void;
  onDeploySuccess?: () => void;
}

function DeployPanel({
  selectedBlocks,
  onClearSelection,
  onSelectAll,
  onSmartSelect,
  onDeploySuccess,
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

  // Native wallet address is already a string
  // Privy wallet address is now normalized by getMovementWallet
  const currentWalletAddress = account?.address || privyWallet?.address;
  
  console.log('🔍 DeployPanel Wallet Address:', {
    nativeAddress: account?.address,
    privyAddress: privyWallet?.address,
    currentWalletAddress,
    addressType: typeof currentWalletAddress
  });
  const { config, loading, refetch } = useAutomation(
    currentWalletAddress ? String(currentWalletAddress) : undefined
  );
  
  // Get balances
  const { balance: moreBalance, refetch: refetchMore } = useMOREBalance(
    currentWalletAddress ? String(currentWalletAddress) : undefined
  );
  const { balance: moveBalance, refetch: refetchMove } = useBalance(
    currentWalletAddress ? String(currentWalletAddress) : undefined
  );

  // Debug: Log balances whenever they change
  console.log("🎯 DeployPanel Balances:", {
    walletAddress: currentWalletAddress,
    moreBalance: moreBalance,
    moreBalanceType: typeof moreBalance,
    moveBalance: moveBalance,
    moveBalanceType: typeof moveBalance,
  });

  const totalCost = useMemo(() => amount * selectedBlocks.length, [amount, selectedBlocks.length]);
  
  // Handle test faucet
  const handleTestFaucet = async () => {
    if (!currentWalletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      if (account && signAndSubmitTransaction) {
        const response = await signAndSubmitTransaction({
          data: {
            function: `${MODULES.MORE_TOKEN}::test_faucet` as `${string}::${string}::${string}`,
            typeArguments: [],
            functionArguments: [CONTRACT_ADDRESS],
          },
        });
        
        const explorerUrl = getTxExplorerUrl(response.hash);
        toast.success("Claimed 10,000 MORE tokens!", {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          description: (
            <a 
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent-yellow hover:underline"
            >
              View in Explorer
              <ExternalLink className="w-3 h-3" />
            </a>
          ),
        });
        
        setTimeout(() => refetchMore(), 1500);
      } else {
        toast.error("Native wallet required for faucet");
      }
    } catch (error: any) {
      console.error("Faucet error:", error);
      toast.error("Failed to claim tokens", {
        description: error.message || "Please try again",
      });
    }
  };

  const incrementAmount = useCallback((value: number) => {
    setAmount((prev) => Math.max(0, prev + value));
  }, []);

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

      const explorerUrl = getTxExplorerUrl(txHash);
      toast.success("Automation enabled successfully!", {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        description: (
          <div className="space-y-1">
            <span>Staked {stakeAmount} MOVE</span>
            <a 
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent-yellow hover:underline text-sm"
            >
              View in Explorer
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ),
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

      const explorerUrl = getTxExplorerUrl(txHash);
      toast.success("Automation disabled", {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        description: (
          <div className="space-y-1">
            <span>Refunded {config?.stakedBalance || 0} MOVE</span>
            <a 
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent-yellow hover:underline text-sm"
            >
              View in Explorer
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ),
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

  // Handle deploy
  const handleDeploy = async () => {
    if (!currentWalletAddress || selectedBlocks.length === 0) {
      toast.error("Please select blocks and connect wallet");
      return;
    }

    // Calculate total cost
    const totalCost = amount * selectedBlocks.length;
    const userMoveBalance = parseFloat(moveBalance || "0");

    console.log('💰 Deploy Balance Check:', {
      moveBalance: moveBalance,
      parsed: userMoveBalance,
      totalCost: totalCost,
      amount: amount,
      blocks: selectedBlocks.length,
      hasEnough: userMoveBalance >= totalCost
    });

    // Check if user has enough MOVE
    if (userMoveBalance < totalCost) {
      toast.error("Insufficient APT balance", {
        description: `Need ${totalCost.toFixed(4)} APT, but you have ${userMoveBalance.toFixed(4)} APT`,
      });
      return;
    }

    try {
      if (account && signAndSubmitTransaction) {
        const payload = await deployToBlocks(selectedBlocks, amount);
        const response = await signAndSubmitTransaction(payload);
        
        const explorerUrl = getTxExplorerUrl(response.hash);
        toast.success("Deployment successful!", {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          description: (
            <div className="space-y-1">
              <span>Deployed {amount} MOVE to {selectedBlocks.length} blocks</span>
              <a 
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-accent-yellow hover:underline text-sm"
              >
                View in Explorer
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ),
        });
        
        onClearSelection();
        
        // Refetch balances and stats after successful deployment
        setTimeout(() => {
          refetchMore();
          refetchMove();
          onDeploySuccess?.();
        }, 1500);
      } else {
        toast.error("Native wallet required for deployment");
      }
    } catch (error: any) {
      console.error("Deploy error:", error);
      toast.error("Deployment failed", {
        description: error.message || "Please try again",
      });
    }
  };

  // Common stats component
  const StatsDisplay = () => (
    <div className="space-y-2">
      {/* Faucet Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleTestFaucet}
          className="py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1"
        >
          <Droplets className="w-3.5 h-3.5" />
          Get MORE
        </button>
        <a
          href="https://faucet.movementnetwork.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1"
        >
          <Droplets className="w-3.5 h-3.5" />
          Get MOVE
        </a>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-card/50 rounded-lg p-2 border border-border">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Coins className="w-3.5 h-3.5 text-accent-yellow" />
            <span className="text-[10px] text-gray-400">MORE Balance</span>
          </div>
          <div className="text-base font-bold text-white">{loading ? "..." : moreBalance.toFixed(2)}</div>
        </div>

        <div className="bg-card/50 rounded-lg p-2 border border-border">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Coins className="w-3.5 h-3.5 text-accent-yellow" />
            <span className="text-[10px] text-gray-400">MOVE Balance</span>
          </div>
          <div className="text-base font-bold text-accent-yellow">{moveBalance ? Number(moveBalance).toFixed(2) : "0.00"}</div>
        </div>
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
          onClick={handleDeploy}
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

export default memo(DeployPanel);
