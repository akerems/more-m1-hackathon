"use client";

import Header from "@/components/Header";
import { BarChart3, Users, Coins, Trophy } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-accent-yellow mb-4">Discover</h1>
            <p className="text-gray-400">
              Explore protocol stats, leaderboards, and recent activity
            </p>
          </div>

          {/* Protocol Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <BarChart3 className="w-8 h-8 text-accent-yellow mx-auto mb-3" />
              <div className="text-sm text-gray-400 mb-1">Total Volume</div>
              <div className="text-2xl font-bold text-white">1.2M MOVE</div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <Users className="w-8 h-8 text-accent-yellow mx-auto mb-3" />
              <div className="text-sm text-gray-400 mb-1">Total Players</div>
              <div className="text-2xl font-bold text-white">5,234</div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <Coins className="w-8 h-8 text-accent-yellow mx-auto mb-3" />
              <div className="text-sm text-gray-400 mb-1">Circulating Supply</div>
              <div className="text-2xl font-bold text-white">2.1M MORE</div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <Trophy className="w-8 h-8 text-accent-yellow mx-auto mb-3" />
              <div className="text-sm text-gray-400 mb-1">Total Rounds</div>
              <div className="text-2xl font-bold text-white">12,445</div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-card rounded-2xl p-8 border border-border mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Top Players</h2>
            <div className="space-y-4">
              {[
                { rank: 1, address: "0x1234...5678", earnings: "125,420" },
                { rank: 2, address: "0xabcd...efgh", earnings: "98,750" },
                { rank: 3, address: "0x9876...5432", earnings: "87,320" },
                { rank: 4, address: "0x4567...8901", earnings: "76,540" },
                { rank: 5, address: "0xfedc...ba98", earnings: "65,890" },
              ].map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-accent-yellow/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-accent-yellow">#{player.rank}</span>
                    </div>
                    <span className="font-mono text-white">{player.address}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-accent-yellow">{player.earnings}</div>
                    <div className="text-sm text-gray-400">MORE earned</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { type: "Win", player: "0x1234...5678", amount: "1,250 MORE", time: "2m ago" },
                { type: "Deploy", player: "0xabcd...efgh", amount: "50 MOVE", time: "5m ago" },
                { type: "Motherlode", player: "0x9876...5432", amount: "10K MORE + 200 MOVE", time: "12m ago" },
                { type: "Stake", player: "0x4567...8901", amount: "5,000 MORE", time: "18m ago" },
                { type: "Win", player: "0xfedc...ba98", amount: "850 MORE", time: "23m ago" },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        activity.type === "Motherlode"
                          ? "bg-accent-yellow/20 text-accent-yellow"
                          : activity.type === "Win"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {activity.type}
                    </span>
                    <span className="font-mono text-sm text-white">{activity.player}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{activity.amount}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

