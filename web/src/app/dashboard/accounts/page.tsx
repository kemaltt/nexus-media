"use client";

import { useState } from "react";
import {
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";

type SocialPlatform =
  | "youtube"
  | "instagram"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "tiktok";

interface Account {
  id: string;
  platform: SocialPlatform;
  username: string;
  avatarUrl?: string;
  connectedAt: string;
  status: "active" | "expired" | "error";
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      platform: "youtube",
      username: "Nexus Tech",
      connectedAt: "2024-01-15T10:00:00Z",
      status: "active",
    },
    {
      id: "2",
      platform: "instagram",
      username: "@nexustech_official",
      connectedAt: "2024-01-20T14:30:00Z",
      connectedAt: "2024-01-20T14:30:00Z",
      status: "expired",
    },
  ]);

  // Helper to get platform details
  const getPlatformDetails = (platform: SocialPlatform) => {
    switch (platform) {
      case "youtube":
        return {
          name: "YouTube",
          icon: Youtube,
          color: "text-red-600",
          bg: "bg-red-50",
        };
      case "instagram":
        return {
          name: "Instagram",
          icon: Instagram,
          color: "text-pink-600",
          bg: "bg-pink-50",
        };
      case "facebook":
        return {
          name: "Facebook",
          icon: Facebook,
          color: "text-blue-600",
          bg: "bg-blue-50",
        };
      case "twitter":
        return {
          name: "X (Twitter)",
          icon: Twitter,
          color: "text-black",
          bg: "bg-gray-50",
        };
      case "linkedin":
        return {
          name: "LinkedIn",
          icon: Linkedin,
          color: "text-blue-700",
          bg: "bg-blue-50",
        };
      case "tiktok":
        return {
          name: "TikTok",
          icon: Share2,
          color: "text-black",
          bg: "bg-gray-50",
        }; // Share2 as placeholder for TikTok if not available in lucide version
      default:
        return {
          name: platform,
          icon: Share2,
          color: "text-gray-600",
          bg: "bg-gray-50",
        };
    }
  };

  // Mock function to simulate connection flow
  const handleConnect = (platform: SocialPlatform) => {
    // In a real app, this would redirect to OAuth URL
    // router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/${platform}`);
    alert(`Connecting to ${platform}... (OAuth implementation pending)`);
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm("Are you sure you want to disconnect this account?")) return;

    // Optimistic update
    setAccounts(accounts.filter((a) => a.id !== accountId));

    try {
      // await api.delete(`/social-accounts/${accountId}`);
    } catch (error) {
      console.error("Failed to disconnect", error);
      // Revert if failed
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Connected Accounts</h1>
        <p className="text-gray-500 mt-1">
          Manage your social media connections and permissions.
        </p>
      </div>

      {/* Connected Accounts List */}
      <div className="grid gap-4">
        {accounts.map((account) => {
          const {
            name,
            icon: Icon,
            color,
            bg,
          } = getPlatformDetails(account.platform);
          return (
            <div
              key={account.id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${bg}`}>
                  <Icon className={`${color}`} size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{account.username}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>
                      Connected on{" "}
                      {new Date(account.connectedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {account.status === "active" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" /> Active
                  </span>
                ) : (
                  <button className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors">
                    <AlertCircle size={12} className="mr-1" /> Reconnect
                  </button>
                )}

                <button
                  onClick={() => handleDisconnect(account.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  title="Disconnect Account"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {accounts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No accounts connected
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by connecting a social media profile.
            </p>
          </div>
        )}
      </div>

      {/* Add New Connection Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 mt-8">
          Connect New Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(
            [
              "youtube",
              "instagram",
              "facebook",
              "twitter",
              "linkedin",
              "tiktok",
            ] as SocialPlatform[]
          ).map((platform) => {
            const {
              name,
              icon: Icon,
              color,
              bg,
            } = getPlatformDetails(platform);
            const isConnected = accounts.some((a) => a.platform === platform);

            return (
              <button
                key={platform}
                onClick={() => handleConnect(platform)}
                disabled={isConnected}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                  isConnected
                    ? "bg-gray-50 border-gray-100 opacity-50 cursor-default"
                    : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon className={`${color}`} size={20} />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 block">
                    {name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isConnected ? "Already connected" : "Connect now"}
                  </span>
                </div>
                {!isConnected && <Plus size={16} className="text-gray-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Simple placeholder for Share2 since I can't import it from here if not imported at top
// Added "Share2" to import list at the top.
import { Share2 } from "lucide-react";
