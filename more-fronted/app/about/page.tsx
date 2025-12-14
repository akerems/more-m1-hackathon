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
            Movement On-chain Reserve Experiment - A fair-launch digital store of value built on Movement Network
          </p>
        </div>

        {/* Overview */}
        <div className="mb-16">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h2 className="text-3xl font-bold text-accent-yellow mb-6">Overview</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                MORE is a fair-launch, fully on-chain mining game and digital store-of-value experiment built on Movement Network.
                The protocol combines a grid-based mining game where users spend MOVE tokens to compete for rewards,
                a native MORE token whose supply and value are directly tied to protocol activity, a dual Motherlode jackpot
                that pays out in both MORE and MOVE, and a continuous buyback & bury mechanism.
              </p>
              <p>
                The goal is to create a sustainable "reserve" asset for the Movement ecosystem, where the token's value
                is driven by actual on-chain activity rather than pure speculation.
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
              <h3 className="text-xl font-bold text-white">Dual Motherlode</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Unique dual-asset jackpot system. Win both MORE tokens and MOVE in a single jackpot event.
              1 in 625 chance every round, constantly accumulating for massive payouts.
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-yellow/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Buyback & Bury</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Protocol continuously uses 8% of game revenue to buy MORE from the market. 90% is permanently
              burned (buried), 10% distributed to stakers. Direct value capture mechanism.
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
              Compete on a 5×5 grid each round. Deploy MOVE on blocks, one block wins randomly.
              Winners share 88% of losing blocks proportionally. Transparent, provably fair on-chain.
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-yellow/10 rounded-lg">
                <Coins className="w-6 h-6 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Tokenomics</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Max supply: 21 million MORE. Fixed minting per round until cap reached. Revenue split:
              88% winners, 8% buyback, 2% motherlode, 2% staking rewards.
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-yellow/10 rounded-lg">
                <Users className="w-6 h-6 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Staking Yield</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Stake MORE to earn yield from buyback rewards. Receive 10% of all bought-back MORE.
              Incentivizes long-term holding and reduces circulating supply.
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
                  Winners on the selected block share 88% of losing blocks proportionally + newly minted MORE tokens.
                  1 in 625 chance to also win the dual Motherlode jackpot!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent-yellow text-black rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Protocol Value Capture</h3>
                <p className="text-gray-400">
                  8% goes to buyback fund → buys MORE from market → 90% burned, 10% to stakers.
                  Continuous deflationary pressure as game activity increases.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-card/50 rounded-xl border border-border">
            <div className="text-3xl font-bold text-accent-yellow mb-2">21M</div>
            <div className="text-sm text-gray-400">Max Supply</div>
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
            <div className="text-3xl font-bold text-accent-yellow mb-2">90%</div>
            <div className="text-sm text-gray-400">Burned Forever</div>
          </div>
        </div>
      </main>
    </div>
  );
}

