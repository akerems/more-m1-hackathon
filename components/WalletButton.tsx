"use client";

import { useState } from "react";
import { usePrivy, useLogout } from "@privy-io/react-auth";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Wallet, Copy, ExternalLink, LogOut, Droplets, Check } from "lucide-react";
import { WalletSelectionModal } from "./WalletSelectionModal";
import { getMovementWallet } from "@/lib/privy-movement";
import { getAccountExplorerUrl, FAUCET_URL } from "@/lib/aptos";
import { toast } from "sonner";

export default function WalletButton() {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { ready, authenticated, user } = usePrivy();
  const { logout: privyLogout } = useLogout();
  const { account, disconnect } = useWallet();

  // Get wallet address (prioritize native wallet, then Privy)
  const movementWallet = getMovementWallet(user);
  const rawAddress = account?.address || movementWallet?.address;
  
  // Ensure address is a string
  const address = rawAddress ? (typeof rawAddress === 'string' ? rawAddress : String(rawAddress)) : undefined;

  // Format address for display
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    const addrStr = typeof addr === 'string' ? addr : String(addr);
    return `${addrStr.slice(0, 6)}...${addrStr.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (address) {
      const addrStr = typeof address === 'string' ? address : String(address);
      await navigator.clipboard.writeText(addrStr);
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      if (account) {
        await disconnect();
      }
      if (authenticated) {
        await privyLogout();
      }
      setShowDropdown(false);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  // Loading state
  if (!ready) {
    return (
      <button
        disabled
        className="px-6 py-2 bg-accent-yellow/50 text-black rounded-lg font-bold cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  // Not connected state
  if (!address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowModal(!showModal)}
          className="px-6 py-2 bg-accent-yellow hover:bg-accent-darkYellow text-black rounded-lg font-bold transition-all flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </button>
        
        {showModal && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowModal(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              <WalletSelectionModal isOpen={true} onClose={() => setShowModal(false)} />
            </div>
          </>
        )}
      </div>
    );
  }

  // Connected state with dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-6 py-2 bg-accent-yellow hover:bg-accent-darkYellow text-black rounded-lg font-bold transition-all flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        {formatAddress(address)}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
            {/* Wallet Info */}
            <div className="p-4 border-b border-border bg-gradient-to-br from-card to-accent-yellow/5">
              <div className="text-xs text-gray-400 mb-1">Connected Wallet</div>
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm text-white">{formatAddress(address)}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyAddress}
                    className="p-1.5 hover:bg-background rounded transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-accent-yellow" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                    )}
                  </button>
                  <a
                    href={getAccountExplorerUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-background rounded transition-colors"
                    title="View on Explorer"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* User Info */}
            {user?.email && (
              <div className="p-3 border-b border-border">
                <div className="text-xs text-gray-400 mb-1">Email</div>
                <div className="text-sm text-white">{user.email.address}</div>
              </div>
            )}

            {/* Wallet Type */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Wallet Type</div>
                  <div className="text-sm text-white font-medium">
                    {account ? "Native Wallet" : "Privy Wallet"}
                  </div>
                </div>
                <div className="w-2 h-2 bg-accent-yellow rounded-full" />
              </div>
            </div>

            {/* Network Info */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Network</div>
                  <div className="text-sm text-white font-medium">Movement Testnet</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Actions */}
            <div className="p-2 space-y-2">
              <a
                href={FAUCET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 text-left text-sm text-accent-yellow hover:bg-accent-yellow/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <Droplets className="w-4 h-4" />
                Get Test Tokens
              </a>
              
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
