"use client";

import { memo } from "react";
import { Coins, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load wallet button as it's not critical for initial render
const WalletButton = dynamic(() => import("./WalletButton"), {
  ssr: false,
  loading: () => <div className="w-32 h-10 bg-card rounded-lg animate-pulse" />,
});

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-yellow rounded-lg blur-lg opacity-50" />
              <div className="relative bg-accent-yellow p-2 rounded-lg">
                <Coins className="w-6 h-6 text-black" />
              </div>
            </div>
            <span className="text-2xl font-bold text-accent-yellow">MORE</span>
          </div>

          {/* Navigation - Single page app, no nav needed */}
          <div className="hidden md:flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4 text-accent-yellow" />
            <span className="font-medium text-accent-yellow">Mine MORE</span>
          </div>

          {/* Right side - Wallet button */}
          <div className="flex items-center gap-4">
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);

