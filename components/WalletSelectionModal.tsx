"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth/extended-chains";
import { getAptosWallets } from "@aptos-labs/wallet-standard";
import { createMovementWallet } from "@/lib/privy-movement";
import { MOVEMENT_CONFIGS, CURRENT_NETWORK } from "@/lib/aptos";
import { X, Zap, Wallet as WalletIcon } from "lucide-react";

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletSelectionModal({ isOpen, onClose }: WalletSelectionModalProps) {
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const { wallets, connect } = useWallet();
  const { ready, authenticated, user } = usePrivy();
  const { createWallet } = useCreateWallet();

  // Check for Movement wallet
  const movementWallet: any = user?.linkedAccounts?.find(
    (account: any) => account.type === 'wallet' && account.chainType === 'aptos'
  );

  // Filter wallets - remove unwanted ones and duplicates
  const filteredWallets = wallets?.filter((wallet) => {
      const name = wallet.name.toLowerCase();
      return !name.includes("petra") && 
             !name.includes("google") && 
             !name.includes("apple");
    })
    .filter((wallet, index, self) => {
      return index === self.findIndex((w) => w.name === wallet.name);
    })
    .sort((a, b) => {
      if (a.name.toLowerCase().includes("nightly")) return -1;
      if (b.name.toLowerCase().includes("nightly")) return 1;
      return 0;
    });

  const handleWalletSelect = async (walletName: string) => {
    try {
      // Try to connect with Movement network info
      if (typeof window !== "undefined") {
        const allWallets = getAptosWallets();
        const selectedWallet = allWallets.aptosWallets.find(w => w.name === walletName);

        if (selectedWallet?.features?.['aptos:connect']) {
          const networkInfo: any = {
            chainId: MOVEMENT_CONFIGS[CURRENT_NETWORK].chainId,
            name: "custom" as const,
            url: MOVEMENT_CONFIGS[CURRENT_NETWORK].fullnode
          };

          try {
            const result = await selectedWallet.features['aptos:connect'].connect(false, networkInfo);

            if (result.status === "Approved") {
              await connect(walletName as any);
              onClose();
              return;
            }
          } catch (connectError) {
            // Fallback to standard connection
          }
        }
      }

      // Fallback to standard wallet adapter connection
      await connect(walletName as any);
      onClose();
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const handleWalletCreation = async (user: any) => {
    try {
      setIsCreatingWallet(true);
      await createMovementWallet(user, createWallet);
      onClose();
    } catch (error) {
      console.error('Wallet creation error:', error);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const { login } = useLogin({
    onComplete: async ({ user, isNewUser }) => {
      try {
        console.log('[Privy] Login complete, creating wallet automatically...', { isNewUser });
        // Automatically create wallet for the user after successful login
        await handleWalletCreation(user);
      } catch (error) {
        console.error('Error in login completion:', error);
        setIsCreatingWallet(false);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
      setIsCreatingWallet(false);
    }
  });

  const handlePrivyLogin = async () => {
    try {
      setIsCreatingWallet(true);

      if (!authenticated) {
        // User not logged in - trigger login flow
        // Wallet will be created automatically in onComplete callback
        await login({ 
          loginMethods: ['email', 'google', 'twitter', 'discord', 'github'], 
          disableSignup: false 
        });
      } else {
        // User already logged in but no wallet - create one now
        await handleWalletCreation(user);
      }
    } catch (error) {
      console.error('Privy login error:', error);
      setIsCreatingWallet(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-br from-card to-accent-yellow/5 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Connect Wallet</h3>
            <p className="text-xs text-gray-400 mt-1">
              Choose how to connect to Movement
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-background rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Privy Social Login */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-yellow" />
            <h4 className="text-sm font-bold text-white">Login with Privy</h4>
          </div>
          <p className="text-xs text-gray-400">
            Social login with automatic wallet creation
          </p>

          <button
            onClick={handlePrivyLogin}
            disabled={isCreatingWallet || (authenticated && !!movementWallet)}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all text-sm"
          >
            {isCreatingWallet ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Creating wallet...</span>
              </div>
            ) : authenticated && movementWallet ? (
              <span>✓ Connected</span>
            ) : (
              <span>Continue with Privy</span>
            )}
          </button>

          {authenticated && user && (
            <div className="space-y-1.5">
              {/* Authentication Status */}
              <div className="text-[10px] text-center bg-accent-yellow/10 border border-accent-yellow/20 p-1.5 rounded">
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-1 h-1 bg-accent-yellow rounded-full"></div>
                  <span className="text-accent-yellow">
                    {user.email?.address || user.phone?.number || 'Authenticated'}
                  </span>
                </div>
              </div>

              {/* Wallet Status */}
              {movementWallet && (
                <div className="text-[10px] text-center bg-green-500/10 border border-green-500/20 p-1.5 rounded">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 font-mono">
                      {(() => {
                        const addr = movementWallet.address;
                        const addrStr = typeof addr === 'string' ? addr : String(addr);
                        return `${addrStr.slice(0, 6)}...${addrStr.slice(-4)}`;
                      })()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="bg-card px-2 text-gray-500">OR</span>
          </div>
        </div>

        {/* Native Wallets */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <WalletIcon className="w-4 h-4 text-accent-yellow" />
            <h4 className="text-sm font-bold text-white">Native Wallet</h4>
          </div>
          <p className="text-xs text-gray-400">
            Use your existing Aptos wallet
          </p>

          <div className="space-y-1.5">
            {filteredWallets?.length === 0 ? (
              <div className="text-center py-4 px-3 border border-dashed border-border rounded-lg">
                <p className="text-xs text-gray-400 mb-1">
                  No wallets detected
                </p>
                <p className="text-[10px] text-gray-500">
                  Install Nightly or another Aptos wallet
                </p>
              </div>
            ) : (
              filteredWallets?.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleWalletSelect(wallet.name)}
                  className="w-full flex items-center gap-2.5 p-2.5 bg-background hover:bg-accent-yellow/10 border border-border hover:border-accent-yellow/50 rounded-lg transition-all"
                >
                  {wallet.icon && (
                    <img 
                      src={wallet.icon} 
                      alt={wallet.name} 
                      className="w-5 h-5 rounded"
                    />
                  )}
                  <span className="font-medium text-white text-sm">{wallet.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

