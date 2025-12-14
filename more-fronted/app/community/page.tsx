"use client";

import Header from "@/components/Header";
import { MessageSquare, Twitter, Github, FileText } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-accent-yellow mb-4">Community</h1>
            <p className="text-gray-400">
              Join the MORE community and stay updated with the latest developments
            </p>
          </div>

          {/* Social Links */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <a
              href="#"
              className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-2xl p-8 border border-border hover:border-accent-yellow/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-yellow/10 rounded-xl group-hover:bg-accent-yellow/20 transition-all">
                  <MessageSquare className="w-8 h-8 text-accent-yellow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Discord</h3>
                  <p className="text-sm text-gray-400">Join our community</p>
                </div>
              </div>
              <p className="text-gray-400">
                Connect with other players, get support, and participate in community events.
              </p>
            </a>

            <a
              href="#"
              className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-2xl p-8 border border-border hover:border-accent-yellow/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-yellow/10 rounded-xl group-hover:bg-accent-yellow/20 transition-all">
                  <Twitter className="w-8 h-8 text-accent-yellow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Twitter</h3>
                  <p className="text-sm text-gray-400">Follow for updates</p>
                </div>
              </div>
              <p className="text-gray-400">
                Get the latest news, announcements, and insights from the MORE team.
              </p>
            </a>

            <a
              href="#"
              className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-2xl p-8 border border-border hover:border-accent-yellow/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-yellow/10 rounded-xl group-hover:bg-accent-yellow/20 transition-all">
                  <Github className="w-8 h-8 text-accent-yellow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">GitHub</h3>
                  <p className="text-sm text-gray-400">Open source code</p>
                </div>
              </div>
              <p className="text-gray-400">
                Explore the codebase, contribute, and verify the protocol's transparency.
              </p>
            </a>

            <a
              href="#"
              className="bg-gradient-to-br from-card to-accent-yellow/5 rounded-2xl p-8 border border-border hover:border-accent-yellow/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-yellow/10 rounded-xl group-hover:bg-accent-yellow/20 transition-all">
                  <FileText className="w-8 h-8 text-accent-yellow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Docs</h3>
                  <p className="text-sm text-gray-400">Read the documentation</p>
                </div>
              </div>
              <p className="text-gray-400">
                Learn how to use MORE, understand tokenomics, and explore advanced features.
              </p>
            </a>
          </div>

          {/* Community Stats */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-white mb-6">Community Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-yellow mb-2">5.2K</div>
                <div className="text-sm text-gray-400">Discord Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-yellow mb-2">12.8K</div>
                <div className="text-sm text-gray-400">Twitter Followers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-yellow mb-2">1.2K</div>
                <div className="text-sm text-gray-400">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-yellow mb-2">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

