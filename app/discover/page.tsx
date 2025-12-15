"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Coins, TrendingDown, TrendingUp, Zap, Search } from "lucide-react";

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<"mining" | "motherlodes" | "buybacks" | "stake">("mining");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const miningData = [
    { round: "#31540", block: "#25", winner: "Split", winnersCount: 91, deployed: "28.6629", vaulted: "2.7098", winnings: "24.3886", motherlode: "-", time: "50 sec ago" },
    { round: "#31539", block: "#9", winner: "0x9cqz..40Gg", winnersCount: 87, deployed: "28.6949", vaulted: "2.7130", winnings: "24.4170", motherlode: "-", time: "2 min ago" },
    { round: "#31538", block: "#15", winner: "Split", winnersCount: 90, deployed: "28.6935", vaulted: "2.7122", winnings: "24.4099", motherlode: "-", time: "3 min ago" },
    { round: "#31537", block: "#2", winner: "Split", winnersCount: 86, deployed: "28.6298", vaulted: "2.7080", winnings: "24.3721", motherlode: "-", time: "4 min ago" },
    { round: "#31536", block: "#22", winner: "Split", winnersCount: 87, deployed: "27.6498", vaulted: "2.6135", winnings: "23.5214", motherlode: "-", time: "5 min ago" },
  ];

  const motherlodeData = [
    { round: "#31440", block: "#18", winner: "0xAbC9..12Fx", winnersCount: 5, deployed: "29.1234", vaulted: "2.8912", winnings: "25.9876", motherlode: "1,250 MORE", time: "2 hrs ago" },
    { round: "#30125", block: "#7", winner: "Split", winnersCount: 12, deployed: "31.4567", vaulted: "3.1234", winnings: "28.1234", motherlode: "2,100 MORE", time: "1 day ago" },
  ];

  const buybackData = [
    { txHash: "0x7f8e...4a2b", moveSpent: "450.25", moreBought: "892.50", moreBurned: "892.50", time: "1 hr ago" },
    { txHash: "0x9a3c...7d1e", moveSpent: "320.75", moreBought: "635.12", moreBurned: "635.12", time: "6 hrs ago" },
  ];

  const stakeData = [
    { user: "0x1234...5678", action: "Stake", amount: "10,000 MORE", time: "15 min ago" },
    { user: "0xabcd...efgh", action: "Claim", amount: "125 MORE", time: "1 hr ago" },
    { user: "0x9876...5432", action: "Unstake", amount: "5,000 MORE", time: "2 hrs ago" },
  ];

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="container mx-auto px-4 pt-24 max-w-[1400px]">
        {/* Explore Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Explore</h1>
          <p className="text-gray-400 mb-6">Review protocol stats and activity</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card/50 rounded-lg p-5 border border-border">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total Deployed</div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent-yellow" />
                <div className="text-2xl font-bold text-white">1,245,678</div>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-5 border border-border">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Circulating Supply</div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent-yellow" />
                <div className="text-2xl font-bold text-white">289,214</div>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-5 border border-border">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Burned (7D)</div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div className="text-2xl font-bold text-white">70,732</div>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-5 border border-border">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Protocol Rev (7D)</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-yellow" />
                <div className="text-2xl font-bold text-white">613</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Activity</h2>
          <p className="text-gray-400 mb-6">Browse protocol activity and events</p>

          {/* Tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("mining")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "mining"
                  ? "border-accent-yellow text-accent-yellow"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4" />
              Mining
            </button>
            <button
              onClick={() => setActiveTab("motherlodes")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "motherlodes"
                  ? "border-accent-yellow text-accent-yellow"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Coins className="w-4 h-4" />
              Motherlodes
            </button>
            <button
              onClick={() => setActiveTab("buybacks")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "buybacks"
                  ? "border-accent-yellow text-accent-yellow"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              Buybacks
            </button>
            <button
              onClick={() => setActiveTab("stake")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "stake"
                  ? "border-accent-yellow text-accent-yellow"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Stake
            </button>

            {/* Search */}
            <div className="ml-auto flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by address or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-64"
              />
              <button className="px-3 py-1 bg-accent-yellow text-black text-xs font-bold rounded hover:bg-accent-darkYellow transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card/30 rounded-lg border border-border overflow-hidden">
            {activeTab === "mining" && (
              <table className="w-full">
                <thead className="bg-background/50">
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Round</th>
                    <th className="px-4 py-3">Block</th>
                    <th className="px-4 py-3">Winner</th>
                    <th className="px-4 py-3">Winners</th>
                    <th className="px-4 py-3">Deployed</th>
                    <th className="px-4 py-3">Vaulted</th>
                    <th className="px-4 py-3">Winnings</th>
                    <th className="px-4 py-3">Motherlode</th>
                    <th className="px-4 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {miningData.map((row, i) => (
                    <tr key={i} className="text-sm hover:bg-background/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-white">{row.round}</td>
                      <td className="px-4 py-3 font-mono text-white">{row.block}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-accent-yellow/20 rounded-full" />
                          <span className="font-mono text-white">{row.winner}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white">{row.winnersCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-accent-yellow" />
                          <span className="text-white">{row.deployed}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-accent-yellow" />
                          <span className="text-white">{row.vaulted}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-accent-yellow" />
                          <span className="text-white">{row.winnings}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{row.motherlode}</td>
                      <td className="px-4 py-3 text-gray-400 text-right">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "motherlodes" && (
              <table className="w-full">
                <thead className="bg-background/50">
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Round</th>
                    <th className="px-4 py-3">Block</th>
                    <th className="px-4 py-3">Winner</th>
                    <th className="px-4 py-3">Winners</th>
                    <th className="px-4 py-3">Deployed</th>
                    <th className="px-4 py-3">Vaulted</th>
                    <th className="px-4 py-3">Winnings</th>
                    <th className="px-4 py-3">Motherlode</th>
                    <th className="px-4 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {motherlodeData.map((row, i) => (
                    <tr key={i} className="text-sm hover:bg-background/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-white">{row.round}</td>
                      <td className="px-4 py-3 font-mono text-white">{row.block}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-accent-yellow rounded-full animate-pulse" />
                          <span className="font-mono text-white">{row.winner}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white">{row.winnersCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-accent-yellow" />
                          <span className="text-white">{row.deployed}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-accent-yellow" />
                          <span className="text-white">{row.vaulted}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-accent-yellow" />
                          <span className="text-white">{row.winnings}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-accent-yellow">{row.motherlode}</td>
                      <td className="px-4 py-3 text-gray-400 text-right">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "buybacks" && (
              <table className="w-full">
                <thead className="bg-background/50">
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Transaction</th>
                    <th className="px-4 py-3">MOVE Spent</th>
                    <th className="px-4 py-3">MORE Bought</th>
                    <th className="px-4 py-3">MORE Burned</th>
                    <th className="px-4 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {buybackData.map((row, i) => (
                    <tr key={i} className="text-sm hover:bg-background/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-accent-yellow hover:underline cursor-pointer">{row.txHash}</td>
                      <td className="px-4 py-3 text-white">{row.moveSpent} MOVE</td>
                      <td className="px-4 py-3 text-white">{row.moreBought} MORE</td>
                      <td className="px-4 py-3 text-red-500 font-bold">{row.moreBurned} MORE 🔥</td>
                      <td className="px-4 py-3 text-gray-400 text-right">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "stake" && (
              <table className="w-full">
                <thead className="bg-background/50">
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stakeData.map((row, i) => (
                    <tr key={i} className="text-sm hover:bg-background/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-white">{row.user}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            row.action === "Stake"
                              ? "bg-green-500/20 text-green-400"
                              : row.action === "Claim"
                              ? "bg-accent-yellow/20 text-accent-yellow"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {row.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{row.amount}</td>
                      <td className="px-4 py-3 text-gray-400 text-right">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

