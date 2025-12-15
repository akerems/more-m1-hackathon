"use client";

import { Coins, TrendingUp, Compass, Info } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import WalletButton from "./WalletButton";

export default function Header() {
  const pathname = usePathname();

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

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`flex items-center gap-2 transition-colors ${
                pathname === "/" 
                  ? "text-accent-yellow" 
                  : "text-gray-400 hover:text-accent-yellow"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Mine</span>
            </Link>
            <Link 
              href="/stake" 
              className={`flex items-center gap-2 transition-colors ${
                pathname === "/stake" 
                  ? "text-accent-yellow" 
                  : "text-gray-400 hover:text-accent-yellow"
              }`}
            >
              <Coins className="w-4 h-4" />
              <span className="font-medium">Stake</span>
            </Link>
            <Link 
              href="/discover" 
              className={`flex items-center gap-2 transition-colors ${
                pathname === "/discover" 
                  ? "text-accent-yellow" 
                  : "text-gray-400 hover:text-accent-yellow"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="font-medium">Discover</span>
            </Link>
            <Link 
              href="/about" 
              className={`flex items-center gap-2 transition-colors ${
                pathname === "/about" 
                  ? "text-accent-yellow" 
                  : "text-gray-400 hover:text-accent-yellow"
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="font-medium">About</span>
            </Link>
          </nav>

          {/* Right side - Price info and wallet */}
          <div className="flex items-center gap-4">
            {/* Price indicators */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg">
                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                <span className="text-sm text-gray-400">$</span>
                <span className="text-sm font-semibold text-white">6.79</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg">
                <Coins className="w-4 h-4 text-accent-purple" />
                <span className="text-sm font-semibold text-white">1.28</span>
                <span className="text-sm text-gray-400">MOVE</span>
              </div>
            </div>

            {/* Wallet button */}
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}

