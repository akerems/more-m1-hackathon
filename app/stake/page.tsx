"use client";

import Header from "@/components/Header";
import { Coins, TrendingUp, Clock } from "lucide-react";

export default function StakePage() {
  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-accent-yellow mb-4">Stake MORE</h1>
            <p className="text-gray-400">
              Stake your MORE tokens to earn yield from protocol buybacks
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-accent-yellow" />
                <span className="text-sm text-gray-400">Total Staked</span>
              </div>
              <div className="text-3xl font-bold text-white">5.2M</div>
              <div className="text-sm text-gray-500 mt-1">MORE</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-accent-yellow" />
                <span className="text-sm text-gray-400">APY</span>
              </div>
              <div className="text-3xl font-bold text-accent-yellow">24.5%</div>
              <div className="text-sm text-gray-500 mt-1">Estimated</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-accent-yellow" />
                <span className="text-sm text-gray-400">Unlock Period</span>
              </div>
              <div className="text-3xl font-bold text-white">None</div>
              <div className="text-sm text-gray-500 mt-1">Instant</div>
            </div>
          </div>

          {/* Staking Card */}
          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-2xl p-8 border border-border mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Stake</h2>
              <div className="text-sm text-gray-400">Balance: 0 MORE</div>
            </div>

            <div className="space-y-6">
              {/* Stake Input */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Amount to Stake</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-yellow"
                  />
                  <button className="px-6 py-3 bg-accent-yellow hover:bg-accent-darkYellow text-black rounded-lg font-bold transition-all">
                    Stake
                  </button>
                </div>
              </div>

              {/* Your Staking Info */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Your Staked</div>
                  <div className="text-xl font-bold text-white">0 MORE</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Pending Rewards</div>
                  <div className="text-xl font-bold text-accent-yellow">0 MORE</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-card hover:bg-card/70 border border-border hover:border-accent-yellow/50 rounded-lg font-medium transition-all">
                  Unstake
                </button>
                <button className="flex-1 py-3 bg-card hover:bg-card/70 border border-border hover:border-accent-yellow/50 rounded-lg font-medium transition-all">
                  Claim Rewards
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-card/50 rounded-xl p-6 border border-border">
            <h3 className="text-lg font-bold text-white mb-4">How Staking Works</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-3">
                <span className="text-accent-yellow">•</span>
                <span>Stake MORE tokens to earn yield from protocol buybacks (10% of all bought-back MORE)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent-yellow">•</span>
                <span>No lock-up period - unstake anytime with instant withdrawal</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent-yellow">•</span>
                <span>Rewards compound automatically and can be claimed anytime</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent-yellow">•</span>
                <span>APY varies based on game activity and total staked amount</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

