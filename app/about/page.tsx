"use client";

import Header from "@/components/Header";
import { Coins, TrendingUp, Shield, Zap, Users, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-accent-yellow mb-4">
            MORE Protocol
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            An experimental on-chain mining game where players compete on a grid to earn MOVE and MORE tokens, with protocol fees fueling continuous buyback & burn
          </p>
        </div>

        {/* Overview */}
        <div className="mb-16">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h2 className="text-3xl font-bold text-accent-yellow mb-6">Overview</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                MORE is an experimental on-chain mining game built on Movement Network. Players compete on a 5x5 grid by deploying 
                MOVE tokens to blocks. Winners earn MOVE from successful grid deployments, and have a 1 in 625 chance to win the 
                Motherlode jackpot paid in MORE tokens.
              </p>
              <p>
                The protocol collects fees from all gameplay activity and uses them to continuously buyback MORE tokens from the market 
                and burn them forever. This creates deflationary pressure that aligns all MORE holders with the protocol's growth - 
                the more the game is played, the more tokens are removed from circulation.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-yellow/10 rounded-lg">
                <Shield className="w-6 h-6 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Fair Launch</h3>
            </div>
            <p className="text-gray-400 text-sm">
              No presale, no VCs, no large team allocation. All MORE tokens distributed through mining,
              staking, and airdrops ensuring equal opportunity for all participants.
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-yellow/10 rounded-lg">
                <Zap className="w-6 h-6 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Motherlode Jackpot</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Win MORE tokens from the shared Motherlode jackpot. 1 in 625 chance every round.
              Grid wins pay MOVE, Motherlode wins pay MORE - two ways to earn!
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-yellow/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Buyback & Burn</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Protocol fees from gameplay are used to continuously buyback MORE from the market and burn it forever.
              This creates deflationary pressure that aligns all holders with protocol growth.
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-yellow/10 rounded-lg">
                <Target className="w-6 h-6 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Grid Mining</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Compete on a 5×5 grid each round. Deploy MOVE to blocks, multiple blocks win MOVE rewards.
              85% to winners, 15% protocol fee. Transparent, provably fair on-chain VRF.
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-yellow/10 rounded-lg">
                <Coins className="w-6 h-6 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Two Tokens</h3>
            </div>
            <p className="text-gray-400 text-sm">
              MOVE (native) earned from grid wins. MORE (protocol token) earned from Motherlode jackpot.
              Protocol fees continuously buy & burn MORE, reducing supply forever.
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-yellow/10 rounded-lg">
                <Users className="w-6 h-6 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Holder Alignment</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Continuous burns reduce MORE supply, benefiting all holders. The more activity on the protocol,
              the more deflationary pressure. Growth directly benefits token holders.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-card to-accent-yellow/10 rounded-2xl p-8 border border-accent-yellow/20 mb-16">
          <h2 className="text-3xl font-bold text-accent-yellow mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent-yellow text-black rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Select & Deploy</h3>
                <p className="text-gray-400">
                  Choose one or more blocks on the 5×5 grid. Deploy your MOVE tokens to compete.
                  The more you deploy, the higher your potential rewards.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent-yellow text-black rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Round Ends</h3>
                <p className="text-gray-400">
                  After 60 seconds, the round closes. Verifiable on-chain randomness (VRF) selects one winning block.
                  All MOVE from losing blocks is collected.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent-yellow text-black rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Win Rewards</h3>
                <p className="text-gray-400">
                  Grid winners share MOVE tokens (85% of pool). 1 in 625 chance to win the Motherlode 
                  and earn MORE tokens! Two distinct reward types for different gameplay outcomes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent-yellow text-black rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Buyback & Burn</h3>
                <p className="text-gray-400">
                  Protocol fees (15% from grid + Motherlode fees) are used to buyback MORE from DEX and burn forever.
                  More gameplay = more burns = deflationary pressure benefiting all holders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-card/50 rounded-xl border border-border">
            <div className="text-3xl font-bold text-accent-yellow mb-2">5×5</div>
            <div className="text-sm text-gray-400">Mining Grid</div>
          </div>
          <div className="text-center p-6 bg-card/50 rounded-xl border border-border">
            <div className="text-3xl font-bold text-accent-yellow mb-2">60s</div>
            <div className="text-sm text-gray-400">Round Duration</div>
          </div>
          <div className="text-center p-6 bg-card/50 rounded-xl border border-border">
            <div className="text-3xl font-bold text-accent-yellow mb-2">1/625</div>
            <div className="text-sm text-gray-400">Motherlode Odds</div>
          </div>
          <div className="text-center p-6 bg-card/50 rounded-xl border border-border">
            <div className="text-3xl font-bold text-accent-yellow mb-2">100%</div>
            <div className="text-sm text-gray-400">Burned Forever</div>
          </div>
        </div>
      </main>
    </div>
  );
}

